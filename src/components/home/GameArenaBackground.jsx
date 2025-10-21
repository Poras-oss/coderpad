import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Component for the glowing grid floor, a classic VR/sci-fi element
const GroundGrid = () => {
  const gridConfig = {
    size: 100,
    divisions: 100,
    colorCenterLine: '#00D9FF',
    colorGrid: '#00D9FF',
  };

  return (
    <gridHelper
      args={[gridConfig.size, gridConfig.divisions, gridConfig.colorCenterLine, gridConfig.colorGrid]}
      position={[0, -5, 0]} // Positioned below the center
      rotation={[0, 0, 0]}
      // Make the grid material emissive to give it a glow effect
      material={new THREE.MeshBasicMaterial({
        color: gridConfig.colorGrid,
        transparent: true,
        opacity: 0.2,
        fog: true,
      })}
    />
  );
};


// Component for flowing particles, simulating data streams
const DataParticles = ({ count = 500 }) => {
    const mesh = useRef();
    const { size } = useThree();

    // Generate initial particle positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.005 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 40;
            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;

        particles.forEach((particle, i) => {
            let { factor, speed } = particle;
            const t = (particle.time += speed);
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;

            // Animate particles flowing towards the camera
            dummy.position.set(
                particle.x + Math.cos(t) * factor * 0.2,
                particle.y + Math.sin(t) * factor * 0.2,
                ((particle.z + t * 5) % 20) - 10 // Move along Z and loop
            );
            
            dummy.scale.setScalar(0.1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#00D9FF" transparent opacity={0.5} />
        </instancedMesh>
    );
};

// Component for abstract floating shapes
const FloatingShapes = () => {
    const group = useRef();
  
    useFrame((state) => {
      if (group.current) {
        group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      }
    });
  
    // Create a few wireframe shapes
    return (
      <group ref={group}>
        <mesh position={[-8, 0, -15]} rotation={[0.4, 0.4, 0.1]}>
          <icosahedronGeometry args={[2, 1]} />
          <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.15} />
        </mesh>
        <mesh position={[8, 2, -12]}>
          <octahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    );
  };

// Main background component that assembles the scene
const GameArenaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#080E14]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Fog adds depth, making it feel more like a VR space */}
        <fog attach="fog" args={['#080E14', 10, 30]} />
        <ambientLight intensity={0.5} color="#00D9FF" />
        <pointLight position={[0, 5, -10]} intensity={2} color="#00D9FF" />
        
        <GroundGrid />
        <DataParticles count={500} />
        <FloatingShapes />

      </Canvas>
    </div>
  );
};

export default GameArenaBackground;
