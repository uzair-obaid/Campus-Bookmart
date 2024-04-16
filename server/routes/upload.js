const express = require('express');
const uploadController = require('../controllers/upload');
const router = express.Router();

router.post('/', uploadController.upload);
router.get('/', uploadController.retrieve);
router.get('/:id', uploadController.download); 
router.delete('/:id', uploadController.delete); 

module.exports = router;
