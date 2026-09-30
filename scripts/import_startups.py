import json
import re
import random
from pathlib import Path
from urllib.parse import urlparse
from difflib import SequenceMatcher

ROOT_DIR = Path(__file__).resolve().parents[1]
EXISTING_FILE = ROOT_DIR / 'server' / 'data' / 'startups.json'
ECHAI_FILE = ROOT_DIR / 'server' / 'data' / 'echai-bengaluru-startups.json'
REVIEW_FILE = ROOT_DIR / 'server' / 'data' / 'manual_review_records.json'

def normalize_domain(url):
    if not url or not isinstance(url, str):
        return ''
    url = url.strip().lower()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc or parsed.path.split('/')[0]
        netloc = re.sub(r'^www\.', '', netloc)
        return netloc.strip()
    except Exception:
        return ''

def normalize_name(name):
    if not name:
        return ''
    name = str(name).lower().strip()
    # Remove parenthetical content e.g. (Think & Learn), (epiFi)
    name = re.sub(r'\([^)]*\)', '', name)
    name = re.sub(r'[^\w\s]', ' ', name)
    words = name.split()
    suffixes = {
        'pvt', 'ltd', 'private', 'limited', 'llp', 'inc', 'incorporated', 
        'corp', 'corporation', 'co', 'company', 'technologies', 'technology', 
        'solutions', 'services', 'labs', 'studio', 'studios', 'tech', 
        'health', 'india', 'global', 'systems', 'software', 'ai', 'io'
    }
    filtered = [w for w in words if w not in suffixes]
    if not filtered:
        filtered = words
    clean_str = ' '.join(filtered)
    return re.sub(r'\s+', ' ', clean_str).strip()

def compact_name(name):
    norm = normalize_name(name)
    return re.sub(r'\s+', '', norm)

def similarity(a, b):
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    return SequenceMatcher(None, a, b).ratio()

def slugify(value):
    if value is None:
        return ''
    text = str(value).strip().lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

