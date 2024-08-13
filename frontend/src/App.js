import React, { useState,useEffect } from 'react';
import Lobby from './components/Lobby';
import CodeBlock from './components/CodeBlock';
import './App.css';

const App = () => {
  const [selectedCodeBlock, setSelectedCodeBlock] = useState(null);

   useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      {!selectedCodeBlock ? (
         <Lobby setSelectedCodeBlock={setSelectedCodeBlock} />
      ) : (
        <CodeBlock title={selectedCodeBlock} />
      )}
    </div>
  );
};

export default App;
