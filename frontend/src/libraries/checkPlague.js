import { lastMonitoringRound, calculatePercentage, normalizeDate } from ".";

/**
 *
 * @param {*} report : any array objects => farmland's divisions monitorings
 *                    (all report about monitoring for each division of the farmland)
 * @param {*} farmland : an object => the farmaland about which the monitoring report is being checked
 * @returns : an array objects => recomendations (must-have report properties: trees (number of trees in the division);
 *              sowingyear; status and message )
 */

export const checkPlague = (reports, farmland) => {
  const normalizedReport = [];

  // if there no monitoring report associated to the divisions of this farmland
  // then the return array will contain one recommendation
  if (reports && reports.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let report = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, as pragas ainda não foram monitoradas.`,
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

    if (!reports[i]?.plague?.rounds) {
      report.status = "info";
      report.message = `Neste ano, as pragas ainda não foram monitoradas.`;

      normalizedReport.push(report);
    } else if (
      reports[i]?.plague?.rounds &&
      reports[i]?.plague?.rounds?.length > 0
    ) {
      // get the last monitoring report for each plague reports if exists.

      let cochonilhaRound = lastMonitoringRound(
        reports[i]?.plague?.rounds.filter(
          (round) => round.plagueName === "Cochonilha"
        )
      );

      let helopeltisRound = lastMonitoringRound(
        reports[i]?.plague?.rounds.filter(
          (round) => round.plagueName === "Helopeltis ssp"
        )
      );

    //   let queimaRound = lastMonitoringRound(
    //     reports[i]?.plague?.rounds.filter(
    //       (round) => round.plagueName === "Queima"
    //     )
    //   );

      let lastRounds = [cochonilhaRound, helopeltisRound ];
      let foundLastRounds = lastRounds.filter((round) => round);

      // loop over all the existing plague monitoring reports and
      // create a specific report for each.
      foundLastRounds.map((round) => {
        const {
          plagueName,
          higherAttack,
          highAttack,
          averageAttack,
          lowAttack,
          detectedAt
        } = round;

        let newReport = {
          sowingYear,
          plagueName,
          higherAttack,
          highAttack,
          averageAttack,
          lowAttack,
          detectedAt,
          trees: foundDivision.trees,
        };

        newReport.affectedTrees =
          Number(higherAttack) +
          Number(highAttack) +
          Number(averageAttack) +
          Number(lowAttack);
        newReport.affectedTreePercentage = calculatePercentage(
          newReport.affectedTrees,
          newReport.trees
        );

        if (Math.round(Number(newReport.affectedTreePercentage)) === 0) {
          newReport.status = "success";
          newReport.message = `Ótimo! Ocorreu uma monitoria da praga ${newReport.plagueName.toLowerCase()} aos ${normalizeDate(
            new Date(newReport.detectedAt)
          )} e nenhum cajueiro foi encontrado infectado`;
        } else if (Math.round(Number(newReport.affectedTreePercentage)) <= 30) {
          newReport.status = "warning";
          newReport.message = `Recomenda-se uma pulverização contra a ${newReport.plagueName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(newReport.detectedAt)
                )} 
                detectou ${
                  newReport.affectedTreePercentage
                }% dos cajueiros infectados.`;
        } else {
          newReport.status = "error";
          newReport.message = `Recomenda-se URGENTEMENTE uma pulverização contra a ${newReport.plagueName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(newReport.detectedAt)
                )} 
                detectou ${
                  newReport.affectedTreePercentage
                }% dos cajueiros infectados.`;
        }

        normalizedReport.push(newReport);

        return round;
      });
    }
  }

  return normalizedReport;
};
