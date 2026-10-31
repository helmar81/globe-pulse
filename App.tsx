// @ts-nocheck React is installed, but its type declarations are missing.
import React from 'react';
import { CITIES } from './constants';
import CityCard from './components/CityCard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">Global Pulse</h1>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
             <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">World Time</h2>
             <p className="text-slate-400 max-w-2xl">
               Real-time synchronization across three major global hubs. 
               AI-enhanced insights available on demand. Real-time weather observations and short-term forecasts per hub.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {CITIES.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
             &copy; {new Date().getFullYear()} | Built by{' '}
              <a 
                href="https://uspekhi.web.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline text-blue-200 hover:text-blue-300"
              >
                <strong>USPEKHI</strong>
              </a>
              <br />
              <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-200 hover:text-blue-300">
                Privacy Policy
              </a>

          
        </div>
      </footer>
    </div>
  );
};

export default App;
