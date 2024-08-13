import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import hljs from 'highlight.js';
import styles from './CodeBlock.module.css';

function normalizeString(str) {
  return str
    .trim() // Remove whitespace from both ends
    .replace(/\s+/g, ' '); // Replace multiple spaces (including line breaks) with a single space
}

function compareStrings(str1, str2) {
  const normalizedStr1 = normalizeString(str1);
  const normalizedStr2 = normalizeString(str2);
  return normalizedStr1 === normalizedStr2;
}

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

    fetch(`http://localhost:3000/code-blocks/${title}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log({data})
        setCode(data.code);  
        setSolution(data.solution);
      })
      .catch(error => console.error('Error fetching code block:', error));

    socket.emit('join', title);

    socket.on('codeChange', newCode => {
      setCode(newCode);
      setIsCorrect(compareStrings(newCode,solution));

    });

    
    return () => {
      socket.off('codeChange');
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
    setIsCorrect(compareStrings(newCode,solution));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {isMentor ? (
        <pre>
          <code ref={codeRef} className={`${styles.code} language-javascript`}>
            {code}
          </code>
        </pre>
      ) : (  
        <textarea
          value={code}
          onChange={handleCodeChange}
          className={styles.textarea}
        />
      )}
      {isCorrect && <div className={styles.correct}>😊</div>}
    </div>
  );
};

export default CodeBlock;
