import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, useMatcapTexture } from '@react-three/drei';
import { Mesh, Group } from 'three';

const RotatingText = ({ text, position }: { text: string; position: [number, number, number] }) => {
  const meshRef = useRef<Mesh>(null);
  const [matcap] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Center position={position}>
      <Text3D
        ref={meshRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.1}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshMatcapMaterial matcap={matcap} color="#00ff41" />
      </Text3D>
    </Center>
  );
};

const PythonSyntaxElements = () => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const pythonKeywords = ['def', 'class', 'import', 'from', 'if', 'else', 'for', 'while', 'return'];
  const operators = ['=', '==', '!=', '+', '-', '*', '/', ':', ';'];

  return (
    <group ref={groupRef}>
      {/* Python keywords floating around */}
      {pythonKeywords.map((keyword, i) => (
        <Center key={keyword} position={[
          Math.cos(i * 0.7) * 3,
          Math.sin(i * 0.5) * 2,
          Math.sin(i * 0.8) * 2
        ]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.15}
            height={0.05}
          >
            {keyword}
            <meshBasicMaterial color="#ffa500" transparent opacity={0.7} />
          </Text3D>
        </Center>
      ))}
      
      {/* Operators */}
      {operators.map((op, i) => (
        <Center key={op} position={[
          Math.sin(i * 0.9) * 4,
          Math.cos(i * 0.6) * 1.5,
          Math.cos(i * 0.4) * 3
        ]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.2}
            height={0.03}
          >
            {op}
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.5} />
          </Text3D>
        </Center>
      ))}
    </group>
  );
};

const PythonText3D = () => {
  return (
    <div className="w-full h-64 bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <RotatingText text="EVAN" position={[0, 0.5, 0]} />
        <RotatingText text="LYNCH" position={[0, -0.5, 0]} />
        
        <PythonSyntaxElements />
      </Canvas>
    </div>
  );
};

export default PythonText3D;