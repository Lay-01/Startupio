import React from 'react';
import StartupDetails from './StartupDetails';

export default function StartupBottomSheet({ startup, onClose }) {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop overlay */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col border-t border-slate-200/80 animate-in slide-in-from-bottom duration-300">
        
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        <div className="p-0">
          <StartupDetails startup={startup} onClose={onClose} />
        </div>

      </div>

    </div>
  );
}
