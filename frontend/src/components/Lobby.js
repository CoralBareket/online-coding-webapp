import React, { useState, useEffect } from 'react';
import './Lobby.css'; // Import the CSS file

const Lobby = ({ setSelectedCodeBlock }) => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/code-blocks')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setCodeBlocks(data))
      .catch(error => console.error('Error fetching code blocks:', error));
  }, []);

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Choose code block</h1>
      <ul className="code-block-list">
        {codeBlocks.map(block => (
          <li key={block.title} className="code-block-item" onClick={() => setSelectedCodeBlock(block.title)}>
            {block.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
