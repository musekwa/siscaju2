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
import { Recommendation, WeedingRecommendation } from "../models/recommendation.model.js";
import Weeding from "../models/weeding.model.js";
import Pruning from "../models/pruning.model.js";
import Disease from "../models/disease.model.js";
import Plague from "../models/plague.model.js";
import Insecticide from "../models/insecticide.model.js";
import Fungicide from "../models/fungicide.model.js";
import Pesticide from "../models/pesticide.model.js";
import Harvest from "../models/harvest.model.js";
import Production from "../models/production.model.js";

const ObjectId = mongoose.Types.ObjectId;

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];


const STATUS = {
    unstarted: 'unstarted', 
    valid: 'valid', 
    toBeExpired: 'toBeExpired', 
    expired: 'expired'
}

const INTERVALS = {
    weeding: 2, // months
}

const SCORE = {
    worse: 0,
    bad: 25,
    pass: 50,
    good: 75,
    better: 100,
}

// ------------------------------------- start services --------------------------
// add weeding
const addWeedingRecommendation = async (data) => {

    /**
     *  data: 
     *      flag,
     *      division,
     *      round [ {
     *          start=null, end=null, status=unstarted
     *         }]
     */

    // get the end date from start date + 2 months
    const getEndDate = (startDate, monthInterval)=>{ 
        let endDate = new Date(startDate);
        return new Date(endDate.setMonth(endDate.getMonth() + monthInterval));
    }

    const getStatus = (startDate, monthInterval)=>{
        // let start = new Date(startDate);
        let end = getEndDate(startDate, monthInterval);
        let intermediate = getEndDate(startDate, monthInterval-1);

        if (new Date() <= new Date(intermediate)) {
            return STATUS.valid;
        }
        else if (new Date() <= new Date(end)) {
            return STATUS.toBeExpired;
        }
        else if (new Date() >= new Date(end)) {
            return STATUS.expired;
        }
        else {
            return STATUS.unstarted;
        }
    }

    const getScore = ({ totallyCleanedTrees, partiallyCleanedTrees, division: { trees }})=>{
        
        const totallyCleanedPercentage = Math.floor((totallyCleanedTrees / trees) * 100);
        const partiallyCleanedPercentage = Math.floor((partiallyCleanedTrees / trees) * 100);

        if (totallyCleanedPercentage === SCORE.worse) {
            return SCORE.worse;
        }
        else if (totallyCleanedPercentage <= SCORE.bad) {
            return SCORE.bad;
        } 
        else if (totallyCleanedPercentage <= SCORE.average) {
            return SCORE.average;
        } 
        else if (totallyCleanedPercentage <= SCORE.good) {
            return SCORE.good;
        } 
        else if (totallyCleanedPercentage <= SCORE.better) {
            return SCORE.better;
          }
    }

    const normalizedData = {
      rounds: new Array({
        start: new Date(data?.weededAt),
        end: getEndDate(data?.weededAt, INTERVALS.weeding),
        status: getStatus(data?.weededAt, INTERVALS.weeding),
        score: getScore(data),
      }),
      division: ObjectId(data?.division._id),
    };


  const newWeedingRecommendation = new WeedingRecommendation(normalizedData);

  let foundRecommendation = await Recommendation.findOne({
    year: new Date().getFullYear(),
    division: newWeedingRecommendation.division,
  });

  if (!foundRecommendation) {
    await newWeedingRecommendation.save();

    const newRecommdation = {
      weeding: newWeedingRecommendation,
      division: newWeedingRecommendation.division,
    };

    return await new Recommendation(newRecommdation).save();

  } 
  else if (!foundRecommendation?.weeding) {
    await newWeedingRecommendation.save();

    foundRecommendation.weeding = newWeedingRecommendation;

    return await foundRecommendation.save();
 } 
 else if (foundRecommendation?.weeding) {
    let foundWeedingRecommendation = await WeedingRecommendation.findOne({
      _id: ObjectId(foundRecommendation?.weeding),
    });
    console.log("found:", foundWeedingRecommendation?.rounds);
    foundWeedingRecommendation?.round?.push(normalizedData.rounds);
    await foundWeedingRecommendation.save();

    return await foundRecommendation.save();
  }
};

// // add pruning
// const addPruningReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const newPruningReport = new Pruning({
//     ...data,
//     division: ObjectId(data?.division._id),
//   });

