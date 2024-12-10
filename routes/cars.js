const express = require('express');
const multer = require('multer');
const { createCar } = require('../controller/car');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.array("file", 10), createCar);

module.exports = router;