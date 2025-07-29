// import { Button } from '@/components/ui/button';
import { Button } from '../../components/ui/button';
// import { cn } from '@/lib/utils';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

const CyberButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  icon,
  type,
  style
}) => {
  const colors = ['#1FC4D6', '#FFFFFF'];
  const [bgIndex, setBgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev === 0 ? 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  let backgroundColor = colors[bgIndex];
  if (isHovered) {
    if (variant === 'primary') backgroundColor = '#ffffff';
    if (variant === 'secondary') backgroundColor = '#FFFFFF';
    if (variant === 'outline') backgroundColor = '#ffffff';
  }

  const baseClasses = "relative overflow-hidden font-mono font-bold tracking-wider transition-all duration-300 group";

  const variantClasses = {
    primary: `border-1 border-primary text-black hover:bg-white hover:text-background cyber-glow`,
    secondary: `border-1 border-accent text-black hover:bg-white hover:text-background cyber-glow`,
    outline: `bg-[#1FC4D6] border border-muted-foreground text-black hover:text-background cyber-glow`
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-12 py-6 text-lg"
  };

  return (
    <Button
      onClick={onClick}
      style={{ ...style, backgroundColor }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      type={type}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 scan-line opacity-0 group-hover:opacity-100" />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="flex items-center justify-center w-full h-full">{icon}</span>}
        {children}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity blur-sm" />
    </Button>
  );
};

export default CyberButton;
