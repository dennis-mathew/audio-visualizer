// fragmentShader.ts
export const fragmentShader = `
// uniform vec2 u_resolution;
// uniform float u_frequency;
// uniform float u_time;

// varying vec2 vUv;
// varying float vNoise;
// varying float vDisplacement;

// void main() {
//   vec2 st = gl_FragCoord.xy / u_resolution;
  
//   // Create color based on position and noise
//   vec3 color = vec3(st.x, st.y, 1.0);
//   color += vec3(vNoise * 0.1); // Add some noise variation
//   color += vec3(vDisplacement); // Add displacement effect
  
//   gl_FragColor = vec4(color, 1.0);
// }
uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

void main() {
  float distort = 2.0 * vDisplacement * u_intensity;

  vec3 color = vec3(abs(vUv - 0.5) * 2.0  * (1.0 - distort), 1.0);
  
  gl_FragColor = vec4(color ,1.0);
}

`;