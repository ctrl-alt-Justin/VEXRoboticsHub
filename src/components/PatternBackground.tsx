import React from 'react';
import { motion } from 'framer-motion';

const PatternBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 opacity-80">
        {/* Orange Orb - Top Left */}
        <motion.div
          animate={{
            x: [0, 300, 0],
            y: [0, 150, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-orange-600 rounded-full blur-[100px] opacity-60"
        />

        {/* Red Orb - Bottom Right */}
        <motion.div
          animate={{
            x: [0, -300, 0],
            y: [0, -150, 0],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-red-600 rounded-full blur-[100px] opacity-50"
        />

        {/* Purple Orb - Center/Moving */}
        <motion.div
          animate={{
            x: [0, 400, -400, 0],
            y: [0, -200, 200, 0],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900 rounded-full blur-[120px] opacity-40"
        />

        {/* Extra Orange Highlight - Top Right */}
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 200, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-0 right-0 w-80 h-80 bg-orange-500 rounded-full blur-[80px] opacity-40"
        />
      </div>

      {/* Noise Texture Overlay for texture/grit */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Blur overlay for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
    </div>
  );
}

export default PatternBackground;
