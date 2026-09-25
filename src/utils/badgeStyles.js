/**
 * Helper to generate sector badge styling matching the reference UI
 */
export function getSectorBadgeStyle(sectorName) {
  if (!sectorName) {
    return { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600', 
      border: 'border-purple-100', 
      pill: 'bg-purple-50 text-purple-600 border-purple-100' 
    };
  }

  const s = sectorName.toLowerCase();

  if (s.includes('fintech') || s.includes('finance') || s.includes('payment') || s.includes('money')) {
    return { 
      bg: 'bg-orange-50', 
      text: 'text-orange-600', 
      border: 'border-orange-200/60', 
      pill: 'bg-orange-50 text-orange-600 border-orange-200/60' 
    };
  }
  if (s.includes('saas') || s.includes('enterprise') || s.includes('software') || s.includes('b2b')) {
    return { 
      bg: 'bg-indigo-50', 
      text: 'text-indigo-600', 
      border: 'border-indigo-200/60', 
      pill: 'bg-indigo-50 text-indigo-600 border-indigo-200/60' 
    };
  }
  if (s.includes('ai') || s.includes('deeptech') || s.includes('deep tech') || s.includes('robotics')) {
    return { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600', 
      border: 'border-purple-200/60', 
      pill: 'bg-purple-50 text-purple-600 border-purple-200/60' 
    };
  }
  if (s.includes('health') || s.includes('bio') || s.includes('med') || s.includes('pharma')) {
    return { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700', 
      border: 'border-emerald-200/60', 
      pill: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
    };
  }
  if (s.includes('vc') || s.includes('capital') || s.includes('investor') || s.includes('fund')) {
    return { 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200/60', 
      pill: 'bg-green-50 text-green-700 border-green-200/60' 
    };
  }
  if (s.includes('d2c') || s.includes('consumer') || s.includes('retail') || s.includes('e-commerce') || s.includes('ecommerce')) {
    return { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600', 
      border: 'border-purple-200/60', 
      pill: 'bg-purple-50 text-purple-600 border-purple-200/60' 
    };
  }
  if (s.includes('edtech') || s.includes('education') || s.includes('learn')) {
    return { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700', 
      border: 'border-amber-200/60', 
      pill: 'bg-amber-50 text-amber-700 border-amber-200/60' 
    };
  }
  if (s.includes('crypto') || s.includes('web3')) {
    return { 
      bg: 'bg-cyan-50', 
      text: 'text-cyan-700', 
      border: 'border-cyan-200/60', 
      pill: 'bg-cyan-50 text-cyan-700 border-cyan-200/60' 
    };
  }
  return { 
    bg: 'bg-slate-100', 
    text: 'text-slate-600', 
    border: 'border-slate-200/60', 
    pill: 'bg-slate-100 text-slate-600 border-slate-200/60' 
  };
}
