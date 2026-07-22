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

  // Blog posts — summarised from LinkedIn activity
  const blogPosts: BlogPost[] = [
    {
      title: "Joining MSCI as a Summer Analyst",
      date: "2026-06-01",
      content: "Excited to share I'm joining MSCI's Institutional Client Strategy & Execution team in London this summer. I'll be working on whitespace mapping across EMEA asset owners and helping shape go-to-market thinking for MSCI's factor and multi-factor QIS strategies. Grateful to the team for the opportunity. (Summarised from LinkedIn)"
    },
    {
      title: "Launching Encode London — UK Chapter for AI Safety",
      date: "2025-08-15",
      content: "Thrilled to co-found the UK chapter of Encode, a global AI safety organisation. We're building a 15-fellow research, policy, and education programme, and partnering with the UK AI Safety Institute, LISA, and government contacts. If you care about frontier-model safety and want to get involved, reach out. (Summarised from LinkedIn)"
    },
    {
      title: "Pricing Power Forwards with Lucia–Schwartz + Merton Jumps",
      date: "2026-04-20",
      content: "Just shipped an electricity forward pricer using the two-factor Lucia–Schwartz model with Merton jumps. Closed-form risk-neutral forward curve F(0,T) via the moment generating function, validated by an exact-discretisation Monte Carlo simulator — convergence within 2–3% at N=20,000 paths. Built in Python with NumPy/SciPy and a Streamlit front end. (Summarised from LinkedIn)"
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
          '  research ........... MSc thesis & research work',
          '  projects ........... Personal projects & code',
          '  interests .......... Hobbies & passions',
          '  socials ............ Social media links',
          '  blog ............... Recent posts (summarised from LinkedIn)',
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
          "having graduated with a BEng in Chemical Engineering from Bath. This summer",
          "I'm at MSCI in London as a Summer Analyst on the Institutional Client Strategy",
          "& Execution team.",
          "",
          "I co-founded Encode London — the UK chapter of a global AI safety organisation —",
          "and my MSc thesis applies machine learning to commodity price modelling",
          "(neural observer for the inverse Gibson–Schwartz problem). Type `research`",
          "to read more.",
          "",
          "Career Interests: AI Safety, Quantitative Trading, Data Science",
          "Languages: Python, SQL, MATLAB, VBA | Fluent English; Beginner German & Danish",
          "Certifications: Stanford ML Specialisation (Andrew Ng, Coursera)"
        ];
        break;


      case 'experience':
        output = [
          'Professional Experience:',
          '=============================================================================',
          '',
          'Jun 2026 – Present | Summer Analyst, Institutional Client Strategy & Execution | MSCI, London',
          '  • Sized ~$1tn AUM whitespace among EMEA asset-owner prospects; fused multiple',
          '    data sources into a screening tool with an LLM pipeline that auto-drafted outreach',
          '  • Authored go-to-market proposal for MSCI factor & multi-factor QIS strategies',
          '  • Built benchmarking tool comparing QIS performance vs MSCI World (Sharpe & more)',
          '',
          'Aug 2025 – Present | Co-Founder & Director | Encode London',
          '  • Co-founded UK chapter of Encode — a global AI safety organisation',
          '  • Recruited 5-person executive team; coordinate 15 fellows across research, policy, education',
          '  • Built engagement with UK AISI, LISA, and UK government contacts',
          '',
          'Mar 2025 – Aug 2025 | Data Science Intern | Datactics, Belfast',
          '  • Automated validation pipeline for 100GB+ financial datasets — 60% less manual work',
          '  • Built LLM-assisted parsing engine (Python/FastAPI + proprietary C++ libraries)',
          '  • Authored 10+ technical reports translating EMIR, FATCA, MiFID II into rule sets',
          '',
          'Aug 2022 – Aug 2023 | Technology Analyst, Strategy & Capital Allocation | Shell, London',
          '  • Built TCO models for offshore wind vessels across 10+ configurations (£1M+ allocation)',
          '  • Modelled sensitivity to commodity prices, discount rates, and operational risk',
          '  • Presented scenarios to Shell executives; authored 100+ parameter risk mitigation report',
          '',
          'Leadership:',
          '  • Postgraduate Representative — UCL Quantitative Finance Society',
          '  • Head of Science — UCL Data Science Society',
          '  • UCL Men\'s Tennis 3rd Team'
        ];
        break;

      case 'research':
        output = [
          'MSc Research (UCL, 2025 – 2026):',
          '=============================================================================',
          '',
          '🧠 Thesis: Applied Machine Learning for Commodity Price Modelling',
          '   A neural observer approach to the inverse Gibson–Schwartz problem.',
          '',
          '   • Gibson–Schwartz is a two-factor stochastic model for commodity spot',
          '     price and convenience yield — foundational for pricing oil, gas, and',
          '     power derivatives, but its latent state (convenience yield) is not',
          '     directly observable from market data.',
          '',
          '   • The "inverse problem": recover the hidden convenience yield and',
          '     calibrate model parameters from observed forward curves and spot prices.',
          '',
          '   • My approach: train a neural observer (a learned state estimator) to',
          '     jointly infer the latent factor and calibrate parameters end-to-end,',
          '     benchmarking against classical Kalman-filter calibration.',
          '',
          '   • Stack: PyTorch, NumPy, SciPy, Statsmodels; commodity forward-curve data.',
          '',
          'Supervisor & module context: Financial Engineering, Numerical Methods,',
          'Data-Driven Methods for Engineers (UCL MSc Engineering with Finance).'
        ];
        break;


      case 'projects':
        output = [
          'Projects:',
          '',
          '⚡ Electricity Forward Pricer  (Apr 2026)',
          '   Tech: Python, NumPy, SciPy, Streamlit, Monte Carlo',
          '   • Forward-curve pricer for power markets using Lucia–Schwartz two-factor',
          '     model with Merton jumps',
          '   • Closed-form risk-neutral F(0,T) via moment generating function',
          '   • Validated by exact-discretisation Monte Carlo — 2–3% convergence at N=20k paths',
          '   → https://github.com/Metahemeralism/forward_heatmap',
          '',
          '✈️  Plane-Wing Optimisation  (May 2026)',
          '   Tech: Python, Gaussian Process Regression, MLP, NSGA-II',
          '   • Surrogate-based multi-objective optimisation of an aircraft wing panel',
          '   • Minimised mass & max von Mises stress via evolutionary search',
          '   → https://github.com/Metahemeralism/plane-wing-optimisation',
          '',
          '🔬 Pendulum Motion Tracking & Analysis  (Mar 2026)',
          '   Tech: Python, OpenCV, NumPy, SciPy, Scikit-Learn',
          '   • Computer-vision pipeline tracking a spring-pendulum from multi-camera video',
          '   • Extracted dominant oscillation modes via PCA; estimated k and L analytically',
          '   → https://github.com/Metahemeralism/pendulum',
          '',
          '🔐 Pynigma — Enigma Machine Simulator  (Nov 2024)',
          '   Tech: Python, OOP',
          '   • Object-oriented WWII Enigma cipher simulation — rotor stepping & plugboard',
          '   • Encode/decode paths validated against known historical settings',
          '   → https://github.com/Metahemeralism/pynigma',
          '',
          '🎾 Wimbledon 2025 Winner Prediction',
          '   Tech: Python, Scikit-Learn, Jupyter',
          '   • ML model predicting the 2025 Wimbledon Men\'s Singles Final winner',
          '   → https://github.com/Metahemeralism/wimby-pred',
          '',
          '⌚ Garmin Heatmap Widget',
          '   Tech: JavaScript, Garmin Connect IQ',
          '   • Watch widget rendering activity heatmap (14 GitHub stars)',
          '   → https://github.com/Metahemeralism/garmin_heatmap_widget'
        ];
        break;


      case 'interests':
        output = [
          'Personal Interests & Hobbies:',
          '',
          '♞ Chess',
          '   Top 6% on Chess.com — always looking for a game',
          '',
          '🎾 Tennis',
          '   UCL Men\'s 3rd Team; active player and coach',
          '',
          '💪 Fitness',
          '   Regular gym training and wellness focus',
          '',
          '🌍 Travelling',
          '   Exploring new places — most recently South Africa with Raleigh International'
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

          'Recent Posts (summarised from LinkedIn):',
          '',
          ...blogPosts.map((post, index) =>
            `${index + 1}. ${post.title} (${post.date}) [click to read]`
          ),
          '',
          'Click a title to read the summary. Full posts live on LinkedIn.'
        ];
        break;

      case 'tldr':
        output = [
          'TL;DR: MSc Engineering with Finance (UCL, 1st predicted) · Summer Analyst',
          '@ MSCI · Co-Founder @ Encode London (AI Safety) · Datactics & Shell alum.',
          'Thesis: neural observer for the inverse Gibson–Schwartz problem.',
          'Interested in AI Safety, Quantitative Trading & Data Science. 🚀'
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
