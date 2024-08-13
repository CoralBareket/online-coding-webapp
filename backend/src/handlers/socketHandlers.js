const codeBlocks = [
  { title: 'Async Case', code: 'async function example() { /* Write your code here.. */ }', solution: 'async function example() { return true; }' },
  { title: 'Callback Example', code: 'function callback example() { /* Write your code here.. */ }', solution: 'function callbackExample() { return true; }' },
  { title: 'Promise Example', code: 'function promise example() { /* Write your code here.. */ }', solution: 'function promiseExample() { return true; }' },
  { title: 'Event Loop', code: 'function eventLoop example() { /* Write your code here.. */ }', solution: 'function eventLoopExample() { return true; }' },
];

const getCodeBlocksHandler = () => {
  return codeBlocks;
};

const getCodeBlockHandler = (title) => {
  return codeBlocks.find(cb => cb.title === title);
};

module.exports = {
  getCodeBlocksHandler,
  getCodeBlockHandler
};
