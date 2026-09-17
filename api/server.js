const express = require("express");
const cors = require("cors");

const { db } = require("./firebaseAdmin");
const eventsRouter = require("./routes/events");
const bookingsRouter = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/events", eventsRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "EventHub REST API is running",
  });
});

app.get("/test-firebase", async (req, res) => {
  try {
    await db.collection("events").limit(1).get();

    res.json({
      message: "Firebase connection successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Firebase connection failed",
    });
  }
});

const PORT = 3000;

app.listen(3000, "0.0.0.0", () => {
  console.log("EventHub API running on http://localhost:3000");
});
