const router = require("express").Router();
const { Autisamscore } = require("../models/autisam");

router.post("/", async (req, res) => {
    try {
        await new Autisamscore(req.body).save();
        res.status(201).send({ message: "Done" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
