const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const path = require('path')



const corsOptions = {
   origin: 'http://localhost:3000',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const userRouter  = require("./router/user");
const sendEmail = require("./controller/sendEmail");
const EventTimeSlotRoute = require('./router/EventTimeSlotRoute');
const EventRoute = require('./router/EventRoutes');
const SuperUserRoute = require("./router/SuperUserRoute");
const authMiddleware = require("./config/authMiddleware")


InitiateMongoServer();
// middleware
// app.use(authMiddleware);
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', cors(corsOptions), EventRoute);
app.use('/', EventTimeSlotRoute);
app.use('/',SuperUserRoute);


const _dirname = path.dirname("")
const builPath = path.join(_dirname, "../client/build");
// app.use(express.static(builPath))
app.use(express.static(path.join(builPath)));
app.get("/*", function (req, res) {
  res.sendFile('index.html',
    { root: path.join(_dirname, "../client/build") },
    function (err) {
      if (err) {
        res.status(500).send(err)
      }
    }
  );
})

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
app.use('/', sendEmail)
// router

app.use("/user", userRouter );







app.listen(process.env.PORT, (req, res) => {
  console.log(`Server Started at PORT ${process.env.PORT}`);
});