import _ from "lodash";
import mongoose from "mongoose";
// import {
//   inspectDivision,
//   getMonitoringService,
//   getMonitoringByYearService,
//   getMonitoringByVariabilityService,
//   getMonitoringByVariablityAndYearService,
// } from "../services/monitoring.services.js";
import asyncHandler from "express-async-handler";
import Monitoring from '../models/monitoring.model.js';
import Weeding from "../models/weeding.model.js";

const ObjectId = mongoose.Types.ObjectId;


// ------------------------------------- start services --------------------------
// add weeding
const addWeedingReport = async (data)=>{
  const newWeedingReport = new Weeding({
    ...data,
    division: ObjectId(data?.division._id)
  });

  let foundMonitoring = await Monitoring.findOne({ year: new Date().getFullYear(), division: newWeedingReport.division})
  
  if (!foundMonitoring) {
    await newWeedingReport.save();
    return await new Monitoring({  weeding: new Array(newWeedingReport), division: newWeedingReport.division }).save();
  }
  else {
    if (!foundMonitoring?.weeding?.length === 0) {
      return await new Monitoring({...foundMonitoring, weeding: new Array(newWeedingReport) }).save()
    }
    else {
      foundMonitoring?.weeding?.push(newWeedingReport);
      return await foundMonitoring.save();
    }
}
};

// ------------------------- end services ---------------------------------

const addVariability = asyncHandler(async (req, res)=>{
    const { body } = req;
    const { variable } = req.params;

    if (!variable) {
        res.status(400);
        throw new Error("Indique a variável que pretende monitorar!");
    }

    let result;

    switch(variable) {
        case 'weeding':
            result =  await addWeedingReport(body);
            break;
        case 'pruning':

            break;
        case 'diseases':

            break;
        case 'plagues':

            break;
        case 'insecticides':

            break;
        case 'fungicides':

            break;
        case 'harvest':

            break;
        default:
            res.status(400);
            throw new Error("Indique uma variável certa que pretende monitorar!");
    }

    res.status(200).json(result);
});

//@desc
//@route
//@access
const addMonitoringByVariability = asyncHandler(async (req, res) => {
  const { body, query, user } = req;

  if (!query.divisionId || !query.variable) {
    res.status(400);
    throw new Error("Indique 'divisionId' e 'variable'!");
  }
  // try {
  let savedInspection = await inspectDivision(user.id, query, body);
  return res.status(201).json(savedInspection);
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

//@desc
//@route
//@access
const getMonitorings = asyncHandler(async (req, res) => {
  const {
    query: { divisionId, variable, year },
  } = req;

  if (!divisionId) {
    res.status(400);
    throw new Error("Deve especificar 'divisionId'!");
  }

  // try {
  let monitoring;
  if (divisionId && !variable && !year) {
    monitoring = await getMonitoringService(divisionId); // ok
  } else if (divisionId && !variable && year) {
    monitoring = await getMonitoringByYearService(divisionId, year); // ok
  } else if (divisionId && variable && !year) {
    monitoring = await getMonitoringByVariabilityService(divisionId, variable); // ok
  } else if (divisionId && variable && year) {
    monitoring = await getMonitoringByVariablityAndYearService(
      divisionId,
      variable,
      year
    ); // ok
  }

  return res.status(200).json({ status: "OK", data: monitoring });
  // } catch (error) {
  //   res.status(error?.status || 500);
  //   throw new Error(error.message);
  // }
});

export {
  addMonitoringByVariability,
  // getMonitoringByYear,
  getMonitorings,
  addVariability,
  // updateMonitoring,
  // deleteMonitoring,
};
