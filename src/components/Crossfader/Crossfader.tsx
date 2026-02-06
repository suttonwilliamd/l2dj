import React from 'react';
import { useAudioStore } from '../../store/audioStore';

export const Crossfader: React.FC = () => {
  const { setCrossfader, crossfaderPosition } = useAudioStore();

  const handleCrossfaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setCrossfader(value);
  };

  return (
    <div className="crossfader bg-gray-800 border border-gray-600 rounded-lg p-6 w-64">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-4">Crossfader</h2>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Left/Right Labels */}
          <div className="flex justify-between w-full text-sm text-gray-400">
            <span>Left</span>
            <span>Right</span>
          </div>
          
          {/* Horizontal Crossfader */}
          <div className="relative w-full">
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={crossfaderPosition}
              onChange={handleCrossfaderChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${50 + crossfaderPosition * 50}%, #4B5563 ${50 + crossfaderPosition * 50}%, #4B5563 100%)`
              }}
            />
            
            {/* Position Indicator */}
            <div 
              className="absolute top-0 w-4 h-2 bg-white rounded-full shadow-lg transform -translate-y-0"
              style={{ 
                left: `${50 + crossfaderPosition * 50}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>
          
          {/* Current Position Display */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Position: {crossfaderPosition.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {crossfaderPosition < -0.3 ? 'Left' : crossfaderPosition > 0.3 ? 'Right' : 'Center'}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }
      `}</style>
    </div>
  );
};