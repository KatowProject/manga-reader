const router = require('express').Router();
const { axios } = require('../tools');
const db = require('../database');

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const accs = db.account.get(username);
        if (accs) {
            if (accs.password === password) {
                res.send({ success: true, data: accs });
            } else {
                res.send({ success: false, message: 'Password salah' });
            }
        } else {
            res.send({ success: false, message: 'Akun tidak ditemukan' });
        };
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

router.post('/favorit', async (req, res) => {
    try {
        const username = req.body.username;
        const favorites = req.body.favorites;
        const type = req.body.type;

        const accs = db.account.get(username);
        if (!accs) return res.send({ success: false, message: 'Akun tidak ditemukan' });

        switch (type) {
            case 'add':
                accs.favorites = accs.favorites.concat(favorites);
                db.account.set(username, accs);
                res.send({ success: true, data: accs.favorites });
                break;
            case 'remove':
                accs.favorites = accs.favorites.filter(fav => fav.title !== favorites.title);
                db.account.set(username, accs);
                res.send({ success: true, data: accs.favorites });
                break;
            case 'list':
                res.json({ success: true, data: accs.favorites });
                break;
            default:
                res.send({ success: false, message: 'Method tidak ditemukan' });
                break;
        }
    } catch (error) {
        res.send({ suceess: false, message: error.message });
    }
});

module.exports = router;