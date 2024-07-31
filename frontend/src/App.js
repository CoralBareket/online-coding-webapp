import React, { useState } from 'react';
import Lobby from './Lobby';
import CodeBlock from './CodeBlock';

const App = () => {
  const [selectedCodeBlock, setSelectedCodeBlock] = useState(null);

  return (
    <div>
      {selectedCodeBlock ? (
        <CodeBlock title={selectedCodeBlock} />
      ) : (
        <Lobby setSelectedCodeBlock={setSelectedCodeBlock} />
      )}
    </div>
  );
};

export default App;
