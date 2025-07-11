import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function Signin() {
  const [formData, setFormData]= useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
  const { error, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    try{
       dispatch(signInStart()); 
      
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
       
        dispatch(signInFailure(data.message));
        return;
      }
      
      dispatch(signInSuccess(data));
      navigate('/'); // redirect to sign-in page after successful signup
    }
    catch (error) {
      dispatch(signInFailure(error.message));
    }
    
    
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        
        <input type="email" placeholder='Email' className='border rounded-lg p-3 ' id='email'  onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border rounded-lg p-3 ' id='password' onChange={handleChange}/>
        <button disabled={loading} type="submit" className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading... ': 'Sign In'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p >Dont have an account?</p> 
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
      
    </div>
  )
}
