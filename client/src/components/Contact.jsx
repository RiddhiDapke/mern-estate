import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landord, setlandord] = useState(null);
  const [message, setmessage] = useState(' ');

  const onChange = (e) => {
    setmessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        if (!response.ok) throw new Error('Failed to fetch landlord');
        const data = await response.json();
        setlandord(data);
      } catch (error) {
        console.error('Error fetching landlord:', error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landord.username} </span> for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className='w-full h-24 p-2 border border-gray-300 rounded-lg'
            placeholder='Type your message here...'
            value={message}
            onChange={onChange}
          ></textarea>
          <Link
            to={`mailto:${landord.email}?subject=regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            {/* <button className=' text-white px-4 py-2 rounded-lg hover:bg-blue-600'> */}
              Send Message
            {/* </button> */}
          </Link>
        </div>
      )}
    </>
  );
}
