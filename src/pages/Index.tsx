
import { useState, useEffect, useRef } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const typewriterEffect = async (text: string[]): Promise<void> => {
    setIsTyping(true);
    
    for (const line of text) {
      let displayLine = '';
      for (const char of line) {
        displayLine += char;
        await new Promise(resolve => setTimeout(resolve, 70));
        
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = {
              ...newHistory[newHistory.length - 1],
              output: [...newHistory[newHistory.length - 1].output.slice(0, -1), displayLine]
            };
          }
          return newHistory;
        });
      }
      
      // Add new line for next iteration
      if (text.indexOf(line) < text.length - 1) {
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = {
              ...newHistory[newHistory.length - 1],
              output: [...newHistory[newHistory.length - 1].output, '']
            };
          }
          return newHistory;
        });
      }
    }
    
    setIsTyping(false);
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
          "I'm Evan Lynch, a software engineer specializing in AI-powered applications",
          "and full-stack development. With a background spanning data science and",
          "modern web technologies, I bridge the gap between cutting-edge research",
          "and production systems. I'm passionate about creating intelligent",
          "applications that solve real-world problems, leveraging everything from",
          "machine learning models to scalable cloud architectures. Currently focused",
          "on building the next generation of AI-first applications."
        ];
        break;

      case 'experience':
        output = [
          'Professional Experience:',
          '',
          '2023-Present | Full-Stack Engineer | Acme AI',
          '  • Architected and deployed React/Node.js applications on AWS',
          '  • Integrated OpenAI APIs for intelligent user experiences', 
          '  • Built scalable microservices handling 100k+ daily requests',
          '  • Led frontend development using React, TypeScript, and Tailwind',
          '',
          '2021-2023 | Data Scientist | InsightX',
          '  • Developed machine learning models using Python and TensorFlow',
          '  • Created data pipelines processing TB-scale datasets',
          '  • Built interactive dashboards and visualization tools',
          '  • Collaborated with product teams to deploy ML solutions'
        ];
        break;

      case 'projects':
        output = [
          'Featured Projects:',
          '',
          '🌱 SmartGarden',
          '   IoT plant monitoring system with automated watering',
          '   Tech: ESP32, Flask, React, PostgreSQL',
          '   → https://github.com/evanlynch/smartgarden',
          '',
          '✍️ Quill-AI', 
          '   AI-assisted writing application with real-time suggestions',
          '   Tech: Next.js, OpenAI API, Prisma, Vercel',
          '   → https://github.com/evanlynch/quill-ai',
          '',
          '📊 DataViz Studio',
          '   Interactive data visualization platform',
          '   Tech: D3.js, Python, FastAPI, Docker',
          '   → https://github.com/evanlynch/dataviz-studio'
        ];
        break;

      case 'interests':
        output = [
          'Personal Interests & Hobbies:',
          '',
          '🏃‍♂️ Trail Running',
          '   Exploring mountain trails and training for ultramarathons',
          '',
          '📸 Analog Photography', 
          '   Shooting film with vintage cameras, developing in darkroom',
          '',
          '🎮 Indie Game Development',
          '   Creating pixel art games in Unity during weekends',
          '',
          '☕ Coffee Brewing',
          '   Perfecting pour-over techniques and roasting beans',
          '',
          '📚 Sci-Fi Literature',
          '   Reading everything from Asimov to contemporary cyberpunk'
        ];
        break;

      case 'socials':
        output = [
          'Connect with me:',
          '',
          '💼 LinkedIn → https://linkedin.com/in/evanlynch',
          '📧 Email   → mailto:evan@evanlynch.dev', 
          '🐙 GitHub  → https://github.com/evanlynch',
          '📷 Instagram → https://instagram.com/evanlynch.dev',
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
          'TL;DR: Full-stack engineer & AI enthusiast building the future, one line of code at a time. 🚀'
        ];
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'ascii':
        output = [
          '',
          '  ███████╗██╗   ██╗ █████╗ ███╗   ██╗',
          '  ██╔════╝██║   ██║██╔══██╗████╗  ██║', 
          '  █████╗  ██║   ██║███████║██╔██╗ ██║',
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
        break;

      default:
        output = [
          `Command not found: ${cmd}`,
          `Type 'help' to see available commands.`
        ];
        break;
    }

    await typewriterEffect(output);
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
    <div className="min-h-screen bg-black text-gray-300 p-4 font-mono overflow-hidden">
      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto terminal-container"
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
          <div key={index} className="mb-2">
            <div className="flex items-center mb-1">
              <span className="text-green-400 mr-2">λ</span>
              <span className="text-white">{cmd.input}</span>
            </div>
            {renderOutput(cmd.output, cmd.input)}
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
    </div>
  );
};

export default Index;
