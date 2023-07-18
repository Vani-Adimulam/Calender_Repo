import axios from "axios";
import React, { useState } from "react";
import "../App.css";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import Backendapi from "../Backendapi";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // add state for password visibility
  const [isSuperUser, setIsSuperUser] = useState(false); // add state for super user
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    // Perform client-side validation 
    if (userName.trim() === "") {
      toast.error("Please enter your username");
      return;
    }

    if (email.trim() === "") {
      toast.error("Please enter your email");
      return;
    }

    if (password.trim() === "") {
      toast.error("Please enter your password");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const data = {
      username: userName,
      email: email,
      password: password,
      isSuperUser: isSuperUser, // include the isSuperUser field in the request
    };

    axios
      .post(`${Backendapi.REACT_APP_BACKEND_API_URL}/user/signup`, data)
      .then((res) => {
        toast.success("Registration is Success 😊", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        console.log(res);
        localStorage.clear();
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate("/login");
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred during registration");
        }
        console.log(err);
      });
  }

  // toggle password visibility state
  function togglePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  // handle super user checkbox change
  function handleSuperUserChange(event) {
    setIsSuperUser(event.target.checked);
  }

  return (
    <div>
      <div className="sl-screen flex">
        <Navbar />
      </div>
      <div className="w-screen h-[90vh] flex justify-center items-center login-page">
        <div className="blur-container">
          <form onSubmit={(e) => handleSubmit(e)} className="d-flex-col w-[100%] space-y-4 align-item-center">
            <h1 className="text-center text-xl">REGISTER</h1>
            <div className="d-flex justify-content-between">
              <label className="text-xl">𝐔𝐬𝐞𝐫𝐍𝐚𝐦𝐞</label>
              <input
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                required="Please enter Your Name"
                placeholder="john"
                className="border border-zinc-400 outline-none px-6 py-1 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="d-flex justify-content-between">
              <label className="text-xl">𝐄𝐦𝐚𝐢𝐥</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                required="Please enter Your Email"
                placeholder="example@p2fsemi.in"
                className="border border-zinc-400 outline-none px-6 py-1 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="d-flex justify-content-between">
              <label className="text-xl">𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={passwordVisible ? "text" : "password"}
                  required="Please enter Your Password"
                  placeholder="******"
                  className="border border-zinc-400 outline-none px-6 py-1 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center rounded-full bg-transparent"
                >
                  {passwordVisible ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {/* SuperUser CheckBox */}

            {/* <div className="d-flex justify-content-between">
              <label className="text-xl ">𝐒𝐮𝐩𝐞𝐫 𝐔𝐬𝐞𝐫</label>
              <input
                onChange={handleSuperUserChange}
                type="checkbox"
                className="h-5 w-5"
              />
            </div> */}
            <div className="w-[100%]" style={{ textAlign: "center" }}>
              <button type="submit" className="bg-blue-300 rounded-lg">
                Submit
              </button>
            </div>
            <div className="text-center">
              <p>
                𝓐𝖑𝖗𝖊𝖆𝖉𝖞 𝖍𝖆𝖛𝖊 𝖆𝖓 𝖆𝖈𝖈𝖔𝖚𝖓𝖙?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
