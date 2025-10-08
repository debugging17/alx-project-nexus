import { useEffect, useRef, useState } from 'react';
import * as three from 'three';
import SplitText from './SplitText';
const AFRICA_PATH =
  'M342.6 17.1 316.5 24.6 298.8 29.4 277.1 22.7 261.6 27.5 242.5 62.1 219.9 79.4 210.4 95.7 198.1 117.5 190.3 141.2 192.7 160.5 204.7 181.5 205 204.6 187.6 219 191.7 239.9 179.4 256.5 185.3 270.6 181.6 292.5 192.9 311.7 207 318.2 225.4 333 237.6 347.1 256.2 370.4 274.8 394.2 287.2 40' +
  '3.9 303.5 424.9 318.7 442.9 331 459.4 333.4 471.8 323.6 481.8 318.9 490.1 318.6 507.3 321 524 328.5 532.9 336.6 536.6 350.8 549.3 363.9 562.6 373 566.3 384.3 572.5 399.2 584.8 412.3 595.5 420.7 603.6 413.2 617.8 405.1 626 390.6 634.5 373.5 640.4 353.2 640.1 334.5 626 316.8 622.8 292.2 624.3 278' +
  '.3 614.5 258 608.4 239.7 613.2 214.6 602.1 182.5 586.6 147.3 572.8 120.6 556.3 99.6 541.1 79.9 518.4 66.2 504.3 60.1 481.4 61.7 465.9 72.4 454.5 92.7 433.9 97.5 423.4 92.1 419 82.1 410.5 67.1 405.4 49.1 383.1 38.8 368.6 28.8 352.5 20.6 342.6 17.1 Z';

const MADAGASCAR_PATH =
  'M689.4 317.8 698.6 308.2 705.6 294.5 710.3 279.6 710.3 263.9 706.2 247.4 699.6 233.1 693.6 226.1 683.1 223.4 672.6 226.1 665 232.7 660.9 247.4 658.9 263.3 660.9 279 665.6 294.1 671.5 304.3 679.7 313.3 689.4 317.8 Z';

const africaOutlinePoints = [
  [-1.18, 1.55],
  [-1.04, 1.62],
  [-0.88, 1.68],
  [-0.74, 1.58],
  [-0.6, 1.46],
  [-0.46, 1.38],
  [-0.32, 1.28],
  [-0.12, 1.2],
  [0.12, 1.22],
  [0.38, 1.2],
  [0.56, 1.12],
  [0.7, 0.98],
  [0.86, 0.86],
  [1.02, 0.66],
  [1.16, 0.46],
  [1.32, 0.28],
  [1.48, 0.1],
  [1.6, -0.04],
  [1.72, -0.22],
  [1.82, -0.36],
  [1.72, -0.38],
  [1.54, -0.4],
  [1.42, -0.56],
  [1.28, -0.82],
  [1.16, -1.04],
  [1.04, -1.26],
  [0.96, -1.48],
  [0.88, -1.72],
  [0.78, -1.94],
  [0.66, -2.14],
  [0.56, -2.32],
  [0.46, -2.5],
  [0.36, -2.68],
  [0.24, -2.86],
  [0.12, -3.06],
  [-0.04, -3.26],
  [-0.22, -3.4],
  [-0.4, -3.46],
  [-0.58, -3.44],
  [-0.76, -3.32],
  [-0.92, -3.12],
  [-1.02, -2.86],
  [-1.08, -2.56],
  [-1.12, -2.3],
  [-1.2, -2.02],
  [-1.3, -1.74],
  [-1.38, -1.44],
  [-1.42, -1.16],
  [-1.4, -0.82],
  [-1.36, -0.52],
  [-1.28, -0.24],
  [-1.18, 0.04],
  [-1.06, 0.32],
  [-0.94, 0.56],
  [-0.82, 0.78],
  [-0.9, 0.96],
  [-1.02, 1.14],
  [-1.12, 1.32],
  [-1.2, 1.46],
];

const hubReferencePoints = [
  [-105, 115, 0],
  [-128, 60, 0],
  [-135, 5, 0],
  [-138, -65, 0],
  [-124, -120, 0],
  [-108, -175, 0],
  [-82, -230, 0],
  [-40, -280, 0],
  [30, -270, 0],
  [90, -210, 0],
  [150, -130, 0],
  [200, -40, 0],
  [220, 25, 0],
  [120, 120, 0],
  [10, 160, 0],
];

