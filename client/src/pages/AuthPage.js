import axios from "axios";
import React, { useState } from "react";
import '../App.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import Backendapi from "../Backendapi";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // add state for password visibility
  const [isLoginMode, setIsLoginMode] = useState(true); // track login/register mode
  const [objectId, setObjectId] = useState("");

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    // Perform client-side validation
    if (isLoginMode && email.trim() === '') {
      toast.error("Please enter your email");
      return;
    }

    if (isLoginMode && password.trim() === '') {
      toast.error("Please enter your password");
      return;
    }

    if (!isLoginMode && userName.trim() === '') {
      toast.error("Please enter your username");
      return;
    }



    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (isLoginMode && !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const data = {
      username: userName,
      email: email,
      password: password,
      objectId: objectId
    };
    localStorage.setItem("email", email)
    localStorage.setItem("objectId", objectId)

    const url = isLoginMode ? `${Backendapi.REACT_APP_BACKEND_API_URL}/user/login` : `${Backendapi.REACT_APP_BACKEND_API_URL}/user/signup`;

    axios
      .post(url, data)
      .then((res) => {
        if (isLoginMode) {
          toast.success("Login Success 😊", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success("Registration Success 😊", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });
        }
        console.log(res);
        // localStorage.clear();
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem('objectId', JSON.stringify(res.data.user['_id']))
        navigate("/Dashboard");
      })
      
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred");
        }
        console.log(err);
      });
  }

  function toggleMode() {
    setIsLoginMode((prevMode) => !prevMode);
  }

  // toggle password visibility state
  function togglePasswordVisibility() {
    setPasswordVisible((prev) => !prev);
  }

  return (
    <div >
      <Navbar />
      {/* className="login-page w-screen h-[100vh] flex justify-center items-center" */}
      <div className="w-screen h-[90vh] d-flex  justify-content-center align-item-center items-top login-page" style={{ padding: "50px" }}>

        <div className="blur-container d-flex align-item-center h-75" >
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="d-flex-col w-[100%] space-y-2 align-item-center "
          >
            <h1 className="text-xl text-center">{isLoginMode ? "🆂🅸🅶🅽🅸🅽" : "🆁🅴🅶🅸🆂🆃🅴🆁"}</h1>
            {!isLoginMode && (
              <div className="d-flex justify-content-between">
                <label className="text-xl ">𝐔𝐬𝐞𝐫 𝐍𝐚𝐦𝐞</label>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  required="Please enter Your Name"
                  placeholder="Enter Your User Name"
                  className=" border border-zinc-400 outline-none  px-6 py-2 text-black "
                />
              </div>
            )}
            <div className="d-flex justify-content-between">
              <label className="text-xl ">{isLoginMode ? "𝐄𝐦𝐚𝐢𝐥" : "𝐄𝐦𝐚𝐢𝐥"}</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                required="Please enter Your Email"
                placeholder="Enter Your Email"
                className=" border border-zinc-400 outline-none  px-6 py-2 text-black "
              />
            </div>

            <div className="d-flex justify-content-between">
              <label className="text-xl ">{isLoginMode ? "𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝" : "𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝"}</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={passwordVisible ? "text" : "password"} // show or hide password based on state
                  required="Please enter Your Password"
                  placeholder="Enter Your Password"
                  className="border border-zinc-400 outline-none px-6 py-2 text-black w-full"
                />

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2"
                >
                  {passwordVisible ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>

              </div>
            </div>
            <div className="w-[100%]" style={{ textAlign: "center" }} >
              <button
                type="submit"
                className=" bg-blue-300 rounded-lg"
              >
                {isLoginMode ? "Login" : "Register"}
              </button>
              <p className="text-center mt-2 text-black">
                {isLoginMode ? "𝕯𝖔𝖓'𝖙 𝖍𝖆𝖛𝖊 𝖆𝖓 𝖆𝖈𝖈𝖔𝖚𝖓𝖙?" : "𝓐𝖑𝖗𝖊𝖆𝖉𝖞 𝖍𝖆𝖛𝖊 𝖆𝖓 𝖆𝖈𝖈𝖔𝖚𝖓𝖙?"}{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={toggleMode}
                >
                  {isLoginMode ? "Register" : "Login"}
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
