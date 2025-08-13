import {type ReactElement, useEffect, useState} from 'react'
import { BiWater } from 'react-icons/bi';
import {LuEarth, LuHouse, LuMountain, LuTrees} from "react-icons/lu";
import { GiCorn } from 'react-icons/gi';
import { type Token, type TokenType } from '../utils/can-be-placed';
import {calculatePoints, type GridCell, type HexCoord} from "../utils/points-calculation.ts";
import CardsDeck from "./cards-deck/CardsDeck.tsx";
import PlayingBoard3D from "../components/3D/PlayingBoard3D.tsx";

// Grille hexagonale d'Harmonies - 23 cases (5-4-5-4-5 par colonne)
// Layout forms a diamond/rhombus shape typical of the Harmonies board game
const GRID_LAYOUT: HexCoord[] = [
  // Column -2 (leftmost, 5 hexagons)
  { q: -2, r: 0 }, { q: -2, r: 1 }, { q: -2, r: 2 }, { q: -2, r: 3 }, { q: -2, r: 4 },
  
  // Column -1 (4 hexagons)  
  { q: -1, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: -1, r: 2 },
  
  // Column 0 (center, 5 hexagons)
  { q: 0, r: -2 }, { q: 0, r: -1 }, { q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 },
  
  // Column 1 (4 hexagons)
  { q: 1, r: -3 }, { q: 1, r: -2 }, { q: 1, r: -1 }, { q: 1, r: 0 },
  
  // Column 2 (rightmost, 5 hexagons)
  { q: 2, r: -4 }, { q: 2, r: -3 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }
];

// Tokens disponibles pour placement
const AVAILABLE_TOKENS: Token[] = [
  { id: '1', type: 'water', color: '#4A90E2' },      // Bleu - Eau
  { id: '2', type: 'field', color: '#F4D03F' },      // Jaune - Champ
  { id: '3', type: 'mountain', color: '#8E8E93' },   // Gris - Montagne
  { id: '4', type: 'tree', color: '#50C878' },       // Vert - Arbre
  { id: '5', type: 'house', color: '#E74C3C' },      // Rouge - Maison
  { id: '6', type: 'brown', color: '#8B4513' }       // Marron - Base pour arbres
];

const PlayingBoard = () => {
  const [grid, setGrid] = useState<Map<string, GridCell>>(new Map());
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>();

  // Initialisation de la grille
  useEffect(() => {
    const initialGrid = new Map<string, GridCell>();
    
    GRID_LAYOUT.forEach(coord => {
      const key = `${coord.q},${coord.r}`;
      initialGrid.set(key, {
        coord,
        pixel: { x: 0, y: 0 }, // Not used in 3D version
        tokens: [],
        terrain: 'plain'
      });
    });
    
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    setTotalPoints(calculatePoints(grid))
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

        <h2>Total points : {totalPoints}</h2>

        {/* 3D Board */}
        <div className="w-full h-96 border-2 border-gray-400 rounded-lg shadow-lg overflow-hidden">
          <PlayingBoard3D
            grid={grid}
            setGrid={setGrid}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600 max-w-lg text-center">
          <p>Sélectionnez un token puis cliquez sur une case pour le placer.</p>
          <div className="mt-2 text-xs">
            <p><strong>Règles d'empilement :</strong></p>
            <ul className="text-left inline-block">
              <li>• Maximum 3 tokens par pile</li>
              <li>• Montagnes : empilables partout (3 max)</li>
              <li>• Arbres : uniquement sur 1-2 tokens marron</li>
              <li>• Champs/Eau : au sol uniquement</li>
              <li>• Maisons : au sol ou sur marron/montagne/maisons (3 max)</li>
            </ul>
          </div>
        </div>

        <CardsDeck />
      </div>
  )
}

export default PlayingBoard;