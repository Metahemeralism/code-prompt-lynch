import { useState, useEffect, useRef } from 'react';
import linkedinLogo from '../assets/brands/linkedin.svg';
import githubLogo from '../assets/brands/github.svg';
import gmailLogo from '../assets/brands/gmail.svg';

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

const Index = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [currentlyTypingIndex, setCurrentlyTypingIndex] = useState(-1);
  const [visitorNumber, setVisitorNumber] = useState(0);
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

  // Auto-scroll to keep input visible
  useEffect(() => {
    if (terminalRef.current) {
      const terminal = terminalRef.current;
      // Always scroll to bottom when new content is added
      setTimeout(() => {
        terminal.scrollTo({
          top: terminal.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [history, typingText]);

  // Also scroll to bottom when input changes to keep it visible
  useEffect(() => {
    if (terminalRef.current && input) {
      const terminal = terminalRef.current;
      setTimeout(() => {
        terminal.scrollTo({
          top: terminal.scrollHeight,
          behavior: 'smooth'
        });
      }, 10);
    }
  }, [input]);

  const displayOutput = (text: string[], isAscii: boolean = false): void => {
    if (isAscii) {
      setIsTyping(true);
      setTypingText('');
      const fullText = text.join('\n');
      
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypingText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          // Update history with final text
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
      }, 20);
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
          '  tldr ............... Quick summary',
          '  clear .............. Clear terminal',
          '  ascii .............. Display ASCII art',
          '',
          'Type any command to get started!'
        ];
        break;

      case 'about':
        output = [
          "Hi, I'm Evan Lynch — passionate about technology, AI and entrepreneurship.",
          "",
          "I'm completing an MSc in Engineering with Finance at UCL (predicted First),",
          "having graduated with a BEng in Chemical Engineering from the University of Bath.",
          "",
          "I co-founded Encode London, the UK chapter of a global AI governance organisation,",
          "where I lead undergraduate research fellows in Clinical AI Safety. I also serve as",
          "Head of Science at the UCL Data Science Society and play on the UCL Men's 3rd Tennis Team.",
          "",
          "Career Interests: AI Safety, Quantitative Trading, Data Science",
          "Languages: Python, SQL, MATLAB | Fluent English; Beginner German & Danish",
          "Certifications: Stanford ML Specialisation, Codecademy Data Science (Analytics)"
        ];
        break;

      case 'experience':
        output = [
          'Professional Experience:',
          '=============================================================================',
          '',
          'Aug 2025 – Present | Co-Founder & Director | Encode London',
          '  • Co-founded UK chapter of a global AI governance organisation',
          '  • Research Lead for undergraduate fellows in Clinical AI Safety',
          '  • Built partnerships with policy think-tanks, AI Safety Institutes & academic societies',
          '',
          'Aug 2025 – Present | Head of Science | UCL Data Science Society',
          '  • Designed & delivered curriculum on "Mathematics of Data Science" and Python to 200+ members',
          '  • Managed logistics for hackathons & technical events',
          '',
          'Nov 2025 – Present | Postgraduate Representative | UCL Quant Society',
          '  • Liaison between postgraduate cohort and committee',
          '  • Organised engagement with industry quant firms and technical workshops',
          '',
          'Aug 2025 – Oct 2025 | Data Science Intern | TRUSS, London',
          '  • Engineered dual-model ML system (pricing & time-to-sell) deployed via Flask API',
          '  • Achieved MAE of ~0.8 days; conducted feature engineering on fashion market datasets',
          '',
          'Mar 2025 – Aug 2025 | Data Science Intern | Datactics, Belfast',
          '  • Built enterprise address processing engine (Python/FastAPI + OpenAI LLMs + C++ libraries)',
          '  • Automated validation tool for 100GB+ datasets, reducing manual processing by 60%',
          '  • Researched EMIR, FATCA, MiFID II — authored 10+ technical reports for GovTech product dev',
          '',
          'Aug 2022 – Aug 2023 | Electric Mobility Technology Analyst | Shell, London',
          '  • Engineered TCO models for offshore wind vessels, shaping £1M+ investment strategy',
          '  • Presented 10+ configuration scenarios to Shell executives',
          '  • Led risk assessment of 100+ safety and economic parameters'
        ];
        break;

      case 'projects':
        output = [
          'Projects:',
          '',
          '🔬 Pendulum Motion Tracking & Analysis',
          '   Tech: Python, OpenCV, NumPy, SciPy, Scikit-Learn, Matplotlib',
          '   • Computer vision pipeline for tracking a spring-pendulum system from multi-camera video',
          '   • Extracted dominant oscillation modes via PCA on 6-component standardised centroid data',
          '   • FFT-based frequency analysis, PSD filtering, and Gabor time-frequency spectrograms',
          '   • Estimated physical parameters (spring constant k, pendulum length L) analytically',
          '   → https://github.com/Metahemeralism/pendulum',
          '',
          '🔐 Enigma Machine Simulator',
          '   Tech: Python, OOP, Algorithms',
          '   • Architected an object-oriented simulation of the Enigma machine',
          '   • Demonstrated algorithmic complexity and logic design principles'
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
        output = [
          '',
          '  ███████╗██╗   ██╗ █████╗ ███╗   ██╗',
          '  ██╔════╝██║   ██║██╔══██╗████╗  ██║',
          '  █████╗   ██║   ██║███████║██╔██╗ ██║',
          '  ██╔══╝  ╚██╗ ██╔╝██╔══██║██║╚██╗██║',
          '  ███████╗ ╚████╔╝ ██║  ██║██║ ╚████║',
          '  ╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝  ╚═══╝',
          '',
          '  ██╗     ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗',
          '  ██║     ██║   ██║████╗  ██║██╔════╝██║  ██║',
          '  ██║     ██║   ██║██╔██╗ ██║██║     ███████║',
          '  ██║     ██║   ██║██║╚██╗██║██║     ██╔══██║',
          '  ███████╗╚██████╔╝██║ ╚████║╚██████╗██║  ██║',
          '  ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝',
          ''
        ];
        displayOutput(output, true);
        return;
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

  const handleBlogClick = (postTitle: string) => {
    const post = blogPosts.find(p => postTitle.includes(p.title));
    if (post) {
      setSelectedPost(post);
      setShowModal(true);
    }
  };

  const renderOutput = (output: string[], commandInput: string) => {
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

      // Social lines with official logos
      const isSocialLine = line.startsWith('[in]') || line.startsWith('[git]') || line.startsWith('[mail]');
      if (isSocialLine) {
        const match = line.match(/(https?:\/\/[^\s]+|mailto:[^\s]+)/);
        const href = match ? match[0] : undefined;
        let iconSrc = '';
        let alt = '';
        if (line.startsWith('[in]')) { iconSrc = linkedinLogo; alt = 'LinkedIn logo'; }
        else if (line.startsWith('[git]')) { iconSrc = githubLogo; alt = 'GitHub logo'; }
        else { iconSrc = gmailLogo; alt = 'Gmail logo'; }

        return (
          <div key={index} className="terminal-line flex items-center gap-2">
            <img src={iconSrc} alt={alt} className="h-4 w-4" />
            {href ? (
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {line.replace(/^[^A-Za-z]*\s*/, '')}
              </a>
            ) : (
              <span>{line.replace(/^[^A-Za-z]*\s*/, '')}</span>
            )}
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
      if (line.startsWith('  •') || line.startsWith('   •') || line.startsWith('    ')) {
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
    <div className="min-h-screen bg-black text-gray-300 p-4 font-mono overflow-hidden relative">
      {/* Visitor Counter */}
      <div className="absolute top-4 right-4 text-green-400 text-sm font-mono">
        Visitor #{visitorNumber.toLocaleString()}
      </div>
      
      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto terminal-container pb-20"
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
        <form onSubmit={handleSubmit} className="flex items-center mb-8">
          <span className="text-green-400 mr-2">λ</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent text-white outline-none w-full font-mono"
              disabled={isTyping}
              autoComplete="off"
              style={{ caretColor: 'transparent' }}
            />
            <span 
              className={`absolute top-0 text-green-400 pointer-events-none font-mono ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              style={{ left: `${input.length * 0.6}em` }}
            >
              █
            </span>
          </div>
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
    </div>
  );
};

export default Index;
