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
// import Monitoring from "../models/monitoring.model.js";
import Monitoring2 from "../models/monitoring.model.v2.js";
// import Weeding from "../models/weeding.model.js";
import Weeding2 from "../models/weeding.model.v2.js";
// import Pruning from "../models/pruning.model.js";
import Pruning2 from "../models/pruning.model.v2.js";
// import Disease from "../models/disease.model.js";
import Disease2 from "../models/disease.model.v2.js"
import Plague2 from "../models/plague.model.v2.js";
import Insecticide2 from "../models/insecticide.model.v2.js";
import Fungicide2 from "../models/fungicide.model.v2.js";
import Harvest2 from "../models/harvest.model.v2.js";

import { addWeedingRecommendation } from "./recomendation.controllers.js";

const ObjectId = mongoose.Types.ObjectId;

// ------------------------------------- start services --------------------------

// add pruning
const addPruningReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };

  const { pruningType, totallyPrunedTrees, partiallyPrunedTrees, prunedAt } =
    data;

  const newPruningReport = new Pruning2({
    rounds: new Array({
      pruningType,
      totallyPrunedTrees,
      partiallyPrunedTrees,
      prunedAt,
      user,
    }),
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newPruningReport.division,
  });

  if (!foundMonitoring) {
    await newPruningReport.save();

    const newMonitoringReport = {
      pruning: newPruningReport,
      division: newPruningReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {
    let foundPruningReport = await Pruning2.findOne({
      year: new Date().getFullYear(),
      division: ObjectId(data?.division._id),
    });

    if (!foundPruningReport) {
      await newPruningReport.save();

      foundMonitoring.pruning = newPruningReport;
      return await foundMonitoring.save();
    } else {
      foundPruningReport.rounds = new Array(...foundPruningReport.rounds, {
        pruningType,
        totallyPrunedTrees,
        partiallyPrunedTrees,
        prunedAt,
        user,
      });

      await foundPruningReport.save();
      return await foundMonitoring.save();
    }
  }
};

// add weeding
const addWeedingReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };

  const { totallyCleanedTrees, partiallyCleanedTrees, weededAt } = data;

  const newWeedingReport = new Weeding2({
    rounds: new Array({
      totallyCleanedTrees,
      partiallyCleanedTrees,
      weededAt,
      user,
    }),
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newWeedingReport.division,
  });

  if (!foundMonitoring) {
    await newWeedingReport.save();

    const newMonitoringReport = {
      weeding: newWeedingReport,
      division: newWeedingReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {
    let foundWeedingReport = await Weeding2.findOne({
      year: new Date().getFullYear(),
      division: ObjectId(data?.division._id),
    });

    if (!foundWeedingReport) {
      await newWeedingReport.save();

      foundMonitoring.weeding = newWeedingReport;
      return await foundMonitoring.save();
    } else {
      foundWeedingReport.rounds = new Array(...foundWeedingReport.rounds,{
        totallyCleanedTrees,
        partiallyCleanedTrees,
        weededAt,
        user,
      });

      await foundWeedingReport.save();
      return await foundMonitoring.save();
    }

    // return await foundMonitoring.save();
  }
};

// add disease
const addDiseaseReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };

  const {
    diseaseName,
    higherSeverity,
    highSeverity,
    averageSeverity,
    lowSeverity,
    detectedAt,
  } = data;

  const newDiseaseReport = new Disease2({
    rounds: {
      diseaseName,
      higherSeverity,
      highSeverity,
      averageSeverity,
      lowSeverity,
      detectedAt,
      user,
    },
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newDiseaseReport.division,
  });

  if (!foundMonitoring) {
    await newDiseaseReport.save();

    const newMonitoringReport = {
      disease: newDiseaseReport,
      division: newDiseaseReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {

    let foundDiseaseReport = await Disease2.findOne({
      year: new Date().getFullYear(),
      division: ObjectId(data?.division._id),
    });

    if (!foundDiseaseReport) {
      await newDiseaseReport.save();

      foundMonitoring.disease = newDiseaseReport;
      return await foundMonitoring.save();
    } else {
      foundDiseaseReport.rounds = new Array(...foundDiseaseReport.rounds, {
        higherSeverity,
        highSeverity,
        averageSeverity,
        lowSeverity,
        detectedAt,
        user,
      });

      await foundDiseaseReport.save();
      return await foundMonitoring.save();
    }

    // return await foundMonitoring.save();
    }
};

// add plague
const addPlagueReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };

  const {
    plagueName,
    higherAttack,
    highAttack,
    averageAttack,
    lowAttack,
    detectedAt
  } = data
  const newPlagueReport = new Plague2({
    rounds: new Array({    
    plagueName,
    higherAttack,
    highAttack,
    averageAttack,
    lowAttack,
    detectedAt,
    user
    }),
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newPlagueReport.division,
  });

  if (!foundMonitoring) {
    await newPlagueReport.save();

    const newMonitoringReport = {
      plague: newPlagueReport,
      division: newPlagueReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {
    let foundPlagueReport = await Plague2.findOne({
      year: new Date().getFullYear(),
      division: ObjectId(data?.division._id),
    });

    if (!foundPlagueReport) {
      await newPlagueReport.save();

      foundMonitoring.plague = newPlagueReport;
      return await foundMonitoring.save();
    } else {
      foundPlagueReport.rounds = new Array(...foundPlagueReport.rounds, {
        plagueName,
        higherAttack,
        highAttack,
        averageAttack,
        lowAttack,
        detectedAt,
        user,
      });

      await foundPlagueReport.save();
      return await foundMonitoring.save();

    }

    // return await foundMonitoring.save();
  }
};

// add insecticide
const addInsecticideReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const { insecticideName, treatedTrees, applicationNumber, dose, appliedAt } = data;

  const newInsecticideReport = Insecticide2({
    rounds: new Array({
      insecticideName,
      treatedTrees,
      applicationNumber,
      dose,
      appliedAt,
      user,
    }),
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newInsecticideReport.division,
  })

  if (!foundMonitoring) {

    await newInsecticideReport.save();

    const newMonitoringReport = {
      insecticide: newInsecticideReport,
      division: newInsecticideReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } 
  else {
    let foundInsecticideReport = await Insecticide2.findOne({
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
    });

    if (!foundInsecticideReport) {
      await newInsecticideReport.save();

      foundMonitoring.insecticide = newInsecticideReport;
      return await foundMonitoring.save();
    } else {
      foundInsecticideReport.rounds = new Array(...foundInsecticideReport.rounds, {
        insecticideName,
        treatedTrees,
        applicationNumber,
        dose,
        appliedAt,
        user,
      });

      await foundInsecticideReport.save();
      return await foundMonitoring.save();
    }

    // return await foundMonitoring.save();
  }
};

// add fungicide
const addFungicideReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const { fungicideName, treatedTrees, applicationNumber, dose, appliedAt } = data;


  const newFungicideReport = Fungicide2({
    rounds: new Array({
      fungicideName,
      treatedTrees,
      applicationNumber,
      dose,
      appliedAt,
      user,
    }),
    division: ObjectId(data?.division._id),
  });

  // find the monitoring reports
  // and populate all the insecticide report for this year and division
  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newFungicideReport.division,
  })
