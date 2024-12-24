import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AudioAnalyser, MathUtils, Mesh, ShaderMaterial, Vector2 } from "three";
import { vertexShader } from "./vertexShader";
import { fragmentShader } from "./fragmentShader";
// import vertexShader from "!!raw-loader!./vertexShader.glsl";
// import fragmentShader from "!!raw-loader!./fragmentShader.glsl";

export interface BlobProps {
  sound: React.RefObject<any>;
  play: boolean;
  // onClick: () => void;
}

// const Blob2 = ({ sound, play, onClick }: Blob2Props) => {
  const Blob = ({ sound, play }: BlobProps) => {
  const mesh = useRef<Mesh>(null!);
  const analyserRef = useRef<AudioAnalyser | null>(null);

  const uniforms = useMemo(() => ({
    u_resolution: {
      value: new Vector2(window.innerWidth, window.innerHeight)
    },
    u_time: {
      value: 0.0
    },
    u_intensity: {
      value: 0.3
    },
    u_frequency: {
      value: 0.0
    }
  }), []);

  // Handle window resize
  useEffect(() => {
    // console.log({sound});
    
    const handleResize = () => {
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uniforms]);
  // useEffect(() => {
  //   // Update debug display whenever sound or play state changes
  //   console.log('Blob2 Update:', {
  //     hasSound: !!sound.current,
  //     isPlaying: play,
  //     analyserExists: !!sound.current?.analyser
  //   });
  // }, [sound, play]);
  useEffect(() => {
    if (sound.current && !analyserRef.current){
      const audioContext = new AudioContext();

      analyserRef.current = new AudioAnalyser(sound.current, 32);
      console.log("Analyzer created:", analyserRef.current);
    }

    return () => {
      if (analyserRef.current) {
        analyserRef.current = null;
      }
    };
  }, [sound.current]);
 

  // useFrame((state) => {
  //   const { clock } = state;
  //   if (mesh.current) {
  //     const material = mesh.current.material as ShaderMaterial;
      
  //     // Update time
  //     material.uniforms.u_time.value = clock.getElapsedTime();
  //     // console.log({"sound.current?.analyser":sound});
      
  //     // Update frequency from audio if playing
  //     if (sound.current?.analyser && play) {
  //       const frequency = sound.current.analyser.getAverageFrequency();
  //       material.uniforms.u_frequency.value = frequency;
  //     } else {
  //       material.uniforms.u_frequency.value = 0;
  //     }
  //   }
  // });
  // useEffect(() => {
  //   // Log the entire sound ref object
  //   console.log('Sound ref:', sound);
    
  //   // Log specific properties if sound.current exists
  //   if (sound.current) {
  //     console.log('Sound current:', {
  //       analyser: sound.current.analyser,
  //       isPlaying: sound.current.isPlaying,
  //       context: sound.current.context,
  //       buffer: sound.current.buffer
  //     });
  //   }
    
  //   // Add play state logging
  //   console.log('Play state:', play);
  // }, [sound, play]); // Added play to dependencies
  
  // Add debug logging in useFrame
  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      const material = mesh.current.material as ShaderMaterial;
      material.uniforms.u_time.value = clock.getElapsedTime();
      mesh.current.rotation.x = clock.getElapsedTime() * 0.1;
      mesh.current.rotation.z = clock.getElapsedTime() * 0.1;
      // Debug logging for audio analysis
      if (analyserRef.current && play) {
        mesh.current.rotation.y = clock.getElapsedTime() * 0.1;
        material.uniforms.u_time.value = clock.getElapsedTime();
        material.uniforms.u_frequency.value = analyserRef.current.getAverageFrequency();
        mesh.current.scale.x = 0.75 + analyserRef.current.getAverageFrequency() / 1000;
        mesh.current.scale.y = 0.75 + analyserRef.current.getAverageFrequency() / 1000;
        mesh.current.scale.z = 0.75 + analyserRef.current.getAverageFrequency() / 1000;

        // const frequency = analyserRef.current.getAverageFrequency();
        // console.log('Current frequency:', frequency);
        // material.uniforms.u_frequency.value = MathUtils.lerp(
        //   material.uniforms.u_frequency.value,
        //   frequency / 255.0, // Normalize to 0-1 range
        //   0.1 // Smoothing factor
        // );
        // material.uniforms.u_intensity.value = MathUtils.lerp(
        //   material.uniforms.u_intensity.value,
        //   frequency / 255.0, // Normalize to 0-1 range
        //   0.1 // Smoothing factor
        // );
      // } else {
      //   console.log('Audio analysis not available:', {
      //     hasAnalyser: !!sound.current?.analyser,
      //     isPlaying: play
      //   });
        // material.uniforms.u_frequency.value = MathUtils.lerp(material.uniforms.u_frequency.value, 0, 0.1);
      }
    }
  });

  return (
    <mesh
      ref={mesh}
      scale={.75}
      position={[0, 0, 0]}
      // onClick={onClick}
    >
      <icosahedronGeometry args={[4, 30]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
        toneMapped={true}
      />
    </mesh>
  );
};

export default Blob;