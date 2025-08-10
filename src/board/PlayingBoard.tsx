import {type ReactElement, useCallback, useEffect, useRef, useState} from 'react'
import { BiWater } from 'react-icons/bi';
import {LuEarth, LuHouse, LuMountain, LuTrees} from "react-icons/lu";
import { GiCorn } from 'react-icons/gi';
import { canPlaceToken, type Token, type TokenType } from '../utils/can-be-placed';

interface HexagonCoord {
  q: number;
  r: number;
}

interface PixelCoord {
  x: number;
  y: number;
}


interface GridCell {
  coord: HexagonCoord;
  pixel: PixelCoord;
  tokens: Token[];
  terrain:  'plain'; // | 'water' | 'forest' | 'mountain';
}

const HEX_SIZE = 50;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const GRID_CENTER_X = CANVAS_WIDTH / 2;
const GRID_CENTER_Y = CANVAS_HEIGHT / 2;

// Grille hexagonale d'Harmonies - 23 cases (5-4-5-4-5 par colonne)
const GRID_LAYOUT: HexagonCoord[] = [
  // Colonne 1 (5 cases) - q = -2
  { q: -2, r: -1 }, { q: -2, r: 0 }, { q: -2, r: 1 }, { q: -2, r: 2 }, { q: -2, r: 3 },
  // Colonne 2 (4 cases) - q = -1
  { q: -1, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: -1, r: 2 },
  // Colonne 3 (5 cases) - q = 0 (centre)
  { q: 0, r: -2 }, { q: 0, r: -1 }, { q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 },
  // Colonne 4 (4 cases) - q = 1
  { q: 1, r: -2 }, { q: 1, r: -1 }, { q: 1, r: 0 }, { q: 1, r: 1 },
  // Colonne 5 (5 cases) - q = 2
  { q: 2, r: -3 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }, { q: 2, r: 1 }
];

// Utilitaires hexagonaux
const hexToPixel = (q: number, r: number): PixelCoord => {
  const x = HEX_SIZE * (3/2 * q);
  const y = HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
  return {
    x: x + GRID_CENTER_X,
    y: y + GRID_CENTER_Y
  };
};

const pixelToHex = (x: number, y: number): HexagonCoord => {
  const relativeX = x - GRID_CENTER_X;
  const relativeY = y - GRID_CENTER_Y;

  const q = (2/3 * relativeX) / HEX_SIZE;
  const r = (-1/3 * relativeX + Math.sqrt(3)/3 * relativeY) / HEX_SIZE;

  return roundHex(q, r);
};

const roundHex = (q: number, r: number): HexagonCoord => {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
};


const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
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
};

// Tokens inspirés d'Harmonies (couleurs du vrai jeu)
const AVAILABLE_TOKENS: Token[] = [
  { id: '1', type: 'tree', color: '#228B22' },     // Vert - Arbres
  { id: '2', type: 'house', color: '#CD853F' },    // Rouge/Orange - Bâtiments
  { id: '3', type: 'water', color: '#4682B4' },    // Bleu - Eau
  { id: '4', type: 'mountain', color: '#708090' }, // Gris - Montagnes
  { id: '5', type: 'field', color: '#DAA520' },    // Jaune - Champs
  { id: '6', type: 'brown', color: '#8B4513' }     // Marron - Base pour arbres
];

const PlayingBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Map<string, GridCell>>(new Map());
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Initialisation de la grille
  useEffect(() => {
    const initialGrid = new Map<string, GridCell>();

    GRID_LAYOUT.forEach((coord, __index) => {
      const key = `${coord.q},${coord.r}`;
      const pixel = hexToPixel(coord.q, coord.r);
      //const terrains = ['forest', 'plain', 'water', 'mountain'] as const;

      initialGrid.set(key, {
        coord,
        pixel,
        tokens: [],
        terrain: 'plain'
      });
    });

    setGrid(initialGrid);
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Effacer le canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dessiner chaque cellule
    grid.forEach((cell, key) => {
      const { pixel, tokens, terrain } = cell;

      // Couleur de terrain
      const terrainColors = {
        forest: '#90EE90',
        plain: '#F5DEB3',
        water: '#87CEEB',
        mountain: '#D3D3D3'
      };

      // Dessiner l'hexagone
      drawHexagon(ctx, pixel.x, pixel.y, HEX_SIZE);

      // Colorer le terrain
      ctx.fillStyle = terrainColors[terrain];
      ctx.fill();

      // Bordure avec indication de validité
      let strokeColor = '#333';
      let lineWidth = 1;

      if (hoveredCell === key) {
        if (selectedToken && !canPlaceToken(selectedToken, tokens)) {
          strokeColor = '#FF0000'; // Rouge pour invalid
          lineWidth = 3;
        } else if (selectedToken) {
          strokeColor = '#00FF00'; // Vert pour valid
          lineWidth = 3;
        } else {
          strokeColor = '#FF6B6B'; // Rose pour hover sans token
          lineWidth = 3;
        }
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Dessiner les tokens s'ils existent
      if (tokens.length > 0) {
        tokens.forEach((token, index) => {
          // Offset pour créer un effet de pile
          const offsetX = index * 3;
          const offsetY = index * -3;
          const radius = HEX_SIZE * 0.6 - (index * 2);

          ctx.beginPath();
          ctx.arc(pixel.x + offsetX, pixel.y + offsetY, Math.max(radius, 15), 0, Math.PI * 2);
          ctx.fillStyle = token.color;
          ctx.fill();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Icône du token (seulement pour le token du dessus)
          if (index === tokens.length - 1) {
            ctx.fillStyle = '#FFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(token.type[0].toUpperCase(), pixel.x + offsetX, pixel.y + offsetY);
          }
        });

        // Afficher le nombre de tokens si plus d'un
        if (tokens.length > 1) {
          ctx.fillStyle = '#FF0000';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tokens.length.toString(), pixel.x + HEX_SIZE * 0.5, pixel.y - HEX_SIZE * 0.5);
        }
      }

      // Coordonnées pour debug
      ctx.fillStyle = '#333';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${cell.coord.q},${cell.coord.r}`, pixel.x, pixel.y + HEX_SIZE + 15);
    });
  }, [grid, hoveredCell, selectedToken]);

  // Effet de rendu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [draw]);

  // Gestion des clics
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedToken) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hexCoord = pixelToHex(x, y);
    const key = `${hexCoord.q},${hexCoord.r}`;
    const cell = grid.get(key);

    if (cell && canPlaceToken(selectedToken, cell.tokens)) {
      setGrid(prev => {
        const newGrid = new Map(prev);
        const updatedCell = { ...cell, tokens: [...cell.tokens, selectedToken] };
        newGrid.set(key, updatedCell);
        return newGrid;
      });
      setSelectedToken(null);
    }
  }, [selectedToken, grid]);

// Gestion du survol
  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hexCoord = pixelToHex(x, y);
    const key = `${hexCoord.q},${hexCoord.r}`;

    if (grid.has(key)) {
      setHoveredCell(key);
    } else {
      setHoveredCell(null);
    }
  }, [grid]);

  const tokenIcon: Record<TokenType, ReactElement> = {
    'mountain' : <LuMountain className="w-[1.5rem] h-[1.5rem]" />,
    'tree': <LuTrees className="w-[1.5rem] h-[1.5rem]" />,
    'house': <LuHouse className="w-[1.5rem] h-[1.5rem]" />,
    'water': <BiWater className="w-[1.5rem] h-[1.5rem]" />,
    field: <GiCorn className="w-[1.5rem] h-[1.5rem]" />,
    brown: <LuEarth className="w-[1.5rem] h-[1.5rem]" />
  }
  return (
      <div className="flex flex-col items-center justify-center">
        {/* Panel de tokens */}
        <div className="mb-4 flex gap-2">
          {AVAILABLE_TOKENS.map(token => (
              <button
                  key={token.id}
                  onClick={() => setSelectedToken(selectedToken?.id === token.id ? null : token)}
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-white font-bold ${
                      selectedToken?.id === token.id
                          ? 'border-red-500 ring-2 ring-red-300'
                          : 'border-gray-400'
                  }`}
                  style={{ backgroundColor: token.color }}
              >
                <div className="flex justify-center items-center">{tokenIcon[token.type]}</div>
              </button>
          ))}
        </div>
        {selectedToken && (
            <p className="mb-4 text-gray-600">
              Token sélectionné: <span className="font-semibold">{selectedToken.type}</span>
            </p>
        )}

        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredCell(null)}
            className="border-2 border-gray-400 rounded-lg shadow-lg cursor-pointer bg-white"
        />

        <div className="mt-4 text-sm text-gray-600 max-w-lg text-center">
          <p>Sélectionnez un token puis cliquez sur une case pour le placer.</p>
          <div className="mt-2 text-xs">
            <p><strong>Règles d'empilement :</strong></p>
            <ul className="text-left inline-block">
              <li>• Maximum 3 tokens par pile</li>
              <li>• Montagnes : empilables partout (3 max)</li>
              <li>• Arbres : uniquement sur 1-2 tokens marron</li>
              <li>• Champs/Eau : niveau sol uniquement</li>
              <li>• Bâtiments : sol ou sur marron/montagne/bâtiment</li>
            </ul>
          </div>
          <p className="mt-2">Bordure verte = placement valide, rouge = invalide</p>
        </div>
      </div>
  )
}
export default PlayingBoard
