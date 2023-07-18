import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPligin from '@fullcalendar/timegrid';
import InteractionPlugin from "@fullcalendar/interaction";
import ListPlugin from "@fullcalendar/list";
import Datetime from 'react-datetime';
import Popup from 'reactjs-popup';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import *as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-datetime/css/react-datetime.css';
import NavbarCalendar from '../pages/NavbarCalendar';
import moment from 'moment-timezone';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backendapi from '../Backendapi';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css"






export default function (props) {
  // localStorage.getItem("email").split("@")[0]
  const [username, setuserName] = useState("");
  console.log(username)
  const [Emailusername, setEmailusername] = useState(localStorage.getItem("email"));
  console.log(Emailusername)
  const [title, setTitle] = useState("");
  const [roomName, setroomName] = useState("Big Room");
  const [StartTime, setStartTime] = useState(new Date());
  const [EndTime, setEndTime] = useState(new Date());
  const [availability, setAvailability] = useState(true);
  const [loginusername, setLoginUsername] = useState("")
  const [Hours, setHours, getHours] = useState(new Date())
  const navigate = useNavigate();
  const [showEndTime, setShowEndTime] = useState(false);
  const [endTimeManual, setEndTimeManual] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [displayEndTime, setDisplayEndTime] = useState(null)
  const [meetingTime, setMeetingTime] = useState({ startTime: null, endTime: null });


  const objectId = localStorage.getItem('objectId');
  const userid = objectId.replace(/^"(.*)"$/, '$1');
  const [User, setUser] = useState(userid);
  const [eventid, setEventid] = useState()

  const [Data, setData] = useState([]); // store the post data
  const [eventData, setEventData] = useState([]); // store the Display data
  const [RowData, setRowData] = useState([]);
  const [ViewShow, setViewShow] = useState(false);
  const handleViewShow = () => { setViewShow(true) }
  const handleViewClose = () => { setViewShow(false) }


  // For Edit Modal*****
  const [ViewEdit, setEditShow] = useState(false);
  const handleEditShow = () => { setEditShow(true) }
  const handleEditClose = () => { setEditShow(false) }

  // For delete Modal*****
  const [ViewDelete, setDeleteShow] = useState(false);
  const handleDeletShow = () => { setDeleteShow(true) }
  const handleDeleteClose = () => { setDeleteShow(false) }

  // For Add new data Modal*****
  const [ViewPost, setPostShow] = useState(false);
  const handlePostShow = () => { setPostShow(true) }
  const handlePostClose = () => { setPostShow(false) }

  const [Delete, setDelete] = useState(false);
  //id for update record and delete
  const [id, setId] = useState("");

  //create a event
  const handleclick = async (event) => {
    event.preventDefault();

    if (moment(EndTime).isBefore(moment(StartTime))) {
      toast.error("EndTime cannot be less than StartTime");
      return;
    }

    // Condition for past time slot booking
    const currentTimeIST = moment().tz('Asia/Kolkata');

    if (moment(StartTime).isBefore(currentTimeIST)) {
      toast.error("Cannot book events for past time slots");
      setTimeout(() => {
        toast.info(`Book your event with the current time: ${currentTimeIST.format('YYYY-MM-DD HH:mm:ss')}`);
      }, 3000);
      return;
    }

    const payload = {
      username:username,
      title: title,
      roomName: roomName,
      StartTime: moment(StartTime).tz('Asia/Kolkata').format(),
      EndTime: moment(EndTime).tz('Asia/Kolkata').format(),
      availability: availability,
      User: User,
    };

    const config = { headers: { "Content-Type": "application/json" } };

    try {
      const { data } = await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/create-event`, payload, config);
      localStorage.setItem("eventid", data.eventId);
      toast.success("Event is Confirmed 😊", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      try {
        const eventId = localStorage.getItem("eventid");
        console.log(eventId);
        console.log(username.username)
        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/${username.username}/${Emailusername}/${title}`);
        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/superuser/${username.username}/${Backendapi.REACT_APP_SuperUser_EMAIL}/${title}`); // Send email to superuser
        toast.success("Check Your Confirmation Email");
      } catch (error) {
        toast.error("Unable to send Email");
      }

      window.location.reload();
    } catch (e) {
      if (e.response.status === 409) {
        toast.error("The slot is already booked ☹️");
      } else {
        toast.error("The slot is already booked ☹️");
        navigate("/Calendar");
      }
    }
  };

  //display user details
  useEffect(() => {
    axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/user/getusers/${User}`)
      .then((d) => {
        const cdata = d.data
        setData(cdata)
        console.log(cdata)
      })
      .catch((e) => { console.log(e) })

  }, [])



  //Calendar Display
  // useEffect(() => {
  //   axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
  //     .then((d) => {
  //       const cdata = d.data.map(item => {
  //         return { eventid: item._id, username: item.username, title: item.title, date: item.StartTime, EndTime: item.EndTime, User: item.User }
  //       })
  //       setData(cdata)
  //       // console.log(cdata)
  //     })
  //     .catch((e) => { console.log(e) })

  // }, [])



  // FullCalendar Display Color Variation
  let userEmailName;
  useEffect(() => {
    axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
      .then((d) => {
        const currentTime = moment(); // Get current system date and time
        const cdata = d.data.map(item => {
          const startTime = moment(item.StartTime);
          const endTime = moment(item.EndTime);
          let colorClass;

          if (currentTime.isBefore(startTime)) {
            colorClass = 'event-yellow'; // Condition 1: StartTime is not yet started
          } else if (currentTime.isBetween(startTime, endTime)) {
            colorClass = 'event-green'; // Condition 2: StartTime is started but not yet expired
          } else {
            colorClass = 'event-gray'; // Condition 3: EndTime is expired
          }
          setuserName(item.User)
          userEmailName = item.User.username;
          console.log(item.User.username)
          return {
            eventid: item._id,
            username: item.User.username,
            title: item.title,
            roomName: item.roomName,
            date: item.StartTime,
            EndTime: item.EndTime,
            User: item.User,
            colorClass: colorClass // Add colorClass property to the object
          };
        });


        setData(cdata);
        console.log(cdata)
      })

      .catch((e) => { console.log(e) });
  }, []);
  
  console.log(username)
  console.log(userEmailName)

  // Display Login User Data

  useEffect(() => {

    const objectId = localStorage.getItem('objectId');
    const myString = objectId.replace(/^"(.*)"$/, '$1');
    axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/getuserevent/${myString}`)
      .then((d) => {
        setEventData(d.data.events)
        console.log(d.data.events)
      })
      .catch((e) => { console.log(e) })
  }, [])



  //update Event

  const handleEdit = async (e) => {
    e.preventDefault();

    const currentTimeIST = moment().tz('Asia/Kolkata');

    if (moment(StartTime).isBefore(currentTimeIST)) {
      toast.error("Cannot update events for past time slots");
      setTimeout(() => {
        toast.info(`Update your event with the current time: ${currentTimeIST.format('YYYY-MM-DD HH:mm:ss')}`);
      }, 3000);
      return;
    }

    if (moment(EndTime).isBefore(moment(StartTime))) {
      toast.error("EndTime cannot be less than StartTime");
      return;
    }

    const Credentials = {
      title,
      roomName,
      StartTime: moment.tz(StartTime, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment.tz(EndTime, 'YYYY-MM-DD HH:mm:ss', 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      availability
    };

    try {
      const response = await axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/update-event/${id}`, Credentials);
      setData(response.data);
      toast.success("Event updated successfully 😊", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      try {
        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/${username.username}/${Emailusername}`);
        toast.success("Check your email, event details have been updated");
      } catch (error) {
        toast.error("Unable to send email");
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error("The slot is already booked ☹️");
      } else {
        toast.error("The slot is already booked ☹️");
      }
      navigate("/Calendar");
    }

    navigate("/Dashboard");
  };

  //handle delete function
  const handleDelete = async () => {


    try {
      const response = await axios.delete(`${Backendapi.REACT_APP_BACKEND_API_URL}/delete-event/${id}`);
      setData(response.data.eventId);
      console.log(response.data.title)
      const mailTitle = response.data.title
      toast.success("Event deleted successfully 😊", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      // Send deletion confirmation email
      try {
        const eventId = localStorage.getItem("eventid");
        console.log(username.username)
        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/deletion/${username.username}/${Emailusername}/${mailTitle}`);
        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/deletionSuperUser/${username.username}/${Backendapi.REACT_APP_SuperUser_EMAIL}/${mailTitle}`);
        toast.success("Deletion confirmation email sent");
      } catch (error) {
        toast.error("Unable to send deletion confirmation email");
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    window.location.reload();
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

  useEffect(() => {
    // Get the current datetime
    const currentDatetime = new Date().toISOString().slice(0, 16);

    // Set the current datetime as the initial value for StartTime and EndTime
    setStartTime(currentDatetime);
    setEndTime(currentDatetime);
  }, []);


  // Function to convert UTC time to IST
  const convertToIST = (utcDateTime) => {
    const istDateTime = moment.utc(utcDateTime).utcOffset("+05:30").format("YYYY-MM-DDTHH:mm");
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
        <div className='text-center'>
          <>
            <Button
              className="text-black"
              style={{ backgroundColor: 'skyblue' }}
              onClick={handleOpenModal}
            >

              <span style={{ color: 'white', fontWeight: 'bold' }}>
                <i className="fa fa-plu">Schedule Meeting</i>
              </span>
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered
              style={{ backgroundColor: 'transparent' }}
              backdrop="static"
              keyboard={false}

            >
              <Modal.Header
                closeButton
                style={{ backgroundColor: 'lightgray' }}
              >
                <Modal.Title>
                  <label style={{ display: 'block', marginBottom: '10px', color: '#444', fontFamily: 'Arial', fontSize: '20px' }}>
                    <span style={{ color: 'black', fontWeight: 'bold' }}> Hi, </span>
                    <span style={{ color: 'red', fontWeight: 'bold' }}>{username.username}</span>
                    <span style={{ color: 'black', fontWeight: 'bold' }}> Please book your Event</span>
                  </label>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ backgroundColor: 'lightgray' }}>
                <form onSubmit={handleclick}
                  style={{ backgroundColor: 'lightgray', padding: '20px', borderRadius: '5px', width: '350px' }}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={username.username}
                    // onChange={(e) => setuserName(e.target.value)}
                    required
                    placeholder={username.username}
                    hidden="true"
                  />

                  {/* <lable>Enter Your Title</lable> */}
                  <span style={{ color: 'black', fontWeight: 'bold' }}> Enter Your Title </span>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  {/* <label>Select Room:</label> */}
                  <span style={{ color: 'black', fontWeight: 'bold' }}>Select Room</span>
                  <select
                    className="form-control"
                    value={roomName}
                    onChange={(e) => setroomName(e.target.value)}
                    required
                  >

                    <option value="Big Room">Big Room</option>
                    <option value="Small Room">Small Room</option>
                    <option value="Booth One">Booth One</option>
                    <option value="Booth Two">Booth Two</option>
                  </select>

                  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
                    <span style={{ color: 'black', fontWeight: 'bold' }}> Start Time </span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={StartTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />

                    <span style={{ color: 'black', fontWeight: 'bold' }}>End Time</span>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={EndTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />

                  </div>
                  <button type="submit" className="btn btn-success">
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      ADD EVENT
                    </span>
                  </button>
                </form>
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: 'gray' }}>
                <Button variant="dark" onClick={handleCloseModal}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>𝒞𝓁𝑜𝓈𝑒</span>
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        </div>

        {/* // Inside your component's render or return statement */}
        <section style={{ backgroundColor: 'white' }}>
          <div style={{ position: "relative", zIndex: 0 }}>
            <FullCalendar
              timeZone="UTC"
              plugins={[dayGridPlugin, timeGridPligin, InteractionPlugin, ListPlugin]}
              initialView="dayGridMonth"
              events={Data}
              headerToolbar={{
                start: 'today prev,next', // will normally be on the left. if RTL, will be on the right
                center: 'title',
                end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",// will normally be on the right. if RTL, will be on the left
                eventColor: '#378006',
              }}
              height="80vh"
              eventDidMount={(info) => {
                return new bootstrap.Popover(info.el, {
                  title: info.event.title,
                  placement: "auto",
                  trigger: "hover",
                  customClass: "PopoverStyle",
                  content: `
                    <strong>Title:</strong> ${info.event.title}<br>
                    <strong>Room Name:</strong> ${info.event.extendedProps.roomName}<br>
                    <strong>Username:</strong> ${info.event.extendedProps.username}
                  `,
                  html: true,
                });
              }}

              eventClassNames={(info) => {
                return info.event.extendedProps.colorClass;
              }}
            />
          </div>
        </section>

        <div className='row'>
          <div className='mt-5 mb-4'>
            <h2 className='text-center'>🆈🅾🆄🆁 🅴🆅🅴🅽🆃🆂</h2>
          </div>
        </div>

        {/* User Data Table View  */}
        <div className='row'>
          <div className='table-responsive'>
            <table className='table table-striped table-hover table-bordered'>
              <thead className='bg-warning text-white'>
                <tr>
                  <th>Title</th>
                  <th>Room Name</th>
                  <th>StartTime</th>
                  <th>EndTime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  eventData.map((item) =>
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.roomName}</td>
                      <td>
                        {item.StartTime.split('T').join(' ⋆ ').slice(0, -5)}

                        <span className="clock-animation">🕒</span>
                      </td>
                      <td>
                        {item.EndTime.split('T').join(' ⋆ ').slice(0, -5)}

                        <span className="clock-animation">🕒</span>
                      </td>
                      <td style={{ minWidth: 190 }}>
                        {/* <Button size='sm' varient='primary' style={{ backgroundColor: 'Green' }} onClick={() => { handleViewShow(setRowData(item)) }}>View</Button>|
                        <Button size='sm' varient='warning' className='text-black' style={{ backgroundColor: 'yellow' }} onClick={() => { handleEditShow(setRowData(item), setId(item._id)) }}>Edit</Button>| */}
                        <Button size='sm' varient='danger' style={{ backgroundColor: 'Red' }} onClick={() => { handleViewShow(setRowData(item), setId(item._id), setDelete(true)) }}>𝘾𝙖𝙣𝙘𝙚𝙡 𝙈𝙚𝙚𝙩𝙞𝙣𝙜</Button>
                      </td>
                    </tr>

                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* create modal for view data */}
        <div className='model-box-view'>
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
                  <div className='form-group'>
                    <input type='text' className='form-control' required value={RowData.title} readOnly />
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <input type='text' className='form-control' required value={RowData.roomName} readOnly />
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <input type='text' className='form-control' required value={RowData.StartTime} readOnly />
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <input type='text' className='form-control' required value={RowData.EndTime} readOnly />
                  </div>
                </div>



              </div>
              {
                Delete && (
                  <Button type='submit' style={{ backgroundColor: 'red' }} className='btn btn-danger mt-4' onClick={handleDelete}>Confirm Again</Button>
                )
              }


            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' className='text-black' style={{ backgroundColor: 'Gray' }} onClick={handleViewClose}>Close</Button>
            </Modal.Footer>

          </Modal>
        </div>

        {/* modal for Submit data to database */}

        <div className='model-box-view'>
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
                <div className='form-group'>
                  <input type='text' className='form-control' required value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Please Enter your Title' />
                </div>

                <div>
                  <div className='form-group mt-3'>
                    <label style={{ color: "blue" }}>Select your Room</label>
                    <select placeholder="Select Room" value={roomName} required onChange={e => setroomName(e.target.value)}>
                      <option>  </option>
                      <option>RoomOne</option>
                      <option>RoomTwo</option>
                      <option>RoomThree</option>
                      <option>RoomFour</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <label style={{ color: "blue" }}>StartTime</label>
                    <Datetime value={StartTime} required onChange={date => setStartTime(date)} />
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <label style={{ color: "blue" }}>EndTime</label>
                    <Datetime value={EndTime} required onChange={date => setEndTime(date)} />
                  </div>
                </div>

                <Button type='submit' className='btn btn-success mt-4' onClick={handleclick}>Add new Event</Button>

              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' className='text-black' style={{ backgroundColor: 'yellow' }} onClick={handlePostClose}>Close</Button>
            </Modal.Footer>

          </Modal>
        </div>

        {/* modal for Edit data to database */}

        <div className='model-box-view'>
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
              <form onSubmit={handleEdit}>
                <div className='form-group'>
                  <lable>Title</lable>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required defaultValue={RowData.title}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '15px' }}
                  />

                </div>

                <div>
                  <select
                    value={roomName}
                    onChange={e => setroomName(e.target.value)} defaultValue={RowData.roomName}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '15px' }}
                  >

                    <option value="Big Room">Big Room</option>
                    <option value="Small Room">Small Room</option>
                    <option value="Booth One">Booth One</option>
                    <option value="Booth Two">Booth Two</option>
                  </select>

                </div>
                <div>
                  <div className='form-group mt-3'>
                    <label style={{ color: "blue" }}>StartTime</label>
                    <Datetime
                      value={StartTime}
                      onChange={date => setStartTime(date)}
                      defaultValue={RowData.StartTime}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '5px' }}
                    />
                  </div>
                </div>
                <div>
                  <div className='form-group mt-3'>
                    <label style={{ color: "blue" }}>EndTime</label>
                    <Datetime
                      value={EndTime}
                      onChange={date => setEndTime(date)}
                      defaultValue={RowData.EndTime}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '3px', marginBottom: '5px' }}
                    />
                  </div>
                </div>
                <Button type='submit' style={{ backgroundColor: 'skyblue' }} className='btn btn-warning mt-4'>Update</Button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' className='text-black' style={{ backgroundColor: 'gray' }} onClick={handleEditClose}>Close</Button>
            </Modal.Footer>

          </Modal>
        </div>

      </div>
    </div>


  )
}


