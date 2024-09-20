// src/components/Animation/Animation.js

import React from 'react';
import { motion } from 'framer-motion';
import './Animation.css';

const Animation = ({ paid }) => {
    return (
      <motion.div
        animate={{
          x: paid ? 500 : 0,
          rotate: paid ? 360 : 0,
          opacity: paid ? 1 : 0.5,
        }}
        transition={{ duration: 2 }}
        className="animation-container"
      >
        <div className="animation-box" />
      </motion.div>
    );
  };

export default Animation;
