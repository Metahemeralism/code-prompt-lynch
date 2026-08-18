import { Suspense, lazy, useState } from 'react';
import linkedinLogo from '../assets/brands/linkedin.svg';
import githubLogo from '../assets/brands/github.svg';
import gmailLogo from '../assets/brands/gmail.svg';
import wandererArt from '../assets/wanderer.png';

// ~120KB of country geometry — only fetched when the map is opened.
const TravelMap = lazy(() => import('./TravelMap'));

/* ------------------------------------------------------------------ *
 * Shared primitives
 * ------------------------------------------------------------------ */

export const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-4">
    <h2 className="text-white font-semibold">{title}</h2>
    {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] uppercase tracking-wide text-gray-400 border border-gray-700 rounded px-1.5 py-px">
    {children}
  </span>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="text-gray-300 text-sm flex gap-2">
    <span className="text-gray-600 shrink-0">–</span>
    <span>{children}</span>
  </li>
);

const LinkRow = ({
  label,
  href,
  external = true,
}: {
  label: string;
  href: string;
  external?: boolean;
}) => (
  <div className="flex gap-2 text-sm">
    <span className="text-gray-600 shrink-0">→</span>
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all"
    >
      {label}
    </a>
  </div>
);

const LiveDot = () => (
  <span className="ml-2 text-green-400 text-sm">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 mr-1 align-middle animate-pulse" />
    current
  </span>
);

/* ------------------------------------------------------------------ *
 * About
 * ------------------------------------------------------------------ */

const aboutParagraphs = [
  "I'm completing an MSc in Engineering with Finance at UCL (predicted First), having graduated with a BEng in Chemical Engineering from Bath.",
  "I'm currently a Postgraduate Researcher in the Financial Computing & Analytics Group at UCL as part of my MSc thesis, and spent summer 2026 at MSCI in London as a Summer Analyst on the Institutional Client Strategy & Execution team.",
  'I co-founded Encode London — the UK chapter of a global AI safety organisation.',
];

const aboutFacts: { label: string; value: string }[] = [
  { label: 'Focus', value: 'AI Safety · Quantitative Trading · Data Science' },
  { label: 'Languages', value: 'Python, SQL, MATLAB, VBA' },
  { label: 'Spoken', value: 'Fluent English; beginner German & Danish' },
  { label: 'Certifications', value: 'Stanford ML Specialisation (Andrew Ng, Coursera)' },
];

export const AboutSection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Evan Lynch" subtitle="Technology, AI and entrepreneurship." />

    <div className="flex flex-col gap-2 mb-5">
      {aboutParagraphs.map((p) => (
        <p key={p} className="text-gray-300 text-sm leading-relaxed">
          {p}
        </p>
      ))}
    </div>

    <dl className="flex flex-col gap-1.5">
      {aboutFacts.map(({ label, value }) => (
        <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
          <dt className="text-gray-500 text-sm sm:w-32 shrink-0">{label}</dt>
          <dd className="text-gray-300 text-sm">{value}</dd>
        </div>
      ))}
    </dl>

    <p className="text-gray-500 text-sm mt-5">
      Type <span className="text-green-400">experience</span> for the full history, or{' '}
      <span className="text-green-400">projects</span> for what I've built.
    </p>
  </div>
);

/* ------------------------------------------------------------------ *
 * TL;DR
 * ------------------------------------------------------------------ */

