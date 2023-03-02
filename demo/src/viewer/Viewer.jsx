import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, extend, useFrame, useLoader } from '@react-three/fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
} from 'react-dat-gui';

import useDrag from './useDrag';

import './gui.css';

extend({ TrackballControls });
extend({ TextGeometry });


const Scene = ({ children }) => {
  const { camera, gl } = useThree();
  const control = useRef();

  useFrame(() => control.current && control.current.update());

  return(
    <>
      <trackballControls args={[camera, gl.domElement]} ref={control}/>
      <ambientLight intensity={0.2} color={0xffffff} />
      <hemisphereLight intensity={0.4} />
      {children}
    </>
  );
};

const Text = ({ size, height, color, onDrag, ...props }) => {
  const ref = useRef();
  const [ bindDrag ] = useDrag(onDrag);
  const [hovered, hover] = useState(false)
  const font = useLoader(FontLoader, '/assets/fonts/helvetiker_regular.typeface.json');
  
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  
  return(
    <mesh 
      ref={ref}
      {...bindDrag}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <textGeometry args={['TAI CHI', {font, size, height, ...props}]}/>
      <meshLambertMaterial attach='material' color={hovered ? 'pink': color} />
    </mesh>
  )
}

const initData = {
  size: 0.5, 
  height: 0.4,
  color: '#27BB80',
  curveSegments: 0.1,
  bevelEnabled: true,
  bevelThickness: 0,
  bevelSize: 0,
  bevelSegments: 0,
}

const Viewer = () => {
  const [guiData, setGuiData] = useState(initData);
  const [position, setPosition] = useState({x: 0, y: 0, z: 0});

  const handleUpdate = newData => {
    setGuiData(newData);
  };

  useEffect(() => {
    const handleKeydown = (event) => {
        // Ctrl+z
      if(event.ctrlKey && event.keyCode === 90){
        setGuiData(initData);
      }
      // Ctrl+y
      if(event.ctrlKey && event.keyCode === 89){
        setGuiData(initData);
      }

    }
    document.addEventListener('keydown', handleKeydown);
    return() => {
      document.removeEventListener('keydown', handleKeydown);
    }
  }, []);

  return(
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
      }}>
       <Canvas style={{position: 'absolute', top: '0px', right: '0px', bottom: '0px'}}>
        <Scene>
          <Text onDrag={(v) => setPosition(v)} {...guiData}/>
        </Scene>
      </Canvas>
      <div 
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '300px',
          minWidth: '300px',
          color: 'pink',
          zIndex: 9999,
          }}
      >
       {`位置坐标：x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(2)}`}
      </div>
      <DatGui
        data={guiData}
        onUpdate={handleUpdate}
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
          width: '300px',
          minWidth: '300px',
          background: '#5a5b5a'
        }}
      >
        <DatNumber
          path="size"
          label="size"
          min={0}
          max={5}
          step={0.1}
          />
           <DatNumber
            path="height"
            label="height"
            min={0.4}
            max={1}
            step={0.1}
          />
           <DatColor path="color" label="color" />
           <DatNumber
            path="curveSegments"
            label="curveSegments"
            min={0.1}
            max={0.3}
            step={0.1}
          />
           <DatBoolean path="bevelEnabled" label="bevelEnabled" />
           <DatNumber
            path="bevelThickness"
            label="bevelThickness"
            min={0}
            max={0.3}
            step={0.1}
          />
          <DatNumber
            path="bevelSize"
            label="bevelSize"
            min={0}
            max={0.3}
            step={0.1}
          />
          <DatNumber
            path="bevelSegments"
            label="bevelSegments"
            min={0}
            max={0.3}
            step={0.1}
          />
      </DatGui>
    </div>
  );
};

export default Viewer;