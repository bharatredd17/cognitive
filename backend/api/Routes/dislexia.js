const router = require("express").Router();
const { Dislexiascore } = require("../models/dislexia");

router.post("/", async (req, res) => {
    try {
        await new Dislexiascore(req.body).save();
        res.status(201).send({ message: "Done" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;