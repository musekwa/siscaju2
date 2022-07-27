import { diseaseMessages } from "./messages";
import { lastMonitoringRound, calculatePercentage, normalizeDate } from ".";

/**
 * 
 * @param {*} report : any array objects => farmland's divisions monitorings 
 *                    (all report about monitoring for each division of the farmland)
 * @param {*} farmland : an object => the farmaland about which the monitoring report is being checked
 * @returns : an array objects => recomendations (report properties: trees (number of trees in the division); 
 *              sowingyear; status and message )
 */

export const checkDisease = (reports, farmland) => {
  const normalizedReport = [];

  // if there no monitoring report associated to the divisions of this farmland
  // then the return array will contain one recommendation
  if (reports && reports.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let report = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, as doenças ainda não foram monitoradas.`,
      };

      normalizedReport.push(report);
    }

    return normalizedReport;
  }

  // If there is any monitoring report, then associate it with is respective farmland's division
  // and formulate the report.
  // 

  for (let i = 0; i < reports?.length; i++) {

    let foundDivision = farmland?.divisions.find(
      (division) => division._id === reports[i].division
    );
    let sowingYear = foundDivision.sowingYear;

    let report = {
      sowingYear,
      trees: foundDivision.trees,
    };

    if (!reports[i]?.disease?.rounds) {
      report.status = "info";
      report.message = `Neste ano, as doenças ainda não foram monitoradas.`;

      normalizedReport.push(report);
    } else if (
      reports[i]?.disease?.rounds &&
      reports[i]?.disease?.rounds?.length > 0
    ) {
    // get the last monitoring report for each disease reports if exists.
      
        let oidioRound = lastMonitoringRound(
            reports[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
            ));

        let antracnoseRound = lastMonitoringRound(
            reports[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Antracnose"
            ));

        let queimaRound = lastMonitoringRound(
            reports[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Queima"
            ));
        
        let lastRounds = [oidioRound, antracnoseRound, queimaRound ];
        let foundLastRounds = lastRounds.filter((round) => round);

        // loop over all the existing disease monitoring reports and
        // create a specific report for each.
        foundLastRounds.map((round) => {
          const {
            diseaseName,
            higherSeverity,
            highSeverity,
            averageSeverity,
            lowSeverity,
            detectedAt
          } = round;

          let newReport = {
            sowingYear,
            diseaseName,
            higherSeverity,
            highSeverity,
            averageSeverity,
            lowSeverity,
            detectedAt,
            trees: foundDivision.trees,
          };

            newReport.affectedTrees = 
                Number(higherSeverity) + Number(highSeverity) + Number(averageSeverity) + Number(lowSeverity);
            newReport.affectedTreePercentage = calculatePercentage(newReport.affectedTrees, newReport.trees);


            if (newReport.affectedTreePercentage === 0) {
                newReport.status = "success"
                newReport.message = `Ótimo! Ocorreu uma monitoria da doença ${newReport.diseaseName.toLowerCase()} aos ${normalizeDate(
                new Date(newReport.detectedAt)
            )} e nenhum cajueiro foi encontrado doente`;
            
            }
            else if (newReport.affectedTreePercentage <= 30) {
                newReport.status = "warning";
                newReport.message = `Recomenda-se uma pulverização contra a ${newReport.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(newReport.detectedAt)
                )} 
                detectou ${newReport.affectedTreePercentage}% dos cajueiros doentes.`;                
            }
            else {
                newReport.status = "error";
                newReport.message = `Recomenda-se URGENTEMENTE uma pulverização contra a ${newReport.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(newReport.detectedAt)
                )} 
                detectou ${
                  newReport.affectedTreePercentage
                }% dos cajueiros doentes.`;                
            }
            
            normalizedReport.push(newReport);

            return round;
        });        
    }
  }

  return normalizedReport;
};
