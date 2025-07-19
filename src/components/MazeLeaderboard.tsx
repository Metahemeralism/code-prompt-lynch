import { useState, useEffect } from 'react';

interface MazeScore {
  time: number;
  date: Date;
  id: string;
}

interface MazeLeaderboardProps {
  latestTime?: number;
}

export const MazeLeaderboard = ({ latestTime }: MazeLeaderboardProps) => {
  const [scores, setScores] = useState<MazeScore[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  // Load scores from localStorage
  useEffect(() => {
    const storedScores = localStorage.getItem('evanLynchMazeScores');
    if (storedScores) {
      const parsed = JSON.parse(storedScores).map((score: any) => ({
        ...score,
        date: new Date(score.date)
      }));
      setScores(parsed);
    }
  }, []);

  // Add new score and calculate rank
  useEffect(() => {
    if (latestTime && latestTime > 0) {
      const newScore: MazeScore = {
        time: latestTime,
        date: new Date(),
        id: Date.now().toString()
      };

      const updatedScores = [...scores, newScore]
        .sort((a, b) => a.time - b.time) // Sort by time (best first)
        .slice(0, 10); // Keep only top 10

      setScores(updatedScores);
      localStorage.setItem('evanLynchMazeScores', JSON.stringify(updatedScores));

      // Calculate rank
      const playerRank = updatedScores.findIndex(score => score.id === newScore.id) + 1;
      setRank(playerRank);
    }
  }, [latestTime, scores]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  if (!latestTime) return null;

  return (
    <div className="text-green-400 mt-4 text-sm">
      <div className="text-center mb-2">
        🎉 Completed in {formatTime(latestTime)}!
      </div>
      
      {rank && (
        <div className="text-center mb-3 text-yellow-400">
          {rank === 1 && '🥇'} 
          {rank === 2 && '🥈'} 
          {rank === 3 && '🥉'} 
          Rank: #{rank}
          {rank <= 3 && ' - Amazing!'}
          {rank <= 5 && rank > 3 && ' - Great job!'}
          {rank > 5 && ' - Keep practicing!'}
        </div>
      )}
      
      {scores.length > 0 && (
        <div>
          <div className="text-center text-cyan-400 mb-1">🏆 Leaderboard</div>
          {scores.slice(0, 5).map((score, index) => (
            <div 
              key={score.id} 
              className={`text-xs ${
                score.time === latestTime ? 'text-yellow-400 font-bold' : 'text-gray-400'
              }`}
            >
              #{index + 1}: {formatTime(score.time)} 
              {index === 0 && ' 👑'}
              {score.time === latestTime && ' (You)'}
            </div>
          ))}
          {scores.length > 5 && (
            <div className="text-xs text-gray-500 text-center mt-1">
              ...and {scores.length - 5} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};