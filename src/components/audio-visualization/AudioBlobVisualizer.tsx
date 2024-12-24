import React, { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, PositionalAudio } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
// import { ToneMappingMode } from 'postprocessing';
import { PositionalAudio as ThreePositionalAudio, AudioListener, CineonToneMapping } from 'three';
import Blob from './Blob';
import AudioInput from './AudioInput';
import BlobDebugger from './BlobDebugger';

interface AudioBlobVisualizerProps {
  className?: string;
}

const AudioBlobVisualizer: React.FC<AudioBlobVisualizerProps> = ({ className = "" }) => {
  const [play, setPlay] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioListener, setAudioListener] = useState<AudioListener | null>(null);
  const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);
  const sound = useRef<ThreePositionalAudio | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!isAudioContextInitialized) {
      const listener = new AudioListener();
      // Resume the AudioContext after creation
      listener.context.resume().then(() => {
        setAudioListener(listener);
        setIsAudioContextInitialized(true);
      });
    }
  }, [isAudioContextInitialized]);

  
  const handleFileSelect = async (file: File) => {
    try {
      // Initialize audio context if not already done
      if (!isAudioContextInitialized) {
        initializeAudioContext();
      }

      // Revoke previous URL to avoid memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        if (sound.current) {
          sound.current.stop();
        }
        setPlay(false);
      }
      
      // Create new URL for the selected file
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error handling file selection:', error);
    }
  };

  const handlePlayPause = () => {
    try {
      // Initialize audio context if needed
      if (!isAudioContextInitialized) {
        initializeAudioContext();
      }

      if (sound.current && audioListener) {
        // Ensure AudioContext is running
        audioListener.context.resume().then(() => {
          if (play) {
            sound.current?.pause();
          } else {
            sound.current?.play();
          }
          setPlay(!play);
        });
      }
    } catch (error) {
      console.error('Error handling play/pause:', error);
    }
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioListener) {
        audioListener.context.close();
      }
    };
  }, []);

  return (
    <div className={className}>
      <AudioInput 
        onFileSelect={handleFileSelect}
        onPlayPause={handlePlayPause}
        isPlaying={play}
        hasAudio={!!audioUrl}
        className="absolute top-4 left-4 z-10"
      />
      
      <Canvas>
        <PerspectiveCamera makeDefault far={100} position={[0, 0, 8.0]}>
          {audioListener && <primitive object={audioListener} />}
        </PerspectiveCamera>
        
        <Suspense fallback={null}>
          {audioUrl && audioListener && isAudioContextInitialized && (
            <PositionalAudio 
              ref={sound}
              url={audioUrl}
              distance={1}
              // loop 
              autoplay={false}
            />
          )}
          
          <Blob 
            sound={sound} 
            play={play} 
            // onClick={handlePlayPause}
          />
          
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.1}
              luminanceSmoothing={0.99}
              intensity={1.0}
            />
            <ToneMapping mode={CineonToneMapping} />
          </EffectComposer>
          
          {/* <OrbitControls maxDistance={10} minDistance={5} enableZoom /> */}
        </Suspense>
      </Canvas>
      {/* <BlobDebugger sound={sound} play={play} /> */}
    </div>
  );
};

export default AudioBlobVisualizer;