import React, { useEffect, useState } from 'react';
import './App.css';
import { load } from './app/demo';
import Console from './app/console/Console';

function App() {
  const [isValid, setValid] = useState('unchecked');
  useEffect(() => {
    const id = 'global';
    const accel = load({ id, arena: 'arena', object: 'object' });
    accel.validate().then((valid) => {
      setValid(valid);
    });
    return () => {
      accel?.stop();
    };
  }, []);

  return (
    <>
      <div className="arena" id="arena">
        <div
          className={`object ${isValid !== 'valid' ? 'hidden' : ''}`}
          id="object"
        ></div>
      </div>
      {isValid === 'invalid' ? (
        <div>This device is not supported. Use on a mobile device.</div>
      ) : null}
      <Console visible={isValid === 'valid'} />
    </>
  );
}

export default App;
