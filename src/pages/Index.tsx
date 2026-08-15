import { useState, useEffect, useRef } from 'react';
import linkedinLogo from '../assets/brands/linkedin.svg';
import githubLogo from '../assets/brands/github.svg';
import gmailLogo from '../assets/brands/gmail.svg';

interface BlogPost {
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
  bullets: string[];
}

// Chronological, oldest first — the timeline reads top (start) to bottom (now).
const experienceEntries: ExperienceEntry[] = [
  {
    company: 'Shell',
    abbr: 'SHL',
    role: 'Technology Analyst, Strategy & Capital Allocation',
    location: 'London',
    dateRange: 'Aug 2022 – Aug 2023',
    current: false,
    accent: 'amber',
    bullets: [
      'Built TCO models for offshore wind vessels across 10+ configurations (£1M+ allocation)',
      'Modelled sensitivity to commodity prices, discount rates, and operational risk',
      'Presented scenarios to Shell executives; authored 100+ parameter risk mitigation report',
    ],
  },
  {
    company: 'Datactics',
    abbr: 'DTX',
    role: 'Data Science Intern',
    location: 'Belfast',
    dateRange: 'Mar 2025 – Aug 2025',
    current: false,
    accent: 'cyan',
    bullets: [
      'Automated validation pipeline for 100GB+ financial datasets — 60% less manual work',
      'Built LLM-assisted parsing engine (Python/FastAPI + proprietary C++ libraries)',
      'Authored 10+ technical reports translating EMIR, FATCA, MiFID II into rule sets',
    ],
  },
  {
    company: 'Encode London',
    abbr: 'ENC',
    role: 'Co-Founder & Director',
    location: 'London',
    dateRange: 'Aug 2025 – Present',
    current: true,
    accent: 'violet',
    bullets: [
      'Co-founded UK chapter of Encode — a global AI safety organisation',
      'Recruited 5-person executive team; coordinate 15 fellows across research, policy, education',
      'Built engagement with UK AISI, LISA, and UK government contacts',
    ],
  },
  {
    company: 'MSCI',
    abbr: 'MSCI',
    role: 'Summer Analyst, Institutional Client Strategy & Execution',
    location: 'London',
    dateRange: 'Jun 2026 – Present',
    current: true,
    accent: 'blue',
    bullets: [
      'Sized ~$1tn AUM whitespace among EMEA asset-owner prospects; fused multiple data sources into a screening tool with an LLM pipeline that auto-drafted outreach',
      'Authored go-to-market proposal for MSCI factor & multi-factor QIS strategies',
      'Built benchmarking tool comparing QIS performance vs MSCI World (Sharpe & more)',
    ],
  },
];

