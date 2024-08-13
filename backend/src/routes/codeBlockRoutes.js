const express = require('express');
const router = express.Router();
const codeBlockController = require('../controllers/codeBlockController');

router.get('/', codeBlockController.getCodeBlocks);
router.get('/:title', codeBlockController.getCodeBlock);

module.exports = router;
