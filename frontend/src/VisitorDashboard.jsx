import React, { useState, useEffect } from 'react';

const VisitorDashboard = () => {
  // Load the count from LocalStorage when the page starts so data survives refreshes
  const [visitorCount, setVisitorCount] = useState(() => {
    return Number(localStorage.getItem('dailyVisitorCount')) || 0;
  });

  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Set up the current date format when the dashboard mounts
  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-NZ', options);
    setCurrentDate(today);
  }, []);

  // Save the count to browser memory every time it changes
  useEffect(() => {
    localStorage.setItem('dailyVisitorCount', visitorCount);
  }, [visitorCount]);

  // Function to handle the incoming Arduino event
  const handleNewVisitor = () => {
    const timestamp = new Date().toLocaleTimeString();
    setVisitorCount(prev => prev + 1);

    // UPDATED VALUE: Keeping the last 25 entries now instead of 10
    const newEntry = { id: Date.now(), time: timestamp };
    setLogs(prev => [newEntry, ...prev].slice(0, 25));
  };

  // WebSocket Connection Logic
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log("Connected to Backend Bridge");
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log("Disconnected from Backend Bridge");
      setIsConnected(false);
    };

    socket.onmessage = (event) => {
      if (event.data.trim() === "INC_COUNT") {
        handleNewVisitor();
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans">
      {/* Container */}
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Visi<span className="text-blue-500">Track</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Visitor Tracking System - <span className="text-slate-300 font-medium">{currentDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {isConnected ? 'Hardware Linked' : 'Searching for Hardware...'}
            </span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Big Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>

              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-4">Total Visitors Today</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-8xl font-black text-white tabular-nums leading-none">
                  {visitorCount}
                </h2>
                <span className="text-blue-500 font-bold text-xl">vst.</span>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  if (window.confirm("Reset daily counter?")) {
                    setVisitorCount(0);
                    setLogs([]);
                  }
                }}
                className="w-full mt-4 py-2 bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 rounded-xl text-xs font-semibold transition-all border border-rose-900/50"
              >
                Clear Daily Counter
              </button>


            </div>
          </div>

          {/* Right Column: Activity Log */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-lg font-bold text-white">Live Event Feed</h3>
                {/* Updated UI text label to show 25 events */}
                <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-950 rounded-md border border-slate-800">Last 25 Events</span>
              </div>

              {/* Scrollable feed area */}
              <div className="space-y-1.5 overflow-y-auto grow pr-1 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl p-8">
                    <p className="text-slate-600 italic text-sm">Waiting for entry detection...</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-center bg-slate-800/20 py-1.5 px-3 rounded-xl border border-slate-900 hover:border-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Shrunk indicator indicator bubble */}
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-110 transition-transform"></div>
                        </div>

                        <span className="text-xs font-medium text-slate-300">Visitor Entry Detected</span>
                      </div>

                      <span className="text-slate-500 font-mono text-xs">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;