const leadershipEntries = [
  'Postgraduate Representative — UCL Quantitative Finance Society',
  'Head of Science — UCL Data Science Society',
  "UCL Men's Tennis 3rd Team",
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
                <div className="text-gray-500 text-sm mb-2">
                  {entry.dateRange} · {entry.location}
                  {entry.current && (
                    <span className="ml-2 text-green-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 mr-1 align-middle animate-pulse" />
                      current
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {entry.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-gray-600 shrink-0">–</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
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

      <div className="mt-6">
        <div className="text-white font-semibold mb-2">Leadership</div>
        <ul className="space-y-1">
          {leadershipEntries.map((item) => (
            <li key={item} className="text-gray-300 text-sm flex gap-2">
              <span className="text-gray-600 shrink-0">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

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
      title: "A Garmin Heatmap Widget for Your Desktop",
      date: "2025-10-27",
      content: "If you use a Garmin, you probably know the frustration of having to open the app just to see your activity heatmap. I built a macOS desktop widget (via Übersicht) that turns your Garmin Connect data into a GitHub-style contribution heatmap right on your desktop — a small side-project that scratched a personal itch and now has 16 GitHub stars from the running community. Code + install instructions on GitHub. (Summarised from LinkedIn — click the link to read the original.)",
      url: "https://www.linkedin.com/posts/-evanlynch_if-you-use-a-garmin-you-probably-know-the-share-7483170090499297281-7G2U/"
    },
    {
      title: "Physics-Informed Machine Learning (PIML) — Notes from UCL",
      date: "2025-10-10",
      content: "A short write-up on physics-informed machine learning: how embedding governing equations (PDEs, conservation laws) into the loss function of a neural network can dramatically cut data requirements and improve extrapolation. Coming from a chemical-engineering background this framing genuinely clicked for me — it's the bridge between first-principles modelling and modern deep learning that I've been looking for. (Summarised from LinkedIn — click the link to read the original.)",
      url: "https://www.linkedin.com/posts/-evanlynch_physics-informed-machine-learning-piml-share-7477018710835290112-oiEx/"
    },
    {
      title: "Measure Change — Girsanov, Risk-Neutral Pricing & Intuition",
      date: "2025-09-23",
      content: "Notes on why the change of measure (Girsanov's theorem) is the single most important idea in quantitative finance. Under the physical measure P, asset drifts reflect real-world expectations; under the risk-neutral measure Q, they collapse to the risk-free rate — which is exactly what makes discounted expectations a valid pricing rule. Working through the intuition made a lot of other results (martingale representation, forward measures, numeraire changes) click. (Summarised from LinkedIn — click the link to read the original.)",
      url: "https://www.linkedin.com/posts/-evanlynch_measurechange-activity-7474899189143941120-yM7X"
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
          "and my MSc thesis builds a physics-informed neural network that inverts the",
          "latent convenience yield from WTI crude oil futures term structures.",
          "Type `research` to read more.",

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
          'MSc Thesis (UCL, 2025 – 2026):',
          '=============================================================================',
          '',
          'A Physics-Informed Neural Network for Inverting the Latent',
          '   Convenience Yield from WTI Crude Oil Futures Term Structures',
          '',
          '   Supervisors: Dr. Carolyn Phelan (primary), Dr. Lama Hamadeh',
          '',
          '─────────────────────────────────────────────────────────────────────────────',
          'Motivation',
          '─────────────────────────────────────────────────────────────────────────────',
          '   The Gibson–Schwartz (1990) two-factor model is a foundational framework',
          '   for pricing commodity derivatives. The spot price $S_t$ and the',
          '   convenience yield $\\delta_t$ co-evolve, but only $S_t$ (and futures',
          '   prices $F(S_t,\\delta_t,\\tau)$) are directly observable — the yield',
          '   $\\delta_t$ is a latent state. Classical practice recovers $\\delta_t$',
          '   with a Kalman filter under Gaussian, linear assumptions. I ask whether',
          '   a physics-informed neural network (PINN) can do better.',
          '',
          '─────────────────────────────────────────────────────────────────────────────',
          'The model — risk-neutral dynamics',
          '─────────────────────────────────────────────────────────────────────────────',
          '   Under the risk-neutral measure Q, after applying Girsanov and pinning',
          '   down $\\lambda_1$ via the cost-of-carry condition:',
          '',
          '     $dS_t = (r - \\delta_t)\\, S_t\\, dt + \\sigma_1 S_t\\, dW_1^{Q}$',
          '     $d\\delta_t = \\kappa(\\alpha^{Q} - \\delta_t)\\, dt + \\sigma_2\\, dW_2^{Q}$',
          '     $dW_1^{Q}\\, dW_2^{Q} = \\rho\\, dt,\\quad \\alpha^{Q} = \\alpha^{P} - \\sigma_2 \\lambda_2 / \\kappa$',
          '',
          '   Applying Itô + the martingale condition on the futures price yields the',
          '   Gibson–Schwartz PDE (in time-to-maturity $\\tau = T - t$):',
          '',
          '     $\\partial_\\tau \\hat F = (r-\\delta) S\\, \\partial_S \\hat F$',
          '       $+ \\kappa(\\alpha^{Q}-\\delta)\\, \\partial_\\delta \\hat F$',
          '       $+ \\tfrac12 \\sigma_1^2 S^2 \\partial_{SS}\\hat F$',
          '       $+ \\rho\\sigma_1\\sigma_2 S\\, \\partial_{S\\delta}\\hat F$',
          '       $+ \\tfrac12 \\sigma_2^2 \\partial_{\\delta\\delta}\\hat F$',
          '     with initial condition $\\hat F(S,\\delta,0) = S$.',
          '',
          '   This admits an exponential-affine closed form:',
          '',
          '     $\\hat F(\\tau, S, \\delta) = S \\exp\\!\\big[B(\\tau)\\,\\delta + A(\\tau)\\big]$',
          '     $B(\\tau) = -\\dfrac{1 - e^{-\\kappa\\tau}}{\\kappa}$',
          '',
          '   (matches Schwartz 1997 Model 2 term-by-term).',
          '',
          '─────────────────────────────────────────────────────────────────────────────',
          'The inverse problem & PINN formulation',
          '─────────────────────────────────────────────────────────────────────────────',
          '   A neural surrogate $\\hat\\delta_\\theta(t, S)$ is trained to invert the',
          '   observed futures panel. Composite objective:',
          '',
          '     $\\hat L = \\lambda_t \\hat L_t + \\lambda_b \\hat L_b + \\lambda_f \\hat L_f$',
          '       $+ \\sum_\\alpha \\lambda_{h_\\alpha}\\, \\hat L_{h_\\alpha}$',
          '',
          '   with weights set adaptively by WamOL loss-balancing. Components:',
          '',
          '   • Data-misfit (linearised in $\\delta$ via the closed form):',
          '     $\\hat L_t = \\tfrac{1}{N} \\sum_i \\big(\\ln S_i + B(\\tau_i)\\hat\\delta_\\theta + A(\\tau_i) - \\ln F_i^{obs}\\big)^2$',
          '',
          '   • No-arbitrage penalties (model-free, hinge-quadratic',
          '     $L_h = \\tfrac{1}{N} \\sum [\\max(0,-g(x))]^2$):',
          '     – Cash-and-carry upper bound: $F_t \\le S_t\\, e^{(r+u)\\tau}$',
          '     – Reverse-carry lower bound:  $F_t \\ge S_t\\, e^{(r-\\delta_{\\max})\\tau}$',
          '     – Economic-plausibility floor: $\\hat\\delta_\\theta \\ge \\delta_{\\min}$',
          '       (calibrated to $-0.3\\ \\mathrm{yr}^{-1}$, admitting deep contango',
          '       such as the April 2020 negative-price episode)',
          '',
          '─────────────────────────────────────────────────────────────────────────────',
          'Data & benchmark',
          '─────────────────────────────────────────────────────────────────────────────',
          '   • WTI quarterly futures panel (2015 – 2027), Refinitiv Workspace + FRED,',
          '     contract expiries cross-validated against the CME specification.',
          '   • Baseline: Kalman filter with exact Ornstein–Uhlenbeck discretisation',
          '     and maximum-likelihood calibration.',
          '   • Validation: Monte Carlo synthetic generator with closed-form ground truth.',
          '',
          '─────────────────────────────────────────────────────────────────────────────',
          'Status',
          '─────────────────────────────────────────────────────────────────────────────',
          '   ✓ Full theoretical derivation (Girsanov → PDE → closed form) complete',
          '   ✓ Empirical data pipeline complete & validated',
          '   ✓ Monte Carlo synthetic generator passing numerical checks',
          '   ⟳ PINN implementation in JAX/Flax with WamOL adaptive loss',
          '   ⟳ Kalman baseline & comparative evaluation',
          '',
          'Stack: JAX, Flax, NumPy, SciPy, Statsmodels · Submission: 31 Aug 2026'
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
          'Thesis: a PINN for inverting the latent convenience yield of WTI crude.',
          'Interested in AI Safety, Quantitative Trading & Data Science.'
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
            ) : cmd.input.toLowerCase().trim() === 'experience' ? (
              <ExperienceTimeline />
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
