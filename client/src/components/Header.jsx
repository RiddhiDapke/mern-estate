import React from 'react'
import { Link } from 'react-router-dom'
import { FaSearch} from 'react-icons/fa'


export default function Header() {
  return (
    <header className='flex justify-between items-center p-2 bg-slate-200 shadow-md mx-auto max-w-6xl'>
        <Link to="/" >
      <h1 className='font-bold test-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500'>Sahand</span>
        <span className='text-slate-700' >Estate</span>
      </h1>
      </Link>
      <form className='bg-slate-100 p-3 rounded-lg flex items-center sm:w-auto'>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
          

        />
        <FaSearch className='text-slate-600'/>

      </form>
      <ul className='flex  gap-4 text-sm sm:text-base'>
        <Link to="/">
        <li className='hidden sm:inline text-slate-700 hover:underline'>
            Home
        </li>
        </Link>
        
        <Link to="/about">
        <li className='hidden sm:inline text-slate-700 hover:underline'>
            About
        </li>
        </Link>
        
        <Link to="/sign-in">
        <li className=' text-slate-700 hover:underline'>
            Sign In
        </li>
        </Link>
      </ul>
    </header>
  )
}
