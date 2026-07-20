"use client";

import { useState, useEffect, useRef } from "react";

interface Racer {
  address: string;
  monkey: string;
  boat: string;
  name: string;
  progress: number;
  speed: number;
  shields: number;
  shortcuts: number;
  tokensLocked: number;
  finished: boolean;
  finishTime?: number;
}

interface RaceTrackProps {
  racers: Racer[];
  isLive: boolean;
  winner?: string;
}

export function RaceTrack({ racers, isLive, winner }: RaceTrackProps) {
  const [animatedRacers, setAnimatedRacers] = useState(racers);
  const trackRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setAnimatedRacers(prev => 
          prev.map(r => {
            if (r.finished) return r;
            const boost = r.shields * 0.5 + r.shortcuts * 2;
            const newProgress = Math.min(r.progress + (r.speed / 1000) + (boost / 100), 100);
            const finished = newProgress >= 100;
            return {
              ...r,
              progress: newProgress,
              finished,
              finishTime: finished ? Date.now() : undefined,
            };
          })
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLive]);
  
  const sortedRacers = [...animatedRacers].sort((a, b) => b.progress - a.progress);
  
  return (
    <div className="race-track" ref={trackRef}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-bay-300">🏝️ Race to Jungle Bay</h3>
        {isLive && <span className="text-red-400 animate-pulse font-bold">● LIVE</span>}
        {winner && <span className="text-sand-400 glow-gold font-bold">🏆 Winner: {winner}</span>}
      </div>
      
      {/* Island at the end */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-5xl animate-float">
        🏝️
      </div>
      
      <div className="space-y-2 relative z-10">
        {sortedRacers.map((racer, idx) => (
          <div key={racer.address} className="race-lane">
            <div className="w-8 text-center font-bold text-bay-300 text-lg">#{idx + 1}</div>
            
            <div className="racer-token text-3xl" style={{ marginLeft: `${racer.progress * 5}px` }}>
              <span>{racer.monkey}</span>
              <span className="boat-icon">{racer.boat}</span>
            </div>
            
            <div className="flex-1 ml-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-jungle-300">{racer.name}</span>
                <span className="text-xs text-bay-400">{racer.tokensLocked} JNG</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${racer.progress}%` }} />
              </div>
            </div>
            
            <div className="flex gap-1">
              {racer.shields > 0 && <span className="power-up-badge power-shield">🛡️ {racer.shields}</span>}
              {racer.shortcuts > 0 && <span className="power-up-badge power-shortcut">🌊 {racer.shortcuts}</span>}
            </div>
            
            {racer.finished && <span className="text-sand-400 text-xl">🏁</span>}
          </div>
        ))}
      </div>
      
      {/* Water animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-30">
        <div className="flex gap-1 h-full items-end">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="flex-1 bg-bay-500 rounded-t-full" style={{
              height: `${30 + Math.sin(i + Date.now() / 500) * 20}%`,
              animation: `wave ${1 + (i % 3) * 0.3}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}