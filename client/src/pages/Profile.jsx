import React, { use } from 'react'
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { getDownloadURL } from 'firebase/storage';
import User from '../../../api/models/user.model';
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    console.log(formData);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingError, setShowListingError] = useState(false);
    const dispatch = useDispatch();
    const [userListings, setUserListings] = useState([]);

useEffect(() => {
    if(file){
        handleFileUpload(file);
    }
}, [file]);

const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setFilePerc(Math.round(progress));
        },
        (error) => {
            setFileUploadError(error.message);
            console.error("File upload error:", error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFormData({ ...formData, avatar: downloadURL });
            });
        }
    );
}

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value,
    });
}

const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refreshing the page
    try {
      dispatch(updateUserStart());
        const res = await fetch(`api/user/update/${currentUser._id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });  
        const data = await res.json();
        if(data.success === false) {
            dispatch(updateUserFailure(data.message));
            return;
        }

        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
    } catch (error) {
        dispatch(updateUserFailure(error.message));
    }
}

const handleDeleteUser = async () => {
    try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if(data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        
        dispatch(deleteUserSuccess(data));
        setUpdateSuccess(false);
        // Optionally, redirect to home or sign-in page after deletion
        navigate('/sign-in');
    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
}

const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch('/api/auth/signout', { credentials: 'include' }); 
    const data = await res.json();
    if (data.success === false) {
      dispatch(signOutUserFailure(data.message));
      return;
    }

    dispatch(signOutUserSuccess(data));
    setUpdateSuccess(false);
    navigate('/sign-in'); // redirect to sign-in page after successful sign-out
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
}

const handleShowListing = async ()=>{
    try {
        setShowListingError(false);
        const res = await fetch(`api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if(data.success === false){
            setShowListingError(true);
            return;
        }
        setUserListings(data);
    } catch (error) {
        setShowListingError(true);
    }
}

const handleListingDelete = async (listingId) => {
    try {
        const res = await fetch(`/api/listing/delete/${listingId}`,
            {
                method: 'DELETE',
                credentials: 'include',
                

    });
        const data = await res.json();
        if (data.success === false) {
            console.log(data.message);
            return;
        }
        setUserListings((prev)=> prev.filter((listing)=>listing._id !== listingId));
    } catch (error) {
        console.log(error.message);
    }
}


  return (
    <div className='p-3 max-w-lg mx-auto '>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
            <img onClick={()=>fileRef.current.click()}  src={formData.avatar || currentUser.avatar} alt="profile" 
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>

            <p className='self-center text-sm'>
                {fileUploadError ? (
                    <span className='text-red-700 '>Error Image Upload</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                    <span className='text-green-700'>Uploading Image {filePerc}%</span>
                ) : filePerc === 100 ? (
                    <span className='text-green-700'>Image Uploaded Successfully</span>
                ) : ('')}
            </p>


            <input type="text" placeholder='username' id='username' defaultValue={currentUser.username} onChange={handleChange}
            className='border p-3 rounded-lg '/>
            <input type="email" placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange}
            className='border p-3 rounded-lg '/>
            <input type="password" placeholder='password' id='password' onChange={handleChange}
            className='border p-3 rounded-lg'/>
            <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
            
            <Link className='uppercase text-center bg-green-700
             text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80' to='/create-listing'> 
                create listing
            </Link>

        </form>
        <div className='flex justify-between mt-5'>
            <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
            <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error : ""}</p>
        <p className='text-green-700 mt-3'>{updateSuccess ? 'User is updated successfully' : ''}</p>
        
        <button onClick={handleShowListing} className='text-green-700 w-full '>Show Listing</button>
        <p className='text-red-700 mt-5'>{showListingError ? 'Error showing listings': ''}</p>
                
        {userListings && userListings.length>0 &&
        <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
            {userListings.map((listing) =>(
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt="listing cover" 
                    className='h-16 w-16 object-contain '/>
                </Link>
                <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                <p >{listing.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                    <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-700 uppercase'>Edit</button>
                    </Link>
                </div>

            </div>
        ))}
        </div>
        
    }
    </div>
  )
}
