const express = require('express');
const productController = require('../controllers/product');
const router = express.Router();


router.post('/', productController.add);
router.get('/', productController.fetch);
router.get('/available', productController.fetchAvailable);
router.get('/:productName/image', productController.downloadImage);
router.put('/:productId', productController.update);

module.exports = router;