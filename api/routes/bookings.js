const express = require("express");
const router = express.Router();

const { db } = require("../firebaseAdmin");

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { eventId, userId, name, email, phone, seats } = req.body;

    // Basic validation
    if (!eventId || !userId || !name || !email || !phone || !seats) {
      return res.status(400).json({
        message: "All booking fields are required",
      });
    }

    if (seats < 1) {
      return res.status(400).json({
        message: "At least one seat must be booked",
      });
    }

    // Get the event
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const event = eventDoc.data();

    // Check availability
    if (event.availableSeats < seats) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    // Create booking
    const bookingRef = await db.collection("bookings").add({
      eventId,
      userId,
      name,
      email,
      phone,
      seats: Number(seats),
      eventName: event.name,
      price: event.price,
      status: "Confirmed",
      createdAt: new Date(),
    });

    // Update available seats
    await eventRef.update({
      availableSeats: event.availableSeats - Number(seats),
    });

    res.status(201).json({
      message: "Booking confirmed",
      bookingId: bookingRef.id,
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
});

module.exports = router;
