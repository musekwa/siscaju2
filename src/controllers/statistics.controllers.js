import mongoose from "mongoose";
import Farmer from "../models/farmer.model.js"
import asyncHandler from "express-async-handler";

const ObjectId = mongoose.Types.ObjectId;


const getGlobalStatistics = asyncHandler(async (req, res) => {

    let globalStatistics = {}

    let farmers;

    farmers = await Farmer.find({}).populate('farmlands');
  
    farmers.map(farmer=>{
        let province = farmer?.address.province;

        if (!globalStatistics.hasOwnProperty(province)) {
          globalStatistics[province] = {
            farmers: 1,
            farmlands: farmer?.farmlands ? farmer?.farmlands.length : 0,
          };
        } else {
          globalStatistics[province].farmers += 1;
          if (farmer?.farmlands){
              globalStatistics[province].farmlands += farmer?.farmlands?.length;
          }

        }
        return farmer;
    })

    const response = {
        farmers,
        globalStatistics,
    }

    

  
  return res.status(200).json(response);
});

export { getGlobalStatistics };
