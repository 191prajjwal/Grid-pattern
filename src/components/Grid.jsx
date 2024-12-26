import React, { useState, useEffect, useCallback } from 'react';

const Grid = ({ rows = 15, columns = 20 }) => {
  const [trails, setTrails] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const MAX_TRAIL_LENGTH = 8;
  const MAX_CELL_SIZE = 40; 

  
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById('grid-container');
      if (container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const generateTrailColors = (baseColor) => {
    const colors = [];
    for (let i = 0; i < MAX_TRAIL_LENGTH; i++) {
      const opacity = 1 - (i / MAX_TRAIL_LENGTH) * 0.8;
      colors.push(`rgba(${baseColor.join(',')}, ${opacity})`);
    }
    return colors;
  };

  const colorSchemes = {
    orange: generateTrailColors([255, 165, 0]),
    red: generateTrailColors([255, 0, 0]),
    purple: generateTrailColors([255, 0, 255])
  };

  const initializeTrail = useCallback(() => ({
    positions: [],
    speed: 0.8 + Math.random() * 2.2,
    colorScheme: Object.keys(colorSchemes)[Math.floor(Math.random() * Object.keys(colorSchemes).length)],
    length: 2 + Math.floor(Math.random() * 6),
    active: false,
    delay: Math.floor(Math.random() * 100),
    restingPeriod: 0,
    dropProbability: 0.01 + Math.random() * 0.02
  }), []);

  useEffect(() => {
    setTrails(Array(columns).fill(null).map(() => initializeTrail()));

    const interval = setInterval(() => {
      setTrails(prevTrails => {
        return prevTrails.map(trail => {
          if (trail.delay > 0) {
            return { ...trail, delay: trail.delay - 1 };
          }

          if (trail.restingPeriod > 0) {
            return { ...trail, restingPeriod: trail.restingPeriod - 1 };
          }

          if (!trail.active && trail.restingPeriod === 0) {
            if (Math.random() < trail.dropProbability) {
              return { ...trail, active: true };
            }
            return trail;
          }

          if (!trail.active) return trail;

          let newPositions = [...trail.positions];
          
          if (newPositions.length === 0 || 
              (newPositions.length < trail.length && 
               newPositions[newPositions.length - 1] > trail.speed)) {
            newPositions.push(0);
          }

          newPositions = newPositions
            .map(pos => pos + trail.speed)
            .filter(pos => pos < rows);

          if (newPositions.length === 0) {
            return {
              ...initializeTrail(),
              restingPeriod: 20 + Math.floor(Math.random() * 80),
              dropProbability: 0.01 + Math.random() * 0.02
            };
          }

          return { ...trail, positions: newPositions };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [rows, columns, initializeTrail]);

  const renderGrid = () => {
    
    const cellSize = Math.min(
      Math.floor(dimensions.width / columns),  
      MAX_CELL_SIZE                           
    );

    return Array(rows).fill(null).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex" style={{ gap: '1px' }}>
        {Array(columns).fill(null).map((_, colIndex) => {
          const trail = trails[colIndex];
          const positionIndex = trail?.positions.findIndex(pos => 
            Math.floor(pos) === rowIndex
          );
          
          const color = positionIndex !== -1 && trail
            ? colorSchemes[trail.colorScheme][positionIndex]
            : 'rgb(0, 0, 0)';

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="border border-gray-900"
              style={{
                backgroundColor: color,
                transition: 'background-color 0.1s ease',
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-full mx-auto p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />
          <div 
            id="grid-container"
            className="bg-black rounded-lg p-1 relative overflow-hidden"
            style={{ gap: '1px' }}
          >
            {renderGrid()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
