import startupRecords from './data/startups.json' with { type: 'json' };

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const MAX_MAP_FEATURES = 200;
const MAX_QUERY_LENGTH = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 120;
const MAP_CELL_SIZE = 112;
const rateLimitStore = new Map();

function normalize(value) {
  return String(value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
}

function categoryParts(record) {
  const sector = record.sector || record.category || '';
  const values = Array.isArray(sector) ? sector : String(sector).split('/');
  return values.map(value => String(value).trim()).filter(Boolean);
}

function safeUrl(value) {
  const candidate = String(value ?? '').trim();
  if (!candidate) return '';
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function publicStartup(record) {
  return {
    id: String(record.id ?? ''),
    name: String(record.name ?? ''),
    sector: categoryParts(record).join(' / '),
    address: String(record.address || record.location || ''),
    city: String(record.city ?? ''),
    area: String(record.area ?? ''),
    description: String(record.description ?? ''),
    employees: String(record.employees ?? ''),
    founders: Array.isArray(record.founders) ? record.founders.map(String) : [],
    foundedYear: record.foundedYear ?? null,
    latitude: Number.isFinite(Number(record.latitude)) && record.latitude !== null ? Number(record.latitude) : null,
    longitude: Number.isFinite(Number(record.longitude)) && record.longitude !== null ? Number(record.longitude) : null,
    locationPrecision: String(record.locationPrecision ?? ''),
    verified: Boolean(record.verified),
    websiteUrl: safeUrl(record.websiteUrl || record.website),
    linkedinUrl: safeUrl(record.linkedinUrl),
    careersUrl: safeUrl(record.careersUrl),
    applyUrl: safeUrl(record.applyUrl)
  };
}

function readFilters(params) {
  const query = params.get('q') ?? params.get('search') ?? '';
  if (query.length > MAX_QUERY_LENGTH) {
    throw Object.assign(new Error(`Search query must be ${MAX_QUERY_LENGTH} characters or fewer.`), { statusCode: 400 });
  }

  const filters = {
    query: normalize(query),
    sector: normalize(params.get('sector')),
    area: normalize(params.get('area')),
    employeeSize: normalize(params.get('employeeSize')),
    precision: normalize(params.get('precision')),
    verifiedOnly: ['true', '1'].includes(normalize(params.get('verifiedOnly')))
  };

  if ([filters.sector, filters.area, filters.employeeSize, filters.precision].some(value => value.length > 80)) {
    throw Object.assign(new Error('A filter value is too long.'), { statusCode: 400 });
  }
  return filters;
}

function matchesFilters(record, filters) {
  if (filters.sector && filters.sector !== 'all' && !categoryParts(record).some(value => normalize(value) === filters.sector)) return false;
  if (filters.area && filters.area !== 'all' && normalize(record.area) !== filters.area) return false;
  if (filters.employeeSize && filters.employeeSize !== 'all' && normalize(record.employees) !== filters.employeeSize) return false;
  if (filters.precision && filters.precision !== 'all' && normalize(record.locationPrecision) !== filters.precision) return false;
  if (filters.verifiedOnly && !record.verified) return false;

  if (filters.query) {
    const searchableValues = [
      record.name,
      ...categoryParts(record),
      record.description,
      record.address,
      record.location,
      record.area,
      record.city,
      record.employees,
      record.foundedYear,
      record.websiteUrl || record.website,
      record.linkedinUrl,
      record.careersUrl,
      record.applyUrl,
      ...(Array.isArray(record.founders) ? record.founders : [])
    ];
    if (!searchableValues.some(value => normalize(value).includes(filters.query))) return false;
  }
  return true;
}

function getFilteredRecords(filters) {
  return startupRecords.filter(record => matchesFilters(record, filters));
}

function countBy(records, getValue) {
  const counts = new Map();
  for (const record of records) {
    for (const rawValue of getValue(record)) {
      const name = String(rawValue ?? '').trim();
      const key = normalize(name);
      if (!key) continue;
      const current = counts.get(key);
      if (current) current.count += 1;
      else counts.set(key, { name, count: 1 });
    }
  }
  return [...counts.values()].filter(value => value.count > 0).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

function getMetadata() {
  return {
    total: startupRecords.length,
    categories: countBy(startupRecords, categoryParts),
    areas: countBy(startupRecords, record => [record.area]),
    employeeSizes: [...new Set(startupRecords.map(record => String(record.employees ?? '').trim()).filter(Boolean))].sort(),
    precisions: [...new Set(startupRecords.map(record => String(record.locationPrecision ?? '').trim()).filter(Boolean))].sort()
  };
}

function getLegendCounts(records) {
  const counts = { startup: 0, investor: 0, accelerator: 0, community: 0, other: 0 };
  for (const record of records) {
    const sector = categoryParts(record).join(' ').toLocaleLowerCase();
    if (sector.includes('vc') || sector.includes('capital') || sector.includes('investor') || sector.includes('fund')) counts.investor += 1;
    else if (sector.includes('accelerator') || sector.includes('incubator') || sector.includes('hub')) counts.accelerator += 1;
    else if (sector.includes('community') || sector.includes('network') || sector.includes('event')) counts.community += 1;
    else if (sector.includes('other') || !sector) counts.other += 1;
    else counts.startup += 1;
  }
  return counts;
}

function parseBounds(value) {
  if (!value || value.length > 80) throw Object.assign(new Error('Map requests require a valid viewport bounding box.'), { statusCode: 400 });
  const bounds = value.split(',').map(Number);
  if (bounds.length !== 4 || !bounds.every(Number.isFinite)) {
    throw Object.assign(new Error('Bounding box must contain west,south,east,north coordinates.'), { statusCode: 400 });
  }
  const [west, south, east, north] = bounds;
  if (west < -180 || east > 180 || south < -85 || north > 85 || west >= east || south >= north) {
    throw Object.assign(new Error('Bounding box coordinates are out of range.'), { statusCode: 400 });
  }
  return { west, south, east, north };
}

function mapFeatures(records, bounds, zoom) {
  const points = records.filter(record => {
    if (record.latitude === null || record.longitude === null) return false;
    const latitude = Number(record.latitude);
    const longitude = Number(record.longitude);
    return Number.isFinite(latitude) && Number.isFinite(longitude) &&
      longitude >= bounds.west && longitude <= bounds.east &&
      latitude >= bounds.south && latitude <= bounds.north;
  });

  const scale = 256 * 2 ** zoom;
  const cells = new Map();
  for (const record of points) {
    const latitude = Math.max(-85.05112878, Math.min(85.05112878, Number(record.latitude)));
    const sinLatitude = Math.sin(latitude * Math.PI / 180);
    const x = (Number(record.longitude) + 180) / 360 * scale;
    const y = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale;
    const cellX = Math.floor(x / MAP_CELL_SIZE);
    const cellY = Math.floor(y / MAP_CELL_SIZE);
    const key = `${cellX}:${cellY}`;
    if (!cells.has(key)) cells.set(key, { cellX, cellY, records: [] });
    cells.get(key).records.push(record);
  }

  const features = [...cells.values()].map(cell => {
    const latitude = cell.records.reduce((sum, record) => sum + Number(record.latitude), 0) / cell.records.length;
    const longitude = cell.records.reduce((sum, record) => sum + Number(record.longitude), 0) / cell.records.length;
    if (cell.records.length > 1) return { kind: 'cluster', latitude, longitude, count: cell.records.length };
    const record = cell.records[0];
    return {
      kind: 'startup',
      id: String(record.id ?? ''),
      name: String(record.name ?? ''),
      sector: categoryParts(record).join(' / '),
      latitude,
      longitude
    };
  }).sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude);

  return { features: features.slice(0, MAX_MAP_FEATURES), totalPoints: points.length, truncated: features.length > MAX_MAP_FEATURES };
}

function parseInteger(params, name, fallback, maximum) {
  const raw = params.get(name);
  if (raw === null) return fallback;
  if (!/^\d{1,9}$/.test(raw)) {
    throw Object.assign(new Error(`${name} must be a positive integer.`), { statusCode: 400 });
  }
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw Object.assign(new Error(`${name} must be a positive integer.`), { statusCode: 400 });
  }
  return Math.min(value, maximum);
}

function allowRequest(req, res) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const clientIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  if (rateLimitStore.size > 10_000) {
    for (const [ip, entry] of rateLimitStore) {
      if (now - entry.startedAt >= RATE_LIMIT_WINDOW_MS) rateLimitStore.delete(ip);
    }
  }
  let window = rateLimitStore.get(clientIp);
  if (!window || now - window.startedAt >= RATE_LIMIT_WINDOW_MS) {
    window = { startedAt: now, count: 0 };
    rateLimitStore.set(clientIp, window);
  }
  window.count += 1;
  res.setHeader('RateLimit-Limit', String(RATE_LIMIT_REQUESTS));
  res.setHeader('RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_REQUESTS - window.count)));
  if (window.count <= RATE_LIMIT_REQUESTS) return true;
  res.setHeader('Retry-After', String(Math.ceil((RATE_LIMIT_WINDOW_MS - (now - window.startedAt)) / 1000)));
  return false;
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function handleStartupApi(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!allowRequest(req, res)) return sendJson(res, 429, { error: 'Too many requests. Please try again shortly.' });

  try {
    const url = new URL(req.url ?? '/api/startups', 'http://localhost');
    const params = url.searchParams;
    const view = params.get('view') || 'list';

    if (view === 'meta') return sendJson(res, 200, getMetadata());

    const filters = readFilters(params);
    if (params.has('id')) {
      const id = normalize(params.get('id'));
      if (!id || id.length > 120) throw Object.assign(new Error('A valid startup id is required.'), { statusCode: 400 });
      const record = startupRecords.find(value => normalize(value.id) === id);
      if (!record) return sendJson(res, 404, { error: 'Startup not found.' });
      return sendJson(res, 200, { item: publicStartup(record) });
    }

    const filtered = getFilteredRecords(filters);
    if (view === 'map') {
      const bounds = parseBounds(params.get('bbox'));
      const zoom = Math.max(1, Math.min(19, parseInteger(params, 'zoom', 12, 19)));
      const result = mapFeatures(filtered, bounds, zoom);
      return sendJson(res, 200, {
        items: result.features,
        totalPoints: result.totalPoints,
        truncated: result.truncated,
        legendCounts: getLegendCounts(filtered)
      });
    }
    if (view !== 'list') throw Object.assign(new Error('Unknown data view.'), { statusCode: 400 });

    const page = parseInteger(params, 'page', 1, 1_000_000);
    const limit = parseInteger(params, 'limit', DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit).map(publicStartup);
    return sendJson(res, 200, {
      items,
      page,
      limit,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit)
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return sendJson(res, statusCode, { error: statusCode === 500 ? 'Unable to load startup data.' : error.message });
  }
}