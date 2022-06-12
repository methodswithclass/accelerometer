import React, { useState, useEffect } from 'react';
import './Console.css';

const Console = (props) => {
  const { visible } = props;
  const [history, setHistory] = useState([]);

  const log = function (...args) {
    let message = '';

    Object.values(args).forEach((value) => {
      message += ` ${value}`;
    });
    history.push(`${history.length}  ${message}`);
    setHistory([...history]);
  };

  const attach = () => {
    const oldLog = console.log;
    console.log = function (...args) {
      log.apply(log, args);
      oldLog.apply(oldLog, args);
    };

    window.onerror = (msg, url, linenumber) => {
      log('error', msg, url, linenumber);
    };
  };

  useEffect(() => {
    attach();
  }, []);

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
