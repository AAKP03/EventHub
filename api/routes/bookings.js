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

    const numberOfSeats = Number(seats);

    if (!Number.isInteger(numberOfSeats) || numberOfSeats < 1) {
      return res.status(400).json({
        message: "At least one seat must be booked",
      });
    }

    const result = await db.runTransaction(async (transaction) => {
      const eventRef = db.collection("events").doc(eventId);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists) {
        throw new Error("EVENT_NOT_FOUND");
      }

      const event = eventDoc.data();

      // Check availability inside the transaction
      if (event.availableSeats < numberOfSeats) {
        throw new Error("NOT_ENOUGH_SEATS");
      }

      // Create booking reference
      const bookingRef = db.collection("bookings").doc();

      // Create booking
      transaction.set(bookingRef, {
        eventId,
        userId,
        name,
        email,
        phone,
        seats: numberOfSeats,
        eventName: event.name,
        price: event.price,
        status: "Confirmed",
        createdAt: new Date(),
      });

      // Update available seats
      transaction.update(eventRef, {
        availableSeats: event.availableSeats - numberOfSeats,
      });

      return bookingRef.id;
    });

    res.status(201).json({
      message: "Booking confirmed",
      bookingId: result,
    });
  } catch (error) {
    console.error("Booking error:", error);

    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (error.message === "NOT_ENOUGH_SEATS") {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
});

module.exports = router;
