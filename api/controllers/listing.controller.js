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