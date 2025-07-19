import { useEffect, useRef } from 'react';

const PythonText3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const rotationY = elapsed * 30; // 30 degrees per second
      const rotationX = Math.sin(elapsed * 0.5) * 10; // Gentle X oscillation

      container.style.transform = `
        perspective(1000px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
        translateZ(0)
      `;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const pythonElements = [
    { text: 'def', top: '10%', left: '15%', color: '#ff6b35' },
    { text: 'class', top: '20%', left: '75%', color: '#f7931e' },
    { text: 'import', top: '60%', left: '10%', color: '#ffd23f' },
    { text: 'from', top: '70%', left: '80%', color: '#00ff41' },
    { text: 'if', top: '25%', left: '5%', color: '#06ffa5' },
    { text: 'else:', top: '45%', left: '85%', color: '#0080ff' },
    { text: 'for', top: '80%', left: '20%', color: '#8000ff' },
    { text: 'return', top: '15%', left: '85%', color: '#ff00ff' },
    { text: '==', top: '35%', left: '10%', color: '#ff4081' },
    { text: '!=', top: '55%', left: '90%', color: '#ff5722' },
    { text: '[]', top: '75%', left: '5%', color: '#4caf50' },
    { text: '()', top: '30%', left: '95%', color: '#2196f3' },
    { text: ':', top: '50%', left: '5%', color: '#9c27b0' },
    { text: '#', top: '85%', left: '85%', color: '#607d8b' },
  ];

  return (
    <div className="w-full h-64 bg-black relative overflow-hidden flex items-center justify-center">
      {/* Floating Python syntax elements */}
      {pythonElements.map((element, i) => (
        <div
          key={i}
          className="absolute text-sm font-mono opacity-70 pointer-events-none"
          style={{
            top: element.top,
            left: element.left,
            color: element.color,
            animation: `float-${i % 3} ${3 + (i % 2)}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          {element.text}
        </div>
      ))}

      {/* Main rotating text */}
      <div
        ref={containerRef}
        className="relative font-mono text-green-400"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* EVAN text */}
        <div
          className="text-4xl font-bold mb-2 text-center"
          style={{
            textShadow: `
              1px 1px 0 #000,
              2px 2px 0 #333,
              3px 3px 0 #555,
              4px 4px 10px rgba(0, 255, 65, 0.5)
            `,
            transform: 'translateZ(20px)',
          }}
        >
          EVAN
        </div>

        {/* LYNCH text */}
        <div
          className="text-4xl font-bold text-center"
          style={{
            textShadow: `
              1px 1px 0 #000,
              2px 2px 0 #333,
              3px 3px 0 #555,
              4px 4px 10px rgba(0, 255, 65, 0.5)
            `,
            transform: 'translateZ(20px)',
          }}
        >
          LYNCH
        </div>

        {/* Python syntax decorations around the name */}
        <div
          className="absolute -top-6 -left-4 text-yellow-400 text-lg"
          style={{ transform: 'translateZ(30px)' }}
        >
          def
        </div>
        <div
          className="absolute -top-6 -right-4 text-blue-400 text-lg"
          style={{ transform: 'translateZ(30px)' }}
        >
          ():
        </div>
        <div
          className="absolute -bottom-4 left-0 text-orange-400 text-sm"
          style={{ transform: 'translateZ(25px)' }}
        >
          return
        </div>
        <div
          className="absolute -bottom-4 right-0 text-purple-400 text-sm"
          style={{ transform: 'translateZ(25px)' }}
        >
          "success"
        </div>
      </div>

    </div>
  );
};

export default PythonText3D;