import React, { useRef } from 'react';
import { Play, Pause, Upload } from 'lucide-react';

interface AudioInputProps {
  onFileSelect: (file: File) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  hasAudio: boolean;
  className?: string;
}

const AudioInput: React.FC<AudioInputProps> = ({ 
  onFileSelect, 
  onPlayPause, 
  isPlaying,
  hasAudio,
  className = "" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Upload size={20} />
        Select Audio
      </button>

      {/* Play/Pause button - only shown when audio is loaded */}
      {hasAudio && (
        <button
          onClick={onPlayPause}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      )}
    </div>
  );
};

export default AudioInput;