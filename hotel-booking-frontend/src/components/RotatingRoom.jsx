import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

const Model = ({ gltf }) => {
  const gltfRef = useRef();

  useFrame(() => {
    if (gltfRef.current) {
      gltfRef.current.rotation.x += 0.00001; // Adjust the rotation speed as needed
      gltfRef.current.rotation.y -= 0.0002;
    }
  });

  return (
    <group ref={gltfRef} scale={[0.025, 0.035, 0.025]}> {/* Scale the model down */}
      <primitive object={gltf.scene} receiveShadow castShadow> {/* Add shadows */}
        <meshPhysicalMaterial color="yellow" metalness={0.2} roughness={1} />
      </primitive>
    </group>
  );
};

const GlbViewer = () => {
  const [gltf, setGltf] = React.useState(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/lowroom.glb', (gltf) => {
      setGltf(gltf);
    });
  }, []);

  return (
    <div style={{ height: '80vmin', width: '80vmin' }}>
      <Canvas camera={{ position: [10, 10, 5] }} style={{ margin : '100px auto' }}>
        <ambientLight intensity={0.8} /> {/* Add some ambient lighting */}
        <pointLight position={[0, 0, 0]} intensity={1} castShadow /> {/* Add a point light for more realistic lighting */}
        {gltf && <Model gltf={gltf} />}
        <OrbitControls enableDamping={false} enableZoom={false} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default GlbViewer;