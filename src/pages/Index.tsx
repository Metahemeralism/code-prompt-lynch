import { useState, useEffect, useRef } from 'react';
import linkedinLogo from '../assets/brands/linkedin.svg';
import githubLogo from '../assets/brands/github.svg';
import gmailLogo from '../assets/brands/gmail.svg';

interface WritingPost {
  title: string;
  date: string;
  content: string;
  url?: string;
}


interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

interface ExperienceEntry {
  company: string;
  abbr: string;
  role: string;
  location: string;
  dateRange: string;
  current: boolean;
  accent: 'amber' | 'cyan' | 'violet' | 'blue';
  quote?: string;
}

// Chronological, oldest first — the timeline reads top (start) to bottom (now).
// TODO: confirm exact start date for the UCL research role below (placeholder: 2026 - Present).
const experienceEntries: ExperienceEntry[] = [
  {
    company: 'Shell',
    abbr: 'SHL',
    role: 'Technology Analyst, Strategy & Capital Allocation',
    location: 'London',
    dateRange: 'Aug 2022 – Aug 2023',
    current: false,
    accent: 'amber',
  },
  {
    company: 'Datactics',
    abbr: 'DTX',
    role: 'Data Science Intern',
    location: 'Belfast',
    dateRange: 'Mar 2025 – Aug 2025',
    current: false,
    accent: 'cyan',
  },
  {
    company: 'Encode London',
    abbr: 'ENC',
    role: 'Co-Founder & Director',
    location: 'London',
    dateRange: 'Aug 2025 – Present',
    current: true,
    accent: 'violet',
  },
  {
    company: 'UCL — Financial Computing & Analytics Group',
    abbr: 'UCL',
    role: 'Postgraduate Researcher',
    location: 'London',
    dateRange: '2026 – Present',
    current: true,
    accent: 'blue',
    quote: 'Building a physics-informed neural network that inverts the latent convenience yield from WTI crude oil futures term structures — as part of my MSc thesis.',
  },
];

