import React from 'react';
import StartupDetails from './StartupDetails';

export default function StartupBottomSheet({ startup, onClose }) {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop overlay touch to close */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Bottom Sheet Drawer Content */}
      <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
        
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" onClick={onClose} />

        <div className="p-0">
          <StartupDetails startup={startup} onClose={onClose} />
        </div>

      </div>

    </div>
  );
}
