import { useState, useEffect, useRef } from 'react';
import { MazeGame } from '@/components/MazeGame';
import { MazeLeaderboard } from '@/components/MazeLeaderboard';

interface BlogPost {
  title: string;
  date: string;
  content: string;
}

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

interface VisitorComment {
  message: string;
  timestamp: Date;
  id: string;
}

const Index = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showVisitorBookModal, setShowVisitorBookModal] = useState(false);
  const [visitorComment, setVisitorComment] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [currentlyTypingIndex, setCurrentlyTypingIndex] = useState(-1);
  const [visitorNumber, setVisitorNumber] = useState(0);
  const [visitorComments, setVisitorComments] = useState<VisitorComment[]>([]);
  const [awaitingVisitorComment, setAwaitingVisitorComment] = useState(false);
  const [mazeCompletionTime, setMazeCompletionTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const currentCommandRef = useRef<HTMLDivElement>(null);

  // Sample blog posts
  const blogPosts: BlogPost[] = [
    {
      title: "Building AI-Powered Applications in 2024",
      date: "2024-01-15",
      content: "In this post, I explore the latest trends in AI application development, covering everything from large language models to computer vision implementations. The landscape has evolved rapidly..."
    },
    {
      title: "The Future of Full-Stack Development",
      date: "2024-01-10", 
      content: "Modern full-stack development has transformed significantly with the rise of serverless architectures, edge computing, and AI-first applications. Here's my take on where we're heading..."
    },
    {
      title: "From Data Science to Software Engineering",
      date: "2024-01-05",
      content: "My journey transitioning from data science to full-stack engineering taught me valuable lessons about bridging the gap between research and production systems..."
    }
  ];

  // Initialize visitor counter
  useEffect(() => {
    const storedCount = localStorage.getItem('evanLynchVisitorCount');
    if (storedCount) {
      setVisitorNumber(parseInt(storedCount));
    } else {
      const newVisitorNumber = Math.floor(Math.random() * 1000) + 100; // Start from a random number between 100-1099
      localStorage.setItem('evanLynchVisitorCount', newVisitorNumber.toString());
      setVisitorNumber(newVisitorNumber);
    }
  }, []);

  // Load visitor comments from localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem('evanLynchVisitorComments');
    if (storedComments) {
      setVisitorComments(JSON.parse(storedComments));
    }
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current && !showModal) {
      inputRef.current.focus();
    }
  }, [showModal]);

  // Scroll to bottom only if user is already near the bottom
  useEffect(() => {
    if (terminalRef.current) {
      const terminal = terminalRef.current;
      const isNearBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 100;
      
      // Only auto-scroll if user is already near the bottom
      if (isNearBottom) {
        setTimeout(() => {
          terminal.scrollTo({
            top: terminal.scrollHeight,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  }, [history, typingText]);

  const displayOutput = (text: string[], isAscii: boolean = false): void => {
    if (isAscii) {
      setIsTyping(true);
      setTypingText('');
      const fullText = text.join('\n');
      
      let currentIndex = 0;
      const charsPerFrame = 8; // Type multiple characters at once for speed
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          // Advance by multiple characters for faster typing
          currentIndex = Math.min(currentIndex + charsPerFrame, fullText.length);
          setTypingText(fullText.slice(0, currentIndex));
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          // Update history with final text to preserve formatting
          setHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > 0) {
              newHistory[newHistory.length - 1] = {
                ...newHistory[newHistory.length - 1],
                output: text
              };
            }
            return newHistory;
          });
          setTypingText('');
        }
      }, 3); // Much faster interval
    } else {
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...newHistory[newHistory.length - 1],
            output: text
          };
        }
        return newHistory;
      });
    }
  };

  const executeCommand = async (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    // Add command to history immediately
    const newCommand: Command = {
      input: cmd,
      output: [''],
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, newCommand]);

    let output: string[] = [];

    switch (command) {
      case 'help':
        output = [
          'Available commands:',
          '',
          '  about .............. Overview of Evan Lynch',
          '  experience ......... Professional history', 
          '  projects ........... Personal projects & code',
          '  interests .......... Hobbies & passions',
          '  socials ............ Social media links',
          '  blog ............... Recent blog posts',
          '  visitor book ....... Leave a comment (200 chars max)',
          '  tldr ............... Quick summary',
          '  clear .............. Clear terminal',
          '  ascii .............. Interactive maze game',
          '',
          'Type any command to get started!'
        ];
        break;

      case 'about':
        output = [
          "I'm Evan Lynch, an aspiring quant researcher/trader skilled in Python",
          "data engineering, statistical modelling, and risk analysis. Currently",
          "pursuing a predicted First-class MSc Engineering with Finance at UCL,",
          "with a background in Chemical Engineering from Bath. I'm seeking to",
          "apply systematic strategies in quantitative investing and data analysis,",
          "combining technical expertise with financial markets knowledge.",
          "",
          "Languages: Fluent English, Beginner German & Danish",
          "Interests: Chess (Top 6% Chess.com), Competitive Tennis & Coaching"
        ];
        break;

      case 'experience':
        output = [
          'Professional Experience:',
          '',
          'March 2025 – Present | Data Science Intern | Datactics, Belfast UK',
          '  • Engineered Python analytics pipeline for 100GB+ client datasets',
          '  • Developed NLP rule-matching engine (TF-IDF + cosine similarity)',
          '  • Cut manual review by 50% for EMIR, MiFID II, FATCA compliance',
          '  • Conducted comprehensive regulatory analysis for GovTech solutions',
          '',
          'Aug 2022 – Aug 2023 | Electric Mobility Technology Analyst | Shell, London',
          '  • Built TCO models for offshore wind electrification vessels',
          '  • Presented to Shell executives, informing £1M+ investment decisions',
          '  • Benchmarked power-electronics R&D from 3+ university labs',
          '  • Led risk assessment of 100+ factors across multiple domains',
          '',
          'Oct 2024 – Dec 2024 | Venturer | Raleigh International, South Africa',
          '  • Led 17-person, 19-day trek with navigation and logistics planning',
          '  • Implemented wildlife conservation and sustainable farming initiatives',
          '  • Delivered after-school programs to 60+ children'
        ];
        break;

      case 'projects':
        output = [
          'Quantitative Projects:',
          '',
          '📈 Stock Market Price Prediction with LSTM Neural Network',
          '   Tech: Python, TensorFlow, Pandas, Scikit-Learn',
          '   • Retrieved 20+ years of equity data via Alpha Vantage API',
          '   • Designed LSTM neural network for time-series forecasting',
          '   • Achieved superior performance vs moving-average baseline',
          '   • Automated preprocessing with MinMaxScaler normalization',
          '',
          '📚 Technical Skills & Certifications:',
          '   Languages: Python (Proficient), Matlab, SQL (Familiar)',
          '   Frameworks: Pandas, NumPy, Scikit-Learn, Git, Seaborn, Matplotlib',
          '   Certifications: Stanford ML, Codecademy Data Science,',
          '   Alan Turing Data Viz, Akuna Capital Options 101'
        ];
        break;

      case 'interests':
        output = [
          'Personal Interests & Hobbies:',
          '',
          '♞ Chess',
          '   Currently ranked in top 6% on Chess.com',
          '',
          '🎾 Competitive Tennis', 
          '   Active player and coach in spare time',
          '',
          '💪 Health & Fitness',
          '   Regular training and wellness focus',
          '',
          '🌍 Languages',
          '   Learning German and Danish (Beginner level)',
          '',
          '📚 Quantitative Finance',
          '   Exploring systematic trading strategies and risk models'
        ];
        break;

      case 'socials':
        output = [
          'Connect with me:',
          '',
          '[in] LinkedIn → https://www.linkedin.com/in/-evanlynch/',
          '[mail] Email → mailto:eplynch398@gmail.com', 
          '[git] GitHub → https://github.com/Metahemeralism',
          '',
          'Feel free to reach out for collaborations or just to chat!'
        ];
        break;

      case 'blog':
        output = [
          'Recent Blog Posts:',
          '',
          ...blogPosts.map((post, index) => 
            `${index + 1}. ${post.title} (${post.date}) [click to read]`
          ),
          '',
          'Click on any post title to read the full article.'
        ];
        break;

      case 'visitor book':
        output = [
          '📝 Visitor Book',
          '',
          '✨ Recent Comments:',
          ''
        ];
        
        if (visitorComments.length === 0) {
          output.push('  No comments yet. Be the first to leave one!');
        } else {
          visitorComments.slice(-5).reverse().forEach((comment, index) => {
            const date = new Date(comment.timestamp).toLocaleDateString();
            output.push(`  "${comment.message}" - ${date}`);
            if (index < Math.min(4, visitorComments.length - 1)) output.push('');
          });
        }
        
        // Show the visitor book modal
        setShowVisitorBookModal(true);
        break;

      case 'tldr':
        output = [
          'TL;DR: Aspiring quant researcher with Python expertise, MSc Engineering',
          'with Finance (UCL), and experience in data pipelines, ML models, and',
          'financial analysis. Ready to apply systematic strategies in quantitative',
          'investing and risk management. 📊'
        ];
        break;

      case 'clear':
        // Find the last occurrence of 'help' command
        const lastHelpIndex = history.map(cmd => cmd.input.toLowerCase().trim()).lastIndexOf('help');
        if (lastHelpIndex !== -1) {
          // Keep everything up to and including the 'help' command
          setHistory(prev => prev.slice(0, lastHelpIndex + 1));
        } else {
          output = ['Please type "help" first to see available commands.'];
        }
        if (lastHelpIndex !== -1) return;
        break;

      case 'ascii':
        output = ['Loading interactive maze game...'];
        break;

      default:
        output = [
          `Command not found: ${cmd}`,
          `Type 'help' to see available commands.`
        ];
        break;
    }

    displayOutput(output);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  const handleVisitorCommentSubmit = () => {
    const comment = visitorComment.trim();
    if (comment.length > 200) {
      return; // Let the UI show the error
    }
    
    const newComment: VisitorComment = {
      id: Date.now().toString(),
      message: comment,
      timestamp: new Date()
    };
    
    const updatedComments = [...visitorComments, newComment];
    setVisitorComments(updatedComments);
    localStorage.setItem('evanLynchVisitorComments', JSON.stringify(updatedComments));
    
    // Add success message to terminal
    setHistory(prev => [...prev, {
      input: 'visitor comment',
      output: ['✅ Thank you for your comment! It has been added to the visitor book.'],
      timestamp: new Date()
    }]);
    
    setVisitorComment('');
    setShowVisitorBookModal(false);
  };

  const handleBlogClick = (postTitle: string) => {
    const post = blogPosts.find(p => postTitle.includes(p.title));
    if (post) {
      setSelectedPost(post);
      setShowModal(true);
    }
  };

  const handleMazeCompletion = (time: number) => {
    setMazeCompletionTime(time);
  };

  const renderOutput = (output: string[], commandInput: string) => {
    // Special handling for ASCII maze game
    if (commandInput.toLowerCase().trim() === 'ascii') {
      return (
        <div>
          <MazeGame onComplete={handleMazeCompletion} />
          <MazeLeaderboard latestTime={mazeCompletionTime} />
        </div>
      );
    }

    return output.map((line, index) => {
      // Check if this is a blog post line
      const isBlogPost = commandInput.toLowerCase() === 'blog' && 
                        line.includes('[click to read]') && 
                        blogPosts.some(post => line.includes(post.title));
      
      if (isBlogPost) {
        return (
          <div key={index} className="terminal-line">
            <span 
              className="text-blue-400 hover:text-blue-300 cursor-pointer underline"
              onClick={() => handleBlogClick(line)}
            >
              {line.replace(' [click to read]', '')}
            </span>
          </div>
        );
      }

      // Check for links
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const emailRegex = /(mailto:[^\s]+)/g;
      
      if (urlRegex.test(line) || emailRegex.test(line)) {
        const parts = line.split(/(https?:\/\/[^\s]+|mailto:[^\s]+)/);
        return (
          <div key={index} className="terminal-line">
            {parts.map((part, partIndex) => {
              if (urlRegex.test(part) || emailRegex.test(part)) {
                return (
                  <a
                    key={partIndex}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </div>
        );
      }

      // Color-code different types of content
      let className = 'terminal-line';
      if (line.startsWith('  •') || line.startsWith('   •')) {
        className += ' text-yellow-400';
      } else if (line.includes('→') || line.startsWith('🌱') || line.startsWith('✍️') || line.startsWith('📊')) {
        className += ' text-green-400';
      } else if (line.includes('|')) {
        className += ' text-cyan-400';
      }

      return (
        <div key={index} className={className}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono relative">
      {/* Visitor Counter */}
      <div className="absolute top-4 right-4 text-green-400 text-sm font-mono z-10">
        Visitor #{visitorNumber.toLocaleString()}
      </div>
      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto terminal-container pt-12 px-4 pb-8"
        onClick={() => inputRef.current?.focus()}
      >
        {/* ASCII Logo */}
        <div className="mb-8 text-green-400 text-sm md:text-base select-none">
          <div>&lt;evan&gt;</div>
          <div>&lt;lynch&gt;</div>
          <div>&lt;terminal&gt;</div>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 text-gray-400">
          You've opened Evan's digital terminal. Type 'help' to explore.
        </div>

        {/* Command History */}
        {history.map((cmd, index) => (
          <div 
            key={index} 
            className="mb-2"
            ref={index === history.length - 1 ? currentCommandRef : null}
          >
            <div className="flex items-center mb-1">
              <span className="text-green-400 mr-2">λ</span>
              <span className="text-white">{cmd.input}</span>
            </div>
            {cmd.input.toLowerCase().trim() === 'ascii' && isTyping && index === history.length - 1 ? (
              <div className="text-green-400 whitespace-pre">
                {typingText}
              </div>
            ) : (
              renderOutput(cmd.output, cmd.input)
            )}
          </div>
        ))}

        {/* Current Input */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">λ</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent text-white outline-none flex-1 font-mono"
            disabled={isTyping}
            autoComplete="off"
          />
          <span className={`text-green-400 ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            █
          </span>
        </form>
      </div>

      {/* Blog Post Modal */}
      {showModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
                <p className="text-gray-400 text-sm">{selectedPost.date}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            <div className="text-gray-300 leading-relaxed">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}

      {/* Visitor Book Modal */}
      {showVisitorBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">💬 Leave a Comment</h2>
              <button
                onClick={() => {
                  setShowVisitorBookModal(false);
                  setVisitorComment('');
                }}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <textarea
                value={visitorComment}
                onChange={(e) => setVisitorComment(e.target.value)}
                placeholder="leave something nice"
                className="w-full h-24 bg-gray-800 border border-gray-600 rounded p-3 text-white placeholder-gray-400 resize-none font-mono text-sm focus:outline-none focus:border-green-400"
                maxLength={200}
                autoFocus
              />
              
              <div className="flex justify-between items-center">
                <span className={`text-sm ${visitorComment.length > 200 ? 'text-red-400' : 'text-gray-400'}`}>
                  {visitorComment.length}/200 characters
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowVisitorBookModal(false);
                      setVisitorComment('');
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVisitorCommentSubmit}
                    disabled={!visitorComment.trim() || visitorComment.length > 200}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
