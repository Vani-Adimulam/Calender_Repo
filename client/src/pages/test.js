import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import '../index.css';
import '../App.css';
import Backendapi from '../Backendapi';
import { toast } from 'react-toastify';

export default function DisplayEvent() {
    const [eventData, setEventData] = useState([]);
    const [Emailusername, setEmailusername] = useState(localStorage.getItem("email"));
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchBookedBy, setSearchBookedBy] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    useEffect(() => {
        axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/get-events`)
            .then((res) => {
                setEventData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleAccept = async (eventId, username, title, email) => {
        await axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/accept-event/${eventId}`);

        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/acceptmail/${username}/${email}/${title}`)
            .then((res) => {
                setEventData(prevData => {
                    const updatedData = prevData.map(item => {
                        if (item._id === eventId) {
                            return { ...item, status: 'Confirmed' };
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
        toast.success("Accept Mail has been sent");
    };

    const handleReject = async (eventId, username, title, email) => {
        await axios.put(`${Backendapi.REACT_APP_BACKEND_API_URL}/reject-event/${eventId}`);

        await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/send/rejectmail/${username}/${email}/${title}`)
            .then((res) => {
                setEventData(prevData => {
                    const updatedData = prevData.map(item => {
                        if (item._id === eventId) {
                            return { ...item, status: 'Rejected' };
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
        toast.success("Reject Mail has been sent");
    };

    const renderActions = (item) => {
        if (localStorage.getItem('isSuperUser') === 'true') {
            return (
                <td>
                    {item.status === 'Initiated' && (
                        <>
                            <button
                                className="btn btn-success"
                                onClick={() => handleAccept(item._id, item.username, item.title, item.User.email)}
                            >
                                Accept
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleReject(item._id, item.username, item.title, item.User.email)}
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
                    <h2>Booked Events</h2>
                </div>
            </div>

            <div className="row">
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered">

                        <thead className="bg-warning text-white">
                            <tr>
                                <th>
                                    Title
                                    <input
                                        type="text"
                                        value={searchTitle}
                                        onChange={(e) => setSearchTitle(e.target.value)}
                                        placeholder="Search title"
                                    />
                                </th>
                                <th>Room Name</th>
                                <th>StartTime</th>
                                <th>EndTime</th>
                                <th>
                                    Event Booked By
                                    <input
                                        type="text"
                                        value={searchBookedBy}
                                        onChange={(e) => setSearchBookedBy(e.target.value)}
                                        placeholder="Search booked by"
                                    />
                                </th>
                                <th>Status</th>

                                {localStorage.getItem('isSuperUser') === 'true' && <th>Actions</th>}
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
                                    <td>{item.username}</td>
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