import Listing from "../models/listing.model.js";
import { errorHander } from "../utils/error.js";

export const createListing = async (req, res, next) =>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Listing created successfully",
            listing
        });
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async(req, res , next) =>{
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHander(404, 'Listing not found'));
    }

    if(req.user.id!= listing.userRef){
        return next(errorHander(403, 'You are not authorized to delete this listing'))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);

    } catch (error) {
        next(error);
    }
};

// export const updateListing = async (req, res, next) =>{
//     const listing = await Listing.findById(req.params.id);
//     if(!listing){
//         return next(errorHander(404, 'Listing not found'));
//     }
    
//     if(req.user.id !== listing.userRef){
//         return next(errorHander(403, 'You are not authorized to update this listing'))
//     }
//     try {
//         const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
//         res.status(200).json(updatedListing);
//     } catch (error) {
//         next(error);
//     }
// };



export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHander(404, 'Listing not found'));
    }
    
    if(req.user.id !== listing.userRef){
        return next(errorHander(403, 'You are not authorized to update this listing'))
    }
    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({
            success: true,
            listing: updatedListing
        });
    } catch (error) {
        next(error);
    }
};

// export const getListing = async (req, res, next) =>{
//     try {
//         const listing = await Listing.findById(req.params.id);
//         if(!listing){
//             return next(errorHander(404, 'Listing not found'));
//         }
//         res.status(200).json({
//             success: true,
//             listing,
//         });
//         // res.status(200).json(listing);
            
            
//     } catch (error) {
//         next(error);
//     }
// }

// export const getListings = async (req, res, next) => {
//     try {
//         const limit = parseInt(req.query.limit) || 9;
//         const startIndex = parseInt(req.query.startIndex) || 0;
//         let offer = req.query.offer ;

//         if(offer === undefined || offer === 'false') {
//             offer = {$in: [false, true ]}; // Handle cases where offer is not provided
            
//         }

//         let furnished = req.query.furnished;
//         if(furnished === undefined || furnished === 'false') {
//             furnished = {$in: [false, true]}; // Handle cases where furnished is not provided
//         }

//         let parking = req.query.parking;
//         if(parking === undefined || parking === 'false') {
//             parking = {$in: [false, true]}; // Handle cases where parking is not provided
//         }

//         let type = req.query.type;
//         if(type === undefined || type === 'all') {
//             type = {$in: ['sale','rent']}; // Handle cases where type is not provided
//         }
//         const searchTerm = req.query.searchTerm || '';
//         const sort = req.query.sort || 'createdAt';
//         const order = req.query.order ||  'desc';
//         const listings = await Listing.find({
//             name: { $regex: searchTerm, $options: 'i' },
//             offer,
//             furnished,
//             parking,
//             type
//         }).sort(
//             { [sort]: order } 
//         ).limit(limit).skip(startIndex);

//         return res.status(200).json(listings);

//     } catch (error) {
//         next(error);
//     }
// }



export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};