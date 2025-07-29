import { useEffect, useState, useRef } from 'react';

const HUD_WIDTH = 240;
const HUD_HEIGHT = 150; // Increased to fit the animated bar chart
const BAR_CHART_BARS = 12;
const BAR_CHART_HEIGHT = 70;
const BAR_CHART_LABEL_SPACE = 18; // Space for labels below bars
const BAR_CHART_COLORS = {
  bar: '#00fff7',
  barGlow: 'rgba(0,255,247,0.18)',
  grid: 'rgba(0,255,247,0.08)',
};

const DataVisualization = () => {
  const [metrics, setMetrics] = useState({
    cpu: 67,
    memory: 84,
    network: 45,
  });

  const [bars, setBars] = useState([10, 18, 28, 36, 44, 52, 60, 68, 60, 52, 36, 20]);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    let anim = 0;
    function animate() {
      anim += 0.012;
      if (anim > 1.05) anim = 0;
      setProgress(anim);
      animationRef.current = setTimeout(animate, 24);
    }
    animate();
    return () => animationRef.current && clearTimeout(animationRef.current);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMetrics((prev) => {
        return {
          cpu: Math.max(30, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(40, Math.min(98, prev.memory + (Math.random() - 0.5) * 8)),
          network: Math.max(20, Math.min(80, prev.network + (Math.random() - 0.5) * 15)),
        };
      });
    }, 2000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  const BarChart = ({ value, label, color }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`${color}`}>{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-muted/30 h-1 rounded">
        <div
          className={`h-1 rounded transition-all duration-1000 ${
            color === 'text-cyber-success'
              ? 'bg-cyber-success'
              : color === 'text-cyber-warning'
              ? 'bg-cyber-warning'
              : 'bg-primary'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="fixed z-20"
      style={{
        position: 'fixed',
        right: 18,
        top: 'calc(50% - 280px)',
        width: HUD_WIDTH,
        height: HUD_HEIGHT,
        pointerEvents: 'auto',
      }}
    >
      <div
        className="hud-overlay border-0 p-3 space-y-2 shadow-xl relative overflow-hidden bg-transparent"
        style={{ width: HUD_WIDTH, height: HUD_HEIGHT, minHeight: HUD_HEIGHT }}
      >
        {/* Animated scan line overlay */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0">
          <div className="absolute left-0 top-0 w-full h-0.5 animate-scan" style={{ animationDuration: '2.5s' }} />
          <div
            className="absolute left-0 bottom-0 w-full h-0.5 animate-scan"
            style={{ animationDuration: '3.2s', animationDirection: 'reverse' }}
          />
        </div>

        <div className="flex items-center gap-2 border-b border-primary/20 pb-1 z-10 relative">
          <div className="w-2 h-2 animate-pulse rounded-full" />
          <span className="text-xs font-mono text-primary">SYSTEM METRICS</span>
        </div>

        <div className="space-y-2 z-10 relative">
          <BarChart
            value={metrics.cpu}
            label="CPU LOAD"
            color={metrics.cpu > 80 ? 'text-cyber-warning' : 'text-cyber-success'}
          />
          <BarChart
            value={metrics.memory}
            label="MEMORY"
            color={metrics.memory > 90 ? 'text-cyber-warning' : 'text-primary'}
          />
          <BarChart value={metrics.network} label="NETWORK" color="text-cyber-success" />
        </div>

        {/* Optional animated chart (commented out)
        <div className="pt-2 z-10 relative">
          <AnimatedBarChart bars={bars} progress={progress} />
        </div>
        */}
      </div>
    </div>
  );
};

export default DataVisualization;
