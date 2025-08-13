import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, useCallback } from 'react';
import { canPlaceToken, type Token } from '../../utils/can-be-placed';
import { type GridCell, type HexCoord } from '../../utils/points-calculation';
import HexCell3D from './HexCell3D';

// Wooden board base component
const WoodenBoard = () => {
  return (
    <mesh position={[0, -0.15, 0]} receiveShadow>
      <boxGeometry args={[10, 0.3, 8]} />
      <meshStandardMaterial 
        color="#8B4513"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

// Table surface under the board
const TableSurface = () => {
  return (
    <mesh 
      position={[0, -0.4, 0]} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#2F1B14"
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
};

// Harmonies board layout - 23 cases in 5-4-5-4-5 pattern forming diamond shape
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

interface PlayingBoard3DProps {
  grid: Map<string, GridCell>;
  setGrid: React.Dispatch<React.SetStateAction<Map<string, GridCell>>>;
  selectedToken: Token | null;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | null>>;
}

const PlayingBoard3D = ({ grid, setGrid, selectedToken, setSelectedToken }: PlayingBoard3DProps) => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Convert hex coordinates to 3D world positions
  const hexToWorld = useCallback((q: number, r: number): [number, number, number] => {
    // For perfectly touching hexagons, use the minimum possible spacing
    const size = 1.9; // Distance between hex centers for touching (hex radius = 0.95)
    const x = size * (3/2 * q);
    const z = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return [x, 0, z];
  }, []);

  const handleCellClick = useCallback((coord: HexCoord) => {
    const key = `${coord.q},${coord.r}`;
    const cell = grid.get(key);

    if (selectedToken && cell && canPlaceToken(selectedToken, cell.tokens)) {
      setGrid(prev => {
        const newGrid = new Map(prev);
        const updatedCell = { ...cell, tokens: [...cell.tokens, selectedToken] };
        newGrid.set(key, updatedCell);
        return newGrid;
      });
      setSelectedToken(null);
    }
  }, [selectedToken, grid, setGrid, setSelectedToken]);

  const handleCellHover = useCallback((key: string, hovered: boolean) => {
    setHoveredCell(hovered ? key : null);
  }, []);

  return (
    <div className="w-full h-96 bg-gradient-to-b from-amber-50 to-orange-100">
      <Canvas
        camera={{ position: [0, 10, 8], fov: 50 }}
        shadows
      >
        {/* Realistic tabletop lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        
        {/* Warm point light for tabletop ambiance */}
        <pointLight
          position={[0, 8, 0]}
          intensity={0.5}
          color="#FFA500"
        />

        {/* Environment for realistic reflections */}
        <Environment preset="apartment" />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={4}
          maxDistance={15}
          target={[0, 0, 0]}
        />

        {/* Table surface */}
        <TableSurface />
        
        {/* Wooden board base */}
        <WoodenBoard />

        {/* Render hex grid */}
        {GRID_LAYOUT.map((coord) => {
          const key = `${coord.q},${coord.r}`;
          const cell = grid.get(key);
          const worldPos = hexToWorld(coord.q, coord.r);

          const isHovered = hoveredCell === key;
          const isValidPlacement = selectedToken && cell
            ? canPlaceToken(selectedToken, cell.tokens)
            : false;

          return (
            <HexCell3D
              key={key}
              position={worldPos}
              tokens={cell?.tokens || []}
              isHovered={isHovered}
              isValidPlacement={isValidPlacement}
              onClick={() => handleCellClick(coord)}
              onHover={(hovered) => handleCellHover(key, hovered)}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default PlayingBoard3D;
