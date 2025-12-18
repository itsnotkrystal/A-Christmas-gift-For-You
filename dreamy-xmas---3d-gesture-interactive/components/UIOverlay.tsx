
import React from 'react';
import { Volume2, VolumeX, Hand, MousePointer2 } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  toggleAudio: () => void;
  isGestureEnabled: boolean;
}

export const UIOverlay: React.FC<Props> = ({ isPlaying, toggleAudio, isGestureEnabled }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="text-white font-serif tracking-widest">
          <div className="text-2xl">DREAMY XMAS</div>
          <div className="text-[10px] text-green-400/50 uppercase">V 1.1.0 // CLASSIC THEME</div>
        </div>
        
        <button 
          onClick={toggleAudio}
          className="p-3 bg-white/5 border border-white/10 rounded-full text-white transition-all hover:bg-white/20 active:scale-90"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      <div className="flex justify-between items-end">
        <div className="text-white/40 text-sm flex items-center gap-2">
          {isGestureEnabled ? (
            <><Hand size={16} /> GESTURE CONTROL ACTIVE</>
          ) : (
            <><MousePointer2 size={16} /> CLICK TO TOGGLE STATES</>
          )}
        </div>
        
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="text-right text-yellow-500 text-xs font-bold uppercase tracking-widest">
            Green & Gold Engine
          </div>
          <div className="flex gap-1 h-1">
             <div className="w-12 bg-green-600 rounded-full"></div>
             <div className="w-6 bg-yellow-500 rounded-full"></div>
             <div className="w-3 bg-red-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
