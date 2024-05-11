const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');


router.post('/searchLaptop', searchController.searchLaptop);
router.post('/searchWhatsapp', searchController.searchwhatsapp);

module.exports = router;
