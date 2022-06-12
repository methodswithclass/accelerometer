import React, { useEffect } from 'react';
import './App.css';
import demo from './demo';
import Console from './Console';

function App() {
  useEffect(() => {
    demo.load();
  }, []);

  return (
    <>
      <div className="arena" id="arena"></div>
      <Console visible={true} />
    </>
  );
}

export default App;
