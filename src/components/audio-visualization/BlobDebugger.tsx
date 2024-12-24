import { useEffect } from 'react';
import { BlobProps } from './Blob';

const BlobDebugger = ({ sound, play }:BlobProps) => {
  useEffect(() => {
    // Update debug display whenever sound or play state changes
    console.log('BlobDebugger Update:', {
      hasSound: !!sound.current,
      isPlaying: play,
      analyserExists: !!sound.current?.analyser
    });
  }, [sound, play]);

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50">
        <h3 className="font-bold mb-2">Blob Debug Info</h3>
        <pre className="text-sm">
          {JSON.stringify({
            hasSound: !!sound.current,
            isPlaying: play,
            hasAnalyser: !!sound.current?.analyser
          }, null, 2)}
        </pre>
      </div>
    );
  }
  
  return null; // Don't render in production
};

export default BlobDebugger;