//   .populate("fungicide");

  // if no monitoring associated to this division in the current year is found
  if (!foundMonitoring) {
    await newFungicideReport.save();

    const newMonitoringReport = {
      fungicide: newFungicideReport,
      division: newFungicideReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {
    let foundFungicideReport = await Fungicide2.findOne({
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
    });

    if (!foundFungicideReport) {
        await newFungicideReport.save();

        foundMonitoring.fungicide = newFungicideReport;
        return await foundMonitoring.save();
    } else {
        foundFungicideReport.rounds = new Array(...foundFungicideReport.rounds, {
          fungicideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
          user,
        });

        await foundFungicideReport.save();
        return await foundMonitoring.save();
    }

    // return await foundMonitoring.save();
  }
};

// add harvest
const addHarvestReport2 = async (data) => {
  const user = {
    fullname: data?.user?.fullname,
    email: data?.user?.email,
    phone: data?.user?.phone,
  };
  const { productiveTrees, appleQuantity, nutQuantity, harvestedAt } = data;

  
  const newHarvestReport = Harvest2({
    rounds: new Array({productiveTrees, appleQuantity, nutQuantity, harvestedAt, user }),
    division: ObjectId(data?.division._id),
    year:
      new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
        ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
        : new Date().getFullYear(),
    user,
  });

  // find the monitoring reports
  // and populate all the insecticide report for this year and division

  let foundMonitoring = await Monitoring2.findOne({
    year:
      new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
        ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
        : new Date().getFullYear(),
    division: newHarvestReport.division,
  })
//   .populate("harvest");

  if (!foundMonitoring) {

    await newHarvestReport.save();

    const newMonitoringReport = {
      harvest: newHarvestReport,
      division: newHarvestReport.division,
      year:
        new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
          ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
          : new Date().getFullYear(),
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else if (
    foundMonitoring?.harvest &&
    foundMonitoring?.harvest.length === 0
  ) {
    newHarvestReport?.production.push(newProduction);
    await newHarvestReport.save();

    foundMonitoring.user = user;
    foundMonitoring.harvest.push(newHarvestReport);

    return await foundMonitoring.save();
  } else {
    let foundHarvestReport = await Harvest2.findOne({
        year:   
          new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
          ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
          : new Date().getFullYear(),
        division: ObjectId(data?.division._id),
    });

    if (!foundHarvestReport) {
      await newHarvestReport.save();

      foundMonitoring.harvest = newHarvestReport;
      return await foundMonitoring.save();
    } else {
      foundHarvestReport.rounds = new Array(...foundHarvestReport.rounds, {
        productiveTrees,
        appleQuantity,
        nutQuantity,
        harvestedAt,
        user,
      });

      await foundHarvestReport.save();
      return await foundMonitoring.save();
    }

    // return await foundMonitoring.save();

  }
};

// ------------------------- end services ---------------------------------

// ------------------- start rethinking the models and control -----------

const addMonitoringReport2 = asyncHandler(async (req, res) => {
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
      result = await addWeedingReport2(body);
      break;
    case "pruning":
      result = await addPruningReport2(body);
      break;
    case "disease":
      result = await addDiseaseReport2(body);
      break;
    case "plague":
      result = await addPlagueReport2(body);
      break;
    case "insecticide":
      result = await addInsecticideReport2(body);
      break;
    case "fungicide":
      result = await addFungicideReport2(body);
      break;
    case "harvest":
      result = await addHarvestReport2(body);
      break;
    default:
      res.status(400);
      throw new Error(
        "Indique como parametro uma variável certa que pretende monitorar!"
      );
  }

  res.status(200).json(result);
});

const getMonitoringReports2 = asyncHandler(async (req, res) => {
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

  let monitoringReports = await Monitoring2.find({
    division: ObjectId(variable),
  })
    .populate("weeding")
    .populate("pruning")
    .populate("disease")
    .populate("plague")
    .populate("insecticide")
    .populate("fungicide")
    .populate("harvest");

  return res.status(200).json(monitoringReports);
});

// ------------------ end rethinking the models and control--------------




//@desc
//@route
//@access
// const getMonitorings = asyncHandler(async (req, res) => {
//   const {
//     query: { divisionId, variable, year },
//   } = req;

//   if (!divisionId) {
//     res.status(400);
//     throw new Error("Deve especificar 'divisionId'!");
//   }

//   // try {
//   let monitoring;
//   if (divisionId && !variable && !year) {
//     monitoring = await getMonitoringService(divisionId); // ok
//   } else if (divisionId && !variable && year) {
//     monitoring = await getMonitoringByYearService(divisionId, year); // ok
//   } else if (divisionId && variable && !year) {
//     monitoring = await getMonitoringByVariabilityService(divisionId, variable); // ok
//   } else if (divisionId && variable && year) {
//     monitoring = await getMonitoringByVariablityAndYearService(
//       divisionId,
//       variable,
//       year
//     ); // ok
//   }

//   return res.status(200).json({ status: "OK", data: monitoring });
//   // } catch (error) {
//   //   res.status(error?.status || 500);
//   //   throw new Error(error.message);
//   // }
// });

export {
  // addMonitoringByVariability,
  // getMonitoringByYear,
//   getMonitorings,
//   addMonitoringReport,
//   getMonitoringReports,
  addMonitoringReport2,
  getMonitoringReports2,
  // updateMonitoring,
  // deleteMonitoring,
};