LOCATION_MAPPINGS = [
    # Explicit Landmarks & Streets in Bengaluru
    ('hal old airport', ('HAL Old Airport Road', 12.9605, 77.6530)),
    ('sankey rd', ('Sadashivanagar', 12.9940, 77.5810)),
    ('shri krishna temple rd', ('Indiranagar', 12.9770, 77.6410)),
    ('ibc internal rd', ('Bannerghatta Road', 12.9290, 77.5950)),
    ('brookefield', ('Brookefield', 12.9667, 77.7117)),
    ('church street', ('MG Road', 12.9750, 77.6040)),
    ('brigade rd', ('MG Road', 12.9730, 77.6070)),
    ('residency rd', ('MG Road', 12.9700, 77.6020)),
    ('lavelle rd', ('MG Road', 12.9710, 77.5980)),
    ('lavelle road', ('MG Road', 12.9710, 77.5980)),
    ('richmond rd', ('Richmond Town', 12.9650, 77.6010)),
    ('richmond town', ('Richmond Town', 12.9650, 77.6010)),
    ('bannerghatta', ('Bannerghatta Road', 12.9121, 77.5984)),
    ('outer ring rd', ('Outer Ring Road', 12.9320, 77.6850)),
    ('outer ring road', ('Outer Ring Road', 12.9320, 77.6850)),
    ('sarjapur', ('Sarjapur Road', 12.9198, 77.6751)),
    ('bellary rd', ('Hebbal', 13.0350, 77.5890)),
    ('bellary road', ('Hebbal', 13.0350, 77.5890)),
    ('cmh rd', ('Indiranagar', 12.9780, 77.6430)),
    ('chinmaya mission hospital', ('Indiranagar', 12.9780, 77.6430)),
    ('100 feet', ('Indiranagar', 12.9720, 77.6410)),
    ('80 feet', ('Koramangala', 12.9380, 77.6250)),
    ('adugodi', ('Adugodi', 12.9440, 77.6080)),
    ('anekal', ('Anekal', 12.7107, 77.6974)),
    ('attibele', ('Attibele', 12.7783, 77.7711)),
    ('basavanagudi', ('Basavanagudi', 12.9331, 77.5748)),
    ('hrbr layout', ('Kalyan Nagar', 13.0184, 77.6464)),
    ('frazer town', ('Frazer Town', 12.9970, 77.6140)),
    ('benson town', ('Frazer Town', 12.9970, 77.6140)),
    ('domlur', ('Domlur', 12.9569, 77.6415)),
    ('ejipura', ('Ejipura', 12.9380, 77.6180)),
    ('mahadevapura', ('Mahadevapura', 12.9885, 77.6814)),
    ('hoodi', ('Hoodi', 12.9920, 77.7160)),
    ('kr puram', ('KR Puram', 13.0070, 77.6960)),
    ('kaggadasapura', ('CV Raman Nagar', 12.9800, 77.6650)),
    ('cv raman nagar', ('CV Raman Nagar', 12.9820, 77.6620)),
    ('vignan nagar', ('CV Raman Nagar', 12.9700, 77.6680)),
    ('mathikere', ('Mathikere', 13.0330, 77.5600)),
    ('yeshwanthpur', ('Yeshwanthpur', 13.0308, 77.5235)),
    ('yeswanthpur', ('Yeshwanthpur', 13.0308, 77.5235)),
    ('peenya', ('Yeshwanthpur', 13.0308, 77.5235)),
    ('tumkur rd', ('Yeshwanthpur', 13.0308, 77.5235)),
    ('sadashivanagar', ('Sadashivanagar', 13.0070, 77.5800)),
    ('vasanth nagar', ('Vasanth Nagar', 12.9880, 77.5920)),
    ('cunningham', ('Vasanth Nagar', 12.9860, 77.5970)),
    ('malleshwaram', ('Malleshwaram', 13.0033, 77.5756)),
    ('malleswaram', ('Malleshwaram', 13.0033, 77.5756)),
    ('margosa', ('Malleshwaram', 13.0033, 77.5756)),
    ('sampige', ('Malleshwaram', 13.0033, 77.5756)),
    ('rajajinagar', ('Rajajinagar', 12.9795, 77.5574)),
    ('orion mall', ('Rajajinagar', 12.9795, 77.5574)),
    ('dr rajkumar rd', ('Rajajinagar', 12.9795, 77.5574)),
    ('vijayanagar', ('Vijayanagar', 12.9612, 77.5481)),
    ('nagarbhavi', ('Vijayanagar', 12.9612, 77.5481)),
    ('banashankari', ('Banashankari', 12.9211, 77.5289)),
    ('jp nagar', ('JP Nagar', 12.9044, 77.5918)),
    ('btm layout', ('BTM Layout', 12.9235, 77.6116)),
    ('jayanagar', ('Jayanagar', 12.9304, 77.5850)),
    ('hsr layout', ('HSR Layout', 12.9152, 77.6417)),
    ('hsr', ('HSR Layout', 12.9152, 77.6417)),
    ('haralur', ('HSR Layout', 12.9152, 77.6417)),
    ('kasavanahalli', ('HSR Layout', 12.9152, 77.6417)),
    ('hosa rd', ('HSR Layout', 12.9152, 77.6417)),
    ('nift', ('HSR Layout', 12.9152, 77.6417)),
    ('koramangala', ('Koramangala', 12.9340, 77.6309)),
    ('sony world', ('Koramangala', 12.9340, 77.6309)),
    ('jyoti nivas', ('Koramangala', 12.9340, 77.6309)),
    ('indiranagar', ('Indiranagar', 12.9713, 77.6422)),
    ('whitefield', ('Whitefield', 12.9808, 77.7165)),
    ('itpl', ('Whitefield', 12.9808, 77.7165)),
    ('nallurhalli', ('Whitefield', 12.9808, 77.7165)),
    ('electronic city', ('Electronic City', 12.8490, 77.6587)),
    ('bommasandra', ('Electronic City', 12.8490, 77.6587)),
    ('jigani', ('Electronic City', 12.8490, 77.6587)),
    ('marathahalli', ('Marathahalli', 12.9653, 77.6975)),
    ('embassy tech village', ('Marathahalli', 12.9653, 77.6975)),
    ('embassy tech square', ('Marathahalli', 12.9653, 77.6975)),
    ('bellandur', ('Bellandur', 12.9315, 77.6848)),
    ('devarabisanahalli', ('Bellandur', 12.9315, 77.6848)),
    ('ecoworld', ('Bellandur', 12.9315, 77.6848)),
    ('prestige tech park', ('Bellandur', 12.9315, 77.6848)),
    ('kadubeesanahalli', ('Bellandur', 12.9315, 77.6848)),
    ('sakra world hospital', ('Bellandur', 12.9315, 77.6848)),
    ('hebbal', ('Hebbal', 13.0569, 77.5917)),
    ('manyata tech park', ('Hebbal', 13.0452, 77.6091)),
    ('manyata', ('Hebbal', 13.0452, 77.6091)),
    ('jakkur', ('Hebbal', 13.0569, 77.5917)),
    ('sahakar nagar', ('Hebbal', 13.0569, 77.5917)),
    ('yelahanka', ('Yelahanka', 13.1161, 77.6067)),
    ('devanahalli', ('Devanahalli', 13.1569, 77.7106)),
    ('kalyan nagar', ('Kalyan Nagar', 13.0184, 77.6464)),
    ('banaswadi', ('Banaswadi', 13.0063, 77.6531)),
    ('hennur', ('Kalyan Nagar', 13.0184, 77.6464)),
    ('bommanahalli', ('Bommanahalli', 12.9082, 77.6284)),
    ('hosur rd', ('Bommanahalli', 12.9082, 77.6284)),
    ('hosur road', ('Bommanahalli', 12.9082, 77.6284)),
    ('kudlu', ('Bommanahalli', 12.9082, 77.6284)),
    ('silk board', ('Bommanahalli', 12.9082, 77.6284)),
    ('rt nagar', ('RT Nagar', 12.9908, 77.6193)),
    ('sanjay nagar', ('Sanjay Nagar', 13.0319, 77.5794)),
    ('sanjaynagar', ('Sanjay Nagar', 13.0319, 77.5794)),
    ('ulsoor', ('Ulsoor', 12.9757, 77.6264)),
    ('halasuru', ('Ulsoor', 12.9757, 77.6264)),
    ('mg road', ('MG Road', 12.9729, 77.6069)),
    ('mysore rd', ('Mysore Road', 12.9290, 77.5142)),
    ('rajarajeshwari nagar', ('Mysore Road', 12.9290, 77.5142)),
    ('global village', ('Mysore Road', 12.9290, 77.5142)),
    ('wilson garden', ('Wilson Garden', 12.9480, 77.5960)),
    ('infantry rd', ('MG Road', 12.9800, 77.5980)),
    ('kasturba rd', ('MG Road', 12.9730, 77.5950)),
    ('cambridge rd', ('Domlur', 12.9700, 77.6320)),
    ('hoskote', ('Hoskote', 13.0720, 77.7980)),
    ('kanakapura', ('Banashankari', 12.8900, 77.5600)),
    ('vidyaranyapura', ('Vidyaranyapura', 13.0662, 77.5764)),
]

