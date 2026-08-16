import { useLocation } from 'react-router-dom';
import { EmptyState } from '../terminal/sections';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-gray-300 p-4 sm:p-6 font-mono">
      <div className="text-green-400 text-sm md:text-base leading-tight mb-6 select-none">
        <div>&lt;evan&gt;</div>
        <div>&lt;lynch&gt;</div>
        <div>&lt;terminal&gt;</div>
      </div>

      <div className="flex items-center mb-1">
        <span className="text-green-400 mr-2" aria-hidden="true">
          λ
        </span>
        <span className="text-white break-all">cd {location.pathname}</span>
      </div>

      <p className="text-gray-400 mb-4">
        No such file or directory: <span className="text-white">{location.pathname}</span>
      </p>

      <EmptyState message="nothing out here" />

      <a
        href="/"
        className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline underline-offset-2"
      >
        → Back to the terminal
      </a>
    </div>
  );
};

export default NotFound;
