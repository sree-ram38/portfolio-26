/* ============================================================
   galaxy.js — Three.js Universe Background
   Sreeram I | Developer Portfolio
   ============================================================ */

(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  /* ── Stars ── */
  const starCount = 7000;
  const starGeo   = new THREE.BufferGeometry();
  const starPos   = new Float32Array(starCount * 3);
  const starCol   = new Float32Array(starCount * 3);
  const starSiz   = new Float32Array(starCount);

  const palette = [
    new THREE.Color('#a855f7'),
    new THREE.Color('#22d3ee'),
    new THREE.Color('#3b82f6'),
    new THREE.Color('#f8fafc'),
    new THREE.Color('#f8fafc'),
    new THREE.Color('#f8fafc'),
  ];

  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 5 + Math.random() * 45;
    starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[Math.floor(Math.random() * palette.length)];
    starCol[i * 3]     = c.r;
    starCol[i * 3 + 1] = c.g;
    starCol[i * 3 + 2] = c.b;
    starSiz[i] = Math.random() * 2.5 + 0.5;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));
  starGeo.setAttribute('size',     new THREE.BufferAttribute(starSiz, 1));

  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })));

  /* ── Nebula clouds ── */
  function makeNebula(color, x, y, z, size) {
    const geo = new THREE.BufferGeometry();
    const n   = 800;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = x + (Math.random() - 0.5) * size;
      pos[i * 3 + 1] = y + (Math.random() - 0.5) * size * 0.6;
      pos[i * 3 + 2] = z + (Math.random() - 0.5) * size * 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color,
      size: 0.15,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
  }

  scene.add(makeNebula(0x7c3aed, -2,  1,  -5,  8));
  scene.add(makeNebula(0x22d3ee,  3, -1,  -8, 10));
  scene.add(makeNebula(0x3b82f6,  0,  2, -12, 14));

  /* ── Spiral galaxy ── */
  const spiralGeo   = new THREE.BufferGeometry();
  const spiralCount = 3000;
  const sPos        = new Float32Array(spiralCount * 3);
  const sCol        = new Float32Array(spiralCount * 3);

  for (let i = 0; i < spiralCount; i++) {
    const t        = (i / spiralCount) * Math.PI * 10;
    const arm      = Math.floor(Math.random() * 3);
    const armAngle = arm * (Math.PI * 2 / 3);
    const r        = t * 0.08 + Math.random() * 0.5;
    const spread   = (Math.random() - 0.5) * 0.6;
    const blend    = i / spiralCount;
    sPos[i * 3]     = Math.cos(t + armAngle) * r + spread;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    sPos[i * 3 + 2] = Math.sin(t + armAngle) * r + spread - 10;
    sCol[i * 3]     = 0.48 + blend * 0.13;
    sCol[i * 3 + 1] = 0.21 + blend * 0.61;
    sCol[i * 3 + 2] = 0.93 - blend * 0.13;
  }

  spiralGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  spiralGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));

  scene.add(new THREE.Points(spiralGeo, new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })));

  /* ── Shooting stars ── */
  const shooters = [];
  let shooterTimer = 0;

  function createShooter() {
    const geo    = new THREE.BufferGeometry();
    const trail  = 12;
    const pos    = new Float32Array(trail * 3);
    const startX = (Math.random() - 0.5) * 20;
    const startY = Math.random() * 8 + 2;
    const startZ = Math.random() * -5 - 1;
    const dx     = (Math.random() - 0.5) * 0.15;
    const dy     = -(Math.random() * 0.08 + 0.04);
    for (let i = 0; i < trail; i++) {
      pos[i * 3]     = startX - dx * i * 2;
      pos[i * 3 + 1] = startY - dy * i * 2;
      pos[i * 3 + 2] = startZ;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
    }));
    scene.add(line);
    return { line, geo, dx, dy, life: 0, maxLife: 60 };
  }

  /* ── Mouse parallax ── */
  let mx = 0, my = 0, targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.3;
    my = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  /* ── Resize handler ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Render loop ── */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow scene rotation
    scene.rotation.y = t * 0.008;
    scene.rotation.x = t * 0.003;

    // Mouse parallax
    targetX += (mx - targetX) * 0.05;
    targetY += (my - targetY) * 0.05;
    camera.position.x = targetX;
    camera.position.y = -targetY;
    camera.lookAt(scene.position);

    // Twinkling stars
    const sizes = starGeo.attributes.size.array;
    for (let i = 0; i < starCount; i += 5) {
      sizes[i] = (Math.sin(t * 2 + i) * 0.5 + 0.5) * 2 + 0.3;
    }
    starGeo.attributes.size.needsUpdate = true;

    // Spawn shooting stars
    shooterTimer++;
    if (shooterTimer > 120 + Math.random() * 180) {
      shooters.push(createShooter());
      shooterTimer = 0;
    }

    // Animate shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s   = shooters[i];
      const pos = s.geo.attributes.position.array;
      s.life++;
      for (let j = 0; j < 12; j++) {
        pos[j * 3]     += s.dx;
        pos[j * 3 + 1] += s.dy;
      }
      s.geo.attributes.position.needsUpdate = true;
      s.line.material.opacity = Math.max(0, 1 - s.life / s.maxLife);
      if (s.life >= s.maxLife) {
        scene.remove(s.line);
        shooters.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  animate();
})();