def geocode_location(loc_str):
    if not loc_str or not isinstance(loc_str, str):
        return None, None, None, 'needs_verification'
    
    l_norm = loc_str.lower().strip()
    if not l_norm:
        return None, None, None, 'needs_verification'

    for kw, (area_name, lat, lng) in LOCATION_MAPPINGS:
        if kw in l_norm:
            # Deterministic small offset using location string hash for reproducible pins
            h = sum(ord(c) for c in l_norm)
            offset_lat = round((((h % 17) - 8) / 50000.0), 5)
            offset_lng = round((((h % 13) - 6) / 50000.0), 5)
            return area_name, round(lat + offset_lat, 4), round(lng + offset_lng, 4), 'approximate'

    return 'Bengaluru', None, None, 'needs_verification'

def run_import():
    # Load existing startups database and imported echai dataset
    existing_records = json.loads(EXISTING_FILE.read_text(encoding='utf-8'))
    imported_records = json.loads(ECHAI_FILE.read_text(encoding='utf-8'))

    initial_existing_count = len(existing_records)
    total_imported_count = len(imported_records)

    # Fast indexes for matching
    ex_by_domain = {}
    ex_by_compact_name = {}

    for item in existing_records:
        d = normalize_domain(item.get('websiteUrl') or item.get('website'))
        if d:
            ex_by_domain[d] = item

        c_name = compact_name(item.get('name'))
        if c_name:
            if c_name not in ex_by_compact_name:
                ex_by_compact_name[c_name] = []
            ex_by_compact_name[c_name].append(item)

    duplicates_found = 0
    new_startups_added = 0
    records_requiring_review = 0
    records_without_coords = 0

    review_list = []
    existing_slugs = set(s.get('id') for s in existing_records if s.get('id'))

    for item in imported_records:
        e_name = (item.get('name') or '').strip()
        e_category = (item.get('category') or '').strip() if item.get('category') else None
        e_website = (item.get('website') or '').strip()
        e_location = (item.get('location') or '').strip()

        e_domain = normalize_domain(e_website)
        e_compact = compact_name(e_name)
        e_norm = normalize_name(e_name)

        is_duplicate = False
        matched_existing = None

        # 1. Exact domain match (very strong signal)
        if e_domain and e_domain in ex_by_domain:
            is_duplicate = True
            matched_existing = ex_by_domain[e_domain]

        # 2. Exact compact name match (very strong signal)
        elif e_compact and e_compact in ex_by_compact_name:
            is_duplicate = True
            matched_existing = ex_by_compact_name[e_compact][0]

        # 3. Fuzzy name match check
        else:
            first_char = e_compact[0] if e_compact else ''
            candidates = [ex for ex in existing_records if compact_name(ex.get('name')) and compact_name(ex.get('name'))[0] == first_char]
            best_score = 0
            best_cand = None
            for ex in candidates:
                ex_norm = normalize_name(ex.get('name'))
                score = similarity(e_norm, ex_norm)
                if score > best_score:
                    best_score = score
                    best_cand = ex

            if best_score >= 0.88:
                is_duplicate = True
                matched_existing = best_cand
            elif best_score >= 0.70:
                # Flag for manual review
                records_requiring_review += 1
                review_list.append({
                    "imported": item,
                    "matched_candidate": {
                        "id": best_cand.get("id"),
                        "name": best_cand.get("name"),
                        "website": best_cand.get("websiteUrl"),
                        "address": best_cand.get("address")
                    },
                    "similarity_score": round(best_score, 3)
                })

        if is_duplicate:
            duplicates_found += 1
            # Optionally enrich existing record with additional details if missing
            if matched_existing:
                if e_website and not matched_existing.get('websiteUrl') and not matched_existing.get('website'):
                    matched_existing['websiteUrl'] = e_website
                    matched_existing['website'] = e_website
                if e_category and (not matched_existing.get('sector') or matched_existing.get('sector') == 'Other'):
                    matched_existing['sector'] = e_category
                    matched_existing['category'] = e_category
                if e_location and not matched_existing.get('address') and not matched_existing.get('location'):
                    matched_existing['address'] = e_location
                    matched_existing['location'] = e_location
                
                ds = matched_existing.get('dataSource') or []
                if not any(isinstance(d, dict) and d.get('type') == 'echai-bengaluru' for d in ds):
                    if isinstance(ds, list):
                        ds.append({'type': 'echai-bengaluru', 'source': 'EChai Bengaluru Import'})
                        matched_existing['dataSource'] = ds

        else:
            # Add as new startup
            new_startups_added += 1
            base_slug = slugify(e_name) or f"startup-{initial_existing_count + new_startups_added}"
            slug = base_slug
            counter = 1
            while slug in existing_slugs:
                slug = f"{base_slug}-{counter}"
                counter += 1
            existing_slugs.add(slug)

            area_name, lat, lng, prec = geocode_location(e_location)
            if lat is None or lng is None:
                records_without_coords += 1

            new_record = {
                "id": slug,
                # Preserved original fields:
                "name": e_name,
                "category": e_category or "Startup",
                "website": e_website,
                "location": e_location,
                # Standard application fields:
                "sector": e_category or "Startup",
                "address": e_location or "Bengaluru, Karnataka, India",
                "city": "Bengaluru",
                "area": area_name or "Bengaluru",
                "description": f"{e_name} is a startup based in {e_location or 'Bengaluru'}.",
                "employees": "1–10",
                "founders": [],
                "foundedYear": None,
                "confidence": "high" if lat is not None else "medium",
                "evidenceNotes": f"Imported from EChai Bengaluru dataset. Location: {e_location}.",
                "verificationSources": [e_website] if e_website else [],
                "linkedinUrl": "",
                "websiteUrl": e_website,
                "careersUrl": "",
                "applyUrl": "",
                "latitude": lat,
                "longitude": lng,
                "locationPrecision": prec,
                "locationSource": "EChai Bengaluru Dataset",
                "dataSource": "EChai Bengaluru Dataset",
                "needsReview": True,
                "verified": bool(lat is not None or e_website)
            }
            existing_records.append(new_record)

    # Save updated database
    EXISTING_FILE.write_text(json.dumps(existing_records, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    # Save review records
    REVIEW_FILE.write_text(json.dumps(review_list, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    print(f"Existing records: {initial_existing_count}")
    print(f"Imported records: {total_imported_count}")
    print(f"Duplicates found: {duplicates_found}")
    print(f"New startups added: {new_startups_added}")
    print(f"Records requiring review: {records_requiring_review}")
    print(f"Records without valid coordinates: {records_without_coords}")

if __name__ == '__main__':
    run_import()
