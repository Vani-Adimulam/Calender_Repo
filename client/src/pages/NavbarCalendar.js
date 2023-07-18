import React from 'react';
import '../App.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";


function NavbarCalendar() {
  const [date, setDate] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = setInterval(() => {
      setDate(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const logut = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("objectId");
    localStorage.removeItem("isSuperUser");
    navigate("/login")
  }


  return (
    <nav className="w-full flex justify-center items-center" style={{ backgroundColor: 'lightblue' }}>
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          {/* <span className="text-black text-center text-2xl font-bold tracking-wider">𝕮𝖔𝖓𝖋𝖊𝖗𝖊𝖓𝖈𝖊 𝕽𝖔𝖔𝖒  𝕭𝖔𝖔𝓚𝖎𝖓𝖌</span> */}
          <span class="text-black text-center text-2xl font-bold tracking-wider">𝐂𝐨𝐧𝐟𝐞𝐫𝐞𝐧𝐜𝐞 𝐑𝐨𝐨𝐦 𝐁𝐨𝐨𝐤</span>
          <button
            className="md:hidden rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg viewBox="0 0 20 20" className="w-6 h-6 fill-current">
              <path
                fillRule="evenodd"
                d="M3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 14a1 1 0 110-2h6a1 1 0 110 2H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>

        </div>

        <div className={`md:flex md:items-center ${showMenu ? "block" : "hidden"}`}>
          <div className="flex flex-col md:flex-row md:mx-6">

            <p className="flex items-center justify-between">𝗪𝗲𝗹𝗰𝗼𝗺 : {localStorage.getItem("email")}</p>


            {/* <NavLink
              to="/dashboard"
              activeClassName="font-bold"
              className="my-1 text-gray-100 md:mx-4 md:my-0 hover:text-gray-300 text-black dashboard-img"
              onClick={() => setShowMenu(false)}
            >
            </NavLink> */}

            <NavLink
              to="/DispalyEvents"
              activeClassName="font-bold"
              className="my-1 text-gray-100 md:mx-4 md:my-0 hover:text-gray-300 text-black flex items-center"
              onClick={() => setShowMenu(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2C5.03 2 1 6.03 1 11c0 2.625 1.043 4.992 2.735 6.734a.994.994 0 001.442-.032l4.829-5.128a.5.5 0 01.706 0l2.342 2.484A7.966 7.966 0 0010 18a8 8 0 100-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                  clipRule="evenodd"
                />
              </svg>
              Dashboard
            </NavLink>


            {/* 
            <NavLink
              to="/login"
              activeClassName="font-bold"
              className="my-1 text-gray-100 md:mx-4 md:my-0 hover:text-gray-300 text-black"
              onClick={() => setShowMenu(false)}
            >
              𝐋𝐨𝐠𝐨𝐮𝐭
            </NavLink> */}

            <button
              className="my-1 text-gray-100 md:mx-1 md:my-0 hover:text-gray-300 text-black bg-light-blue hover:bg-red"
              onClick={() => { setShowMenu(false); logut(); }}
            >
              𝐋𝐨𝐠𝐨𝐮𝐭
            </button>




          </div>
        </div>

      </div>

    </nav>
  )
}

export default NavbarCalendar
