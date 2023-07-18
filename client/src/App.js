import { Route, Routes,Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import PrivateRoute from "./PrivateRoute";
import Modal from 'react-modal';
import Dashboard from "./component/Dashboard";
import Calendar from "./component/Calendar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from "./pages/AuthPage";
import SuperUserDashboard from "./SuperUser/SuperUserDashboard";
import DisplayEvents from "./component/DisplayEvents";

Modal.setAppElement('#root');

function App() {
 

  return (
    <div className="App">

      <ToastContainer />

      <Routes>
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Home />
        } />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/DispalyEvents" element={<DisplayEvents />} />
        <Route path="/superuserdashboard" element={<SuperUserDashboard />} />
      </Routes>

      

    </div>
  );
}

export default App;



