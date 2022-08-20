import React, { useEffect } from 'react';
import './App.css';
import demo from './demo';
import Console from './Console';

function App() {
  const getIndex = () => {
    return Math.floor(Math.random() * 100);
  };

  useEffect(() => {
    demo.load(getIndex());
  }, []);

  return (
    <>
      <div className="arena" id="arena"></div>
      <Console visible={false} />
    </>
  );
}

export default App;
