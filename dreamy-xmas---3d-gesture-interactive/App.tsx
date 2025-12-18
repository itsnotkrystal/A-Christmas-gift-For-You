
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { SplashScreen } from './components/SplashScreen';
import { GestureManager } from './components/GestureManager';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [isGestureEnabled, setIsGestureEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (appState === AppState.PLAYING) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        setIsPlaying(true);
      }
    }
  }, [appState]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050103]">
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      />

      {appState === AppState.SPLASH ? (
        <SplashScreen 
          onEnter={() => setAppState(AppState.PLAYING)}
          onEnterWithGesture={() => {
            setIsGestureEnabled(true);
            setAppState(AppState.PLAYING);
          }}
        />
      ) : (
        <>
          <Canvas
            shadows
            camera={{ position: [0, 5, 15], fov: 45 }}
            gl={{ antialias: false, stencil: false, depth: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Scene isGestureEnabled={isGestureEnabled} />
            </Suspense>
          </Canvas>

          <UIOverlay 
            isPlaying={isPlaying} 
            toggleAudio={toggleAudio} 
            isGestureEnabled={isGestureEnabled} 
          />
          
          {isGestureEnabled && <GestureManager />}
        </>
      )}
    </div>
  );
};

export default App;
