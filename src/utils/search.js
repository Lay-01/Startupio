/**
 * Multi-field search helper for Startup.io
 * Searches across name, sector, description, founders, address, and city/area.
 */
export function searchStartups(startups, query) {
  if (!query || !query.trim()) {
    return startups;
  }

  const q = query.trim().toLowerCase();

  return startups.filter(startup => {
    const nameMatch = startup.name?.toLowerCase().includes(q);
    const sectorMatch = startup.sector?.toLowerCase().includes(q);
    const descMatch = startup.description?.toLowerCase().includes(q);
    const addressMatch = startup.address?.toLowerCase().includes(q);
    const foundersMatch = Array.isArray(startup.founders) && 
      startup.founders.some(f => f.toLowerCase().includes(q));

    return nameMatch || sectorMatch || descMatch || addressMatch || foundersMatch;
  });
}
