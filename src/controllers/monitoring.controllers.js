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
import Pruning from "../models/pruning.model.js";
import Disease from "../models/disease.model.js";

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

    const newMonitoringReport = {
      weeding: new Array(newWeedingReport),
      division: newWeedingReport.division,
      user: {
        fullname: data?.user?.fullname,
        email: data?.user?.email,
        phone: data?.user?.phone,
      }
    };

    return await new Monitoring(newMonitoringReport).save();
  }
  else {
    if (!foundMonitoring?.weeding?.length === 0) {
      await newWeedingReport.save();
      return await new Monitoring({...foundMonitoring, weeding: new Array(newWeedingReport) }).save()
    }
    else {
      foundMonitoring?.weeding?.push(newWeedingReport);
      await newWeedingReport.save();
      return await foundMonitoring.save();
    }
}
};

// add pruning
const addPruningReport = async (data)=>{
  const newPruningReport = new Pruning({
    ...data,
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring.findOne({ year: new Date().getFullYear(), division: newPruningReport.division})
  
  if (!foundMonitoring) {

    await newPruningReport.save();

    const newMonitoringReport = {
      pruning: new Array(newPruningReport),
      division: newPruningReport.division,
      user: {
        fullname: data?.user?.fullname,
        email: data?.user?.email,
        phone: data?.user?.phone,
      },
    };

    return await new Monitoring(newMonitoringReport).save();
  }
  else {
    if (!foundMonitoring?.pruning?.length === 0) {
      await newPruningReport.save();
      return await new Monitoring({
        ...foundMonitoring,
        pruning: new Array(newPruningReport),
      }).save();
    }
    else {
      foundMonitoring?.pruning?.push(newPruningReport);
      await newPruningReport.save();
      return await foundMonitoring.save();
    }
}
};


// add disease
const addDiseaseReport = async (data)=>{
  const newDiseaseReport = new Disease({
    ...data,
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring.findOne({
    year: new Date().getFullYear(),
    division: newDiseaseReport.division,
  });
  
  if (!foundMonitoring) {

    await newDiseaseReport.save();

    const newMonitoringReport = {
      disease: new Array(newDiseaseReport),
      division: newDiseaseReport.division,
      user: {
        fullname: data?.user?.fullname,
        email: data?.user?.email,
        phone: data?.user?.phone,
      },
    };

    return await new Monitoring(newMonitoringReport).save();
  }
  else {
    if (!foundMonitoring?.disease?.length === 0) {
      await newDiseaseReport.save();
      return await new Monitoring({
        ...foundMonitoring,
        disease: new Array(newDiseaseReport),
      }).save();
    }
    else {
      foundMonitoring?.disease?.push(newDiseaseReport);
      await newDiseaseReport.save();
      return await foundMonitoring.save();
    }
}
};


// ------------------------- end services ---------------------------------

const addMonitoringReport = asyncHandler(async (req, res) => {
  const {
    body,
    params: { variable },
  } = req;
  
  if (!variable) {
    res.status(400);
    throw new Error("Indique  como parametro a variável que pretende monitorar!");
  }

  let result;

  switch (variable) {
    case "weeding":
      result = await addWeedingReport(body);
      break;
    case "pruning":
      result = await addPruningReport(body);
      break;
    case "disease":
      result = await addDiseaseReport(body);
      break;
    case "plague":
      break;
    case "insecticide":
      break;
    case "fungicide":
      break;
    case "harvest":
      break;
    default:
      res.status(400);
      throw new Error("Indique como parametro uma variável certa que pretende monitorar!");
  }

  res.status(200).json(result);
});


const getMonitoringReports = asyncHandler(async (req, res)=>{
  const {
    params: { variable }
  } = req;

  // variable param is a division ID

  if (!variable) {
    res.status(400);
    throw new Error("Indique como parametro o ID da divisao!");
  }
  else if (variable === 'void') {
    return res.status(200).json({});
  }

 let monitoringReports = 
    await Monitoring.find({ division: ObjectId(variable) })
                              .populate('weeding')
                              .populate('pruning')
                              .populate('disease');

 return res.status(200).json(monitoringReports);
})

//@desc
//@route
//@access
// const addMonitoringByVariability = asyncHandler(async (req, res) => {
//   const { body, query, user } = req;

//   if (!query.divisionId || !query.variable) {
//     res.status(400);
//     throw new Error("Indique 'divisionId' e 'variable'!");
//   }
//   let savedInspection = await inspectDivision(user.id, query, body);
//   return res.status(201).json(savedInspection);
// });

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
  // addMonitoringByVariability,
  // getMonitoringByYear,
  getMonitorings,
  addMonitoringReport,
  getMonitoringReports,
  // updateMonitoring,
  // deleteMonitoring,
};
