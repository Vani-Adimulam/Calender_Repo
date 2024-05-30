import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPligin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import ListPlugin from "@fullcalendar/list";
import Datetime from "react-datetime";
import Popup from "reactjs-popup";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datetime/css/react-datetime.css";
import NavbarCalendar from "../pages/NavbarCalendar";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backendapi from "../Backendapi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

export default function (props) {
  // localStorage.getItem("email").split("@")[0]
  const [username, setuserName] = useState(
    JSON.parse(localStorage.getItem("username"))
  );
  // console.log(username)
  const [Emailusername, setEmailusername] = useState(
    localStorage.getItem("email")
  );
  // console.log(Emailusername)
  const [title, setTitle] = useState("");
  const [userMeetingInfo, setUserMeetingInfo] = useState({});
  const [roomName, setroomName] = useState("");
  const [StartTime, setStartTime] = useState(
    moment(new Date().toISOString()).tz("Asia/Kolkata").format()
  );
  // console.log(StartTime, "StartTime", "Actual time");
  const [EndTime, setEndTime] = useState(
    moment(new Date().toISOString()).tz("Asia/Kolkata").format()
  );
  // console.log(EndTime, "End time");
  const [availability, setAvailability] = useState(true);
  const [booked, setBooked] = useState(true);
  const [loginusername, setLoginUsername] = useState("");
  const [Hours, setHours, getHours] = useState(new Date());
  const navigate = useNavigate();
  const [showEndTime, setShowEndTime] = useState(false);
  const [endTimeManual, setEndTimeManual] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [displayEndTime, setDisplayEndTime] = useState(null);
  const [meetingTime, setMeetingTime] = useState({
    startTime: null,
    endTime: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const objectId = localStorage.getItem("objectId");
  const userid = objectId.replace(/^"(.*)"$/, "$1");
  const [User, setUser] = useState(userid);
  const [eventid, setEventid] = useState();
  const popoverRef = useRef({});
  const [Data, setData] = useState([]); // store the post data
  const [eventData, setEventData] = useState([]); // store the Display data
  const [RowData, setRowData] = useState([]);
  const [ViewShow, setViewShow] = useState(false);
  const handleViewShow = () => {
    setViewShow(true);
  };
  const handleViewClose = () => {
    setViewShow(false);
  };

  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    if (value === "available") {
      setAvailability(true);
      setBooked(false);
      setTitle("Available"); // Update title to "Available"
    } else if (value === "book") {
      setAvailability(false);
      setBooked(true);
      setTitle(""); // Update title to "Booked" or any other title you prefer
    }
  };

  // For Edit Modal*****
  const [ViewEdit, setEditShow] = useState(false);
  const handleEditShow = () => {
    setEditShow(true);
  };
  const handleEditClose = () => {
    setEditShow(false);
    window.location.reload();
  };

  // For delete Modal*****
  const [ViewDelete, setDeleteShow] = useState(false);
  const handleDeletShow = () => {
    setDeleteShow(true);
  };
  const handleDeleteClose = () => {
    setDeleteShow(false);
  };

  // For Add new data Modal*****
  const [ViewPost, setPostShow] = useState(false);
  const handlePostShow = () => {
    setPostShow(true);
  };
  const handlePostClose = () => {
    setPostShow(false);
  };

  const [Delete, setDelete] = useState(false);
  //id for update record and delete
  const [id, setId] = useState("");

  //state variables to track the filter value and pagination
  const [filterTitle, setFilterTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Backendapi.REACT_APP_SuperUser_EMAIL = response.data.superuserEmail;

  //create a event
  const handleclick = async (event) => {
    event.preventDefault();
    console.log(StartTime);
    console.log(EndTime);
    if (moment(EndTime).isBefore(moment(StartTime))) {
      toast.error("EndTime cannot be less than StartTime");
      return;
    }

    // Condition for past time slot booking
    const currentTimeIST = moment().tz("Asia/Kolkata");

    if (moment(StartTime).isBefore(currentTimeIST)) {
      toast.error("Cannot book events for past time slots");
      setTimeout(() => {
        toast.info(
          `Book your event with the current time: ${currentTimeIST.format(
            "YYYY-MM-DD HH:mm:ss"
          )}`
        );
      }, 4000);
      return;
    }
    setIsLoading(true);

    const payload = {
      username: username,
      title: title,
      roomName: roomName,
      StartTime: moment(StartTime).tz("Asia/Kolkata").format(),
      EndTime: moment(EndTime).tz("Asia/Kolkata").format(),
      availability: availability,
      booked: booked,
      User: User,
    };

    const config = { headers: { "Content-Type": "application/json" } };

    try {
      const { data } = await axios.post(
        `${Backendapi.REACT_APP_BACKEND_API_URL}/create-event`,
        payload,
        config
      );
      localStorage.setItem("eventid", data.eventId);
      setIsLoading(false);
      toast.success("Event is Confirmed 😊", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      try {
        const eventId = localStorage.getItem("eventid");
        // console.log(eventId);
        // console.log(username)
        await axios.post(
          `${Backendapi.REACT_APP_BACKEND_API_URL}/send/${username}/${Emailusername}/${title}`
        );
        await axios.post(
          `${Backendapi.REACT_APP_BACKEND_API_URL}/send/superuser/${username}/${Backendapi.REACT_APP_SuperUser_EMAIL}/${title}`
        ); // Send email to superuser
        toast.success("Check Your Confirmation Email");
      } catch (error) {
        // toast.error("Unable to send Email");
      }

      window.location.reload();
    } catch (e) {
      if (e.response.status === 409) {
        setIsLoading(false);
        toast.error("The slot is already booked ☹️");
      } else {
        setIsLoading(false);
        toast.error("The slot is already booked ☹️");
        navigate("/Calendar");
      }
    }
  };

  //display user details
  useEffect(() => {
    axios
      .get(`${Backendapi.REACT_APP_BACKEND_API_URL}/user/getusers/${User}`)
      .then((d) => {
        const cdata = d.data;
        setData(cdata);
        // console.log(cdata)
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const sortByStartTime = (a, b) => {
    const startTimeA = new Date(a.StartTime);
    const startTimeB = new Date(b.StartTime);
    return startTimeA - startTimeB;
  };
  const sortByEndTime = (a, b) => {
    const endTimeA = new Date(a.EndTime);
    const endTimeB = new Date(b.EndTime);
    return endTimeA - endTimeB;
  };
  const currentDate = new Date();

  const activeEvents = eventData.filter(
    (item) => new Date(item.EndTime) >= currentDate
  );
  const expiredEvents = eventData.filter(
    (item) => new Date(item.EndTime) < currentDate
  );

  const sortedActiveEvents = activeEvents.sort((a, b) => {
    if (a.status === "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝" && b.status !== "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝") {
      return -1;
    } else if (a.status !== "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝" && b.status === "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝") {
      return 1;
    } else {
      return sortByStartTime(a, b);
    }
  });

  const sortedExpiredEvents = expiredEvents.sort(sortByEndTime);

  const sortedEventData = [...sortedActiveEvents, ...sortedExpiredEvents];

  // pagination functionality
  const totalPages = Math.ceil(sortedEventData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // FullCalendar Display Color Variation
  let userEmailName;

  useEffect(() => {
    axios
      .get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
      .then((d) => {
        const currentTime = moment(); // Get current system date and time
        // console.log(d.data)
        const cdata = d.data.map((item) => {
          const startTime = moment(item.StartTime);
          const endTime = moment(item.EndTime);
          // console.log(endTime._i)
          let colorClass;
          // console.log(item)
          // console.log(currentTime.isAfter(StartTime), "checked time")
          // if(currentTime.isAfter(startTime)){
          //   if (currentTime.isBefore(startTime)  ) {
          //     // console.log("Yes beforetime")
          //     colorClass = "event-gray"; // Condition 1: StartTime is not yet started
          //   } else if (currentTime.isBetween(startTime, endTime) && !item.availability)  {
          //     colorClass = "event-yellow"; // Condition 2: StartTime is started but not yet expired
          //   } else if (currentTime.isBefore(startTime) && item.booked) {
          //     colorClass = "event-green"
          //   }
          // }else {
          //   // console.log("Yes after time")
          //   colorClass = "event-past"; // Condition 3: EndTime is expired
          // }

          // console.log(item)
          const date1 = moment(new Date()).format();
          // console.log(date1)
          const date2 = startTime._i;
          // console.log(date2)
          // console.log(date1 > date2, "Checking", item.title);
          if (date1 > date2) {
            colorClass = "event-gray";
          } else {
            if (item.availability && !item.booked) {
              colorClass = "event-yellow"; // Condition 1: Availability is true and not booked
            } else if (item.booked && !item.availability) {
              colorClass = "event-green"; // Condition 2: Booked is true
            } else {
              colorClass = "event-gray"; // Condition 3: Default condition
            }
          }

          // console.log(moment(new Date()).isAfter(startTime), "check");
          // if (item.availability && !item.booked) {
          //   colorClass = "event-yellow"; // Condition 1: Availability is true and not booked
          // } else if (item.booked) {
          //   colorClass = "event-green"; // Condition 2: Booked is true
          // } else {
          //   colorClass = "event-gray"; // Condition 3: Default condition
          // }
          // setuserName(item.User.username)
          userEmailName = item.User.username;
          // console.log(item)
          return {
            eventid: item._id,
            username: item.User.username,
            title: item.title,
            roomName: item.roomName,
            date: item.StartTime,
            EndTime: item.EndTime,
            User: item.User,
            status: item.status,
            colorClass: colorClass, // Add colorClass property to the object
          };
        });
        // Filter out events with status "Rejected"
        const filteredData = cdata.filter((item) => item.status !== "𝐑𝐞𝐣𝐞𝐜𝐭𝐞𝐝");
        setData(filteredData);

        // setData(cdata);
        // console.log(cdata)
      })

      .catch((e) => {
        console.log(e);
      });
  }, []);

  // console.log(username)
  // console.log(userEmailName)

  // Display Login User Data

  useEffect(() => {
    const objectId = localStorage.getItem("objectId");
    const myString = objectId.replace(/^"(.*)"$/, "$1");
    axios
      .get(`${Backendapi.REACT_APP_BACKEND_API_URL}/getuserevent/${myString}`)
      .then((d) => {
        setEventData(d.data.events);
        // console.log(d.data.events)
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //update Event

  // const handleEdit = async (e) => {
  //   console.log(e, "edit update");
  //   e.preventDefault();

  //   const currentTimeIST = moment().tz("Asia/Kolkata");

  //   if (moment(StartTime).isBefore(currentTimeIST)) {
  //     toast.error("Cannot update events for past time slots");
  //     setTimeout(() => {
  //       toast.info(
  //         `Update your event with the current time: ${currentTimeIST.format(
  //           "YYYY-MM-DD HH:mm:ss"
  //         )}`
  //       );
  //     }, 3000);
  //     return;
  //   }

  //   if (moment(EndTime).isBefore(moment(StartTime))) {
  //     toast.error("EndTime cannot be less than StartTime");
  //     return;
  //   }

  //   const Credentials = {
  //     title,
  //     roomName,
  //     StartTime: moment
  //       .tz(StartTime, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
  //       .format("YYYY-MM-DD HH:mm:ss"),
  //     EndTime: moment
  //       .tz(EndTime, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata")
  //       .format("YYYY-MM-DD HH:mm:ss"),
  //     availability,
  //     booked,
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${Backendapi.REACT_APP_BACKEND_API_URL}/update-event/${id}`,
  //       Credentials
  //     );
  //     setData(response.data);
  //     toast.success("Event updated successfully 😊", {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 2000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //     });

  //     try {
  //       await axios.post(
  //         `${Backendapi.REACT_APP_BACKEND_API_URL}/send/${username}/${Emailusername}`
  //       );
  //       // toast.success("Check your email, event details have been updated");
  //     } catch (error) {
  //       // toast.error("Unable to send email");
  //     }
  //   } catch (error) {
  //     if (error.response.status === 409) {
  //       toast.error("The slot is already booked ☹️");
  //     } else {
  //       toast.error("The slot is already booked ☹️");
  //     }
  //     navigate("/Calendar");
  //   }

  //   navigate("/Dashboard");
  // };

  const handleUpdateMeeting = async (id) => {
    console.log(id, "6655b651bce7e1198c10fc64");
    console.log(title);
    console.log(roomName);
    console.log(StartTime, "Start time for updating");
    console.log(EndTime, "End time for updating");

    if (moment(EndTime).isBefore(moment(StartTime))) {
      toast.error("EndTime cannot be less than StartTime");
      return;
    }

    // Condition for past time slot booking
    const currentTimeIST = moment().tz("Asia/Kolkata");

    if (moment(StartTime).isBefore(currentTimeIST)) {
      toast.error("Cannot book events for past time slots");
      setTimeout(() => {
        toast.info(
          `Book your event with the current time: ${currentTimeIST.format(
            "YYYY-MM-DD HH:mm:ss"
          )}`
        );
      }, 4000);
      return;
    }

    const response = await axios.put(
      `${Backendapi.REACT_APP_BACKEND_API_URL}/update/title/${id}`,
      {
        title,
        roomName,
        StartTime: moment(StartTime)
          .add(5, "hours")
          .add(30, "minutes")
          .format("YYYY-MM-DDTHH:mm"),
        EndTime: moment(EndTime)
          .add(5, "hours")
          .add(30, "minutes")
          .format("YYYY-MM-DDTHH:mm"),
      }
    );
    if (response.status == 200) {
      toast.success("Event Updated Successfully");

      // Set a timeout to reload the page after a delay
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // setTimeout(() => {
      //   console.log("3sec");
      // }, 3000);
      // console.log("changed");
      // window.location.reload();
    } else {
      if (response.status === 409) {
        setIsLoading(false);
        toast.error("The slot is already booked ☹️");
      } else {
        setIsLoading(false);
        toast.error("The slot is already booked ☹️");
        navigate("/Calendar");
      }
      console.log("no change");
      window.location.reload();
    }
  };

  //handle delete function
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${Backendapi.REACT_APP_BACKEND_API_URL}/delete-event/${id}`
      );
      setData(response.data.eventId);
      console.log(response.data.title);
      const mailTitle = response.data.title;
      toast.success("Event deleted successfully 😊", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);

      // Send deletion confirmation email
      try {
        const eventId = localStorage.getItem("eventid");
        console.log(username.username);
        await axios.post(
          `${Backendapi.REACT_APP_BACKEND_API_URL}/send/deletion/${username}/${Emailusername}/${mailTitle}`
        );
        await axios.post(
          `${Backendapi.REACT_APP_BACKEND_API_URL}/send/deletionSuperUser/${username}/${Backendapi.REACT_APP_SuperUser_EMAIL}/${mailTitle}`
        );
        // toast.success("Deletion confirmation email sent");
      } catch (error) {
        // toast.error("Unable to send deletion confirmation email");
        window.location.reload();
      }
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
    // window.location.reload();
    // navigate("/Dashboard");
  };

  //Modal for popup
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // StartTime and EndTime Input field Time Display Function

  // useEffect(() => {
  //   // Get the current datetime
  //   const currentDatetime = new Date().toISOString().slice(0, 16);

  //   // Set the current datetime as the initial value for StartTime and EndTime
  //   setStartTime(currentDatetime);
  //   setEndTime(currentDatetime);
  // }, []);

  // Function to convert UTC time to IST
  const convertToIST = (utcDateTime) => {
    const istDateTime = moment
      .utc(utcDateTime)
      .utcOffset("+05:30")
      .format("YYYY-MM-DDTHH:mm");
    return istDateTime;
  };

  // Function to convert IST time to UTC
  const convertToUTC = (istDateTime) => {
    const utcDateTime = moment(istDateTime).utc().format("YYYY-MM-DDTHH:mm");
    return utcDateTime;
  };

  return (
    <div>
      <NavbarCalendar />
      <div>
        {/* UserInput Form */}
        <div className="">
          <>
            <div class="d-flex flex-row">
              <Button
                className="text-black mt-2 "
                style={{ backgroundColor: "skyblue", marginLeft: "43%" }}
                onClick={handleOpenModal}
              >
                <span style={{ color: "white", fontWeight: "bold" }}>
                  <i className="fa fa-plu">Schedule Meeting</i>
                </span>
              </Button>
              <div
                style={{
                  // border: "2px solid #ccc",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "30%",
                  padding: "10px",
                  marginLeft: " 30px",
                  marginTop: "5px",
                }}
              >
                <b>Events Info :</b>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "#bdcdd8",
                      marginRight: "5px",
                    }}
                  ></div>
                  <span>Completed</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "#50C878",
                      marginRight: "5px",
                    }}
                  ></div>
                  <span>Available</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      backgroundColor: "#73c2fb",
                      marginRight: "5px",
                    }}
                  ></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              style={{ backgroundColor: "transparent" }}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header
                closeButton
                style={{ backgroundColor: "lightgray" }}
              >
                <Modal.Title>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "10px",
                      color: "#444",
                      fontFamily: "Arial",
                      fontSize: "20px",
                    }}
                  >
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {" "}
                      Hi,{" "}
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {username}
                    </span>
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {" "}
                      Please book your Event
                    </span>
                  </label>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ backgroundColor: "lightgray" }}>
                <form
                  onSubmit={handleclick}
                  style={{
                    backgroundColor: "lightgray",
                    padding: "20px",
                    borderRadius: "5px",
                    width: "350px",
                  }}
                >
                  <div style={{ margin: "15px 0" }}>
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      Availability
                    </span>
                    <div>
                      <label style={{ marginRight: "10px" }}>
                        <input
                          type="radio"
                          name="availability"
                          value="available"
                          style={{ marginRight: "5px" }}
                          onChange={handleAvailabilityChange}
                          checked={availability === true && booked === false}
                          required
                        />
                        <span style={{ color: "" }}>Available</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="availability"
                          value="book"
                          style={{ marginRight: "5px" }}
                          onChange={handleAvailabilityChange}
                          checked={availability === false && booked === true}
                          required
                        />
                        Book
                      </label>
                    </div>
                  </div>

                  {/* <input
                    type="text"
                    className="form-control"
                    value={username.username}
                    onChange={(e) => setuserName(e.target.value)}
                    required
                    placeholder={username.username}
                    hidden="true"
                  /> */}

                  {/* <lable>Enter Your Title</lable> */}
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    {" "}
                    Enter Your Title{" "}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setTitle(title.trim())}
                    disabled={availability === true} // Disabled if available
                    required
                  />
                  {/* <label>Select Room:</label> */}
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Select Room
                  </span>
                  <select
                    className="form-control"
                    value={roomName}
                    onChange={(e) => setroomName(e.target.value)}
                    required
                  >
                    <option value="" disabled selected>
                      Select Room
                    </option>
                    <option value="𝐓𝐰𝐞𝐥𝐯𝐞 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦">
                      12 Seat
                    </option>
                    <option value="𝐒𝐢𝐱 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦">6 Seat</option>
                  </select>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "15px",
                    }}
                  >
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {" "}
                      Start Time{" "}
                    </span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={moment(StartTime).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        setStartTime(
                          moment(e.target.value).format("YYYY-MM-DDTHH:mm")
                        )
                      }
                      required
                    />

                    <span style={{ color: "black", fontWeight: "bold" }}>
                      End Time
                    </span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={moment(EndTime).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        setEndTime(
                          moment(e.target.value).format("YYYY-MM-DDTHH:mm")
                        )
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      {isLoading ? "ADDING EVENT..." : "ADD EVENT"}
                    </span>
                  </button>
                </form>
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: "gray" }}>
                <Button variant="dark" onClick={handleCloseModal}>
                  <span style={{ color: "white", fontWeight: "bold" }}>
                    𝒞𝓁𝑜𝓈𝑒
                  </span>
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>

        {/* // Inside your component's render or return statement */}
        <section style={{ backgroundColor: "white" }}>
          <div style={{ position: "relative", zIndex: 0 }}>
            <FullCalendar
              timeZone="UTC"
              plugins={[
                dayGridPlugin,
                timeGridPligin,
                InteractionPlugin,
                ListPlugin,
              ]}
              initialView="dayGridMonth"
              events={Data}
              headerToolbar={{
                start: "today prev,next", // will normally be on the left. if RTL, will be on the right
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // will normally be on the right. if RTL, will be on the left
                eventColor: "#378006",
              }}
              height="80vh"
              eventDidMount={(info) => {
                // const newT = (moment((info.event.start).toISOString()).tz("Asia/Kolkata").format())
                // console.log(newT, "NewT")
                const startTime = moment(info.event.start)
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm");
                const endTime = moment(info.event.extendedProps.EndTime)
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm");
                return new bootstrap.Popover(info.el, {
                  title: info.event.title,
                  placement: "auto",
                  trigger: "hover",
                  customClass: "PopoverStyle",

                  content: `
                    <strong>Title:</strong>${info.event.title}</span><br>
                    <strong>Room Name:</strong> ${info.event.extendedProps.roomName}<br>
                    <strong>Username:</strong> ${info.event.extendedProps.username}<br>
                    <strong>Meeting:</strong> ${info.event.extendedProps.status}<br>
                    <strong>Event Start:</strong> ${startTime}<br>
                    <strong>Event End:</strong> ${endTime}<br>
                  `,
                  html: true,
                });
              }}
              eventClassNames={(info) => {
                return info.event.extendedProps.colorClass;
              }}
              eventClick={(info) => {
                // console.log("Event clicked:", info.event);
                // console.log("Event title:", info.event.title);
                // console.log("Event start:", info.event.start);
                // console.log("Event end:", info.event.end);
                // console.log(
                //   "Extended props:",
                //   info.event.extendedProps.EndTime
                // );
                // console.log("Id", info.event.extendedProps.User._id);
                // console.log("endtime", info.event.EndTime);
                // console.log("totalEvents", info.event);
                const currentDateTime = moment().format("YYYY-MM-DDTHH:mm"); // Current date and time
                console.log(currentDateTime, "Current time");
                // Now set them in the same format

                // Convert event start time to moment object
                // handleOpenModal(info.event);
                // if (startTime.isBefore(currentDateTime)) {
                //   // If event start time is in the past, display an error message
                //   alert("Cannot edit past events.");
                //   return; // Exit the function, preventing the modal from opening
                // }
                const date5 = moment(new Date()).format();
                console.log(date5);
                const date6 = moment(info.event.start)
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm");
                console.log(date6);
                // console.log(date1 > date2, "Checking", item.title);
                if (date5 > date6) {
                  alert("Editing past events is not allowed.");
                  return;
                }
                const startTime2 = moment(info.event.start)
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm");
                const endTime2 = moment(info.event.extendedProps.EndTime)
                  .subtract(5, "hours")
                  .subtract(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm");
                setStartTime(startTime2);
                setEndTime(endTime2);
                // setStartTime(moment(info.event.start)
                //   .subtract(5, "hours")
                //   .subtract(30, "minutes")
                //   .format("YYYY-MM-DDTHH:mm"));
                // console.log(startTime, "update time ");
                // setEndTime(moment(info.event.extendedProps.EndTime)
                //   .subtract(5, "hours")
                //   .subtract(30, "minutes")
                //   .format("YYYY-MM-DDTHH:mm"));
                setEditShow(true);
                // setUserMeetingInfo({
                //   title: info.event.title,
                //   selectRoom: info.event.extendedProps.roomName,
                //   startTime: info.event.start,
                //   endTime: info.event.EndTime,
                // });
                setTitle(info.event.title);
                setroomName(info.event.extendedProps.roomName);

                setId(info.event.extendedProps.eventid);

                // setId(info.event.extendedProps.User._id)
                // console.log(id, "for even id ");
                // console.log(userMeetingInfo, "Info");
                // setRowData(info.event.extendedProps.User);
                // setId(info.event.extendedProps.User._id);
                // {
                //   handleEdit(info.event);
                // }
                //
                // handleclickupdate(info.event);
                // handleclickupdate(info.event.extendedProps.User._id)

                // console.log(info.event.extendedProps.User._id, "Event_id")
              }}
            />
          </div>
        </section>

        <div className="row">
          <div className="mt-3 mb-2">
            <h2 className="text-center">𝐘𝐨𝐮𝐫 𝐄𝐯𝐞𝐧𝐭𝐬</h2>
          </div>
        </div>

        {/* User Data Table View  */}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="bg-info text-white">
                <tr>
                  <th className="text-black">
                    Title
                    <input
                      type="text"
                      value={filterTitle}
                      onChange={(e) => setFilterTitle(e.target.value)}
                      placeholder="Search Title"
                      style={{
                        width: "100px",
                        height: "22px",
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        marginLeft: "10px",
                      }}
                    />
                  </th>
                  <th className="text-black">Room Name</th>
                  <th className="text-black">StartTime</th>
                  <th className="text-black">EndTime</th>
                  <th className="text-black">Status</th>
                  <th className="text-black">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedEventData
                  .filter((item) =>
                    item.title.toLowerCase().includes(filterTitle.toLowerCase())
                  )
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.roomName}</td>
                      <td>
                        {item.StartTime.split("T").join(" ⋆ ").slice(0, -5)}
                        <span className="clock-animation"></span>
                      </td>
                      <td>
                        {item.EndTime.split("T").join(" ⋆ ").slice(0, -5)}
                        <span className="clock-animation"></span>
                      </td>
                      <td>{item.status}</td>
                      <td style={{ minWidth: 190 }}>
                        <Button
                          size="sm"
                          varient="danger"
                          style={{ backgroundColor: "Red" }}
                          onClick={() => {
                            handleViewShow(
                              setRowData(item),
                              setId(item._id),
                              setDelete(true)
                            );
                          }}
                        >
                          Cancel Meeting
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              &lt; 𝗣𝗿𝗲𝘃𝗶𝗼𝘂𝘀 𝗣𝗮𝗴𝗲
            </button>
            <span style={{ fontSize: "14px" }}>𝗣𝗮𝗴𝗲 {currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
            >
              𝗡𝗲𝘅𝘁 𝗣𝗮𝗴𝗲 &gt;
            </button>
          </div>
        </div>

        {/* create modal for view data */}
        <div className="model-box-view">
          <Modal
            show={ViewShow}
            onHide={handleViewClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Event Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div className="form-group">
                    <lable style={{ color: "black", fontWeight: "bold" }}>
                      Title
                    </lable>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={RowData.title}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <lable style={{ color: "black", fontWeight: "bold" }}>
                      Room Name
                    </lable>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={RowData.roomName}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <lable style={{ color: "black", fontWeight: "bold" }}>
                      Start Time
                    </lable>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={RowData.StartTime}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <lable style={{ color: "black", fontWeight: "bold" }}>
                      End Time
                    </lable>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={RowData.EndTime}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {Delete && (
                <Button
                  type="submit"
                  style={{ backgroundColor: "red" }}
                  className="btn btn-danger mt-4"
                  onClick={handleDelete}
                >
                  Confirm Again
                </Button>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-black"
                style={{ backgroundColor: "Gray" }}
                onClick={handleViewClose}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* modal for Submit data to database */}

        <div className="model-box-view">
          <Modal
            show={ViewPost}
            onHide={handlePostClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Your Meeting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Please Enter your Title"
                  />
                </div>

                <div>
                  <div className="form-group mt-3">
                    <label style={{ color: "blue" }}>Select your Room</label>
                    <select
                      placeholder="Select Room"
                      value={roomName}
                      required
                      onChange={(e) => setroomName(e.target.value)}
                    >
                      <option> </option>
                      <option>RoomOne</option>
                      <option>RoomTwo</option>
                      <option>RoomThree</option>
                      <option>RoomFour</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <label style={{ color: "blue" }}>StartTime</label>
                    <Datetime
                      value={StartTime}
                      required
                      onChange={(date) => setStartTime(date)}
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <label style={{ color: "blue" }}>EndTime</label>
                    <Datetime
                      value={EndTime}
                      required
                      onChange={(date) => setEndTime(date)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="btn btn-success mt-4"
                  onClick={handleclick}
                >
                  Add new Event
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-black"
                style={{ backgroundColor: "yellow" }}
                onClick={handlePostClose}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* modal for Edit data to database */}

        <div className="model-box-view">
          <Modal
            show={ViewEdit}
            onHide={handleEditClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Your Meeting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(id, "meeting id");
                  handleUpdateMeeting(id);
                }}
              >
                <div className="form-group">
                  <lable style={{ color: "black", fontWeight: "bold" }}>
                    Title
                  </lable>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    defaultValue={title}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      marginBottom: "15px",
                    }}
                  />
                </div>

                <div>
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Select Room
                  </span>
                  <select
                    value={roomName}
                    onChange={(e) => setroomName(e.target.value)}
                    defaultValue={RowData.roomName}
                    required
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "3px",
                      marginBottom: "15px",
                    }}
                  >
                    <option value="" disabled selected>
                      Select Room
                    </option>
                    <option value="𝐓𝐰𝐞𝐥𝐯𝐞 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦">
                      𝐓𝐰𝐞𝐥𝐯𝐞 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦
                    </option>
                    <option value="𝐒𝐢𝐱 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦">
                      𝐒𝐢𝐱 𝐒𝐞𝐚𝐭𝐞𝐫 𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦
                    </option>
                  </select>
                </div>
                {/* <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "15px",
                    }}
                  >
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      {" "}
                      Start Time{" "}
                    </span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={StartTime}
                      onChange={(date) => setStartTime(date)}
                      defaultValue={RowData.StartTime}
                      required
                    />

                    <span style={{ color: "black", fontWeight: "bold" }}>
                      End Time
                    </span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={EndTime}
                      onChange={(date) => setEndTime(date)}
                      defaultValue={RowData.EndTime}
                      required
                    />
                  </div> */}
                <div>
                  <div className="form-group mt-3">
                    <label style={{ color: "black", fontWeight: "bold" }}>
                      StartTime
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control pointer-events-none"
                      value={moment(StartTime).format("YYYY-MM-DDTHH:mm")}
                      // defaultValue={moment(RowData.StartTime).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        setStartTime(
                          moment(e.target.value).format("YYYY-MM-DDTHH:mm")
                        )
                      }
                      required
                    />
                    {/* <Datetime
                      value={StartTime}
                      onChange={(date) => setStartTime(date)}
                      defaultValue={RowData.StartTime}
                      className="pointer-events-none"
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        marginBottom: "5px",
                      }}
                      disabled
                    /> */}
                  </div>
                </div>
                <div>
                  <div className="form-group mt-3">
                    <label style={{ color: "black", fontWeight: "bold" }}>
                      EndTime
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control pointer-events-none"
                      value={moment(EndTime).format("YYYY-MM-DDTHH:mm")}
                      // defaultValue={moment(RowData.EndTime).format("YYYY-MM-DDTHH:mm")}
                      onChange={(e) =>
                        setEndTime(
                          moment(e.target.value).format("YYYY-MM-DDTHH:mm")
                        )
                      }
                      required
                    />
                    {/* <Datetime
                      value={EndTime}
                      onChange={(date) => setEndTime(date)}
                      defaultValue={RowData.EndTime}
                      className="pointer-events-none"
                      style={{
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "3px",
                        marginBottom: "5px",
                      }}
                    /> */}
                  </div>
                </div>
                <Button
                  type="submit"
                  style={{ backgroundColor: "skyblue" }}
                  className="btn btn-warning mt-4"
                >
                  Update
                </Button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-black"
                style={{ backgroundColor: "gray" }}
                onClick={handleEditClose}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
