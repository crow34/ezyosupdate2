import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface VNCDisplayProps {
  connectionDetails: {
    host: string;
    port: number;
    password?: string;
  };
}

const VNCDisplay: React.FC<VNCDisplayProps> = ({ connectionDetails }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulate remote desktop display
    const drawDesktop = () => {
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Draw background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw taskbar
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

      // Draw start button
      ctx.fillStyle = '#404040';
      ctx.fillRect(8, canvas.height - 32, 48, 24);

      // Draw some window
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(50, 50, 400, 300);
      ctx.fillStyle = '#404040';
      ctx.fillRect(50, 50, 400, 30);

      // Draw time
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      const time = new Date().toLocaleTimeString();
      ctx.fillText(time, canvas.width - 70, canvas.height - 15);
    };

    drawDesktop();
    const interval = setInterval(drawDesktop, 1000);

    return () => clearInterval(interval);
  }, [connectionDetails]);

  return (
    <div className="relative h-full bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full">
        {connectionDetails.host}:{connectionDetails.port}
      </div>
    </div>
  );
};

export default VNCDisplay;