import React, { useRef, useEffect } from 'react';
import { Shaders, GLSL, Node, GLSLContext } from 'gl-react';
import { Surface } from 'gl-react-dom';

const shaders = Shaders.create({
  WaterSurface: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      void main() {
        gl_FragColor = texture2D(texture, uv);
      }
    `,
  },
  WaterUpdate: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;
      uniform vec2 delta;
      void main() {
        vec4 info = texture2D(texture, uv);
        vec2 dx = vec2(delta.x, 0.0);
        vec2 dy = vec2(0.0, delta.y);
        float average = (
          texture2D(texture, uv - dx).r +
          texture2D(texture, uv - dy).r +
          texture2D(texture, uv + dx).r +
          texture2D(texture, uv + dy).r
        ) * 0.25;
        info.g += (average - info.r) * 2.0;
        info.g *= 0.995;
        info.r += info.g;
        gl_FragColor = info;
      }
    `,
  },
});

const WaterSurface = ({ texture }) => {
  return <Node shader={shaders.WaterSurface} uniforms={{ texture }} />;
};

const WaterUpdate = ({ texture, delta }) => {
  return <Node shader={shaders.WaterUpdate} uniforms={{ texture, delta }} />;
};

const WaterSimulation = () => {
  const surfaceRef = useRef(null);
  const textureARef = useRef(null);
  const textureBRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (textureARef.current && textureBRef.current) {
        textureBRef.current.drawTo(() => {
          textureARef.current.bind();
          WaterUpdate({ texture: textureARef.current, delta: [1 / 256, 1 / 256] });
        });
        surfaceRef.current.captureFrame();
        textureARef.current.swapWith(textureBRef.current);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const onDrop = (x, y, radius, strength) => {
    textureARef.current.drawTo(() => {
      textureBRef.current.bind();
      shaders.WaterUpdate({ texture: textureBRef.current, delta: [1 / 256, 1 / 256] });
      shaders.WaterDrop({ texture: textureBRef.current, center: [x / 256, y / 256], radius, strength });
    });
  };

  return (
    <div>
      <Surface ref={surfaceRef} width={256} height={256}>
        <WaterSurface texture={textureARef.current} />
      </Surface>
      <button onClick={() => onDrop(128, 128, 0.1, 1.0)}>Add Drop</button>
    </div>
  );
};

export default WaterSimulation;
