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

  // in case there is no updates in regards to the pruning the farmland division
  if (data?.status === "rejected") {
    let foundPruningReport = await Pruning2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, pruning: foundPruningReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

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
    farmland: ObjectId(data?.farmland)
  });

  if (!foundMonitoring) {
    await newPruningReport.save();

    const newMonitoringReport = {
      pruning: newPruningReport,
      division: newPruningReport.division,
      farmland: ObjectId(data?.farmland),
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
      foundMonitoring.user = user;
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
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the weeding the farmland division
  if (data?.status === "rejected") {
    let foundWeedingReport = await Weeding2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, weeding: foundWeedingReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

  const { weedingType, totallyCleanedTrees, partiallyCleanedTrees, weededAt } = data;

  const newWeedingReport = new Weeding2({
    rounds: new Array({
      weedingType,
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
    farmland: ObjectId(data?.farmland),
  });

  if (!foundMonitoring) {
    await newWeedingReport.save();

    const newMonitoringReport = {
      weeding: newWeedingReport,
      division: newWeedingReport.division,
      farmland: ObjectId(data?.farmland),
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
      foundMonitoring.user = user;
      return await foundMonitoring.save();
    } else {
      foundWeedingReport.rounds = new Array(...foundWeedingReport.rounds, {
        weedingType,
        totallyCleanedTrees,
        partiallyCleanedTrees,
        weededAt,
        user,
      });

      await foundWeedingReport.save();
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the disease in this farmland division
  if (data?.status === "rejected") {
    let foundDiseaseReport = await Disease2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, disease: foundDiseaseReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }


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
    farmland: ObjectId(data?.farmland),
  });

  if (!foundMonitoring) {
    await newDiseaseReport.save();

    const newMonitoringReport = {
      disease: newDiseaseReport,
      division: newDiseaseReport.division,
      farmland: ObjectId(data?.farmland),
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
      foundMonitoring.user = user;
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
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the plague the farmland division
  if (data?.status === "rejected") {
    let foundPlagueReport = await Plague2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, plague: foundPlagueReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

  const {
    plagueName,
    higherAttack,
    highAttack,
    averageAttack,
    lowAttack,
    detectedAt,
  } = data;
  const newPlagueReport = new Plague2({
    rounds: new Array({
      plagueName,
      higherAttack,
      highAttack,
      averageAttack,
      lowAttack,
      detectedAt,
      user,
    }),
    division: ObjectId(data?.division._id),
  });

  let foundMonitoring = await Monitoring2.findOne({
    year: new Date().getFullYear(),
    division: newPlagueReport.division,
    farmland: ObjectId(data?.farmland),
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
      foundMonitoring.user = user;
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
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the insecticide the farmland division
  if (data?.status === "rejected") {
    let foundInsecticideReport = await Insecticide2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, insecticide: foundInsecticideReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

  const { insecticideName, treatedTrees, applicationNumber, dose, appliedAt } =
    data;

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
    farmland: ObjectId(data?.farmland),
  });

  if (!foundMonitoring) {
    await newInsecticideReport.save();

    const newMonitoringReport = {
      insecticide: newInsecticideReport,
      division: newInsecticideReport.division,
      user,
    };

    return await new Monitoring2(newMonitoringReport).save();
  } else {
    let foundInsecticideReport = await Insecticide2.findOne({
      year: new Date().getFullYear(),
      division: ObjectId(data?.division._id),
    });

    if (!foundInsecticideReport) {
      await newInsecticideReport.save();

      foundMonitoring.insecticide = newInsecticideReport;
      foundMonitoring.user = user;
      return await foundMonitoring.save();
    } else {
      foundInsecticideReport.rounds = new Array(
        ...foundInsecticideReport.rounds,
        {
          insecticideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
          user,
        }
      );

      await foundInsecticideReport.save();
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the fungicide the farmland division
  if (data?.status === "rejected") {
    let foundFungicideReport = await Fungicide2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year: new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, fungicide: foundFungicideReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

  const { fungicideName, treatedTrees, applicationNumber, dose, appliedAt } =
    data;

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
    farmland: ObjectId(data?.farmland),
  });
  //   .populate("fungicide");

  // if no monitoring associated to this division in the current year is found
  if (!foundMonitoring) {
    await newFungicideReport.save();

    const newMonitoringReport = {
      fungicide: newFungicideReport,
      division: newFungicideReport.division,
      farmland: ObjectId(data?.farmland),
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
      foundMonitoring.user = user;
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
      foundMonitoring.user = user;
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

  // in case there is no updates in regards to the harvest the farmland division
  if (data?.status === "rejected") {
    let foundHarvestReport = await Harvest2.findOneAndUpdate(
      {
        year:
          new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
            ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
            : new Date().getFullYear(),
        division: ObjectId(data?.division._id),
      },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let foundMonitoringReport = await Monitoring2.findOneAndUpdate(
      {
        year:
          new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
            ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
            : new Date().getFullYear(),
        division: ObjectId(data?.division._id),
        farmland: ObjectId(data?.farmland),
      },
      { user, harvest: foundHarvestReport._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return foundMonitoringReport;
  }

  const { productiveTrees, appleQuantity, nutQuantity, harvestedAt } = data;

  const newHarvestReport = Harvest2({
    rounds: new Array({
      productiveTrees,
      appleQuantity,
      nutQuantity,
      harvestedAt,
      user,
    }),
    division: ObjectId(data?.division._id),
    year:
      new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
        ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
        : new Date().getFullYear(),
  });

  // find the monitoring reports
  // and populate all the insecticide report for this year and division

  let foundMonitoring = await Monitoring2.findOne({
    year:
      new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
        ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
        : new Date().getFullYear(),
    division: newHarvestReport.division,
    farmland: ObjectId(data?.farmland),
  });
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

  } 
  else {
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
      foundMonitoring.user = user;
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
      foundMonitoring.user = user;
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

const getMonitoringReportsByDivisionId2 = asyncHandler(async (req, res) => {
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


const getMonitoringReportsByFarmlandId2 = asyncHandler(async (req, res) => {

  const { farmlandId } = req.query;

  let monitoringReports = await Monitoring2.find({
    farmland: ObjectId(farmlandId),
    year: new Date().getFullYear(),
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




// @desc
// @route
// @access
// const getAllMonitoringReports = asyncHandler(async (req, res) => {

//   let reports;

  


// });

export {
  // getAllMonitoringReports,
  addMonitoringReport2,
  getMonitoringReportsByDivisionId2,
  getMonitoringReportsByFarmlandId2,
};
