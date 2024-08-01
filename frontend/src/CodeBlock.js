import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import hljs from 'highlight.js';
import "highlight.js/styles/github.css";

const socket = io('http://localhost:3000');

const CodeBlock = ({ title }) => {
  const [code, setCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [solution, setSolution] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    // Check local storage for mentor role
    const mentorExists = localStorage.getItem('mentorExists');
    if (!mentorExists) {
      setIsMentor(true);
      localStorage.setItem('mentorExists', 'true');
    }

    fetch('http://localhost:3000/code-block/${title}')
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP error! status: ${response.status}');
        }
        return response.json();
      })
      .then(data => {
        setCode(data.code);
        setSolution(data.solution);
      })
      .catch(error => console.error('Error fetching code block:', error));

    socket.emit('join', title);

    socket.on('codeChange', newCode => {
      setCode(newCode);
      setIsCorrect(newCode.trim() === solution.trim());
    });

    const handleBeforeUnload = () => {
      if (isMentor) {
        localStorage.removeItem('mentorExists');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('codeChange');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clean up mentor role in local storage on unmount
      if (isMentor) {
        localStorage.removeItem('mentorExists');
      }
    };
  }, [title, solution]);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightBlock(codeRef.current);
    }
  }, [code]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    socket.emit('codeChange', { room: title, code: newCode });
    setIsCorrect(newCode.trim() === solution.trim());
  };

  return (
    <div>
      <h1>{title}</h1>
      {isMentor ? (
        <pre><code ref={codeRef} className="language-javascript">{code}</code></pre>
      ) : (
        <textarea
          value={code}
          onChange={handleCodeChange}
          style={{ width: '100%', height: '400px' }}
        />
      )}
      {isCorrect && <div style={{ fontSize: '48px' }}>😊</div>}
    </div>
  );
};

export default CodeBlock;