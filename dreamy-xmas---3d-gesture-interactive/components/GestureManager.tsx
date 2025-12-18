
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export const GestureManager: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gesture, setGesture] = useState<string>('Unknown');
  const [handPos, setHandPos] = useState({ x: 0, y: 0 });
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      handLandmarkerRef.current = handLandmarker;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 320, height: 240 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setIsLoaded(true);
            predict();
          };
        }
      }
    }

    let animationId: number;
    const predict = () => {
      if (videoRef.current && handLandmarkerRef.current) {
        const nowInMs = Date.now();
        const results = handLandmarkerRef.current.detectForVideo(videoRef.current, nowInMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Simple Gesture Logic
          // Index tip (8) and Thumb tip (4) distance
          const d = Math.sqrt(
            Math.pow(landmarks[4].x - landmarks[8].x, 2) +
            Math.pow(landmarks[4].y - landmarks[8].y, 2)
          );
          
          const isPinching = d < 0.05;
          setGesture(isPinching ? 'TREE (Pinch)' : 'EXPLODE (Open)');
          
          // Center of palm roughly at landmark 9
          setHandPos({
            x: 1 - landmarks[9].x, // Mirror flip
            y: landmarks[9].y
          });

          // Trigger state changes globally (using window event for simplicity)
          window.dispatchEvent(new CustomEvent('gestureChange', { 
            detail: { type: isPinching ? 'TREE' : 'EXPLODE', pos: { x: 1 - landmarks[9].x, y: landmarks[9].y } } 
          }));
        }
        animationId = requestAnimationFrame(predict);
      }
    };

    init();
    return () => {
      cancelAnimationFrame(animationId);
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="absolute bottom-8 right-8 w-48 h-36 bg-black/40 border border-white/20 rounded-xl overflow-hidden shadow-2xl z-40 pointer-events-none">
      {!isLoaded && <div className="absolute inset-0 flex items-center justify-center text-white/40 text-[10px]">INITIALIZING CAMERA...</div>}
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500 text-[10px] text-white rounded font-bold uppercase">
        {gesture}
      </div>
      
      {/* Visual Cursor following hand */}
      <div 
        className="absolute w-4 h-4 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_white]"
        style={{ left: `${handPos.x * 100}%`, top: `${handPos.y * 100}%` }}
      />
    </div>
  );
};
