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
import Monitoring from "../models/monitoring.model.js";
import Weeding from "../models/weeding.model.js";
import Pruning from "../models/pruning.model.js";
import Disease from "../models/disease.model.js";
import Plague from "../models/plague.model.js";
import { Insecticide, Application } from "../models/insecticide.model.js";

const ObjectId = mongoose.Types.ObjectId;

// ------------------------------------- start services --------------------------
// add weeding
const addWeedingReport = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const newWeedingReport = new Weeding({
    ...data,
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring.findOne({
    year: new Date().getFullYear(),
    division: newWeedingReport.division,
  });

  if (!foundMonitoring) {
    await newWeedingReport.save();

    const newMonitoringReport = {
      weeding: new Array(newWeedingReport),
      division: newWeedingReport.division,
      user,
    };

    return await new Monitoring(newMonitoringReport).save();
  } else {
    await newWeedingReport.save();

    if (foundMonitoring?.weeding && foundMonitoring?.weeding?.length === 0) {
      foundMonitoring.user = user;
      foundMonitoring.weeding = new Array(newWeedingReport);

      return await foundMonitoring.save();
    } else {
      foundMonitoring.user = user;
      foundMonitoring.weeding = new Array(
        ...foundMonitoring.weeding,
        newWeedingReport
      );

      return await foundMonitoring.save();
    }
  }
};

// add pruning
const addPruningReport = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const newPruningReport = new Pruning({
    ...data,
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring.findOne({
    year: new Date().getFullYear(),
    division: newPruningReport.division,
  });

  if (!foundMonitoring) {
    await newPruningReport.save();

    const newMonitoringReport = {
      pruning: new Array(newPruningReport),
      division: newPruningReport.division,
      user,
    };

    return await new Monitoring(newMonitoringReport).save();
  } else {
    await newPruningReport.save();

    if (foundMonitoring?.pruning && foundMonitoring?.pruning?.length === 0) {
      foundMonitoring.user = user;
      foundMonitoring.pruning = new Array(newPruningReport);

      return await foundMonitoring.save();
    } else {
      foundMonitoring.user = user;
      foundMonitoring.pruning = new Array(
        ...foundMonitoring.pruning,
        newPruningReport
      );

      return await foundMonitoring.save();
    }
  }
};

// add disease
const addDiseaseReport = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
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
      user,
    };

    return await new Monitoring(newMonitoringReport).save();
  } else {
    await newDiseaseReport.save();

    if (foundMonitoring?.disease && foundMonitoring?.disease?.length === 0) {
      foundMonitoring.user = user;
      foundMonitoring.disease = new Array(newDiseaseReport);

      return await foundMonitoring.save();
    } else {
      foundMonitoring.user = user;
      foundMonitoring.disease = new Array(
        ...foundMonitoring.disease,
        newDiseaseReport
      );

      return await foundMonitoring.save();
    }
  }
};

// add plague
const addPlagueReport = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const newPlagueReport = new Plague({
    ...data,
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring.findOne({
    year: new Date().getFullYear(),
    division: newPlagueReport.division,
  });

  if (!foundMonitoring) {
    await newPlagueReport.save();

    const newMonitoringReport = {
      plague: new Array(newPlagueReport),
      division: newPlagueReport.division,
      user,
    };

    return await new Monitoring(newMonitoringReport).save();
  } else {
    await newPlagueReport.save();

    if (foundMonitoring?.plague && foundMonitoring?.plague?.length === 0) {
      foundMonitoring.user = user;
      foundMonitoring.plague = new Array(newPlagueReport);

      return await foundMonitoring.save();
    } else {
      foundMonitoring.user = user;
      foundMonitoring.plague = new Array(
        ...foundMonitoring.plague,
        newPlagueReport
      );

      return await foundMonitoring.save();
    }
  }
};

// add insecticide
const addInsecticideReport = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const { treatedTrees, applicationNumber, insecticideDose, appliedAt } = data;

  const newApplication = new Application({
    treatedTrees,
    applicationNumber,
    insecticideDose,
    appliedAt,
  });

  const newInsecticideReport = Insecticide({
    insecticideName: data?.insecticideName,
    user,
    division: ObjectId(data?.division._id),
  });

  // find the monitoring reports
  // and populate all the insecticide report for this year and division
  let foundMonitoring = await Monitoring.findOne({
    year: new Date().getFullYear(),
    division: newInsecticideReport.division,
  }).populate("insecticide")

  // if no monitoring associated to this division in the current year is found 
  if (!foundMonitoring) {
    newInsecticideReport?.application.push(newApplication);
    await newInsecticideReport.save();

    const newMonitoringReport = {
      insecticide: new Array(newInsecticideReport),
      division: newInsecticideReport.division,
      user,
    };

    return await new Monitoring(newMonitoringReport).save();

  } else {  // in case any related monitoring associated to this division in the current year is found

    // check if there is any insecticide-related report registered so far
    // if no insecticide-related report is found
    if (
      foundMonitoring?.insecticide &&
      foundMonitoring?.insecticide?.length === 0
    ) {
      newInsecticideReport?.application.push(newApplication);
      await newInsecticideReport.save();

      foundMonitoring.user = user;
      foundMonitoring.insecticide = new Array(newInsecticideReport);

      return await foundMonitoring.save();
    } else if ( // if an insecticide-relared report is found
      foundMonitoring?.insecticide &&
      foundMonitoring?.insecticide?.length > 0
    ) {
      let length = foundMonitoring?.insecticide.length;
      let count = 0;
      for (let index = 0; index < length; index++) {  
        // check if there already exists a report with this same insecticide name
        // if yes, append the new insecticide report of the same name to it.

        if ( foundMonitoring?.insecticide[index].insecticideName === newInsecticideReport.insecticideName) {
          let foundInsecticideReport = await Insecticide.findOne({
            insecticideName: `${newInsecticideReport.insecticideName}`,
          });
          foundInsecticideReport?.application.push(newApplication);
          await foundInsecticideReport.save();
          foundMonitoring.user = user;    // update the user 
          return await foundMonitoring.save();
        }else if (count === length-1){ 

          // if the insecticide names are different
          // then, create an new insecticide report with this new insecticide name

          newInsecticideReport?.application.push(newApplication);
          await newInsecticideReport.save();
          foundMonitoring?.insecticide.push(newInsecticideReport);
          foundMonitoring.user = user; // update the user
          return await foundMonitoring.save()
        }
        count++;
      }
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
    throw new Error(
      "Indique  como parametro a variável que pretende monitorar!"
    );
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
      result = await addPlagueReport(body);
      break;
    case "insecticide":
      result = await addInsecticideReport(body);
      break;
    case "fungicide":
      break;
    case "harvest":
      break;
    default:
      res.status(400);
      throw new Error(
        "Indique como parametro uma variável certa que pretende monitorar!"
      );
  }

  res.status(200).json(result);
});

const getMonitoringReports = asyncHandler(async (req, res) => {
  const {
    params: { variable },
  } = req;

  // variable param is a division ID

  if (!variable) {
    res.status(400);
    throw new Error("Indique como parametro o ID da divisao!");
  } else if (variable === "void") {
    return res.status(200).json({});
  }

  let monitoringReports = await Monitoring.find({
    division: ObjectId(variable),
  })
    .populate("weeding")
    .populate("pruning")
    .populate("disease")
    .populate("plague")
    .populate("insecticide");

  return res.status(200).json(monitoringReports);
});

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