const disciplineColors = [0x7dd3fc, 0xf472b6, 0xfacc15, 0x34d399, 0xa855f7];

export default function SplashScreen({ onFinished, duration = 3800 }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const finishedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const lastProgressRef = useRef(0);
  const segmentCount = 18;
  const filledSegments = Math.min(
    segmentCount,
    Math.round(Math.max(0, Math.min(progress, 1)) * segmentCount),
  );
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerSmoothedRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f7ff');
    scene.fog = new THREE.FogExp2(0xdde5ff, 0.08);

    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    camera.position.set(0, 0, 2.95);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1.5);
    container.appendChild(renderer.domElement);

    const gradientTexture = (() => {
      const size = 128;
      const data = new Uint8Array(3 * size);
      for (let i = 0; i < size; i += 1) {
        const ratio = i / (size - 1);
        const r = Math.floor(200 + ratio * 40);
        const g = Math.floor(220 + ratio * 25);
        const b = Math.floor(235 + ratio * 15);
        data[i * 3] = r;
        data[i * 3 + 1] = g;
        data[i * 3 + 2] = b;
      }
      const texture = new THREE.DataTexture(data, size, 1, THREE.RGBFormat);
      texture.needsUpdate = true;
      return texture;
    })();
    gradientTexture.wrapS = THREE.ClampToEdgeWrapping;
    gradientTexture.wrapT = THREE.ClampToEdgeWrapping;

    const mapGroup = new THREE.Group();
    mapGroup.position.set(1.28, 0.12, -0.4);
    scene.add(mapGroup);

    const continentShape = new THREE.Shape();
    africaOutlinePoints.forEach(([x, y], idx) => {
      if (idx === 0) {
        continentShape.moveTo(x, y);
      } else {
        continentShape.lineTo(x, y);
      }
    });
    continentShape.lineTo(africaOutlinePoints[0][0], africaOutlinePoints[0][1]);

    const extrudeSettings = {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.12,
      bevelSegments: 6,
      steps: 4,
    };

    const mapGeometry = new THREE.ExtrudeGeometry(continentShape, extrudeSettings);
    mapGeometry.computeBoundingBox();
    const geometrySize = new THREE.Vector3();
    mapGeometry.boundingBox.getSize(geometrySize);
    const targetHeight = 3.2;
    const scaleFactor = targetHeight / geometrySize.y;
    mapGeometry.scale(scaleFactor, scaleFactor, scaleFactor);
    mapGeometry.center();
    const hubScale = scaleFactor;

    const fillMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uProgress: { value: 0 },
        uColorA: { value: new THREE.Color('#354BAE') },
        uColorB: { value: new THREE.Color('#FF0000') },
        uTexture: { value: gradientTexture },
        uIntensity: { value: 0.85 },
        uAlphaBoost: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          vec4 mvPosition = modelViewMatrix * vec4(position * vec3(1.08, 1.22, 1.0), 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform sampler2D uTexture;
        varying vec3 vPosition;

        void main() {
          float normY = smoothstep(-0.95, 0.95, vPosition.y);
          float gradient = texture2D(uTexture, vec2(normY, 0.0)).r;
          float reveal = smoothstep(0.0, 1.0, uProgress);
          float mask = smoothstep(-0.92, mix(-0.92, 0.98, reveal), vPosition.y + gradient * 0.52);
          vec3 color = mix(uColorA, uColorB, pow(normY, 0.6)) * (1.05 + uIntensity * 0.35);
          float alpha = clamp(mask, 0.0, 1.0);
          float edgeGlow = smoothstep(0.82, 1.0, mask) * 0.35;
          float finalAlpha = clamp(alpha + uAlphaBoost * (0.5 + gradient * 0.6), 0.0, 1.0);
          gl_FragColor = vec4(color * (1.0 + edgeGlow * 1.4), max(finalAlpha, 0.82));
        }
      `,
      side: THREE.DoubleSide,
    });

    const africaMesh = new THREE.Mesh(mapGeometry, fillMaterial);
    africaMesh.rotation.y = Math.PI;
    africaMesh.renderOrder = 5;
    mapGroup.add(africaMesh);

    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d6dcf7'),
      emissive: new THREE.Color('#354BAE'),
      emissiveIntensity: 0.5,
      roughness: 0.35,
      metalness: 0.65,
      transparent: true,
      opacity: 0.9,
      side: THREE.FrontSide,
    });
    const shellGeometry = mapGeometry.clone();
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    shellMesh.rotation.y = Math.PI;
    shellMesh.renderOrder = 4;
    mapGroup.add(shellMesh);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#e0f2fe'),
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const glowGeometry = mapGeometry.clone();
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.rotation.y = Math.PI;
    glowMesh.scale.multiplyScalar(1.05);
    glowMesh.renderOrder = 6;
    mapGroup.add(glowMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const wireGeometry = mapGeometry.clone();
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    wireMesh.rotation.y = Math.PI;
    wireMesh.renderOrder = 7;
    mapGroup.add(wireMesh);

    const hubGeometry = new THREE.SphereGeometry(0.04, 20, 20);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x354bae,
      emissiveIntensity: 1.1,
      roughness: 0.4,
      metalness: 0.35,
    });
    const hubs = hubReferencePoints.map(([x, y, z], idx) => {
      const mesh = new THREE.Mesh(hubGeometry, hubMaterial.clone());
      mesh.position.set(x * hubScale, y * hubScale, z);
      mesh.userData.phase = Math.random() * Math.PI * 2;
      mesh.userData.color = new THREE.Color(disciplineColors[idx % disciplineColors.length]);
      mesh.material.emissive = mesh.userData.color.clone().multiplyScalar(0.6);
      mesh.material.color = mesh.userData.color.clone();
      mesh.material.emissiveIntensity = 0.85;
      mesh.material.transparent = true;
      mesh.material.opacity = 0.25;
      mesh.userData.speed = 0.45 + Math.random() * 0.65;
      mesh.scale.setScalar(0.14);
      mapGroup.add(mesh);
      return mesh;
    });

    const connectionMaterial = new THREE.LineDashedMaterial({
      color: 0x60a5fa,
      dashSize: 0.16,
      gapSize: 0.06,
      linewidth: 1,
      transparent: true,
      opacity: 0.75,
    });

    const connectionLines = hubs.slice(1).map((hub, idx) => {
      const anchorIndex = idx % 3 === 0 ? Math.floor(hubs.length / 2) : 0;
      const start = hubs[anchorIndex].position.clone();
      const end = hub.position.clone();
      const curve = new THREE.QuadraticBezierCurve3(
        start,
        start.clone().add(end).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.18 + idx * 0.02, -0.05)),
        end,
      );
      const points = curve.getPoints(40);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, connectionMaterial.clone());
      line.computeLineDistances();
      line.material.opacity = 0;
      mapGroup.add(line);
      return line;
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 750;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.0012 + Math.random() * 0.0025;
      const color = new THREE.Color(disciplineColors[i % disciplineColors.length]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.028,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const rimLight = new THREE.PointLight(0xff8fa2, 2.1, 16, 1.4);
    rimLight.position.set(-2.2, -1.0, -3.2);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xfbbf24, 1.4, 18, 2.4);
    goldLight.position.set(2.8, 1.9, 4.2);
    scene.add(goldLight);

    const spotlight = new THREE.SpotLight(0x3b82f6, 1.5, 11, Math.PI / 4, 0.5, 1.4);
    spotlight.position.set(0.4, 2.1, 3.3);
    spotlight.target.position.copy(mapGroup.position);
    scene.add(spotlight);
    scene.add(spotlight.target);

    const hoverLight = new THREE.PointLight(0x38bdf8, 2.2, 7, 2.1);
    hoverLight.position.set(0, 0, 1.5);
    scene.add(hoverLight);

    const bloomMaterial = new THREE.SpriteMaterial({
      map: (() => {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size; i += 1) {
          for (let j = 0; j < size; j += 1) {
            const dx = (i / size) * 2 - 1;
            const dy = (j / size) * 2 - 1;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const falloff = Math.max(0, 1 - dist);
            const index = (i + j * size) * 4;
            data[index] = 245;
            data[index + 1] = 246;
            data[index + 2] = 255;
            data[index + 3] = Math.floor(falloff * 200);
          }
        }
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
      })(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const bloomSprite = new THREE.Sprite(bloomMaterial);
    bloomSprite.scale.set(3.8, 3.8, 1);
    bloomSprite.position.set(0, 0, -0.2);
    mapGroup.add(bloomSprite);

    const clock = new THREE.Clock();
    let progressValue = 0;

    function handleResize() {
      const { clientWidth, clientHeight } = container;
      const width = clientWidth || window.innerWidth;
      const height = clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (event) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = ((event.clientX - left) / width) * 2 - 1;
      const y = ((event.clientY - top) / height) * -2 + 1;
      pointerTargetRef.current.x = THREE.MathUtils.clamp(x, -1, 1);
      pointerTargetRef.current.y = THREE.MathUtils.clamp(y, -1, 1);
    };
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', () => {
      pointerTargetRef.current.x = 0;
      pointerTargetRef.current.y = 0;
    });

    const pointerGroupOffset = new THREE.Vector3();

    const positionAttribute = particleGeometry.getAttribute('position');
    const speedAttribute = particleGeometry.getAttribute('speed');

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const deltaProgress = 1 / (duration / 32);
      progressValue = Math.min(1, progressValue + deltaProgress);
      if (progressValue - lastProgressRef.current >= 0.02 || progressValue >= 0.999) {
        lastProgressRef.current = progressValue;
        setProgress(progressValue);
      }
      fillMaterial.uniforms.uProgress.value = progressValue;
      fillMaterial.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        fillMaterial.uniforms.uIntensity.value,
        0.95 + pointerSmoothedRef.current.x * 0.12,
        0.08,
      );
      fillMaterial.uniforms.uAlphaBoost.value = THREE.MathUtils.lerp(
        fillMaterial.uniforms.uAlphaBoost.value,
        0.4 + Math.abs(pointerSmoothedRef.current.x) * 0.3 + progressValue * 0.2,
        0.06,
      );

      pointerSmoothedRef.current.x = THREE.MathUtils.lerp(
        pointerSmoothedRef.current.x,
        pointerTargetRef.current.x,
        0.08,
      );
      pointerSmoothedRef.current.y = THREE.MathUtils.lerp(
        pointerSmoothedRef.current.y,
        pointerTargetRef.current.y,
        0.08,
      );

      const tiltX = pointerSmoothedRef.current.y * 0.4;
      const tiltY = pointerSmoothedRef.current.x * 0.5;
      mapGroup.rotation.x = THREE.MathUtils.lerp(mapGroup.rotation.x, tiltX, 0.1);
      mapGroup.rotation.y = THREE.MathUtils.lerp(mapGroup.rotation.y, tiltY, 0.1);
      mapGroup.rotation.z = Math.sin(elapsed * 0.12) * 0.08;

      pointerGroupOffset.set(
        pointerSmoothedRef.current.x * 0.6,
        pointerSmoothedRef.current.y * 0.4,
        0,
      );
      hoverLight.position.copy(mapGroup.position).add(pointerGroupOffset.clone().add(new THREE.Vector3(0, 0, 1.2)));
      bloomSprite.material.opacity = 0.55 + Math.abs(pointerSmoothedRef.current.x) * 0.25 + progressValue * 0.2;

      hubs.forEach((hub, idx) => {
        const reveal = Math.min(1, progressValue * 1.35 - idx * 0.035);
        const hoverDistance = pointerGroupOffset.distanceTo(hub.position);
        const hoverBoost = 0.25 + Math.max(0, 0.9 - hoverDistance) * 0.34;
        hub.scale.setScalar(0.2 + reveal * 0.5 + hoverBoost * 0.06);
        hub.material.opacity = 0.35 + reveal * 0.65;
        hub.position.z = Math.sin(elapsed * (0.7 + idx * 0.035) + hub.userData.phase) * 0.08;
      });

      connectionLines.forEach((line, idx) => {
        const threshold = (idx + 1) / (connectionLines.length + 1);
        const intensity = THREE.MathUtils.smoothstep(progressValue, threshold - 0.22, threshold + 0.08);
        line.material.opacity = intensity * (0.9 + Math.abs(pointerSmoothedRef.current.x) * 0.4);
        line.material.scale = 1 - Math.sin(elapsed * 1.1 + idx * 0.4) * 0.08;
        line.material.needsUpdate = true;
      });

      for (let i = 0; i < particleCount; i += 1) {
        const speed = speedAttribute.getX(i);
        const angleX = elapsed * speed * 38 + i;
        const angleY = elapsed * speed * 18 + i * 0.24;
        const radius = 3.2 + ((i % 18) / 18) * 2.4;
        positionAttribute.setXYZ(
          i,
          Math.cos(angleX) * radius,
          Math.sin(angleY * 0.55) * 2.4,
          Math.sin(angleX) * radius,
        );
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const timeout = window.setTimeout(() => {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinished?.();
      }
    }, duration);

    return () => {
      finishedRef.current = true;
      window.clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      mapGeometry.dispose();
      shellGeometry.dispose();
      glowGeometry.dispose();
      wireGeometry.dispose();
      fillMaterial.dispose();
      shellMaterial.dispose();
      glowMaterial.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      hubGeometry.dispose();
      hubs.forEach((hub) => hub.material.dispose());
      connectionLines.forEach((line) => line.geometry.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [duration, onFinished]);

  const handleSkip = () => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinished?.();
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f8fafc] text-slate-900">
      <div ref={mountRef} className="absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50/65 to-indigo-50/55" aria-hidden />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-10 md:flex-row md:items-start md:justify-between md:py-14 lg:py-16">
        <div className="flex w-full max-w-xl flex-col items-center text-center md:items-start md:text-left">
          <div className="relative w-fit">
            <img
              src="/img/logo.svg"
              alt="Project Nexus logo"
              className="h-20 w-auto md:h-24 drop-shadow-[0_18px_45px_rgba(99,102,241,0.3)]"
            />
            <div className="absolute inset-x-0 -bottom-5 h-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-400 blur-md opacity-80" />
          </div>
          <div className="mt-8 space-y-5 text-slate-600">
            <p className="text-xs uppercase tracking-[0.55em] text-sky-500 md:text-sm">Connecting African Creatives</p>
            <SplitText
              text="Discover. Collaborate. Showcase."
              className="text-[2.65rem] font-semibold text-slate-900 leading-[1.08] md:text-[3.35rem] lg:text-[3.75rem] xl:text-[4rem]"
              delay={110}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.15}
              rootMargin="-80px"
              textAlign="left"
              tag="h2"
            />
            <p className="text-sm leading-relaxed text-slate-600 md:text-base lg:text-lg">
              From Lagos to Nairobi, Accra to Cape Town—immerse yourself in a vibrant network of artists, designers,
              musicians, filmmakers, and storytellers shaping culture across the continent.
            </p>
          </div>
          <div className="mt-10 flex w-full max-w-md flex-col gap-4 text-xs text-slate-500 md:text-sm">
            <div className="rounded-lg border border-slate-200/90 bg-slate-100/90 p-4 shadow-[inset_0_1px_3px_rgba(148,163,184,0.4)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 md:text-sm">Loading...</p>
              <div className="mt-3 rounded-sm border border-slate-400 bg-slate-200 p-1 shadow-inner">
                <div className="flex h-4 items-stretch gap-[3px]">
                  {Array.from({ length: segmentCount }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`flex-1 transition-colors duration-150 ${
                        idx < filledSegments ? 'bg-blue-600 shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 md:text-xs">
              Preparing your nexus • {Math.round(Math.min(1, Math.max(0, progress)) * 100)}%
            </span>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 md:gap-3 md:text-sm">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 md:px-4 md:py-1.5">Live showcases</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 md:px-4 md:py-1.5">Creator collabs</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 md:px-4 md:py-1.5">Marketplace</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="mt-8 inline-flex items-center rounded-full border border-indigo-200 bg-white px-7 py-2 text-xs font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50 md:text-sm"
          >
            Skip intro
          </button>
        </div>
        <div className="hidden flex-1 md:block" />
      </div>
    </div>
  );
}
