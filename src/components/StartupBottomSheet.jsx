import React from 'react';
import StartupDetails from './StartupDetails';

export default function StartupBottomSheet({ startup, onClose }) {
  if (!startup) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/30 backdrop-blur-sm">
      
      {/* Backdrop overlay touch to close */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Bottom Sheet Drawer Content */}
      <div className="bg-white/95 backdrop-blur-2xl max-h-[85vh] overflow-y-auto shadow-glass-xl flex flex-col border-t border-slate-200/40 rounded-t-3xl">
        
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 shrink-0" onClick={onClose}>
          <div className="w-10 h-1 bg-slate-300 rounded-full cursor-pointer hover:bg-slate-400 transition-colors" />
        </div>

        {/* Drag indicator area */}
        <div className="flex justify-center pb-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Swipe to dismiss</span>
          </div>
        </div>

        <div className="p-0">
          <StartupDetails startup={startup} onClose={onClose} />
        </div>

      </div>

    </div>
  );
}
