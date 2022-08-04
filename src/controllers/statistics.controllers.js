import mongoose from "mongoose";
import UserPerformance from "../models/userPerformance.model.js";
import DistrictPerformance from "../models/districtPerformance.model.js";
import ProvincePerformance from "../models/provincePerformance.model.js";
import Farmer from "../models/farmer.model.js"
// import { getPerformanceService } from "../services/performance.services.js";
import asyncHandler from "express-async-handler";

const ObjectId = mongoose.Types.ObjectId;

// const provinces = [
//   "Cabo Delgado",
//   "Gaza",
//   "Inhambane",
//   "Manica",
//   "Maputo",
//   "Maputo Cidade",
//   "Nampula",
//   "Niassa",
//   "Tete",
//   "Sofala",
//   "Zambézia",
// ];

const getGlobalStatistics = asyncHandler(async (req, res) => {

    let globalStatistics = {}

    let farmers;

    farmers = await Farmer.find({});
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

    

  
  return res.status(200).json(globalStatistics);
});

export { getGlobalStatistics };