export const TldrSection = () => (
  <div className="my-1 max-w-2xl">
    <div className="border-l-2 border-green-500/40 pl-4 flex flex-col gap-2">
      <p className="text-gray-200 text-sm leading-relaxed">
        MSc Engineering with Finance at UCL (predicted First). Postgraduate Researcher in
        UCL's Financial Computing &amp; Analytics Group; Co-Founder of Encode London
        (AI safety). Previously MSCI, Datactics and Shell.
      </p>
      <p className="text-gray-400 text-sm leading-relaxed">
        Thesis: a physics-informed neural network for inverting the latent convenience
        yield of WTI crude.
      </p>
      <p className="text-gray-500 text-sm">
        Interested in AI safety, quantitative trading and data science.
      </p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Experience
 * ------------------------------------------------------------------ */

interface ExperienceEntry {
  company: string;
  abbr: string;
  role: string;
  location: string;
  dateRange: string;
  current: boolean;
  accent: 'amber' | 'cyan' | 'violet' | 'blue' | 'emerald';
  quote?: string;
}

// Chronological, oldest first — the timeline reads top (start) to bottom (now).
export const experienceEntries: ExperienceEntry[] = [
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
    dateRange: 'May 2026 – Present',
    current: true,
    accent: 'blue',
    quote:
      'Building a physics-informed neural network that inverts the latent convenience yield from WTI crude oil futures term structures — as part of my MSc thesis.',
  },
  {
    company: 'MSCI',
    abbr: 'MSCI',
    role: 'Summer Analyst, Institutional Client Strategy & Execution',
    location: 'London',
    dateRange: 'Jun 2026 – Jul 2026',
    current: false,
    accent: 'emerald',
  },
];

const accentStyles: Record<ExperienceEntry['accent'], { badge: string; text: string }> = {
  amber: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/40', text: 'text-amber-300' },
  cyan: { badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40', text: 'text-cyan-300' },
  violet: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/40', text: 'text-violet-300' },
  blue: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/40', text: 'text-blue-300' },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-300',
  },
};

