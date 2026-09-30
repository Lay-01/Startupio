import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { requestStartups } from '../utils/api';

export default function CommandSearchModal({
  isOpen,
  onClose,
  onSelectStartup
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setIsLoading(true);
      setError('');
      requestStartups({ page: '1', limit: '8', q: query }, { signal: controller.signal })
        .then(data => {
          if (controller.signal.aborted) return;
          setResults(data.items);
          setTotal(data.total);
        })
        .catch(requestError => {
          if (!controller.signal.aborted) setError(requestError.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, query ? 180 : 0);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen, query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/40 backdrop-blur-md">
      
      {/* Backdrop overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Command Dialog Container */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/50 shadow-glass-xl overflow-hidden z-10 flex flex-col">
        
        {/* Search Header Input */}
        <div className="p-5 border-b border-slate-100/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center shrink-0 shadow-lg">
            <Search className="w-5 h-5 text-sky-300" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search startups, founders, sectors, or addresses..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResults([]);
              setTotal(0);
            }}
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2.5 space-y-1">
          {error ? (
            <div role="alert" className="py-12 px-4 text-center text-xs font-semibold text-rose-700">{error}</div>
          ) : isLoading && results.length === 0 ? (
            <div className="py-12 px-4 text-center text-xs font-semibold text-slate-500">Searching startups...</div>
          ) : results.length > 0 ? (
            results.map((startup) => (
              <div
                key={startup.id}
                onClick={() => {
                  onSelectStartup(startup);
                  onClose();
                }}
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50/80 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                    {startup.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors duration-200 truncate">
                        {startup.name}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                        {startup.sector}
                      </span>
                      {startup.verified && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {startup.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-400 group-hover:text-slate-700 shrink-0">
                  <span className="hidden sm:inline font-bold text-[11px]">{startup.employees}</span>
                  <ArrowRight className="w-4 h-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sky-500" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 mx-auto mb-3">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-slate-500 text-xs">
                No startups found matching "<span className="font-bold text-slate-700">{query}</span>"
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50/80 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-medium">Startup.io Discovery</span>
          </div>
          <div className="font-medium">
            {results.length > 0 ? `Showing ${results.length} of ${total}` : 'No results'}
          </div>
        </div>

      </div>

    </div>
  );
}
