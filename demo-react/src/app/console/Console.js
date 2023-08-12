import React from 'react';
import './Console.css';
import { useConsole } from './console.service';

const Console = (props) => {
  const { visible } = props;
  const history = useConsole();

  return (
    <>
      {visible ? (
        <div className="console" id="console">
          <div className="console-inner">
            {history.map((item) => {
              return (
                <div key={item} className="item">
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Console;
