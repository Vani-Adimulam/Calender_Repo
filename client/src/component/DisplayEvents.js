import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import '../index.css';
import '../App.css';
import Backendapi from '../Backendapi';
import { toast } from 'react-toastify';
import NavbarOne from '../pages/NavbarOne';

export default function DisplayEvents() {
  const [eventData, setEventData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchBookedBy, setSearchBookedBy] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [username, setuserName] = useState(JSON.parse(localStorage.getItem("username")));
  console.log(username)

  // const [Emailusername, setEmailusername] = useState(localStorage.getItem("email"));
  console.log(localStorage.getItem("email"))
  let eventId;
  // let username;
  let title;
  //third code
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
      .then((res) => {
        const sortedData = res.data.sort((a, b) => {
          const aStartTime = new Date(a.StartTime).getTime();
          const aEndTime = new Date(a.EndTime).getTime();
          const bStartTime = new Date(b.StartTime).getTime();
          const bEndTime = new Date(b.EndTime).getTime();
          const currentSystemTime = new Date().getTime();

          if (aEndTime < currentSystemTime && bEndTime < currentSystemTime) {
            return 0; // No change in order if both events are expired
          } else if (aEndTime < currentSystemTime) {
            return 1; // Move event A to the end
          } else if (bEndTime < currentSystemTime) {
            return -1; // Move event B to the end
          } else {
            const aTimeDiff = Math.abs(aStartTime - currentSystemTime);
            const bTimeDiff = Math.abs(bStartTime - currentSystemTime);
            return aTimeDiff - bTimeDiff;
          }
        });

        setEventData(sortedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAccept = async (eventId, username, title, email) => {
    console.log(username)
    await axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/accept-event/${eventId}`)
    await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/acceptmail/${username}/${email}/${title}`)
      .then((res) => {
        setEventData(prevData => {
          const updatedData = prevData.map(item => {
            if (item._id === eventId) {
              return { ...item, status: '𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐞𝐝' };
            }
            return item;
          });
          return updatedData;
        });
        console.log(res.data);

      })

      .catch((error) => {
        console.log(error);
      });
    // window.location.reload();
    toast.success("Event Confirmed 😊", {
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

    // toast.success("Accept Mail has been sent")

  };

  const handleReject = async (eventId, username, title, email) => {
    console.log(email)
    await axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/reject-event/${eventId}`)
    await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/rejectmail/${username}/${email}/${title}`)
      .then((res) => {
        setEventData(prevData => {
          const updatedData = prevData.map(item => {
            if (item._id === eventId) {
              return { ...item, status: '𝐑𝐞𝐣𝐞𝐜𝐭𝐞𝐝' };
            }
            return item;
          });
          return updatedData;
        });
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // window.location.reload();
    toast.success("Event is Rejected", {
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
    // toast.success("Reject Mail has been sent")


  };

  const renderActions = (item) => {

    console.log(item.User.email)
    if (localStorage.getItem('isSuperUser') === 'true') {
      return (
        <td>
          {item.status === '𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝' && (
            <>
              <button
                className="btn btn-success mr-2"
                onClick={() => handleAccept(item._id, item.User.username, item.title, item.User.email)}
              >
                Accept
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleReject(item._id, item.User.username, item.title, item.User.email)}
              >
                Reject
              </button>
            </>
          )}
        </td>
      );
    } else {
      return <td></td>;
    }
  };


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  const filteredEvents = eventData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      item.username.toLowerCase().includes(searchBookedBy.toLowerCase()) &&
      item.status.toLowerCase().includes(searchStatus.toLowerCase())
    );
  })
    .sort((a, b) => {
      if (a.status === "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝" && b.status !== "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝") {
        return -1; // Move event A with status "Initiated" to the beginning
      } else if (a.status !== "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝" && b.status === "𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝") {
        return 1; // Move event B with status "Initiated" to the beginning
      }
      return 0; // No change in order for other events
    });


  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const pageNumbers = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log(currentEvents)
  currentEvents.map(item => {
    console.log(item.User)
  })

  return (


    <div>
      <NavbarOne />
      <div className="row">
        <div className="mt-3 mb-2 d-flex justify-content-center">
          <h2>𝐁𝐨𝐨𝐤𝐞𝐝 𝐄𝐯𝐞𝐧𝐭𝐬</h2>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="bg-info text-white">
              <tr>
                <th className='text-black'>Title
                  <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Search Title"
                    style={{ marginLeft:'10px', width: '100px', height: '22px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </th>
                <th className='text-black'>Room Name</th>
                <th className='text-black'>StartTime</th>
                <th className='text-black'>EndTime</th>
                <th className='text-black'>Booked By
                  <input
                    type="text"
                    value={searchBookedBy}
                    onChange={(e) => setSearchBookedBy(e.target.value)}
                    placeholder="Search Name"
                    style={{marginLeft:'5px', width: '110px', height: '22px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </th>
                <th className='text-black'>Status</th>
                {localStorage.getItem('isSuperUser') === 'true' && (
                  <th className='text-black'>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(currentEvents.length) != 0 ? currentEvents.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.roomName}</td>
                  <td>
                    {item.StartTime.split('T').join(' ⋆ ').slice(0, -5)}
                    <span className="clock-animation"></span>
                  </td>
                  <td>
                    {item.EndTime.split('T').join(' ⋆ ').slice(0, -5)}
                    <span className="clock-animation"></span>
                  </td>
                  <td>{item.User.username}</td>
                  <td>{item.status}</td>
                  {renderActions(item)}
                </tr>

              )) : "Loading..."
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        {Array.from({ length: pageNumbers }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            className={`btn ${currentPage === number ? 'btn-primary' : 'btn-light'}`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>

    </div>
  );
}












