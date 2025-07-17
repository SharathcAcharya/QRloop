import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Visualization3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f9fafb'); // Light gray background

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 3D Placeholder QR block
    const geometry = new THREE.BoxGeometry(2, 2, 0.2);
    const material = new THREE.MeshStandardMaterial({ color: '#4f46e5' }); // Indigo
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(4, 4, 4);
    scene.add(dirLight);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-10 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
        {/* Decorative floating background blobs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-700 blur-3xl rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-700 blur-3xl rounded-full animate-pulse" />

        {/* Title & Description */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-100 mb-2">
            3D QR Code Visualization
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Explore QR codes in an immersive 3D environment. Rotate, zoom, inspect, and more!
          </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          <ul className="list-disc list-inside">
            <li>Interactive 3D QR model</li>
            <li>Animated QR code particles</li>
            <li>Upload & view QR mesh</li>
            <li>Camera orbit & zoom</li>
          </ul>
          <ul className="list-disc list-inside">
            <li>Theme switch support</li>
            <li>Export 3D view as image</li>
            <li>Info panel with metadata</li>
            <li>WebGL powered preview</li>
          </ul>
        </div>

        {/* 3D Canvas */}
        <div
          ref={mountRef}
          className="w-full h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner relative z-10 overflow-hidden bg-white dark:bg-gray-800"
        />
      </div>
    </div>
  );
};

export default Visualization3D;
