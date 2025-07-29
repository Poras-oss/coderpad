import React, { useEffect, useRef } from 'react';

const GRID_SIZE = 220;
const GRID_DIVS = 10;
const PATH_POINTS = [
  [20, 200], [50, 100], [70, 160], [90, 60], [120, 100], [140, 30], [170, 70], [200, 10]
];

const LABELS = [
  { label: 'Learn SQL', point: PATH_POINTS[1] },
  { label: 'Practice Questions', point: PATH_POINTS[2] },
  { label: 'Create Own Quiz', point: PATH_POINTS[3] },
  { label: 'Join Live Quiz', point: PATH_POINTS[4] },
  { label: 'Join DS Community', point: PATH_POINTS[5] },
  { label: 'Play and Compete', point: PATH_POINTS[6] },
  { label: 'Get Job', point: PATH_POINTS[7] },
];

const DISTANCE_THRESHOLD = 12;
const LABEL_PADDING = 8;
const LABEL_OFFSET = 8;

function getPathD(points) {
  return points.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
}

function getDistance(p1, p2) {
  return Math.hypot(p1.x - p2[0], p1.y - p2[1]);
}

function getSmartLabelPosition(point, labelText, fontSize = 10) {
  const estimatedTextWidth = labelText.length * fontSize * 0.6;
  const textHeight = fontSize;

  let x = point[0] + LABEL_OFFSET;
  let y = point[1] - LABEL_OFFSET;

  if (x + estimatedTextWidth > GRID_SIZE - LABEL_PADDING) {
    x = point[0] - LABEL_OFFSET - estimatedTextWidth;
  }

  if (x < LABEL_PADDING) {
    x = LABEL_PADDING;
  }

  if (y - textHeight < LABEL_PADDING) {
    y = point[1] + LABEL_OFFSET + textHeight;
  }

  if (y > GRID_SIZE - LABEL_PADDING) {
    y = GRID_SIZE - LABEL_PADDING;
  }

  return { x, y };
}

const PathTrackerHUD = ({ style }) => {
  const pathRef = useRef(null);
  const tracerRef = useRef(null);
  const headRef = useRef(null);
  const labelRefs = useRef([]);

  useEffect(() => {
    let frame;
    let t = 0;

    const animate = () => {
      t = (t + 0.002) % 1;
      const path = pathRef.current;
      const tracer = tracerRef.current;
      const head = headRef.current;

      if (path && tracer && head) {
        const totalLength = path.getTotalLength();
        const tracerLength = totalLength * 0.18;
        const tracerStart = totalLength * t;

        tracer.setAttribute('stroke-dasharray', `${tracerLength} ${totalLength}`);
        tracer.setAttribute('stroke-dashoffset', `${-tracerStart}`);

        const headPoint = path.getPointAtLength(Math.min(tracerStart + tracerLength, totalLength - 1));
        head.setAttribute('cx', headPoint.x.toString());
        head.setAttribute('cy', headPoint.y.toString());

        LABELS.forEach(({ point, label }, i) => {
          const distance = getDistance(headPoint, point);
          const labelEl = labelRefs.current[i];
          if (labelEl) {
            const isVisible = distance < DISTANCE_THRESHOLD;
            labelEl.setAttribute('opacity', isVisible ? '1' : '0');

            if (isVisible) {
              const position = getSmartLabelPosition(point, label);
              labelEl.setAttribute('x', position.x.toString());
              labelEl.setAttribute('y', position.y.toString());
            }
          }
        });
      }

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        right: 12,
        bottom: 145,
        width: GRID_SIZE + 16,
        height: GRID_SIZE + 14,
        zIndex: 50,
        pointerEvents: 'none',
        ...style,
      }}
      className="select-none"
    >
      <div
        className="hud-overlay border-0 shadow-xl p-2 bg-transparent"
        style={{ width: GRID_SIZE + 16, height: GRID_SIZE + 32 }}
      >
        <svg width={GRID_SIZE} height={GRID_SIZE} style={{ display: 'block', margin: '0 auto' }}>
          {[...Array(GRID_DIVS + 1)].map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              x2={GRID_SIZE}
              y1={(i * GRID_SIZE) / GRID_DIVS}
              y2={(i * GRID_SIZE) / GRID_DIVS}
              stroke="#00fff7"
              opacity={0.08}
              strokeWidth={1}
            />
          ))}
          {[...Array(GRID_DIVS + 1)].map((_, i) => (
            <line
              key={`v${i}`}
              y1={0}
              y2={GRID_SIZE}
              x1={(i * GRID_SIZE) / GRID_DIVS}
              x2={(i * GRID_SIZE) / GRID_DIVS}
              stroke="#00fff7"
              opacity={0.08}
              strokeWidth={1}
            />
          ))}

          {/* Axes */}
          <line x1={0} y1={GRID_SIZE} x2={GRID_SIZE} y2={GRID_SIZE} stroke="#00fff7" strokeWidth={2} opacity={0.5} />
          <polygon points={`${GRID_SIZE},${GRID_SIZE} ${GRID_SIZE - 10},${GRID_SIZE - 5} ${GRID_SIZE - 10},${GRID_SIZE + 5}`} fill="#00fff7" opacity={0.7} />
          <line x1={0} y1={GRID_SIZE} x2={0} y2={0} stroke="#00fff7" strokeWidth={2} opacity={0.5} />
          <polygon points={`0,0 -5,10 5,10`} fill="#00fff7" opacity={0.7} />

          {/* Static path */}
          <path ref={pathRef} d={getPathD(PATH_POINTS)} stroke="#00fff7" strokeWidth={2} opacity={0.18} fill="none" />

          {/* Animated tracer */}
          <path
            ref={tracerRef}
            d={getPathD(PATH_POINTS)}
            stroke="#00fff7"
            strokeWidth={3}
            fill="none"
            style={{ filter: 'drop-shadow(0 0 8px #00fff7cc)' }}
          />

          {/* Glowing head */}
          <circle
            ref={headRef}
            r={6}
            fill="#00fff7"
            opacity={0.85}
            style={{ filter: 'drop-shadow(0 0 12px #00fff7cc)' }}
          />

          {/* Floating labels */}
          {LABELS.map(({ label, point }, i) => {
            const initialPosition = getSmartLabelPosition(point, label);

            return (
              <text
                key={i}
                ref={(el) => (labelRefs.current[i] = el)}
                x={initialPosition.x}
                y={initialPosition.y}
                fill="#00fff7"
                fontSize="10"
                opacity={0}
                style={{
                  transition: 'opacity 0.3s ease-in-out',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                }}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default PathTrackerHUD;
