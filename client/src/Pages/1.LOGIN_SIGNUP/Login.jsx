import React from 'react'

const Login = () => {
  const handleGoogleAuthClick = () => {
    window.open(`http://localhost:4000/auth/google/signup/callback`,'_self');
  };
  return (
    <>
    <div>Login</div>
    <div className='google-panel'>
        <button onClick={handleGoogleAuthClick} className='google-button'>Login/Register with GOOGLE</button>
      </div>
      </>
  )
}

export default Login