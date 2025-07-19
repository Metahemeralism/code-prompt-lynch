import { useState, useEffect, useRef, useCallback } from 'react';

interface MazeGameProps {
  onComplete: (time: number) => void;
}

interface Position {
  x: number;
  y: number;
}

const MAZE_ASCII = [
  '                                .=========.                                ',
  '                            .===| |   |   |===.                            ',
  "                        .=====+=' | .=' | '===+===.                        ",
  '                    .===|     |     |   |     |   |===.                    ',
  "                .=====+=' ====' .====== |===. '=. '=======.                ",
  '            .===|     |     |   |       |   |   |         |===.            ',
  '        .===+======== | ==. | ==+== .====== |=. |== | .=======+===.        ',
  '    .===|   |         |   | |   |   |       | | |   | |       |   |===.    ',
  ".=====+=' | | .========== | '=. | .=| ==. | | | | .===' | .=. | | '===+===.",
  '|     |   |   |     |     |   |   | |   | |   | | |     | | | | |     |   |',
  "| ====' | |===' .== | ======. '===' | .=' |===' | | ====' | | '=' .== '== |",
  '|       | |     |   |       |         |   |     |     |   | |     |       |',
  "'=======| | ====| | '=. .===| .=======' | | ========= | ==| '==== |======='",
  "    '===|       | |   | |   | |         | |       |   |   |       |==='    ",
  "        '=======| '===' | | '=' .=======+=======. '====== |======='        ",
  "            '===|       | |     |       |       |         |==='            ",
  "                '=======| '=====' ===== | ==. ==' .======='                ",
  "                    '===|           |   |   |     |==='                    ",
  "                        '========== | ==' .=+====='                        ",
  "                            '===|   |     |==='                            ",
  "                                '========='                                "
];

export const MazeGame = ({ onComplete }: MazeGameProps) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 20, y: 10 }); // Start position
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const mazeRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Trophy position (center of maze)
  const trophyPos = { x: 36, y: 10 };

  // Convert ASCII to collision map
  const isWall = useCallback((x: number, y: number): boolean => {
    if (y < 0 || y >= MAZE_ASCII.length || x < 0 || x >= MAZE_ASCII[y].length) {
      return true; // Out of bounds
    }
    const char = MAZE_ASCII[y][x];
    return char !== ' ' && char !== '|' && char !== '-' && char !== '+'; // Simplified: paths are spaces
  }, []);

  const isPath = useCallback((x: number, y: number): boolean => {
    if (y < 0 || y >= MAZE_ASCII.length || x < 0 || x >= MAZE_ASCII[y].length) {
      return false;
    }
    const char = MAZE_ASCII[y][x];
    return char === ' '; // Only spaces are valid paths
  }, []);

  // Check if player reached trophy
  const checkWin = useCallback((pos: Position) => {
    const distance = Math.abs(pos.x - trophyPos.x) + Math.abs(pos.y - trophyPos.y);
    return distance <= 2; // Allow some tolerance
  }, [trophyPos]);

  // Handle mouse/touch events for dragging
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    setIsDragging(true);
    e.preventDefault();
  }, [gameStarted]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || gameCompleted || !mazeRef.current) return;

    const rect = mazeRef.current.getBoundingClientRect();
    const charWidth = rect.width / 76; // Approximate character width
    const charHeight = rect.height / MAZE_ASCII.length;
    
    const newX = Math.round((e.clientX - rect.left) / charWidth);
    const newY = Math.round((e.clientY - rect.top) / charHeight);

    // Only move if the new position is a valid path
    if (isPath(newX, newY)) {
      const newPos = { x: newX, y: newY };
      setPlayerPos(newPos);
      
      // Check for win condition
      if (checkWin(newPos) && !gameCompleted) {
        setGameCompleted(true);
        const completionTime = startTime ? Date.now() - startTime : 0;
        onComplete(completionTime);
      }
    }
  }, [isDragging, gameCompleted, isPath, checkWin, startTime, onComplete]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global pointer event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove as any);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove as any);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="relative">
      <div 
        ref={mazeRef}
        className="text-green-400 whitespace-pre font-mono text-center relative select-none cursor-grab active:cursor-grabbing"
        style={{ lineHeight: '1.2' }}
      >
        {MAZE_ASCII.join('\n')}
        
        {/* Player pointer */}
        <div
          ref={playerRef}
          className={`absolute w-3 h-3 bg-yellow-400 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 z-10 ${
            !gameCompleted ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${(playerPos.x / 76) * 100}%`,
            top: `${(playerPos.y / MAZE_ASCII.length) * 100}%`,
          }}
          onPointerDown={handlePointerDown}
        />
        
        {/* Trophy */}
        <div
          className="absolute text-yellow-400 text-lg transform -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"
          style={{
            left: `${(trophyPos.x / 76) * 100}%`,
            top: `${(trophyPos.y / MAZE_ASCII.length) * 100}%`,
          }}
        >
          🏆
        </div>
      </div>
      
      {!gameStarted && (
        <div className="text-yellow-400 text-center mt-2 text-sm">
          Drag the yellow dot to the trophy! 🏆
        </div>
      )}
    </div>
  );
};