import { useState } from 'react';
import { getStorage, list, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { getDownloadURL } from 'firebase/storage';
// const { currentUser } = require('../redux/user/userSlice');
import { useSelector } from 'react-redux';
import { useNavigate , useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function CreateListing() {
    const navigate = useNavigate();
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        furnished: false,
        parking: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
 
    useEffect(()=>{
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false){
                console.log(error.message);
                return;
            }
            setFormData(data.listing);
            
        };
        fetchListing();
    },[]);
    
    const handleImageSubmit = async (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            
            try {
                const urls = await Promise.all(promises);
                setFormData(prev => ({
                    ...prev,
                    imageUrls: prev.imageUrls.concat(urls)
                }));
                setImageUploadError(false);
                
            } catch (error) {
                console.error("Error uploading images:", error);
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            } finally {
                setUploading(false);
            }
        } else {
            setImageUploadError('You can only upload up to 6 images.');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '_' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error("Upload error:", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.checked ? e.target.id : 'rent',
            });
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }
        if(e.target.type === 'number' || e.target.type === 'text'|| e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            if(formData.imageUrls.length<1) return setError('You must upload at least one image');
            if(formData.regularPrice< formData.discountPrice) return setError('Discount price must be less than regular price')
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            
            if(data.success === false) {
                setError(data.message);
                return;
                
            }
            navigate(`/listing/${data.listing._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
        
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name}/>
                    <input type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address} />
                    
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' 
                            onChange={handleChange}
                            checked={formData.type === 'rent' }
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5'
                            onChange={handleChange}
                            checked={formData.parking} />
                            
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' 
                            onChange={handleChange}
                            checked={formData.furnished}/>
                            
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' 
                            onChange={handleChange}
                            checked={formData.offer}/>
                            
                            <span>Offer</span>
                        </div>
                    </div>
                    
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bedrooms} />
                    
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='50' max='100000' required 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.regularPrice}/>
                            
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' max='1000' required 
                            className='p-3 border border-gray-300 rounded-lg'
                            onChange={handleChange}
                            value={formData.discountPrice}/>
                            
                            <div className='flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-xs'>$ / month</span>
                            </div>
                        </div>
                        )}
                        
                    </div>
                </div>
                
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(Array.from(e.target.files))} 
                               className='p-3 border border-gray-300' 
                               type="file" 
                               id='images' 
                               accept='image/*' 
                               multiple />
                        <button type='button' 
                                onClick={handleImageSubmit} 
                                disabled={uploading}
                                className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-sm text-red-700'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt="listing image" 
                                     className='w-20 h-20 object-contain rounded-lg'/>
                                <button type='button' 
                                        onClick={() => handleRemoveImage(index)} 
                                        className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} type='submit' className='mt-3 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        
                        {loading ? 'Creating...' : 'Update Listing'}
                    </button>
                    {error && <p className='text-red-700 mt-2'>{error}</p>}
                </div>
            </form>
        </main>
    );
}