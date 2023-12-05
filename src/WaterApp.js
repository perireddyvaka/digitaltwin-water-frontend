import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const Particle = ({ x, y, size, color }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        borderRadius: '50%',
      }}
    />
  );
};

const App = () => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  useEffect(() => {
    // Initialize particles only once when the component mounts
    const initializeParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 500; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: 0,
          vy: 0,
          size: Math.random() * 5 + 2, // Adjust size to make it look like water
          color: 'blue',
        });
      }
      setParticles(newParticles);
    };

    initializeParticles();
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (isMouseDown) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime > 10) {
        setParticles((prevParticles) => [
          ...prevParticles,
          {
            x: e.clientX,
            y: e.clientY,
            vx: 0,
            vy: 0,
            size: Math.random() * 5 + 2,
            color: 'blue',
          },
        ]);
        setLastUpdateTime(currentTime);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateParticles = () => {
      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          const updatedParticle = {
            ...particle,
            vy: particle.vy + 0.1, // Gravity
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
          };

          if (updatedParticle.y > window.innerHeight - particle.size) {
            // Bounce off the bottom
            updatedParticle.y = window.innerHeight - particle.size;
            updatedParticle.vy *= -0.8; // Bounce with some loss
          }

          if (updatedParticle.x > window.innerWidth || updatedParticle.x < 0) {
            // Wrap around the screen
            updatedParticle.x = window.innerWidth - updatedParticle.x;
          }

          if (updatedParticle.y < 0) {
            // Bounce off the top
            updatedParticle.y = 0;
            updatedParticle.vy *= -0.8; // Bounce with some loss
          }

          return updatedParticle;
        });
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach(({ x, y, size, color }) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    animate();
  }, [isMouseDown, particles, lastUpdateTime]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

export default App;
