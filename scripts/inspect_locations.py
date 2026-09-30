import json

def main():
    echai = json.load(open('server/data/echai-bengaluru-startups.json', encoding='utf-8'))
    existing = json.load(open('server/data/startups.json', encoding='utf-8'))

    locs = [item.get('location') for item in echai if item.get('location')]
    unique_locs = sorted(list(set(locs)))

    print(f"Total echai records: {len(echai)}")
    print(f"Non-empty locations: {len(locs)}")
    print(f"Unique location strings: {len(unique_locs)}")
    
    # Check existing startups area coordinates dictionary
    area_coords = {}
    for s in existing:
        area = s.get('area')
        lat = s.get('latitude')
        lng = s.get('longitude')
        if area and lat is not None and lng is not None:
            if area not in area_coords:
                area_coords[area] = []
            area_coords[area].append((lat, lng))

    print("\n--- Existing Area Centroids ---")
    area_centroids = {}
    for area, pts in area_coords.items():
        avg_lat = round(sum(p[0] for p in pts) / len(pts), 4)
        avg_lng = round(sum(p[1] for p in pts) / len(pts), 4)
        area_centroids[area] = (avg_lat, avg_lng)
        print(f"Area: {area} ({len(pts)} startups) -> ({avg_lat}, {avg_lng})")

    print("\n--- Sample EChai Locations ---")
    for l in unique_locs[:50]:
        print(f"- {l}")

if __name__ == '__main__':
    main()
