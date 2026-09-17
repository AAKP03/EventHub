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

// ADD a new event
router.post("/", async (req, res) => {
  try {
    const {
      name,
      image,
      description,
      date,
      time,
      location,
      category,
      price,
      totalSeats,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !description ||
      !date ||
      !time ||
      !location ||
      !category ||
      price === undefined ||
      totalSeats === undefined
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const eventPrice = Number(price);
    const seats = Number(totalSeats);

    if (isNaN(eventPrice) || eventPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid number",
      });
    }

    if (!Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({
        message: "Total seats must be at least 1",
      });
    }

    const eventData = {
      name: name.trim(),
      image: image || "",
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      category: category.trim(),
      price: eventPrice,
      totalSeats: seats,
      availableSeats: seats,
    };

    const eventRef = await db.collection("events").add(eventData);

    res.status(201).json({
      message: "Event created successfully",
      eventId: eventRef.id,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      message: "Failed to create event",
    });
  }
});

// UPDATE an event
router.put("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const {
      name,
      image,
      description,
      date,
      time,
      location,
      category,
      price,
      totalSeats,
    } = req.body;

    if (
      !name ||
      !description ||
      !date ||
      !time ||
      !location ||
      !category ||
      price === undefined ||
      totalSeats === undefined
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const eventPrice = Number(price);
    const seats = Number(totalSeats);

    if (isNaN(eventPrice) || eventPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid number",
      });
    }

    if (!Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({
        message: "Total seats must be at least 1",
      });
    }

    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const existingEvent = eventDoc.data();

    const bookedSeats =
      Number(existingEvent.totalSeats) - Number(existingEvent.availableSeats);

    if (seats < bookedSeats) {
      return res.status(400).json({
        message: `Total seats cannot be less than the ${bookedSeats} seats already booked`,
      });
    }

    const updatedEvent = {
      name: name.trim(),
      image: image || "",
      description: description.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      category: category.trim(),
      price: eventPrice,
      totalSeats: seats,
      availableSeats: seats - bookedSeats,
    };

    await eventRef.update(updatedEvent);

    res.json({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      message: "Failed to update event",
    });
  }
});

// DELETE an event
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const bookingsSnapshot = await db
      .collection("bookings")
      .where("eventId", "==", eventId)
      .get();

    const activeBookings = bookingsSnapshot.docs.filter(
      (doc) => doc.data().status !== "Cancelled",
    );

    if (activeBookings.length > 0) {
      return res.status(400).json({
        message: "This event cannot be deleted because it has active bookings.",
      });
    }

    await eventRef.delete();

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: "Failed to delete event",
    });
  }
});

module.exports = router;
