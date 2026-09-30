/**
 * Multi-field search helper for Startup.io
 * Searches across name, sector, description, founders, address, and city/area.
 */
export function searchStartups(startups, query) {
  const normalize = value => String(value ?? '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return startups;
  }

  return startups.filter(startup => {
    const searchableFields = [
      startup.name,
      startup.sector,
      startup.description,
      startup.address,
      startup.area,
      startup.city,
      startup.employees,
      startup.foundedYear,
      startup.websiteUrl,
      startup.linkedinUrl,
      startup.careersUrl,
      startup.applyUrl,
      startup.evidenceNotes,
      ...(Array.isArray(startup.verificationSources) ? startup.verificationSources : []),
      ...(Array.isArray(startup.founders) ? startup.founders : [])
    ];

    return searchableFields.some(value => normalize(value).includes(normalizedQuery));
  });
}
