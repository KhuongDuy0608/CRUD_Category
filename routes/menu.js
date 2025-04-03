let express = require('express');
let router = express.Router();
let { GetAllMenu, CreateAMenu } = require('../controllers/menu');

router.get('/', async (req, res) => {
    try {
        let menu = await GetAllMenu();
        res.json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    let { text, url, parentId } = req.body;
    try {
        let newMenu = await CreateAMenu(text, url, parentId);
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
