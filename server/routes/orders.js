const express = require('express');
const orderController = require('../controllers/orders');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
});

const upload = multer({ storage: storage });


router.post('/',upload.none(), orderController.createOrder);
router.get('/',orderController.retrieve);
router.get('/:status',orderController.retrieveAll);
router.put('/:orderId/complete',orderController.markAsComplete);
router.put('/:orderId/readytopick',orderController.markAsReadyToPick);

module.exports = router;
