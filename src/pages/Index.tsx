import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AboutSection,
  EmptyState,
  ExperienceTimeline,
  HelpMenu,
  InterestsSection,
  LibrarySection,
  ProjectsSection,
  SocialsSection,
  TldrSection,
  VolunteeringSection,
  WandererCorner,
  WritingsSection,
  helpCommands,
  writingsPosts,
  type WritingPost,
} from '../terminal/sections';

/** A section rendered as a component rather than plain text. */
type View =
  | 'help'
  | 'about'
  | 'tldr'
  | 'experience'
  | 'volunteering'
  | 'projects'
  | 'interests'
  | 'socials'
  | 'library'
  | 'writings'
  | 'empty';

interface Command {
  input: string;
  /** Plain-text output, used for errors and one-liners. */
  output: string[];
  /** Set only when the command actually ran — keeps the help gate honest. */
  view?: View;
  timestamp: Date;
}

/** Every command the terminal accepts, including the undocumented ones. */
const ALL_COMMANDS = [
  'help',
  ...helpCommands.map((c) => c.cmd),
  'whoami',
  'ls',
  'sudo',
];

/** Levenshtein distance, for "did you mean" suggestions. */
const editDistance = (a: string, b: string): number => {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev.splice(0, prev.length, ...curr);
  }
  return prev[b.length];
};

const closestCommand = (input: string): string | undefined => {
  let best: string | undefined;
  let bestScore = Infinity;
  for (const cmd of ALL_COMMANDS) {
    const score = editDistance(input, cmd);
    if (score < bestScore) {
      bestScore = score;
      best = cmd;
    }
  }
  return bestScore <= Math.max(2, Math.floor(input.length / 2)) ? best : undefined;
};

