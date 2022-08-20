import React from 'react';
import './Console.css';
import { useConsole } from './console.service';

const Console = (props) => {
  const { visible } = props;
  const history = useConsole();

  return (
    <div className="console">
      {visible && (
        <div className="console-inner">
          {history.map((item) => {
            return (
              <div key={item} className="item">
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Console;
