import { useEffect, useState } from 'react';

const HUD_WIDTH = 240; // Match DataVisualization HUD width
const HUD_HEIGHT = 90; // Set a fixed height for the circular bar area

const TOTAL_PYTHON = 5000;
const TOTAL_SQL = 5000;
const SOLVED_PYTHON = 3500;
const SOLVED_SQL = 4000;

const CIRCLE_SIZE = 70;
const STROKE_WIDTH = 7;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function AnimatedCircle({
  solved,
  total,
  color,
  label,
})
  
{
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let current = 0;
    const target = solved;
    const step = Math.max(1, Math.floor(target / 60));
    function animate() {
      current += step;
      if (current >= target) current = target;
      setProgress(current);
      if (current < target) setTimeout(animate, 18);
    }
    animate();
    // eslint-disable-next-line
  }, [solved]);

  const percent = Math.round((progress / total) * 100);
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div
      className="relative flex flex-col items-center justify-center group cursor-pointer"
      style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke="#222b"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.3s linear',
            // filter: ``,
          }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs font-mono text-primary">{label}</span>
        <span className="text-sm font-bold text-cyan-400">{percent}%</span>
      </div>
      {hovered && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 px-2 py-1 rounded bg-transparent text-cyan-300 text-xs font-mono shadow-lg z-10">
          {progress} / {total} questions solved
        </div>
      )}
    </div>
  );
}

const QuestionProgressCircle = () => (
  <div
    className="fixed z-50"
    style={{
      right: 18,
      top: 'calc(50% - 120px)', // Position below DataVisualization
      width: HUD_WIDTH,
      height: HUD_HEIGHT,
      pointerEvents: 'auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      background: 'transparent',
    }}
  >
    <AnimatedCircle
      solved={SOLVED_PYTHON}
      total={TOTAL_PYTHON}
      color="#00fff7"
      label="Python"
    />
    <AnimatedCircle
      solved={SOLVED_SQL}
      total={TOTAL_SQL}
      color="#00ff00"
      label="SQL"
    />
  </div>
);

export default QuestionProgressCircle;