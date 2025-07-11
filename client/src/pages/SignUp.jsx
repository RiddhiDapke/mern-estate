import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
export default function SignUp() {
  const [formData, setFormData]= useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    try{
      setLoading(true);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
       
        setLoading(false);
        setError(data.message);
        return;
      }
      
      setLoading(false);
      setError(null);
      navigate('/sign-in'); // redirect to sign-in page after successful signup
    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
    
    
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="text" placeholder='Username' className='border rounded-lg p-3 ' id='username' onChange={handleChange}/>
        <input type="email" placeholder='Email' className='border rounded-lg p-3 ' id='email'  onChange={handleChange}/>
        <input type="password" placeholder='Password' className='border rounded-lg p-3 ' id='password' onChange={handleChange}/>
        <button disabled={loading} type="submit" className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading... ': 'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p >Already have an account?</p> 
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
      <p className='text-gray-500 mt-3'>By signing up, you
        agree to our <Link to={"/"} className='text-blue-700'>Terms of Service</Link> and <Link to={"/"} className='text-blue-700'>Privacy Policy</Link>.
      </p>
    </div>
  )
}
