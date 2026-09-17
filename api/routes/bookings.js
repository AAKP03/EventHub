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

// Get all bookings for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection("bookings")
      .where("userId", "==", userId)
      .get();

    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      message: "Failed to get bookings",
    });
  }
});

// Cancel a booking
router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await db.runTransaction(async (transaction) => {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingDoc = await transaction.get(bookingRef);

      if (!bookingDoc.exists) {
        throw new Error("BOOKING_NOT_FOUND");
      }

      const booking = bookingDoc.data();

      if (booking.status === "Cancelled") {
        throw new Error("ALREADY_CANCELLED");
      }

      const eventRef = db.collection("events").doc(booking.eventId);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists) {
        throw new Error("EVENT_NOT_FOUND");
      }

      const event = eventDoc.data();

      // Change booking status
      transaction.update(bookingRef, {
        status: "Cancelled",
      });

      // Return the seats to the event
      transaction.update(eventRef, {
        availableSeats: event.availableSeats + Number(booking.seats),
      });

      return bookingId;
    });

    res.json({
      message: "Booking cancelled successfully",
      bookingId: result,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    if (error.message === "BOOKING_NOT_FOUND") {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (error.message === "ALREADY_CANCELLED") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    if (error.message === "EVENT_NOT_FOUND") {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
});

module.exports = router;
