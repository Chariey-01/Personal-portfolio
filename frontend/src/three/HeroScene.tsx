import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function SystemModel() {
  const groupRef = useRef<THREE.Group>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const nodes = useMemo(
    () => [
      [-1.9, 0.8, 0],
      [-0.7, 1.5, -0.2],
      [0.8, 1.0, 0.15],
      [1.7, -0.2, -0.1],
      [0.3, -1.0, 0.25],
      [-1.4, -0.6, -0.15],
    ] as [number, number, number][],
    [],
  );
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(nodes.map((node) => new THREE.Vector3(...node)));
    return geometry;
  }, [nodes]);
  const crossLineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([nodes[0], nodes[3], nodes[5], nodes[1], nodes[4]].map((node) => new THREE.Vector3(...node)));
    return geometry;
  }, [nodes]);
  const mainLine = useMemo(
    () =>
      new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({ color: "#67e8f9", transparent: true, opacity: 0.7 }),
      ),
    [lineGeometry],
  );
  const crossLine = useMemo(
    () =>
      new THREE.Line(
        crossLineGeometry,
        new THREE.LineBasicMaterial({ color: "#f0abfc", transparent: true, opacity: 0.35 }),
      ),
    [crossLineGeometry],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    if (!reduceMotion) {
      groupRef.current.rotation.y = -0.35 + Math.sin(time * 0.35) * 0.18;
      groupRef.current.rotation.x = 0.2 + Math.cos(time * 0.4) * 0.08;
    }
    groupRef.current.position.y = Math.sin(time * 0.9) * 0.08;
  });

  return (
    <group ref={groupRef} rotation={[0.2, -0.35, 0]}>
      <primitive object={mainLine} />
      <primitive object={crossLine} />
      {nodes.map((node, index) => (
        <mesh key={node.join("-")} position={node}>
          <sphereGeometry args={[index === 2 ? 0.18 : 0.13, 32, 32]} />
          <meshStandardMaterial
            color={index === 2 ? "#f0abfc" : "#67e8f9"}
            emissive={index === 2 ? "#a21caf" : "#0891b2"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.55]} rotation={[0.15, 0.2, 0]}>
        <torusKnotGeometry args={[0.78, 0.035, 130, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.55} roughness={0.28} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="min-h-[360px] md:min-h-[560px]"
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050810"]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[3, 4, 5]} intensity={12} color="#67e8f9" />
      <pointLight position={[-4, -2, 2]} intensity={8} color="#f0abfc" />
      <SystemModel />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.15, 0]}>
        <circleGeometry args={[2.5, 80]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Canvas>
  );
}