const accentStyles: Record<ExperienceEntry['accent'], { badge: string; text: string }> = {
  amber: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/40', text: 'text-amber-300' },
  cyan: { badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40', text: 'text-cyan-300' },
  violet: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/40', text: 'text-violet-300' },
  blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/40', text: 'text-blue-300' },
};

const ExperienceTimeline = () => {
  return (
    <div className="my-1 max-w-2xl">
      <div className="text-white font-semibold mb-4">Professional Experience</div>

      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 border-l-2 border-dashed border-gray-700" aria-hidden="true" />

        <div className="flex flex-col gap-6">
          {experienceEntries.map((entry) => (
            <div key={entry.company} className="relative flex gap-4">
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-black font-mono text-[10px] font-bold tracking-tight ${accentStyles[entry.accent].badge}`}
              >
                {entry.abbr}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-white font-semibold">{entry.role}</span>
                  <span className="text-gray-600">·</span>
                  <span className={accentStyles[entry.accent].text}>{entry.company}</span>
                </div>
                <div className="text-gray-500 text-sm">
                  {entry.dateRange} · {entry.location}
                  {entry.current && (
                    <span className="ml-2 text-green-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 mr-1 align-middle animate-pulse" />
                      current
                    </span>
                  )}
                </div>
                {entry.quote && (
                  <div className="mt-2 text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3">
                    "{entry.quote}"
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="relative flex items-center gap-4">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <span className="text-green-400 text-sm font-semibold">Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LibraryItem {
  title: string;
  url: string;
  description: string;
}

interface LibraryTopic {
  topic: string;
  items: LibraryItem[];
}

// Obsidian-style index — topics as folders, items filed underneath.
// Add new topics/items here as they come up.
const libraryTopics: LibraryTopic[] = [
  {
    topic: 'AI Safety',
    items: [
      {
        title: 'Idealists Collective',
        url: 'https://idealistscollective.org/',
        // Placeholder — couldn't reach this domain to pull an accurate summary, edit freely.
        description: "A community I'm part of.",
      },
    ],
  },
];

const LibrarySection = () => {
  return (
    <div className="my-1 max-w-2xl">
      <div className="text-white font-semibold mb-1">Library</div>
      <div className="text-gray-500 text-sm mb-4">
        A running index of things worth knowing about, filed by topic.
      </div>

      {libraryTopics.map((topic) => (
        <div key={topic.topic} className="mb-5">
          <div className="text-white font-semibold mb-1">{topic.topic}</div>
          {topic.items.map((item, itemIndex) => {
            const isLast = itemIndex === topic.items.length - 1;
            return (
              <div key={item.url}>
                <div className="flex gap-2">
                  <span className="text-gray-600 shrink-0">{isLast ? '└──' : '├──'}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {item.title}
                  </a>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600 shrink-0">{isLast ? '   ' : '│  '}</span>
                  <span className="text-gray-400 text-sm">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

interface VolunteeringEntry {
  org: string;
  role: string;
  dateRange: string;
  description?: string;
}

// Empty for now — add entries here once details are confirmed
// (Data Science Society, Quant Society, Thinking About Thinking,
// Zero Gravity, Raleigh International).
const volunteeringEntries: VolunteeringEntry[] = [];

const VolunteeringSection = () => {
  return (
    <div className="my-1 max-w-2xl">
      <div className="text-white font-semibold mb-4">Volunteering</div>
      <div className="flex flex-col gap-3">
        {volunteeringEntries.map((entry) => (
          <div key={`${entry.org}-${entry.role}`}>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-white font-semibold">{entry.role}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-300">{entry.org}</span>
            </div>
            <div className="text-gray-500 text-sm">{entry.dateRange}</div>
            {entry.description && (
              <div className="text-gray-400 text-sm mt-1">{entry.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface HelpCommand {
  cmd: string;
  desc: string;
}

const helpCommands: HelpCommand[] = [
  { cmd: 'about', desc: 'Overview of Evan Lynch' },
  { cmd: 'experience', desc: 'Professional history' },
  { cmd: 'volunteering', desc: 'Societies, programmes & expeditions' },
  { cmd: 'projects', desc: 'Personal projects & code' },
  { cmd: 'interests', desc: 'Hobbies & passions' },
  { cmd: 'library', desc: 'Curated links, filed by topic' },
  { cmd: 'socials', desc: 'Social media links' },
  { cmd: 'writings', desc: 'Notes & posts' },
  { cmd: 'tldr', desc: 'Quick summary' },
  { cmd: 'clear', desc: 'Clear terminal' },
];

const HelpMenu = () => {
  return (
    <div className="my-1 max-w-xl">
      <div className="text-white font-semibold mb-3">Available commands</div>
      <div className="flex flex-col gap-1.5">
        {helpCommands.map(({ cmd, desc }) => (
          <div key={cmd} className="flex gap-4">
            <span className="text-green-400 w-32 shrink-0">{cmd}</span>
            <span className="text-gray-400">{desc}</span>
          </div>
        ))}
      </div>
      <div className="text-gray-500 text-sm mt-4">Type any command to get started.</div>
    </div>
  );
};

const GNOME_ART = String.raw`   /\
  /vv\
 (o.o)
 ('')
  ||
 _||______,---o
|_____________|
  ~  ~  ~  ~  ~`;

const EmptyState = () => (
  <div className="my-1 text-green-400">
    <pre className="text-xs leading-tight">{GNOME_ART}</pre>
    <div className="text-gray-500 mt-1">gone fishing</div>
  </div>
);

interface FishParticle {
  id: number;
  left: number;
  delay: number;
}

const GnomeFisher = () => {
  const [fish, setFish] = useState<FishParticle[]>([]);
  const fishIdRef = useRef(0);

  const spawnFish = () => {
    const batch: FishParticle[] = Array.from({ length: 6 }).map(() => {
      fishIdRef.current += 1;
      return {
        id: fishIdRef.current,
        left: Math.random() * 60 - 30,
        delay: Math.random() * 0.5,
      };
    });
    setFish((prev) => [...prev, ...batch]);
    const ids = batch.map((f) => f.id);
    setTimeout(() => {
      setFish((prev) => prev.filter((f) => !ids.includes(f.id)));
    }, 2600);
  };

  return (
    <div
      className="fixed bottom-2 right-2 z-40 select-none hidden sm:block"
      onMouseEnter={spawnFish}
    >
      <pre className="gnome-fisher text-green-400 text-[10px] leading-[1.15] cursor-default">
        {GNOME_ART}
      </pre>
      {fish.map((f) => (
        <span
          key={f.id}
          className="fish-particle absolute text-cyan-300 text-xs pointer-events-none"
          style={{
            left: `calc(50% + ${f.left}px)`,
            top: '10px',
            animationDelay: `${f.delay}s`,
          }}
        >
          {'<><'}
        </span>
      ))}
    </div>
  );
};

const Index = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<WritingPost | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [visitorNumber, setVisitorNumber] = useState(0);
  const [hasUsedHelp, setHasUsedHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const currentCommandRef = useRef<HTMLDivElement>(null);

  // Writings — cleared out; add new posts here as they're written.
  const writingsPosts: WritingPost[] = [];


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
  }, [history]);

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

  const displayOutput = (text: string[]): void => {
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

    if (!hasUsedHelp && command !== 'help') {
      output = [
        `Command not found: ${cmd}`,
        `Type 'help' to see available commands.`
      ];
      displayOutput(output);
      return;
    }

    switch (command) {
      case 'help':
        setHasUsedHelp(true);
        output = [
          'Available commands:',
          '',
          ...helpCommands.map(({ cmd: c, desc }) => `  ${c.padEnd(14)}${desc}`),
          '',
          'Type any command to get started!'
        ];
        break;


      case 'about':
        output = [
          "Hi, I'm Evan Lynch — passionate about technology, AI and entrepreneurship.",
          "",
          "I'm completing an MSc in Engineering with Finance at UCL (predicted First),",
          "having graduated with a BEng in Chemical Engineering from Bath. I'm currently",
          "a Postgraduate Researcher in the Financial Computing & Analytics Group at UCL,",
          "as part of my MSc thesis.",
          "",
          "I co-founded Encode London — the UK chapter of a global AI safety organisation —",
          "and my thesis builds a physics-informed neural network that inverts the latent",
          "convenience yield from WTI crude oil futures term structures.",
          "Type `experience` to read more.",
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
          ...experienceEntries
            .slice()
            .reverse()
            .map((e) => `${e.dateRange} | ${e.role} | ${e.company}`)
        ];
        break;

      case 'volunteering':
        output = volunteeringEntries.length === 0
          ? []
          : [
              'Volunteering:',
              '',
              ...volunteeringEntries.map((v) => `${v.dateRange} | ${v.role} | ${v.org}`)
            ];
        break;

      case 'projects': {
        const rule = '─'.repeat(52);
        output = [
          'Projects:',
          '',
          'Electricity Forward Pricer  (Apr 2026)',
          rule,
          '   Tech:  Python, NumPy, SciPy, Streamlit, Monte Carlo',
          '',
          '   • Forward-curve pricer for power markets using Lucia–Schwartz',
          '     two-factor model with Merton jumps',
          '   • Closed-form risk-neutral F(0,T) via moment generating function',
          '   • Validated by exact-discretisation Monte Carlo —',
          '     2–3% convergence at N=20k paths',
          '',
          '   → GitHub:  https://github.com/Metahemeralism/forward_heatmap',
          '',
          '',
          'Plane-Wing Optimisation  (May 2026)',
          rule,
          '   Tech:  Python, Gaussian Process Regression, MLP, NSGA-II',
          '',
          '   • Surrogate-based multi-objective optimisation of an aircraft',
          '     wing maintenance panel',
          '   • Minimised mass & max von Mises stress via evolutionary search',
          '   • Coursework for Data-Driven Methods for Engineers (MECH0107), UCL',
          '     — supervised by Dr. Lama Hamadeh',
          '',
          '   → GitHub:      https://github.com/Metahemeralism/plane-wing-optimisation',
          '   → Report (PDF): /coursework/mech0107-coursework2-wing-panel-optimisation.pdf',
          '',
          '',
          'Pendulum Motion Tracking & Analysis  (Mar 2026)',
          rule,
          '   Tech:  Python, OpenCV, NumPy, SciPy, Scikit-Learn',
          '',
          '   • Computer-vision pipeline tracking a spring-pendulum from',
          '     multi-camera video',
          '   • Extracted dominant oscillation modes via PCA; estimated k and L',
          '     analytically',
          '   • Coursework for Data-Driven Methods for Engineers (MECH0107), UCL',
          '     — supervised by Dr. Lama Hamadeh',
          '',
          '   → GitHub:      https://github.com/Metahemeralism/pendulum',
          '   → Report (PDF): /coursework/mech0107-coursework1-spring-pendulum.pdf',
          '',
          '',
          'Pynigma — Enigma Machine Simulator  (Nov 2024)',
          rule,
          '   Tech:  Python, OOP',
          '',
          '   • Object-oriented WWII Enigma cipher simulation — rotor stepping',
          '     & plugboard',
          '   • Encode/decode paths validated against known historical settings',
          '',
          '   → GitHub:  https://github.com/Metahemeralism/pynigma',
          '',
          '',
          'Wimbledon 2025 Winner Prediction  (Jul 2025)',
          rule,
          '   Tech:  Python, Scikit-Learn, Jupyter',
          '',
          '   • ML model predicting the 2025 Wimbledon Men\'s Singles Final winner',
          '',
          '   → GitHub:  https://github.com/Metahemeralism/wimby-pred',
          '',
          '',
          'Garmin Heatmap Widget  (Jul 2026)',
          rule,
          '   Tech:  Python, JavaScript, Übersicht',
          '',
          '   • macOS desktop widget rendering Garmin activity heatmap',
          '     (16 GitHub stars)',
          '',
          '   → GitHub:  https://github.com/Metahemeralism/garmin_heatmap_widget'
        ];
        break;
      }


      case 'interests':
        output = [
          'Personal Interests & Hobbies:',
          '',
          'Chess',
          '   Top 6% on Chess.com — always looking for a game',
          '',
          'Tennis',
          '   UCL Men\'s 3rd Team; active player and coach',
          '',
          'Fitness',
          '   Regular gym training and wellness focus',
          '',
          'Travelling',
          '   Exploring new places — most recently South Africa with Raleigh International'
        ];
        break;

      case 'library':
        output = [
          'Library — a running index of things worth knowing about, filed by topic:',
          '',
          ...libraryTopics.flatMap((topic) => [
            topic.topic,
            ...topic.items.flatMap((item) => [
              `  ${item.title} — ${item.url}`,
              `    ${item.description}`
            ]),
            ''
          ])
        ];
        break;

      case 'socials':
        output = [
          'Connect with me:',
          '',
          '[in] LinkedIn → https://www.linkedin.com/in/-evanlynch/',
          '[mail] Email → mailto:eplynch398@gmail.com,evan.lynch.25@ucl.ac.uk', 
          '[git] GitHub → https://github.com/Metahemeralism',
          '',
          'Feel free to reach out for collaborations or just to chat!'
        ];
        break;

      case 'writings':
        output = writingsPosts.length === 0
          ? []
          : [
              'Writings:',
              '',
              ...writingsPosts.map((post, index) =>
                `${index + 1}. ${post.title} (${post.date}) [click to read]`
              ),
              '',
              'Click a title to read the summary.'
            ];
        break;

      case 'tldr':
        output = [
          'TL;DR: MSc Engineering with Finance (UCL, 1st predicted) · Postgraduate',
          'Researcher @ UCL Financial Computing & Analytics Group · Co-Founder @',
          'Encode London (AI Safety) · Datactics & Shell alum.',
          'Thesis: a PINN for inverting the latent convenience yield of WTI crude.',
          'Interested in AI Safety, Quantitative Trading & Data Science.'
        ];
        break;


      case 'clear':
        setHistory([]);
        return;

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
    if (input.trim()) {
      executeCommand(input.trim());
      setInput('');
    }
  };

  const handleWritingClick = (postTitle: string) => {
    const post = writingsPosts.find(p => postTitle.includes(p.title));
    if (post) {
      setSelectedPost(post);
      setShowModal(true);
    }
  };

  const renderOutput = (output: string[], commandInput: string) => {
    return output.map((line, index) => {
      // Check if this is a writings post line
      const isWritingPost = commandInput.toLowerCase() === 'writings' &&
                        line.includes('[click to read]') &&
                        writingsPosts.some(post => line.includes(post.title));

      if (isWritingPost) {
        return (
          <div key={index} className="terminal-line">
            <span
              className="text-blue-400 hover:text-blue-300 cursor-pointer underline"
              onClick={() => handleWritingClick(line)}
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

      // Check for links (no 'g' flag here — test() must stay stateless across calls)
      const linkPattern = /(https?:\/\/[^\s]+|\/coursework\/[^\s]+|mailto:[^\s]+)/;

      if (linkPattern.test(line)) {
        const parts = line.split(new RegExp(linkPattern.source, 'g'));
        return (
          <div key={index} className="terminal-line">
            {parts.map((part, partIndex) => {
              if (linkPattern.test(part)) {
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
      const isProjectsCmd = commandInput.toLowerCase().trim() === 'projects';
      const isDividerLine = /^─+$/.test(line);
      const isProjectTitle = isProjectsCmd && line.trim() !== '' && !line.startsWith(' ') && line !== 'Projects:' && !isDividerLine;

      if (isProjectTitle) {
        className += ' text-white font-semibold mt-1';
      } else if (isDividerLine) {
        className += ' text-gray-700';
      } else if (line.includes('→')) {
        className += ' text-green-400';
      } else if (line.includes('|')) {
        className += ' text-cyan-400';
      }

      return (
        <div key={index} className={className}>
          {line === '' ? ' ' : line}
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

      <GnomeFisher />

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
            {(() => {
              const trimmedInput = cmd.input.toLowerCase().trim();
              if (trimmedInput === 'help') return <HelpMenu />;
              if (trimmedInput === 'experience') return <ExperienceTimeline />;
              if (trimmedInput === 'library') return <LibrarySection />;
              if (trimmedInput === 'volunteering') {
                return volunteeringEntries.length === 0
                  ? <EmptyState />
                  : <VolunteeringSection />;
              }
              if (trimmedInput === 'writings') {
                return writingsPosts.length === 0
                  ? <EmptyState />
                  : renderOutput(cmd.output, cmd.input);
              }
              return renderOutput(cmd.output, cmd.input);
            })()}
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

      {/* Writing Post Modal */}
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
            {selectedPost.url && (
              <a
                href={selectedPost.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline text-sm"
              >
                → Read the full post on LinkedIn
              </a>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
