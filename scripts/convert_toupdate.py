import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'toupdate.json'
TARGET = ROOT / 'server' / 'data' / 'startups.json'


def slugify(value):
    if value is None:
        return ''
    text = str(value).strip().lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def normalize_size(value):
    if value is None or value == '':
        return '1–10'
    text = str(value).strip()
    if text in {'1–10', '1-10', '1-10 employees', '1-10 Employees'}:
        return '1–10'
    if text in {'11–50', '11-50', '11-50 employees', '11-50 Employees'}:
        return '11–50'
    if text in {'51–200', '51-200', '51-200 employees', '51-200 Employees'}:
        return '51–200'
    if text in {'201–500', '201-500', '201-500 employees', '201-500 Employees'}:
        return '201–500'
    if text in {'501–1000', '501-1000', '501-1000 employees', '501-1000 Employees'}:
        return '501–1000'
    if text in {'1001–5000', '1001-5000', '1001-5000 employees', '1001-5000 Employees'}:
        return '1001–5000'
    if text in {'5000+', '5000+ employees'}:
        return '5000+'
    return '1–10'


def first_linkedin_url(founder_links):
    if not founder_links:
        return ''
    for entry in founder_links:
        if isinstance(entry, dict):
            url = entry.get('url') or ''
            if 'linkedin.com' in str(url).lower():
                return str(url)
        elif isinstance(entry, str):
            if 'linkedin.com' in entry.lower():
                return entry
    return ''


raw = json.loads(SOURCE.read_text(encoding='utf-8'))
normalized = []

for idx, item in enumerate(raw):
    name = (item.get('name') or '').strip()
    slug = (item.get('slug') or slugify(name) or f'startup-{idx + 1}').strip()
    area = (item.get('area') or '').strip()
    city = 'Bengaluru'
    address = (item.get('hsr_location') or item.get('address') or '').strip()
    if not address and area:
        address = f'{area}, {city}, Karnataka, India'
    elif not address:
        address = f'{city}, Karnataka, India'

    sector = (item.get('sector') or item.get('kind') or 'Other').strip() or 'Other'
    description = (item.get('description') or item.get('tagline') or '').strip()

    founders = item.get('founders') or []
    if isinstance(founders, str):
        founders = [f.strip() for f in founders.split(',') if f.strip()]
    founders = [str(f).strip() for f in founders if str(f).strip()]

    founder_links = item.get('founder_links') or []
    linkedin_url = first_linkedin_url(founder_links)
    website_url = (item.get('website') or '').strip()
    if website_url and not website_url.startswith(('http://', 'https://')):
        website_url = 'https://' + website_url

    latitude = item.get('lat')
    longitude = item.get('lng')
    try:
        latitude = float(latitude) if latitude not in (None, '', 'null', 'NaN') else None
    except (TypeError, ValueError):
        latitude = None
    try:
        longitude = float(longitude) if longitude not in (None, '', 'null', 'NaN') else None
    except (TypeError, ValueError):
        longitude = None

    if latitude is not None and longitude is not None:
        location_precision = 'exact'
    elif area or address:
        location_precision = 'approximate'
    else:
        location_precision = 'unavailable'

    employee_value = normalize_size(item.get('employees'))

    verified = bool(item.get('verified') is True or latitude is not None or website_url or linkedin_url)
    confidence = (item.get('confidence') or '').lower() or ('high' if verified else 'medium')
    evidence = (item.get('evidenceNotes') or '').strip() or (
        description or f"Startup details identified in {area or city}."
    )
    verification_sources = item.get('verificationSources') or []
    if isinstance(verification_sources, str):
        verification_sources = [verification_sources]
    if not verification_sources:
        verification_sources = []
        if website_url:
            verification_sources.append(website_url)
        if linkedin_url:
            verification_sources.append(linkedin_url)
        for link in founder_links:
            if isinstance(link, dict):
                url = link.get('url')
                if url:
                    verification_sources.append(str(url))
    verification_sources = list(dict.fromkeys([str(v).strip() for v in verification_sources if str(v).strip()]))

    founded_year = item.get('founded_year')
    if founded_year in (None, '', 'null'):
        founded_year = None

    data_source = item.get('dataSource') or []
    if not data_source and website_url:
        data_source = [{'type': 'website', 'url': website_url}]
    if not data_source and linkedin_url:
        data_source = [{'type': 'linkedin', 'url': linkedin_url}]

    normalized.append({
        'id': slug,
        'name': name,
        'sector': sector,
        'address': address,
        'city': city,
        'area': area or 'Bengaluru',
        'description': description,
        'employees': employee_value,
        'founders': founders,
        'foundedYear': founded_year,
        'confidence': confidence,
        'evidenceNotes': evidence,
        'verificationSources': verification_sources,
        'linkedinUrl': linkedin_url,
        'websiteUrl': website_url,
        'careersUrl': '',
        'applyUrl': '',
        'latitude': latitude,
        'longitude': longitude,
        'locationPrecision': location_precision,
        'locationSource': item.get('locationSource') or (f'{area or city} location data' if area else 'Public directory'),
        'dataSource': data_source,
        'verified': verified,
    })

TARGET.write_text(json.dumps(normalized, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Converted {len(normalized)} startups into {TARGET}')
print(f'Verified count: {sum(1 for s in normalized if s["verified"]) }')
print(f'Exact precision count: {sum(1 for s in normalized if s["locationPrecision"] == "exact")}')