export const ExperienceTimeline = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Professional Experience" subtitle="Start to now." />

    <div className="relative">
      <div
        className="absolute left-5 top-2 bottom-2 border-l-2 border-dashed border-gray-700"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6">
        {experienceEntries.map((entry) => (
          <div key={`${entry.company}-${entry.dateRange}`} className="relative flex gap-4">
            {/* Solid backing: the accent tint is semi-transparent, so without
                this the dashed timeline shows through the badge. */}
            <div className="relative z-10 h-10 w-10 shrink-0 rounded-md bg-black">
              <div
                className={`flex h-full w-full items-center justify-center rounded-md border font-mono text-[10px] font-bold tracking-tight ${
                  accentStyles[entry.accent].badge
                }`}
              >
                {entry.abbr}
              </div>
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-white font-semibold">{entry.role}</span>
                <span className="text-gray-600">·</span>
                <span className={accentStyles[entry.accent].text}>{entry.company}</span>
              </div>
              <div className="text-gray-500 text-sm">
                {entry.dateRange} · {entry.location}
                {entry.current && <LiveDot />}
              </div>
              {entry.quote && (
                <div className="mt-2 text-gray-400 text-sm italic border-l-2 border-gray-700 pl-3">
                  “{entry.quote}”
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="relative flex items-center gap-4">
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-black">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <span className="text-green-400 text-sm font-semibold">Now</span>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Volunteering
 * ------------------------------------------------------------------ */

interface VolunteeringEntry {
  org: string;
  role: string;
  dateRange: string;
  current?: boolean;
}

// Most recent first, by start date.
export const volunteeringEntries: VolunteeringEntry[] = [
  { org: 'UCL Quant Society', role: 'Postgraduate Representative', dateRange: 'Nov 2025 – Mar 2026' },
  {
    org: 'Thinking About Thinking',
    role: 'Community Fellow',
    dateRange: 'Oct 2025 – Present',
    current: true,
  },
  { org: 'UCL Data Science Society', role: 'Head of Science', dateRange: 'Sep 2025 – Apr 2026' },
  { org: 'Raleigh International', role: 'Venturer — South Africa', dateRange: 'Oct 2024 – Dec 2024' },
  { org: 'Zero Gravity', role: 'University Mentor', dateRange: 'Jan 2024 – Mar 2026' },
];

export const VolunteeringSection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Volunteering" subtitle="Societies, programmes and expeditions." />
    <div className="flex flex-col gap-4">
      {volunteeringEntries.map((entry) => (
        <div key={`${entry.org}-${entry.role}`} className="border-l-2 border-gray-800 pl-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-white font-semibold">{entry.role}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-300">{entry.org}</span>
          </div>
          <div className="text-gray-500 text-sm">
            {entry.dateRange}
            {entry.current && <LiveDot />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

type ProjectTopic =
  | 'Quantitative Finance'
  | 'Machine Learning & Optimisation'
  | 'Computer Vision & Signal Processing'
  | 'Tools & Simulations';

/** Order the topics appear in. */
const projectTopics: ProjectTopic[] = [
  'Quantitative Finance',
  'Machine Learning & Optimisation',
  'Computer Vision & Signal Processing',
  'Tools & Simulations',
];

interface Project {
  title: string;
  date: string;
  topic: ProjectTopic;
  tech: string[];
  bullets: string[];
  note?: string;
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: 'Electricity Forward Pricer',
    topic: 'Quantitative Finance',
    date: 'Apr 2026',
    tech: ['Python', 'NumPy', 'SciPy', 'Streamlit', 'Monte Carlo'],
    bullets: [
      'Forward-curve pricer for power markets using the Lucia–Schwartz two-factor model with Merton jumps',
      'Closed-form risk-neutral F(0,T) via the moment generating function',
      'Validated by exact-discretisation Monte Carlo — 2–3% convergence at N=20k paths',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Metahemeralism/forward_heatmap' }],
  },
  {
    title: 'Plane-Wing Optimisation',
    topic: 'Machine Learning & Optimisation',
    date: 'May 2026',
    tech: ['Python', 'Gaussian Process Regression', 'MLP', 'NSGA-II'],
    bullets: [
      'Surrogate-based multi-objective optimisation of an aircraft wing maintenance panel',
      'Minimised mass and max von Mises stress via evolutionary search',
    ],
    note: 'Coursework for Data-Driven Methods for Engineers (MECH0107), UCL — supervised by Dr. Lama Hamadeh',
    links: [
      { label: 'GitHub', href: 'https://github.com/Metahemeralism/plane-wing-optimisation' },
      {
        label: 'Read the report (PDF)',
        href: '/coursework/mech0107-coursework2-wing-panel-optimisation.pdf',
        external: false,
      },
    ],
  },
  {
    title: 'Pendulum Motion Tracking & Analysis',
    topic: 'Computer Vision & Signal Processing',
    date: 'Mar 2026',
    tech: ['Python', 'OpenCV', 'NumPy', 'SciPy', 'Scikit-Learn'],
    bullets: [
      'Computer-vision pipeline tracking a spring-pendulum from multi-camera video',
      'Extracted dominant oscillation modes via PCA; estimated k and L analytically',
    ],
    note: 'Coursework for Data-Driven Methods for Engineers (MECH0107), UCL — supervised by Dr. Lama Hamadeh',
    links: [
      { label: 'GitHub', href: 'https://github.com/Metahemeralism/pendulum' },
      {
        label: 'Read the report (PDF)',
        href: '/coursework/mech0107-coursework1-spring-pendulum.pdf',
        external: false,
      },
    ],
  },
  {
    title: 'Pynigma — Enigma Machine Simulator',
    topic: 'Tools & Simulations',
    date: 'Nov 2024',
    tech: ['Python', 'OOP'],
    bullets: [
      'Object-oriented WWII Enigma cipher simulation — rotor stepping and plugboard',
      'Encode/decode paths validated against known historical settings',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Metahemeralism/pynigma' }],
  },
  {
    title: 'Wimbledon 2025 Winner Prediction',
    topic: 'Machine Learning & Optimisation',
    date: 'Jul 2025',
    tech: ['Python', 'Scikit-Learn', 'Jupyter'],
    bullets: ["ML model predicting the 2025 Wimbledon Men's Singles Final winner"],
    links: [{ label: 'GitHub', href: 'https://github.com/Metahemeralism/wimby-pred' }],
  },
  {
    title: 'Garmin Heatmap Widget',
    topic: 'Tools & Simulations',
    date: 'Jul 2026',
    tech: ['Python', 'JavaScript', 'Übersicht'],
    bullets: ['macOS desktop widget rendering a Garmin activity heatmap — 16 GitHub stars'],
    links: [{ label: 'GitHub', href: 'https://github.com/Metahemeralism/garmin_heatmap_widget' }],
  },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <div>
    <div className="flex flex-wrap items-baseline gap-x-3">
      <h3 className="text-white font-semibold">{project.title}</h3>
      <span className="text-gray-500 text-sm">{project.date}</span>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
      {project.tech.map((t) => (
        <Chip key={t}>{t}</Chip>
      ))}
    </div>

    <ul className="flex flex-col gap-1 mb-2">
      {project.bullets.map((b) => (
        <Bullet key={b}>{b}</Bullet>
      ))}
    </ul>

    {project.note && <p className="text-gray-500 text-sm italic mb-2">{project.note}</p>}

    <div className="flex flex-col gap-1">
      {project.links.map((link) => (
        <LinkRow
          key={link.href}
          label={link.label}
          href={link.href}
          external={link.external !== false}
        />
      ))}
    </div>
  </div>
);

export const ProjectsSection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Projects" subtitle="Things I've built, grouped by topic." />

    <div className="flex flex-col gap-9">
      {projectTopics.map((topic) => {
        const inTopic = projects.filter((p) => p.topic === topic);
        if (inTopic.length === 0) return null;

        return (
          <div key={topic}>
            <div className="flex items-baseline gap-3 mb-4 pb-1.5 border-b border-gray-800">
              <span className="text-gray-500 text-[10px] uppercase tracking-widest">
                {topic}
              </span>
              <span className="text-gray-700 text-[10px]">{inTopic.length}</span>
            </div>

            <div className="flex flex-col gap-7">
              {inTopic.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Interests
 * ------------------------------------------------------------------ */

interface Interest {
  name: string;
  detail?: string;
  link?: { label: string; href: string };
  /** Renders the world map, revealed on click. */
  map?: boolean;
}

export const interests: Interest[] = [
  {
    name: 'Chess',
    detail: 'Highest rapid rating: 1325 — always looking for a game.',
    link: { label: 'Send me a friend request', href: 'https://link.chess.com/friend/N0Q3dC' },
  },
  { name: 'Tennis', detail: "UCL Men's 3rd Team; active player and coach." },
  { name: 'Fitness', detail: 'Regular gym training and wellness focus.' },
  {
    name: 'Travelling',
    map: true,
  },
];

const InterestRow = ({ interest }: { interest: Interest }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      {interest.map ? (
        <button
          type="button"
          onClick={() => setShowMap((open) => !open)}
          aria-expanded={showMap}
          className="text-white font-semibold hover:text-green-300 transition-colors flex items-center gap-2 group"
        >
          {interest.name}
          <span className="text-gray-600 text-xs group-hover:text-green-400 transition-colors">
            {showMap ? '[ hide map ]' : '[ show map ]'}
          </span>
        </button>
      ) : (
        <div className="text-white font-semibold">{interest.name}</div>
      )}

      {interest.detail && <p className="text-gray-300 text-sm">{interest.detail}</p>}

      {interest.link && (
        <div className="mt-1">
          <LinkRow label={interest.link.label} href={interest.link.href} />
        </div>
      )}

      {interest.map && showMap && (
        <Suspense
          fallback={<div className="text-gray-600 text-sm mt-3">loading map…</div>}
        >
          <TravelMap />
        </Suspense>
      )}
    </div>
  );
};

export const InterestsSection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Interests" subtitle="Outside of work." />
    <div className="flex flex-col gap-4">
      {interests.map((interest) => (
        <InterestRow key={interest.name} interest={interest} />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Socials
 * ------------------------------------------------------------------ */

interface Social {
  label: string;
  value: string;
  href: string;
  icon: string;
}

export const socials: Social[] = [
  {
    label: 'LinkedIn',
    value: '/in/-evanlynch',
    href: 'https://www.linkedin.com/in/-evanlynch/',
    icon: linkedinLogo,
  },
  {
    label: 'GitHub',
    value: '@Metahemeralism',
    href: 'https://github.com/Metahemeralism',
    icon: githubLogo,
  },
  {
    label: 'Email',
    value: 'eplynch398@gmail.com',
    href: 'mailto:eplynch398@gmail.com',
    icon: gmailLogo,
  },
  {
    label: 'Email (UCL)',
    value: 'evan.lynch.25@ucl.ac.uk',
    href: 'mailto:evan.lynch.25@ucl.ac.uk',
    icon: gmailLogo,
  },
];

export const SocialsSection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Elsewhere" subtitle="Reach out for collaborations, or just to chat." />
    <div className="flex flex-col gap-2.5">
      {socials.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target={social.href.startsWith('http') ? '_blank' : undefined}
          rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-3 group w-fit"
        >
          {/* The brand SVGs carry no fill, so they'd render black-on-black —
              invert flips them to white, then opacity mutes them. */}
          <img
            src={social.icon}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 invert opacity-50 group-hover:opacity-90 transition-opacity"
          />
          <span className="text-gray-500 text-sm w-24 shrink-0">{social.label}</span>
          <span className="text-blue-400 group-hover:text-blue-300 underline underline-offset-2 text-sm break-all">
            {social.value}
          </span>
        </a>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Library
 * ------------------------------------------------------------------ */

interface LibraryItem {
  title: string;
  url: string;
  description: string;
  /** Optional tag shown beside the title, e.g. "signatory", "member". */
  tag?: string;
}

interface LibraryTopic {
  topic: string;
  items: LibraryItem[];
}

// Obsidian-style index — topics as folders, items filed underneath.
export const libraryTopics: LibraryTopic[] = [
  {
    topic: 'AI Safety',
    items: [
      {
        title: 'Thinking About Thinking',
        url: 'https://www.thinkingaboutthinking.org/',
        description:
          'An independent nonprofit advancing an interdisciplinary understanding of intelligence — a global fellowship of researchers, engineers and thinkers across AI, neuroscience, cognitive science and mathematics.',
        tag: 'community fellow',
      },
      {
        title: 'Idealists Collective',
        url: 'https://idealistscollective.org/',
        description: "A community I'm part of.",
        tag: 'member',
      },
    ],
  },
  {
    topic: 'Human-Centred Computing',
    items: [
      {
        title: 'The Resonant Computing Manifesto',
        url: 'https://resonantcomputing.org/',
        description:
          'A manifesto for software that serves human agency and collective flourishing rather than extractive scale — building technology that empowers rather than hijacks attention.',
        tag: 'signatory',
      },
    ],
  },
];

export const LibrarySection = () => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Library" subtitle="A running index of things worth knowing about, filed by topic." />

    <div className="flex flex-col gap-5">
      {libraryTopics.map((topic) => (
        <div key={topic.topic}>
          <div className="text-white font-semibold mb-1.5">{topic.topic}</div>
          {topic.items.map((item, itemIndex) => {
            const isLast = itemIndex === topic.items.length - 1;
            return (
              <div key={item.url}>
                <div className="flex gap-2 items-baseline flex-wrap">
                  <span className="text-gray-600 shrink-0" aria-hidden="true">
                    {isLast ? '└──' : '├──'}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    {item.title}
                  </a>
                  {item.tag && (
                    <span className="text-[10px] uppercase tracking-wide text-green-400 border border-green-500/40 rounded px-1.5 py-px">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600 shrink-0" aria-hidden="true">
                    {isLast ? '   ' : '│  '}
                  </span>
                  <span className="text-gray-400 text-sm">{item.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Writings
 * ------------------------------------------------------------------ */

export interface WritingPost {
  title: string;
  date: string;
  content: string;
  url?: string;
}

// Add new posts here as they're written.
export const writingsPosts: WritingPost[] = [];

export const WritingsSection = ({
  onSelect,
}: {
  onSelect: (post: WritingPost) => void;
}) => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Writings" subtitle="Notes and posts." />
    <div className="flex flex-col gap-3">
      {writingsPosts.map((post) => (
        <button
          key={post.title}
          type="button"
          onClick={() => onSelect(post)}
          className="text-left w-fit group"
        >
          <span className="text-blue-400 group-hover:text-blue-300 underline underline-offset-2">
            {post.title}
          </span>
          <span className="text-gray-500 text-sm ml-2">{post.date}</span>
        </button>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ *
 * Help
 * ------------------------------------------------------------------ */

interface HelpCommand {
  cmd: string;
  desc: string;
  group: 'Me' | 'Work' | 'Terminal';
}

export const helpCommands: HelpCommand[] = [
  { cmd: 'about', desc: 'Who I am, in short', group: 'Me' },
  { cmd: 'tldr', desc: 'The one-paragraph version', group: 'Me' },
  { cmd: 'interests', desc: 'Chess, tennis, and elsewhere', group: 'Me' },
  { cmd: 'socials', desc: 'Where to find me', group: 'Me' },

  { cmd: 'experience', desc: 'Roles, start to now', group: 'Work' },
  { cmd: 'volunteering', desc: 'Societies, programmes & expeditions', group: 'Work' },
  { cmd: 'projects', desc: 'Things I have built', group: 'Work' },
  { cmd: 'library', desc: 'Curated links, filed by topic', group: 'Work' },
  { cmd: 'writings', desc: 'Notes and posts', group: 'Work' },

  { cmd: 'clear', desc: 'Clear the terminal', group: 'Terminal' },
];

const helpGroups: HelpCommand['group'][] = ['Me', 'Work', 'Terminal'];

export const HelpMenu = ({ onRun }: { onRun: (cmd: string) => void }) => (
  <div className="my-1 max-w-2xl">
    <SectionHeading title="Available commands" subtitle="Click one, or type it below." />

    <div className="flex flex-col gap-5">
      {helpGroups.map((group) => (
        <div key={group}>
          <div className="text-gray-600 text-[10px] uppercase tracking-widest mb-1.5">
            {group}
          </div>
          <div className="flex flex-col gap-1">
            {helpCommands
              .filter((c) => c.group === group)
              .map(({ cmd, desc }) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => onRun(cmd)}
                  className="flex gap-4 text-left w-full hover:bg-white/5 rounded px-1 -mx-1 py-0.5 transition-colors"
                >
                  <span className="text-green-400 w-32 shrink-0">{cmd}</span>
                  <span className="text-gray-400 text-sm">{desc}</span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>

    <p className="text-gray-600 text-xs mt-5 leading-relaxed">
      <kbd className="text-gray-400">Tab</kbd> completes ·{' '}
      <kbd className="text-gray-400">↑</kbd>/<kbd className="text-gray-400">↓</kbd> recalls
      history · <kbd className="text-gray-400">Ctrl</kbd>+
      <kbd className="text-gray-400">L</kbd> clears
    </p>
  </div>
);

/* ------------------------------------------------------------------ *
 * The wanderer
 * ------------------------------------------------------------------ */

// The original pencil drawing, recoloured to the site green with the paper
// background knocked out to alpha.
const Wanderer = ({ className = '' }: { className?: string }) => (
  <img src={wandererArt} alt="" aria-hidden="true" className={className} />
);

const SMOKE_PUFFS = ['~', 'o', '°', '~', '∘', 'o'];

// Pipe smoke, in ASCII, drifting up and off to the left.
const PipeSmoke = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {SMOKE_PUFFS.map((char, index) => (
      <span
        key={index}
        className="smoke-puff absolute text-green-500/70 text-[10px] leading-none"
        style={{
          // the pipe bowl sits about a third across, a little under halfway down
          left: '32%',
          top: '41%',
          animationDelay: `${index * 0.9}s`,
        }}
      >
        {char}
      </span>
    ))}
  </div>
);

export const EmptyState = ({ message = 'gone fishing' }: { message?: string }) => (
  <div className="my-1">
    <div className="relative w-32">
      <Wanderer className="wanderer w-32" />
      <PipeSmoke />
    </div>
    <div className="text-gray-500 mt-1">{message}</div>
  </div>
);

export const WandererCorner = () => (
  <div className="fixed bottom-3 right-4 z-40 select-none pointer-events-none hidden md:block">
    <div className="relative w-36 opacity-90">
      <Wanderer className="wanderer w-36" />
      <PipeSmoke />
    </div>
  </div>
);
