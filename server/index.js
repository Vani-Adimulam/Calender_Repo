const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const path = require("path");

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const userRouter = require("./router/user");
const sendEmail = require("./controller/sendEmail");
const EventTimeSlotRoute = require("./router/EventTimeSlotRoute");
const EventRoute = require("./router/EventRoutes");
const SuperUserRoute = require("./router/SuperUserRoute");
const authMiddleware = require("./config/authMiddleware");
const Event = require("./modal/Event");
const { events } = require("./modal/EventTimeSlots");
const { default: mongoose } = require("mongoose");

InitiateMongoServer();
// middleware
// app.use(authMiddleware);
app.use(bodyParser.json());
// app.use(cors(corsOptions));
app.use(express.json());
app.use("/", EventRoute);
app.use("/", EventTimeSlotRoute);
app.use("/", SuperUserRoute);

const _dirname = path.dirname("");
const builPath = path.join(_dirname, "../client/build");
// app.use(express.static(builPath))
app.use(express.static(path.join(builPath)));

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
// app.get("/update/title/:id/title", async(req,res)=>{
app.put("/update/title/:id", async (req, res) => {
  const { id } = req.params;
  const {title, roomName, StartTime, EndTime} = req.body
  
  console.log(req.params);
  try {
    console.log("Received ID:", id);
    console.log("New Title:", title);

    // Ensure the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const existingEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        roomName,
        StartTime,
        EndTime,
        availability: false,
        booked: true,
      },
      { new: true }
    );

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ existingEvent });
    console.log("Updated Event:", existingEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// const fun = async () => {
//   try {
//     const existingEvent = await Event.findByIdAndUpdate(
//       '663b66f231d99bab8268507a',  // Pass the ID directly
//       { title: 'veera hike meeting' }, // Update data
//       { new: true } // Options to return the updated document
//     );
//     console.log(existingEvent);
//   } catch (error) {
//     console.error(error);
//   }
// };

// fun();

app.use("/", sendEmail);
// router

app.use("/user", userRouter);
app.get("/*", function (req, res) {
  res.sendFile(
    "index.html",
    { root: path.join(_dirname, "../client/build") },
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server Started at PORT ${process.env.PORT}`);
});
