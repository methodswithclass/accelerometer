import React, { useEffect } from 'react';
import './App.css';
import demo from './demo';

function App() {
  useEffect(() => {
    demo.load();
  }, []);

  return <div className="arena" id="arena"></div>;
}

export default App;
