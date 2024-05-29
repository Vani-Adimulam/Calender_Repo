const express = require("express");
const { model } = require("mongoose");
const Event = require("../modal/Event");
const moment = require("moment-timezone");
const userdetail = require("../modal/User");
const sendExpirationAlert = require("../controller/sendExpirationAlert");
const sendEmail = require("./sendEmail");

const CreateEvent = async (req, res) => {
  const {
    username,
    title,
    roomName,
    StartTime,
    EndTime,
    availability,
    booked,
    User,
  } = req.body;

  const startTimeIST = moment
    .tz(StartTime, "YYYY-MM-DD HH:mm:ss", "UTC")
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");
  const endTimeIST = moment
    .tz(EndTime, "YYYY-MM-DD HH:mm:ss", "UTC")
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  try {
    const currentTimeIST = moment()
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    // Check if StartTime is in the future
    if (new Date(startTimeIST) < new Date(currentTimeIST)) {
      return res
        .status(400)
        .json({ message: "Cannot book events for past time slots" });
    }

    // Check if EndTime is less than StartTime
    if (new Date(EndTime) < new Date(StartTime)) {
      return res
        .status(400)
        .json({ message: "EndTime cannot be less than StartTime" });
    }

    const existingEvent = await Event.findOne({
      roomName,
      StartTime: { $lte: endTimeIST },
      EndTime: { $gte: startTimeIST },
      status: "𝐑𝐞𝐣𝐞𝐜𝐭𝐞𝐝",
    });

    if (existingEvent) {
      // Replace the existing rejected event with the new event
      existingEvent.username = username;
      existingEvent.title = title;
      existingEvent.StartTime = startTimeIST;
      existingEvent.EndTime = endTimeIST;
      existingEvent.availability = availability;
      existingEvent.booked = booked;
      existingEvent.User = User;
      existingEvent.status = "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝";
      await existingEvent.save();

      console.log("Existing Rejected Event:", existingEvent._id);
      res
        .status(200)
        .json({
          message: "Existing rejected event replaced and pending approval",
          eventId: existingEvent._id,
        });
    } else {
      const event = await Event.create({
        username,
        title,
        roomName,
        StartTime: startTimeIST,
        EndTime: endTimeIST,
        availability,
        booked,
        User,
        status: "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝", // Set the initial status as 'initiated'
      });

      const eventId = event._id.toString();

      console.log("New Event:", eventId);
      res
        .status(201)
        .json({ message: "Event created and pending approval", eventId });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err, message: "Something went wrong" });
  }
};

const GetEventRoute = async (req, res) => {
  try {
    const events = await Event.find()
      .select("-__v")
      .populate("User", "-password");
    res.send(events);
  } catch (err) {
    res.status(500).send(err);
  }
};

const GetUserEvent = async (req, res) => {
  try {
    const userId = req.params.id;
    const events = await Event.find({ User: userId }).select("-__v"); // Exclude the __v field
    res.send({ events });
  } catch (err) {
    res.status(500).send(err);
  }
};

const UpdateEvent = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "title",
    "roomName",
    "StartTime",
    "EndTime",
    "availability",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  const { StartTime, EndTime, availability } = req.body;
  try {
    const roomExits = await Event.findOne({ availability });
    const startTimeAvailble = await Event.findOne({ StartTime });
    const endTimeAvailble = await Event.findOne({ EndTime });

    if (roomExits && startTimeAvailble && endTimeAvailble) {
      return res.status(400).json({ message: "Slot is already booked" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      if (update === "StartTime" || update === "EndTime") {
        // Convert to IST timezone
        event[update] = moment
          .tz(req.body[update], "YYYY-MM-DD HH:mm:ss", "UTC")
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        event[update] = req.body[update];
      }
    });

    // Check if EndTime is less than or equal to StartTime
    if (moment(event.EndTime).isSameOrBefore(event.StartTime)) {
      return res
        .status(400)
        .send({ error: "EndTime must be greater than StartTime!" });
    }
    console.log(updates);

    await event.save();
    res.send(event);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete an event by ID
const DeleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    console.log("=>>", event);
    if (!event) {
      return res.status(404).send();
    }
    res.send(event);
  } catch (err) {
    res.status(500).send(err);
  }
};

const acceptEvent = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update the event status to 'accepted'
    event.status = "𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐞𝐝";
    await event.save();
    res.json({ message: "Event accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update the event status to 'rejected'
    event.status = "𝐑𝐞𝐣𝐞𝐜𝐭𝐞𝐝";
    await event.save();
    res.json({ message: "Event rejected" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateEvent,
  GetEventRoute,
  GetUserEvent,
  DeleteEvent,
  UpdateEvent,
  acceptEvent,
  rejectEvent,
};
