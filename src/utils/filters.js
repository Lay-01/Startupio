/**
 * Filtering utility for Startup.io
 */
export function filterStartups(startups, { sector = 'all', area = 'all', employeeSize = 'all', precision = 'all', verifiedOnly = false }) {
  return startups.filter(startup => {
    // Sector filter
    if (sector !== 'all') {
      const s = startup.sector?.toLowerCase() || '';
      const filterSector = sector.toLowerCase();
      if (!s.includes(filterSector)) {
        return false;
      }
    }

    // Area filter
    if (area !== 'all') {
      const a = startup.area?.toLowerCase() || '';
      const filterArea = area.toLowerCase();
      if (!a.includes(filterArea) && !filterArea.includes(a)) {
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
  const sectorsSet = new Set();
  startups.forEach(s => {
    if (!s.sector) return;
    // Extract primary sector tag before slash if any, or normalize
    const parts = s.sector.split('/').map(p => p.trim());
    parts.forEach(part => sectorsSet.add(part));
  });
  return Array.from(sectorsSet).sort();
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
  const sizes = [
    '1–10',
    '11–50',
    '51–200',
    '201–500',
    '501–1000',
    '1001–5000',
    '5000+'
  ];
  return sizes;
}
