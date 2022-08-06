import mongoose from "mongoose";
import Farmer from "../models/farmer.model.js"
import Monitoring2 from "../models/monitoring.model.v2.js"
import asyncHandler from "express-async-handler";

const ObjectId = mongoose.Types.ObjectId;


const months = [
  { number: 0, month: "Jan" },
  { number: 1, month: "Fev" },
  { number: 2, month: "Mar" },
  { number: 3, month: "Abr" },
  { number: 4, month: "Mai" },
  { number: 5, month: "Jun" },
  { number: 6, month: "Jul" },
  { number: 7, month: "Ago" },
  { number: 8, month: "Sep" },
  { number: 9, month: "Out" },
  { number: 10, month: "Nov" },
  { number: 11, month: "Dez" },
];


const getGlobalStatistics = asyncHandler(async (req, res) => {

    let globalStatistics = {}

    let farmers;

    let monthlyMonitorings = {}

    let visits = new Array(12).fill(0);

    farmers = await Farmer.find({}).populate('farmlands');
    monthlyMonitorings = await Monitoring2.find({ year : new Date().getFullYear() })

  
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
    });

    monthlyMonitorings.map(monitoring=>{
      const month = new Date(monitoring?.updatedAt).getMonth();
      switch (month) {
        case 0:
          visits[0] = visits[0] += 1;
          break;
        case 1:
          visits[1] = visits[1] += 1;
          break;
        case 2:
          visits[2] = visits[2] += 1;
          break;
        case 3:
          visits[3] = visits[3] += 1;
          break;
        case 4:
          visits[4] = visits[4] += 1;
          break;
        case 5:
          visits[5] = visits[5] += 1;
          break;
        case 6:
          visits[6] = visits[6] += 1;
          break;
        case 7:
          visits[7] = visits[7] += 1;
          break;
        case 8:
          visits[8] = visits[8] += 1;
          break;
        case 9:
          visits[9] = visits[9] += 1;
          break;
        case 10:
          visits[10] = visits[10] += 1;
          break;
        case 11:
          visits[11] = visits[11] += 1;
          break;
        default: 
          return ;
      }

    });

    const response = {
      farmers,
      globalStatistics,
      visits,
    };

    

  
  return res.status(200).json(response);
});

export { getGlobalStatistics };