const longestCommonPrefix = (values: string[]): string => {
  if (values.length === 0) return '';
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (!value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
};

const Index = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<WritingPost | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [hasUsedHelp, setHasUsedHelp] = useState(false);

  // Submitted commands, oldest first — for ↑/↓ recall.
  const [commandLog, setCommandLog] = useState<string[]>([]);
  // -1 means "composing a new line"; otherwise an index into commandLog.
  const [logIndex, setLogIndex] = useState(-1);
  const draftRef = useRef('');

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Inline completion hint, fish-shell style.
  const trimmedInput = input.trim();
  const completion =
    trimmedInput.length > 0 && input === trimmedInput
      ? ALL_COMMANDS.find((c) => c.startsWith(trimmedInput) && c !== trimmedInput)
      : undefined;

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Keep the caret in the input unless a modal has focus
  useEffect(() => {
    if (inputRef.current && !showModal) inputRef.current.focus();
  }, [showModal, history]);

  // Follow the output as it grows
  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    const id = setTimeout(
      () => terminal.scrollTo({ top: terminal.scrollHeight, behavior: 'smooth' }),
      50
    );
    return () => clearTimeout(id);
  }, [history]);

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const command = cmd.toLowerCase();

      setCommandLog((prev) => [...prev, cmd]);
      setLogIndex(-1);

      // `clear` wipes the screen rather than appending to it.
      if (command === 'clear') {
        setHistory([]);
        return;
      }

      let output: string[] = [];
      let view: View | undefined;

      // Nothing but `help` works until `help` has been run once.
      if (!hasUsedHelp && command !== 'help') {
        output = [`Command not found: ${cmd}`, `Type 'help' to see available commands.`];
        setHistory((prev) => [...prev, { input: cmd, output, timestamp: new Date() }]);
        return;
      }

      switch (command) {
        case 'help':
          setHasUsedHelp(true);
          view = 'help';
          break;
        case 'about':
          view = 'about';
          break;
        case 'tldr':
          view = 'tldr';
          break;
        case 'experience':
          view = 'experience';
          break;
        case 'volunteering':
          view = 'volunteering';
          break;
        case 'projects':
          view = 'projects';
          break;
        case 'interests':
          view = 'interests';
          break;
        case 'socials':
          view = 'socials';
          break;
        case 'library':
          view = 'library';
          break;
        case 'writings':
          view = writingsPosts.length === 0 ? 'empty' : 'writings';
          break;

        // Undocumented, but people who live in terminals will try them.
        case 'ls':
          output = [ALL_COMMANDS.filter((c) => c !== 'sudo').join('   ')];
          break;
        case 'whoami':
          output = ['evan — MSc Engineering with Finance, UCL. Type `about` for more.'];
          break;
        case 'sudo':
          output = ['Nice try.'];
          break;

        default: {
          const suggestion = closestCommand(command);
          output = [
            `Command not found: ${cmd}`,
            suggestion
              ? `Did you mean '${suggestion}'? Type 'help' to see everything.`
              : `Type 'help' to see available commands.`,
          ];
        }
      }

      setHistory((prev) => [...prev, { input: cmd, output, view, timestamp: new Date() }]);
    },
    [hasUsedHelp]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L clears, like a real shell
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }
    // Ctrl+C abandons the current line
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setInput('');
      setLogIndex(-1);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = ALL_COMMANDS.filter((c) => c.startsWith(trimmedInput));
      if (trimmedInput.length === 0 || matches.length === 0) return;
      if (matches.length === 1) {
        setInput(matches[0]);
      } else {
        const prefix = longestCommonPrefix(matches);
        if (prefix.length > trimmedInput.length) setInput(prefix);
        else
          setHistory((prev) => [
            ...prev,
            { input: trimmedInput, output: [matches.join('   ')], timestamp: new Date() },
          ]);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandLog.length === 0) return;
      if (logIndex === -1) draftRef.current = input;
      const next = logIndex === -1 ? commandLog.length - 1 : Math.max(0, logIndex - 1);
      setLogIndex(next);
      setInput(commandLog[next]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (logIndex === -1) return;
      const next = logIndex + 1;
      if (next >= commandLog.length) {
        setLogIndex(-1);
        setInput(draftRef.current);
      } else {
        setLogIndex(next);
        setInput(commandLog[next]);
      }
      return;
    }

    // Accept the inline suggestion
    if (e.key === 'ArrowRight' && completion) {
      const atEnd =
        inputRef.current?.selectionStart === input.length &&
        inputRef.current?.selectionEnd === input.length;
      if (atEnd) {
        e.preventDefault();
        setInput(completion);
      }
    }
  };

  const renderView = (cmd: Command) => {
    switch (cmd.view) {
      case 'help':
        return <HelpMenu onRun={runCommand} />;
      case 'about':
        return <AboutSection />;
      case 'tldr':
        return <TldrSection />;
      case 'experience':
        return <ExperienceTimeline />;
      case 'volunteering':
        return <VolunteeringSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'interests':
        return <InterestsSection />;
      case 'socials':
        return <SocialsSection />;
      case 'library':
        return <LibrarySection />;
      case 'writings':
        return (
          <WritingsSection
            onSelect={(post) => {
              setSelectedPost(post);
              setShowModal(true);
            }}
          />
        );
      case 'empty':
        return <EmptyState />;
      default:
        return cmd.output.map((line, index) => (
          <div key={index} className="terminal-line text-gray-400">
            {line === '' ? ' ' : line}
          </div>
        ));
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 p-4 sm:p-6 font-mono relative">
      <WandererCorner />

      <div
        ref={terminalRef}
        className="h-screen overflow-y-auto terminal-container pb-24 md:pr-44"
        onClick={(e) => {
          // Don't steal focus from links/buttons inside the output
          if ((e.target as HTMLElement).closest('a,button')) return;
          inputRef.current?.focus();
        }}
      >
        {/* Wordmark */}
        <header className="mb-6 select-none">
          <div className="text-green-400 text-sm md:text-base leading-tight">
            <div>&lt;evan&gt;</div>
            <div>&lt;lynch&gt;</div>
            <div>&lt;terminal&gt;</div>
          </div>
        </header>

        <p className="mb-6 text-gray-400 text-sm">
          You've opened Evan's digital terminal. Type{' '}
          <button
            type="button"
            onClick={() => runCommand('help')}
            className="text-green-400 hover:text-green-300 underline underline-offset-2"
          >
            help
          </button>{' '}
          to explore.
        </p>

        {/* Output */}
        <div aria-live="polite">
          {history.map((cmd, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center mb-1">
                <span className="text-green-400 mr-2" aria-hidden="true">
                  λ
                </span>
                <span className="text-white">{cmd.input}</span>
              </div>
              {renderView(cmd)}
            </div>
          ))}
        </div>

        {/* Prompt */}
        <form onSubmit={handleSubmit} className="flex items-center mb-8">
          <span className="text-green-400 mr-2" aria-hidden="true">
            λ
          </span>
          <div className="flex-1 relative">
            <label htmlFor="terminal-input" className="sr-only">
              Type a command
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white outline-none w-full font-mono relative z-10"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="terminal-hint"
              style={{ caretColor: 'transparent' }}
            />

            {/* Inline completion hint */}
            {completion && (
              <span
                className="absolute top-0 text-gray-600 pointer-events-none font-mono select-none"
                style={{ left: `${input.length}ch` }}
                aria-hidden="true"
              >
                {completion.slice(input.length)}
              </span>
            )}

            {/* Block cursor — a thin caret when a suggestion sits under it */}
            <span
              className={`absolute top-0 text-green-400 pointer-events-none font-mono z-20 ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}
              style={{ left: `${input.length}ch` }}
              aria-hidden="true"
            >
              {completion ? '▏' : '█'}
            </span>
          </div>
        </form>

        <p id="terminal-hint" className="sr-only">
          Press Tab to complete a command, the up and down arrows to recall previous
          commands, and Control plus L to clear the screen.
        </p>
      </div>

      {/* Writing modal */}
      {showModal && selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPost.title}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-950 border border-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
                <p className="text-gray-500 text-sm">{selectedPost.date}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="text-gray-300 leading-relaxed">{selectedPost.content}</div>
            {selectedPost.url && (
              <a
                href={selectedPost.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline text-sm"
              >
                → Read the full post
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
