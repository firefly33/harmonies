import { useCallback, useEffect, useRef } from 'react';
import type {CardPattern} from "../types/Card.ts";

interface CardCanvasProps {
  pattern: CardPattern;
  width?: number;
  height?: number;
  hexSize?: number;
}

const CardCanvas = ({ pattern, width = 150, height = 120, hexSize = 12 }: CardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToPixel = useCallback((q: number, r: number, centerX: number, centerY: number) => {
    const x = hexSize * (3/2 * q);
    const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return {
      x: x + centerX,
      y: y + centerY
    };
  }, [hexSize]);

  const drawHexagon = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hexX = x + size * Math.cos(angle);
      const hexY = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(hexX, hexY);
      } else {
        ctx.lineTo(hexX, hexY);
      }
    }
    ctx.closePath();
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate center position
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw each cell in the pattern
    pattern.cells.forEach(cell => {
      const pixel = hexToPixel(cell.coord.q, cell.coord.r, centerX, centerY);

      // Draw hexagon background
      drawHexagon(ctx, pixel.x, pixel.y, hexSize);
      ctx.fillStyle = '#F5DEB3'; // Plain terrain color
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw tokens if they exist
      if (cell.tokens.length > 0) {
        cell.tokens.forEach((token, index) => {
          // Stack tokens with slight offset
          const offsetX = index * 1.5;
          const offsetY = index * -1.5;
          const radius = hexSize * 0.6 - (index * 1);

          ctx.beginPath();
          ctx.arc(pixel.x + offsetX, pixel.y + offsetY, Math.max(radius, 4), 0, Math.PI * 2);
          ctx.fillStyle = token.color;
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Show icon for top token only
          if (index === cell.tokens.length - 1 && radius > 6) {
            ctx.fillStyle = '#FFF';
            ctx.font = `${Math.max(6, hexSize * 0.4)}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(token.type[0].toUpperCase(), pixel.x + offsetX, pixel.y + offsetY);
          }
        });

        // Stack count indicator
        if (cell.tokens.length > 1 && hexSize > 8) {
          ctx.fillStyle = '#FF0000';
          ctx.font = `${Math.max(4, hexSize * 0.3)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            cell.tokens.length.toString(),
            pixel.x + hexSize * 0.4,
            pixel.y - hexSize * 0.4
          );
        }
      }
    });
  }, [pattern, width, height, hexSize, hexToPixel, drawHexagon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-300 rounded"
      style={{
        imageRendering: 'crisp-edges',
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default CardCanvas;
