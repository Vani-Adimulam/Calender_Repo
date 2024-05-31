import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../App.css";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backendapi from "../Backendapi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [objectId, setObjectId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    let interval = setInterval(() => {
      setDate(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const setSuperUserEmail = (email) => {
    Backendapi.REACT_APP_SuperUser_EMAIL = email;
  };

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true

    const data = {
      email: email,
      password: password,
      objectId: objectId,
    };


    axios
      .post(`${Backendapi.REACT_APP_BACKEND_API_URL}/user/login`, data)
      .then((res) => {
        toast.success("Login Success 😊", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        console.log(res, "Logged");
        localStorage.setItem("email", JSON.stringify(res.data.user.email));
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem(
          "username",
          JSON.stringify(res.data.user.username)
        );
        localStorage.setItem("objectId", JSON.stringify(res.data.user["_id"]));
        localStorage.setItem(
          "isSuperUser",
          JSON.stringify(res.data.user.isSuperUser)
        );

        console.log(res.data.user.username);

        if (res.data.user.isSuperUser) {
          setSuperUserEmail(res.data.user.email);
          console.log(res.data.user.email);
          navigate("/DispalyEvents");
        } else {
          navigate("/Calendar");
        }
      })
      .catch((err) => {
        toast.error("Login Failed: Invalid credentials 😫");
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false
      });
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div>
      <div className="sl-screen flex">
        <Navbar />
      </div>
      <div className="w-screen h-[90vh] flex justify-center items-center login-page">
        <div className="blur-container">
          <form
            onSubmit={handleSubmit}
            className="d-flex-col w-[100%] space-y-4 align-item-center"
          >
            <h1 className="text-center text-xl">LOGIN</h1>
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
            <div className="flex">
              <label className="text-xl pr-2">𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required="Please enter Your Password"
                  placeholder="******"
                  className="border border-zinc-400 outline-none px-6 py-1 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center rounded-full bg-transparent"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-[100%]" style={{ textAlign: "center" }}>
              <button
                type="submit"
                className="bg-blue-300 rounded-lg"
                disabled={isLoading} // Disable button during loading
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <div className="text-center">
              <p>
                𝕯𝖔𝖓'𝖙 𝖍𝖆𝖛𝖊 𝖆𝖓 𝖆𝖈𝖈𝖔𝖚𝖓𝖙?{" "}
                <button type="button" className=""
                  style={{ backgroundColor: 'indigo', color: 'white', borderRadius: '5px' }}
                  onClick={(e) => {
                    const data = {
                      email: "guest@gmail.com",
                      password: "guest@123",
                    };


                    axios
                      .post(`${Backendapi.REACT_APP_BACKEND_API_URL}/user/login`, data)
                      .then((res) => {
                        toast.success("Login Success 😊", {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 3000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: true,
                          progress: undefined,
                        });
                        localStorage.setItem("email", JSON.stringify(res.data.user.email));
                        console.log(res.data.user, "Logged");
                        localStorage.setItem("token", JSON.stringify(res.data.token));
                        localStorage.setItem(
                          "username",
                          JSON.stringify(res.data.user.username)
                        );
                        localStorage.setItem("objectId", JSON.stringify(res.data.user._id));
                        localStorage.setItem(
                          "isSuperUser",
                          JSON.stringify(res.data.user.isSuperUser)
                        );

                        if (res.data.user.isSuperUser) {
                          setSuperUserEmail(res.data.user.email);
                          console.log(res.data.user.email);
                          navigate("/DispalyEvents");
                        } else {
                          navigate("/Calendar");
                        }
                      })
                      .catch((err) => {
                        toast.error("Login Failed: Invalid credentials 😫");
                        console.log(err);
                      })
                      .finally(() => {
                        setIsLoading(false); // Set loading state to false
                      });

                  }}
                >Login As Guest</button>
              </p>
            </div>
            <div style={{display:'flex',justifyContent:"center",alignItems:'center'}}>
             
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
