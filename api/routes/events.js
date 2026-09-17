const express = require("express");
const router = express.Router();

const { db } = require("../firebaseAdmin");

// GET all events
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve events",
    });
  }
});

module.exports = router;