//   let foundMonitoring = await Monitoring.findOne({
//     year: new Date().getFullYear(),
//     division: newPruningReport.division,
//   });

//   if (!foundMonitoring) {
//     await newPruningReport.save();

//     const newMonitoringReport = {
//       pruning: new Array(newPruningReport),
//       division: newPruningReport.division,
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else {
//     await newPruningReport.save();

//     if (foundMonitoring?.pruning && foundMonitoring?.pruning?.length === 0) {
//       foundMonitoring.user = user;
//       foundMonitoring.pruning = new Array(newPruningReport);

//       return await foundMonitoring.save();
//     } else {
//       foundMonitoring.user = user;
//       foundMonitoring.pruning = new Array(
//         ...foundMonitoring.pruning,
//         newPruningReport
//       );

//       return await foundMonitoring.save();
//     }
//   }
// };

// // add disease
// const addDiseaseReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const newDiseaseReport = new Disease({
//     ...data,
//     division: ObjectId(data?.division._id),
//   });

//   let foundMonitoring = await Monitoring.findOne({
//     year: new Date().getFullYear(),
//     division: newDiseaseReport.division,
//   });

//   if (!foundMonitoring) {
//     await newDiseaseReport.save();

//     const newMonitoringReport = {
//       disease: new Array(newDiseaseReport),
//       division: newDiseaseReport.division,
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else {
//     await newDiseaseReport.save();

//     if (foundMonitoring?.disease && foundMonitoring?.disease?.length === 0) {
//       foundMonitoring.user = user;
//       foundMonitoring.disease = new Array(newDiseaseReport);

//       return await foundMonitoring.save();
//     } else {
//       foundMonitoring.user = user;
//       foundMonitoring.disease = new Array(
//         ...foundMonitoring.disease,
//         newDiseaseReport
//       );

//       return await foundMonitoring.save();
//     }
//   }
// };

// // add plague
// const addPlagueReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const newPlagueReport = new Plague({
//     ...data,
//     division: ObjectId(data?.division._id),
//   });

//   let foundMonitoring = await Monitoring.findOne({
//     year: new Date().getFullYear(),
//     division: newPlagueReport.division,
//   });

//   if (!foundMonitoring) {
//     await newPlagueReport.save();

//     const newMonitoringReport = {
//       plague: new Array(newPlagueReport),
//       division: newPlagueReport.division,
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else {
//     await newPlagueReport.save();

//     if (foundMonitoring?.plague && foundMonitoring?.plague?.length === 0) {
//       foundMonitoring.user = user;
//       foundMonitoring.plague = new Array(newPlagueReport);

//       return await foundMonitoring.save();
//     } else {
//       foundMonitoring.user = user;
//       foundMonitoring.plague = new Array(
//         ...foundMonitoring.plague,
//         newPlagueReport
//       );

//       return await foundMonitoring.save();
//     }
//   }
// };

// // add insecticide
// const addInsecticideReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const { treatedTrees, applicationNumber, dose, appliedAt } = data;

//   const newPesticide = new Pesticide({
//     treatedTrees,
//     applicationNumber,
//     dose,
//     user,
//     appliedAt,
//   });

//   // await newPesticide.save();

//   const newInsecticideReport = Insecticide({
//     insecticideName: data?.insecticideName,
//     division: ObjectId(data?.division._id),
//     user,
//   });

//   // find the monitoring reports
//   // and populate all the insecticide report for this year and division
//   let foundMonitoring = await Monitoring.findOne({
//     year: new Date().getFullYear(),
//     division: newInsecticideReport.division,
//   }).populate("insecticide");

//   // if no monitoring associated to this division in the current year is found
//   if (!foundMonitoring) {
//     newInsecticideReport?.application.push(newPesticide);
//     await newInsecticideReport.save();

//     const newMonitoringReport = {
//       insecticide: new Array(newInsecticideReport),
//       division: newInsecticideReport.division,
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else {
//     // in case any related monitoring associated to this division in the current year is found

//     // check if there is any insecticide-related report registered so far
//     // if no insecticide-related report is found
//     if (
//       foundMonitoring?.insecticide &&
//       foundMonitoring?.insecticide?.length === 0
//     ) {
//       newInsecticideReport?.application.push(newPesticide);
//       await newInsecticideReport.save();

//       foundMonitoring.user = user;
//       foundMonitoring.insecticide = new Array(newInsecticideReport);

//       return await foundMonitoring.save();
//     } else if (
//       // if an insecticide-relared report is found
//       foundMonitoring?.insecticide &&
//       foundMonitoring?.insecticide?.length > 0
//     ) {
//       let length = foundMonitoring?.insecticide.length;
//       let count = 0;
//       for (let index = 0; index < length; index++) {
//         // check if there already exists a report with this same insecticide name
//         // if yes, append the new insecticide report of the same name to it.

//         if (
//           foundMonitoring?.insecticide[index].insecticideName ===
//           newInsecticideReport.insecticideName
//         ) {
//           let foundInsecticideReport = await Insecticide.findOne({
//             insecticideName: `${newInsecticideReport.insecticideName}`,
//           });
//           foundInsecticideReport?.application.push(newPesticide);
//           foundInsecticideReport.user = user;
//           await foundInsecticideReport.save();
//           foundMonitoring.user = user; // update the user
//           return await foundMonitoring.save();
//         } else if (count === length - 1) {
//           // if the insecticide names are different
//           // then, create an new insecticide report with this new insecticide name

//           newInsecticideReport?.application.push(newPesticide);
//           await newInsecticideReport.save();
//           foundMonitoring?.insecticide.push(newInsecticideReport);
//           foundMonitoring.user = user; // update the user
//           return await foundMonitoring.save();
//         }
//         count++;
//       }
//     }
//   }
// };

// // add fungicide
// const addFungicideReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const { treatedTrees, applicationNumber, dose, appliedAt } = data;

//   const newPesticide = new Pesticide({
//     treatedTrees,
//     applicationNumber,
//     dose,
//     user,
//     appliedAt,
//   });

//   // await newPesticide.save();

//   const newFungicideReport = Fungicide({
//     fungicideName: data?.fungicideName,
//     division: ObjectId(data?.division._id),
//     user,
//   });

//   // find the monitoring reports
//   // and populate all the insecticide report for this year and division
//   let foundMonitoring = await Monitoring.findOne({
//     year: new Date().getFullYear(),
//     division: newFungicideReport.division,
//   }).populate("fungicide");

//   // if no monitoring associated to this division in the current year is found
//   if (!foundMonitoring) {
//     newFungicideReport?.application.push(newPesticide);
//     await newFungicideReport.save();

//     const newMonitoringReport = {
//       fungicide: new Array(newFungicideReport),
//       division: newFungicideReport.division,
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else {
//     // in case any related monitoring associated to this division in the current year is found

//     // check if there is any insecticide-related report registered so far
//     // if no insecticide-related report is found
//     if (
//       foundMonitoring?.fungicide &&
//       foundMonitoring?.fungicide?.length === 0
//     ) {
//       newFungicideReport?.application.push(newPesticide);
//       await newFungicideReport.save();

//       foundMonitoring.user = user;
//       foundMonitoring.fungicide = new Array(newFungicideReport);

//       return await foundMonitoring.save();
//     } else if (
//       // if an insecticide-relared report is found
//       foundMonitoring?.fungicide &&
//       foundMonitoring?.fungicide?.length > 0
//     ) {
//       let length = foundMonitoring?.fungicide.length;
//       let count = 0;
//       for (let index = 0; index < length; index++) {
//         // check if there already exists a report with this same insecticide name
//         // if yes, append the new insecticide report of the same name to it.

//         if (
//           foundMonitoring?.fungicide[index].fungicideName ===
//           newFungicideReport.fungicideName
//         ) {
//           let foundFungicideReport = await Fungicide.findOne({
//             fungicideName: `${newFungicideReport.fungicideName}`,
//           });
//           foundFungicideReport?.application.push(newPesticide);
//           foundFungicideReport.user = user;
//           await foundFungicideReport.save();
//           foundMonitoring.user = user; // update the user
//           return await foundMonitoring.save();
//         } else if (count === length - 1) {
//           // if the insecticide names are different
//           // then, create an new insecticide report with this new insecticide name

//           newFungicideReport?.application.push(newPesticide);
//           await newFungicideReport.save();
//           foundMonitoring?.fungicide.push(newFungicideReport);
//           foundMonitoring.user = user; // update the user
//           return await foundMonitoring.save();
//         }
//         count++;
//       }
//     }
//   }
// };

// // add harvest
// const addHarvestReport = async (data) => {
//   const user = {
//     fullname: data?.user?.fullname,
//     email: data?.user?.email,
//     phone: data?.user?.phone,
//   };
//   const { productiveTrees, appleQuantity, nutQuantity, harvestedAt } = data;

//   const newProduction = new Production({
//     productiveTrees,
//     appleQuantity,
//     nutQuantity,
//     harvestedAt,
//     user,
//     year:
//       new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
//         ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
//         : new Date().getFullYear(),
//   });

//   // await newPesticide.save();

//   const newHarvestReport = Harvest({
//     division: ObjectId(data?.division._id),
//     year:
//       new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
//         ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
//         : new Date().getFullYear(),
//     user,
//   });

//   // find the monitoring reports
//   // and populate all the insecticide report for this year and division

//   let foundMonitoring = await Monitoring.findOne({
//     year:
//       new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
//         ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
//         : new Date().getFullYear(),
//     division: newHarvestReport.division,
//   }).populate("harvest");

//   if (!foundMonitoring) {
//     newHarvestReport?.production.push(newProduction);
//     await newHarvestReport.save();

//     const newMonitoringReport = {
//       harvest: new Array(newHarvestReport),
//       division: newHarvestReport.division,
//       year:
//         new Date().getMonth() + 1 < 3 // check if the harvest campain is not of the previous year
//           ? new Date().getFullYear() - 1 // till march of following year, it's still of the previous campain
//           : new Date().getFullYear(),
//       user,
//     };

//     return await new Monitoring(newMonitoringReport).save();
//   } else if (
//     foundMonitoring?.harvest &&
//     foundMonitoring?.harvest.length === 0
//   ) {
//     newHarvestReport?.production.push(newProduction);
//     await newHarvestReport.save();

//     foundMonitoring.user = user;
//     foundMonitoring.harvest.push(newHarvestReport);

//     return await foundMonitoring.save();
//   } else if (foundMonitoring?.harvest && foundMonitoring?.harvest.length > 0) {
//     let year =
//       new Date().getMonth() + 1 < 3
//         ? new Date().getFullYear() - 1
//         : new Date().getFullYear();

//     let foundHarvestReport = await Harvest.findOne({
//       year: year,
//       division: ObjectId(data.division._id),
//     });

//     if (!foundHarvestReport) {
//       newHarvestReport?.production.push(newProduction);
//       await newHarvestReport.save();

//       foundMonitoring.user = user;
//       foundMonitoring.harvest.push(newHarvestReport);

//       return await foundMonitoring.save();
//     } else {
//       foundHarvestReport?.production.push(newProduction);
//       foundHarvestReport.user = user;
//       await foundHarvestReport.save();

//       foundMonitoring.user = user;
//       return await foundMonitoring.save();
//     }
//   }
// };

// // ------------------------- end services ---------------------------------

const addRecommendation = asyncHandler(async (req, res) => {
  const {
    body,
    params: { variable },
  } = req;

  if (!variable) {
    res.status(400);
    throw new Error(
      "Indique como parametro a variável da recommendacao!"
    );
  }

  let result;

  switch (variable) {
    case "weeding":
      result = await addWeedingRecommendation(body);
      break;
    case "pruning":
    //   result = await addPruningReport(body);
      break;
    case "disease":
    //   result = await addDiseaseReport(body);
      break;
    case "plague":
    //   result = await addPlagueReport(body);
      break;
    case "insecticide":
    //   result = await addInsecticideReport(body);
      break;
    case "fungicide":
    //   result = await addFungicideReport(body);
      break;
    case "harvest":
    //   result = await addHarvestReport(body);
      break;
    default:
      res.status(400);
      throw new Error(
        "Indique como parametro uma variável certa que pretende monitorar!"
      );
  }

  res.status(200).json(result);
});

// const getRecommendations = asyncHandler(async (req, res) => {
//   const {
//     params: { variable },
//   } = req;

//   // variable param is a division ID

//   if (!variable) {
//     res.status(400);
//     throw new Error("Indique como parametro o ID da divisao!");
//   } else if (variable === "void") {
//     return res.status(200).json({});
//   }

//   let recommendations = await Recommendation.find({
//     division: ObjectId(variable),
//   })
//     .populate("weeding")
//     .populate("pruning")
//     .populate("disease")
//     .populate("plague")
//     .populate("insecticide")
//     .populate("fungicide")
//     .populate("harvest");

//   return res.status(200).json(recommendations);
// });



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

// });

export { addRecommendation, addWeedingRecommendation };
