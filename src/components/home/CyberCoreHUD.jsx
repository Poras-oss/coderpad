import React, { useEffect, useRef } from 'react';

const CyberCoreHUD = ({ style }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 200, height = 200;
    let dpr = window.devicePixelRatio || 1;
    function resize() {
      width = 180; height = 180;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);
    let t0 = performance.now();
    function draw(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, width, height);
      // Central core
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.beginPath();
      ctx.arc(0, 0, 22 + Math.sin(t*2)*2, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(0,255,247,0.18)';
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
      // Rotating rings
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.translate(width/2, height/2);
        ctx.rotate(t * (0.4 + i*0.2) + i);
        ctx.beginPath();
        ctx.arc(0, 0, 48 + i*18, Math.PI*0.1, Math.PI*1.9);
        ctx.strokeStyle = `rgba(0,255,247,${0.13 + 0.07*i})`;
        ctx.lineWidth = 2 + i;
        ctx.shadowColor = '#4dd0e1';
        ctx.shadowBlur = 8 + i*2;
        ctx.stroke();
        ctx.restore();
      }
      // Rotating arc segments
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(width/2, height/2);
        ctx.rotate(t * 1.2 + i * Math.PI/2);
        ctx.beginPath();
        ctx.arc(0, 0, 80, Math.PI*0.05, Math.PI*0.22);
        ctx.strokeStyle = 'rgba(0,255,247,0.22)';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#4dd0e1';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }
      // Scan line
      ctx.save();
      ctx.translate(width/2, height/2);
      const scanAngle = (t*1.1) % (2*Math.PI);
      ctx.rotate(scanAngle);
      ctx.beginPath();
      ctx.arc(0, 0, 70, -0.08, 0.08);
      ctx.strokeStyle = 'rgba(0,255,247,0.32)';
      ctx.lineWidth = 8;
      ctx.shadowColor = '#00fff7';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.strokeStyle = '#00fff7';
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(width/2, height/2, i*22, 0, 2*Math.PI);
        ctx.stroke();
      }
      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      left: 32,
      bottom: 32,
      width: 200,
      height: 200,
      zIndex: 40,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{
          zIndex: 2,
          background: 'transparent',
          filter: 'drop-shadow(0 0 16px #00fff7)',
          width: 200,
          height: 200,
        }}
      />
      {/* Subtle scanlines overlay */}
      <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'repeating-linear-gradient(to bottom, rgba(0,255,220,0.04) 0px, rgba(0,255,220,0.04) 1px, transparent 1px, transparent 4px)',
        mixBlendMode: 'lighten',
        animation: 'scan-move 2s linear infinite',
      }} />
      <style>{`
        @keyframes scan-move {
          0% { background-position-y: 0; }
          100% { background-position-y: 4px; }
        }
      `}</style>
    </div>
  );
  
};

export default CyberCoreHUD;