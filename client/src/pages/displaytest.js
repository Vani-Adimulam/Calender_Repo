// import React, { useRef, useState, useEffect } from 'react';
// import axios from 'axios';
// import "bootstrap/dist/css/bootstrap.min.css";
// import '../index.css';
// import '../App.css';
// import Backendapi from '../Backendapi';


// export default function () {

//     const [eventData, setEventData] = useState([]); // store the Display data

//     //this api Display Event 

//     useEffect(() => {
//         axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
//             .then((d) => {
//                 setEventData(d.data)
//                 console.log(d.data)

//             })
//             .catch((e) => { console.log(e) })

//     }, [])

//     return (

//         <div >
//             <div className='row'>
//                 <div className='mt-5 mb-4'>
//                     <h2>𝕭𝖔𝖔𝖐𝖊𝖉 𝕰𝖛𝖊𝖓𝖙𝖘</h2>
//                 </div>
//             </div>

//             <div className='row'>
//                 <div className='table-responsive'>
//                     <table className='table table-striped table-hover table-bordered'>
//                         <thead className='bg-warning text-white'>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Room Name</th>
//                                 <th>StartTime</th>
//                                 <th>EndTime</th>
//                                 <th>Event Booked by</th>

//                             </tr>
//                         </thead>
//                         <tbody >
//                             {eventData.map((item) =>

//                                 <tr key={item._id}>
//                                     <td >{item.title}</td>
//                                     <td>{item.roomName}</td>
//                                     <td>
//                                         {item.StartTime.split('T').join(' ⋆ ').slice(0, -5)}

//                                         <span className="clock-animation">🕒</span>
//                                     </td>
//                                     <td>
//                                         {item.EndTime.split('T').join(' ⋆ ').slice(0, -5)}

//                                         <span className="clock-animation">🕒</span>
//                                     </td>
//                                     <td>{item.username}</td>
//                                 </tr>
//                             )}

//                         </tbody>
//                     </table>

//                 </div>
//             </div>


//         </div>

//     )
// }

// second code

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import "bootstrap/dist/css/bootstrap.min.css";
// import '../index.css';
// import '../App.css';
// import Backendapi from '../Backendapi';

// export default function DisplayEvent() {
//   const [eventData, setEventData] = useState([]);

//   useEffect(() => {
//     axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
//       .then((res) => {
//         setEventData(res.data);
//         console.log(res.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const handleAccept = (eventId) => {
//     updateEventStatus(eventId, 'accept');
//   };

//   const handleReject = (eventId) => {
//     updateEventStatus(eventId, 'reject');
//   };

//   const updateEventStatus = (eventId, status) => {
//     axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/update-event/${eventId}`, { status })
//       .then((res) => {
//         setEventData(prevData => {
//           const updatedData = prevData.map(item => {
//             if (item._id === eventId) {
//               return { ...item, status };
//             }
//             return item;
//           });
//           return updatedData;
//         });
//         console.log(res.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const renderActions = (item) => {
//     if (localStorage.getItem('isSuperUser') === 'true') {
//       return (
//         <td>
//           {item.status === 'initiated' && (
//             <>
//               <button
//                 className="btn btn-success"
//                 onClick={() => handleAccept(item._id)}
//               >
//                 Accept
//               </button>
//               <button
//                 className="btn btn-danger"
//                 onClick={() => handleReject(item._id)}
//               >
//                 Reject
//               </button>
//             </>
//           )}
//         </td>
//       );
//     } else {
//       return <td></td>;
//     }
//   };

//   return (
//     <div>
//       <div className="row">
//         <div className="mt-5 mb-4">
//           <h2>𝕭𝖔𝖔𝖐𝖊𝖉 𝕰𝖛𝖊𝖓𝖙𝖘</h2>
//         </div>
//       </div>

//       <div className="row">
//         <div className="table-responsive">
//           <table className="table table-striped table-hover table-bordered">
//             <thead className="bg-warning text-white">
//               <tr>
//                 <th>Title</th>
//                 <th>Room Name</th>
//                 <th>StartTime</th>
//                 <th>EndTime</th>
//                 <th>Event Booked by</th>
//                 <th>Status</th>
//                 {localStorage.getItem('isSuperUser') === 'true' && (
//                   <th>Actions</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {eventData.map((item) => (
//                 <tr key={item._id}>
//                   <td>{item.title}</td>
//                   <td>{item.roomName}</td>
//                   <td>
//                     {item.StartTime.split('T').join(' ⋆ ').slice(0, -5)}
//                     <span className="clock-animation">🕒</span>
//                   </td>
//                   <td>
//                     {item.EndTime.split('T').join(' ⋆ ').slice(0, -5)}
//                     <span className="clock-animation">🕒</span>
//                   </td>
//                   <td>{item.username}</td>
//                   <td>{item.status}</td>
//                   {renderActions(item)}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


//third code

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import '../index.css';
import '../App.css';
import Backendapi from '../Backendapi';
import { toast } from 'react-toastify';

export default function DisplayEvent() {
  const [eventData, setEventData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchBookedBy, setSearchBookedBy] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  // const [Emailusername, setEmailusername] = useState(localStorage.getItem("email"));
  console.log(localStorage.getItem("email"))
  let eventId;
  let username;
  let title;

  useEffect(() => {
    axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
      .then((res) => {
        setEventData(res.data);
        //  const eventId =  console.log(res.data);
        //  const myString = eventId.replace(/^"(.*)"$/, '$1');
        console.log(res.data[0].User.email)
        console.log(res.data[0]._id)
        eventId = res.data[0]._id
        console.log(eventId)


        //  console.log(res.data[0].username)
        //  username = res.data[0].username
        //  console.log(username)

        //  console.log(res.data[0].title)
        //  title = res.data[0].title
        //  console.log(title)

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAccept = async (eventId, username, title, email) => {
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

    toast.success("Event is Confirmed 😊", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    window.location.reload();
    toast.success("Accept Mail has been sent")
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
    toast.success("Event is Rejected", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
    window.location.reload();
    toast.success("Reject Mail has been sent")
  };

  const renderActions = (item) => {

    console.log(item.User.email)
    if (localStorage.getItem('isSuperUser') === 'true') {
      return (
        <td>
          {item.status === '𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐞𝐝' && (
            <>
              <button
                className="btn btn-success"
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
  });

  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const pageNumbers = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div>
      <div className="row">
        <div className="mt-5 mb-4">
          <h2>𝕭𝖔𝖔𝖐𝖊𝖉 𝕰𝖛𝖊𝖓𝖙𝖘</h2>
        </div>
      </div>

      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="bg-warning text-white">
              <tr>
                <th className='text-black'>Title
                  <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Search Title"
                    style={{ width: '100px', height: '22px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </th>
                <th className='text-black'>Room Name</th>
                <th className='text-black'>StartTime</th>
                <th className='text-black'>EndTime</th>
                <th className='text-black'>Event BookedBy
                  <input
                    type="text"
                    value={searchBookedBy}
                    onChange={(e) => setSearchBookedBy(e.target.value)}
                    placeholder="Search Name"
                    style={{ width: '110px', height: '22px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </th>
                <th className='text-black'>Status</th>
                {localStorage.getItem('isSuperUser') === 'true' && (
                  <th className='text-black'>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((item) => (
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
                  <td>{item.User.username}</td>
                  <td>{item.status}</td>
                  {renderActions(item)}
                </tr>
              ))}
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






