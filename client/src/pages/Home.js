import React from 'react'
import Modal from 'react-modal'; 
import Login from './Login';
import AuthPage from './AuthPage';



Modal.setAppElement('#root');
function Home() {
  return (
    <div>
     {/* <AuthPage /> */}
     <Login />
    </div>
  )
}

export default Home