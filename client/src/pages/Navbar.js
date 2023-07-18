
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const [date, setDate] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setDate(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full flex justify-center items-center" style={{ backgroundColor: 'lightblue' }}>
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          {/* <Link className="text-black text-xl font-semibold">𝕮𝖔𝖓𝖋𝖊𝖗𝖊𝖓𝖈𝖊 𝕽𝖔𝖔𝖒  𝕭𝖔𝖔𝓚𝖎𝖓𝖌</Link> */}
          {/* <span className="text-black text-center text-3xl font-bold tracking-wider">Conference Room Book</span> */}
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

        {/* <div className="text-right">
          <p className="date-time text-black text-size-10 ">{date}</p>
        </div> */}
        

        <div className={`md:flex md:items-center ${showMenu ? "block" : "hidden"}`}>
          {/* <div className="flex flex-col md:flex-row md:mx-6">
            <NavLink
              to="/login"
              activeClassName="font-bold"
              className="my-1 text-gray-100 md:mx-4 md:my-0 hover:text-gray-300 text-black"
              onClick={() => setShowMenu(false)}
            >
              𝕷𝖔𝖌𝖎𝖓
            </NavLink>
            <NavLink
              to="/register"
              activeClassName="font-bold"
              className="my-1 text-gray-100 md:mx-4 md:my-0 hover:text-gray-300 text-black"
              onClick={() => setShowMenu(false)}
            >
              𝕽𝖊𝖌𝖎𝖘𝖙𝖊𝖗
            </NavLink>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
