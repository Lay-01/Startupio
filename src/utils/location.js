/**
 * Location precision helper functions
 */

// Bengaluru default fallback center coordinates (centroid between Indiranagar, HSR Layout, BTM Layout)
export const BENGALURU_CENTER = [12.9350, 77.6350];
export const DEFAULT_ZOOM = 13;

export function getLocationPrecisionMeta(precision) {
  switch (precision) {
    case 'exact':
      return {
        label: 'Exact Location',
        shortLabel: 'Exact Office',
        color: 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        markerBg: '#059669', // Emerald 600
        markerBorder: '#047857',
        description: 'Verified physical street address & geocoded office location.'
      };
    case 'approximate':
      return {
        label: 'Approximate Area',
        shortLabel: 'Estimated Area',
        color: 'amber',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        markerBg: '#d97706', // Amber 600
        markerBorder: '#b45309',
        description: 'Office is located in designated area; exact building coordinates estimated.'
      };
    case 'unavailable':
    default:
      return {
        label: 'Location Unavailable',
        shortLabel: 'Location Hidden',
        color: 'slate',
        badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
        markerBg: '#64748b', // Slate 500
        markerBorder: '#475569',
        description: 'Exact office address not publicly disclosed.'
      };
  }
}
