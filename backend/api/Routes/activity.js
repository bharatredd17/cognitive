const router = require("express").Router();
const { Activity } = require("../models/activity");

router.post("/", async (req, res) => {
  const { email, gameType, score } = req.body;
  const todayDate =  new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  try {
    const result = await Activity.findOneAndUpdate(
      { email },
      {
        $push: {
          [`scores.${todayDate}.${gameType}`]: score
        }
      },
      { upsert: true }
    );

    if (result) {
      res.status(200).json({ message: "Scores added successfully" });
    } else {
      res.status(500).json({ error: "Failed to add scores" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
