const { getCodeBlocksHandler, getCodeBlockHandler } = require('../handlers/socketHandlers');

const getCodeBlocks = (req, res) => {
  const codeBlocks = getCodeBlocksHandler();
  res.json(codeBlocks.map(cb => ({ title: cb.title })));
};

const getCodeBlock = (req, res) => {
  const codeBlock = getCodeBlockHandler(req.params.title);
  if (codeBlock) {
    res.json(codeBlock);
  } else {
    res.status(404).send('Code block not found');
  }
};

module.exports = {
  getCodeBlocks,
  getCodeBlock
};
