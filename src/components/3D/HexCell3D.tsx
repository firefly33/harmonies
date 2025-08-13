import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { Token } from '../../utils/can-be-placed';

interface HexCell3DProps {
  position: [number, number, number];
  tokens: Token[];
  isHovered: boolean;
  isValidPlacement: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}


const HexCell3D = ({ 
  position, 
  tokens, 
  isHovered, 
  isValidPlacement, 
  onClick, 
  onHover 
}: HexCell3DProps) => {
  const meshRef = useRef<Mesh>(null);

  // Subtle hover animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + (isHovered ? 0.1 : 0);
    }
  });


  return (
    <group position={position}>
      {/* Hex tile base - realistic game tile appearance */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.95, 0.95, 0.15, 6]} />
        <meshStandardMaterial 
          color={isValidPlacement ? '#90EE90' : isHovered ? '#FFD700' : '#F5F5DC'}
          roughness={0.4}
          metalness={0.1}
          opacity={0.9}
          transparent
        />
      </mesh>
      
      {/* Hex tile border/rim */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        <cylinderGeometry args={[1, 1, 0.05, 6]} />
        <meshStandardMaterial 
          color="#8B7355"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* Render tokens as 3D stacks */}
      {tokens.map((token, index) => (
        <TokenStack3D
          key={`${token.id}-${index}`}
          token={token}
          stackIndex={index}
          position={[0, 0.075 + (index * 0.2), 0]}
        />
      ))}
    </group>
  );
};

// 3D Token component
interface TokenStack3DProps {
  token: Token;
  stackIndex: number;
  position: [number, number, number];
}

const TokenStack3D = ({ token, stackIndex, position }: TokenStack3DProps) => {
  const getTokenIcon = (type: string): string => {
    const icons = {
      water: '🌊',
      field: '🌻', 
      mountain: '⛰️',
      tree: '🌳',
      house: '🏠',
      brown: '🟤'
    };
    return icons[type as keyof typeof icons] || type[0].toUpperCase();
  };

  return (
    <group position={position}>
      {/* Token cylinder - more realistic appearance */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.15, 16]} />
        <meshStandardMaterial 
          color={token.color}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Token top highlight */}
      <mesh position={[0, 0.076, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.01, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF"
          opacity={0.2}
          transparent
        />
      </mesh>
      
      {/* Token icon/text */}
      <Text
        position={[0, 0.085, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {getTokenIcon(token.type)}
      </Text>
      
      {/* Stack number indicator */}
      {stackIndex > 0 && (
        <Text
          position={[0.6, 0.1, 0.6]}
          fontSize={0.25}
          color="#FF4444"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="white"
        >
          {stackIndex + 1}
        </Text>
      )}
    </group>
  );
};

export default HexCell3D;