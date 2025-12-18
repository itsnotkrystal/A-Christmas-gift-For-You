
import React from 'react';

interface Props {
  onEnter: () => void;
  onEnterWithGesture: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onEnter, onEnterWithGesture }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050103] bg-opacity-80 backdrop-blur-md">
      <div className="p-12 border border-white/10 bg-white/5 rounded-3xl text-center flex flex-col items-center max-w-lg shadow-2xl">
        <h1 className="text-6xl md:text-8xl text-white mb-4 tracking-widest font-serif">
          DREAMY XMAS
        </h1>
        <p className="text-pink-200/60 mb-12 text-lg tracking-wider italic">
          Experience the Magic of Geometry & Motion
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full">
          <button 
            onClick={onEnter}
            className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            ENTER EXPERIENCE
          </button>
          <button 
            onClick={onEnterWithGesture}
            className="flex-1 px-8 py-4 border border-white/30 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white active:scale-95"
          >
            GESTURE MODE
          </button>
        </div>
        
        <div className="mt-8 text-white/40 text-xs">
          Use camera for gesture controls (Pinch to form Tree, Open to Explode)
        </div>
      </div>
    </div>
  );
};
