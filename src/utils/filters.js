/**
 * Filtering utility for Startup.io
 */
export function filterStartups(startups, { sector = 'all', area = 'all', employeeSize = 'all', precision = 'all', verifiedOnly = false }) {
  return startups.filter(startup => {
    // Sector filter
    if (sector !== 'all') {
      const filterSector = sector.trim().toLocaleLowerCase();
      const startupSectors = (startup.sector || '').split('/').map(value => value.trim().toLocaleLowerCase());
      if (!startupSectors.includes(filterSector)) {
        return false;
      }
    }

    // Area filter
    if (area !== 'all') {
      const normalizeArea = value => String(value ?? '').trim().toLocaleLowerCase();
      const startupArea = normalizeArea(startup.area);
      const filterArea = normalizeArea(area);
      if (!startupArea || startupArea !== filterArea) {
        return false;
      }
    }

    // Employee Size filter
    if (employeeSize !== 'all') {
      if (startup.employees !== employeeSize) {
        return false;
      }
    }

    // Location Precision filter
    if (precision !== 'all') {
      if (startup.locationPrecision !== precision) {
        return false;
      }
    }

    // Verified filter
    if (verifiedOnly && !startup.verified) {
      return false;
    }

    return true;
  });
}

export function getUniqueSectors(startups) {
  const sectorsByKey = new Map();
  startups.forEach(s => {
    if (!s.sector) return;
    const parts = s.sector.split('/').map(part => part.trim()).filter(Boolean);
    parts.forEach(part => {
      const key = part.toLocaleLowerCase();
      if (!sectorsByKey.has(key)) sectorsByKey.set(key, part);
    });
  });
  return Array.from(sectorsByKey.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export function getUniqueAreas(startups) {
  const areasSet = new Set();
  startups.forEach(s => {
    if (!s.area) return;
    areasSet.add(s.area.trim());
  });
  return Array.from(areasSet).sort();
}

export function getUniqueEmployeeSizes(startups) {
  const sizesSet = new Set();
  startups.forEach(s => {
    if (s.employees) sizesSet.add(s.employees);
  });
  return Array.from(sizesSet).sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
    const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
    return numA - numB;
  });
}

export function getUniquePrecisions(startups) {
  const precisionsSet = new Set();
  startups.forEach(s => {
    if (s.locationPrecision) precisionsSet.add(s.locationPrecision);
  });
  return Array.from(precisionsSet).sort();
}
