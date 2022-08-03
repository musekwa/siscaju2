
import {
  calculatePercentage,
  getNextRound,
  lastMonitoringRound,
  normalizeDate,
  sprayingMonths,
} from ".";
import { northProvinces } from "../app/provinces";
import { checkPlague } from "./checkPlague";

// ---------------------------- Start fungicide report --------------------------

export const checkInsecticide = (reports, farmland) => {
  const normalizedReport = [];

  if (reports && reports.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let report = {
        sowingYear: farmland.divisions[i].sowingYear,
        status:
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? "warning"
            : "info",
        message:
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se a aplicação rotineira da 
                insecticida nos meses de julho, agosto e setembro.`
            : `Neste ano, a aplicação da insecticida ainda não foi monitorada.`,
      };

      normalizedReport.push(report);
    }

    return normalizedReport;
  }

  for (let i = 0; i < reports?.length; i++) {
    // find the reports-related farmland division.
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === reports[i].division
    );

    // find the sowing year of this farmland division
    let sowingYear = foundDivision.sowingYear;

    //
    let report = {
      sowingYear,
      trees: reports[i].trees,
    };

    // let fungicidereports = {
    //     sowingYear,
    //     trees: foundDivision.trees,
    // };

    if (!reports[i]?.plague?.rounds && !reports[i]?.insecticide?.rounds) {
      report.status =
        sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
          ? "warning"
          : "info";
      report.message =
        sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
          ? `Recomenda-se a aplicação rotineira da 
                insecticida nos meses de julho, agosto e setembro.`
          : `Recomenda-se o controle das doenças e a aplicação rotineira da 
                insecticida nos meses de julho, agosto e setembro.`;

     
      normalizedReport.push(report);
    } else if (
      reports[i]?.plague?.rounds &&
      reports[i]?.plague?.rounds?.length > 0 &&
      !reports[i]?.insecticide?.rounds
    ) {

      // check if the last plague reportss have any relevant information
      let lastPlagueRounds = checkPlague(reports, farmland);

      let cochonilhaLastRound = lastPlagueRounds.find(
        (round) => round.plagueName === "Cochonilha"
      );
      let helopeltisLastRound = lastPlagueRounds.find(
        (round) => round.plagueName === "Helopeltis ssp"
      );


      let foundLastRounds = [
        cochonilhaLastRound,
        helopeltisLastRound,
  
      ];
      let foundRounds = foundLastRounds.filter((round) => round);

      foundRounds.map((round) => {
        const {
          plagueName,
          higherAttack,
          highAttack,
          averageAttack,
          lowAttack,
          detectedAt,
        } = round;

        let newReport = {
          ...report,
          plagueName,
          higherAttack: Number(higherAttack),
          highAttack: Number(highAttack),
          averageAttack: Number(averageAttack),
          lowAttack: Number(lowAttack),
          detectedAt,
        };

        newReport.affectedTrees = 
          Number(higherAttack) + 
          Number(highAttack) + 
          Number(averageAttack) + 
          Number(lowAttack);

        newReport.affectedTreePercentage = Number(
          calculatePercentage(newReport.affectedTrees, newReport.trees)
        );

        if (newReport.affectedTreePercentage === 0) {
          newReport.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "warning"
              : "info";
          newReport.message =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? `Recomenda-se a aplicação rotineira da 
                        insecticida nos meses de julho, agosto e setembro. 
                        A última monitoria das pragas que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        não detectou nenhuma ${plagueName}.`
              : `Recomenda-se o controle das doenças e a aplicação rotineira da 
                        insecticida nos meses de julho, agosto e setembro.                         
                        A última monitoria das pragas que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        não detectou nenhuma ${plagueName}.`;
        } else if (newReport.affectedTreePercentage > 0) {
          newReport.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "error"
              : "warning";
          newReport.message =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? `Recomenda-se a aplicação da 
                        insecticida contra a ${plagueName}. 
                        A última monitoria das pragas que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        detectou ${
                          newReport.affectedTreePercentage
                        }% dos cajueiros infectados.`
              : `Recomenda-se a aplicação da 
                        insecticida contra a ${plagueName}. 
                        A última monitoria das pragas que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} detectou ${
                  newReport.affectedTreePercentage
                }% dos cajueiros infectados.`;
        }
        normalizedReport.push(newReport);

        return round;
      });
    } else if (
      !reports[i]?.plague?.rounds &&
      reports[i]?.insecticide?.rounds &&
      reports[i]?.insecticide?.rounds.length > 0
    ) {
      // considering there is no plague reports yet, but there fungicide reports already

      let cochonilhaLastRound = lastMonitoringRound(
        reports[i]?.insecticide?.rounds.filter(
          (round) => round.plagueName === "Cochonilha"
        )
      );

      let helopeltisLastRound = lastMonitoringRound(
        reports[i]?.insecticide?.rounds.filter(
          (round) => round.plagueName === "Helopeltis ssp"
        )
      );


      let lastInsecticideRounds = [
        cochonilhaLastRound,
        helopeltisLastRound,
      ];
      let foundRounds = lastInsecticideRounds.filter((lastRound) => lastRound);

      // all fungicide reports with
      foundRounds.map((round) => {
        const {
          plagueName,
          insecticideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
        } = round;

        let newReport = {
          ...report,
          plagueName,
          insecticideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
        };

        newReport.treatedTreePercentage = calculatePercentage(
          Number(treatedTrees),
          newReport.trees
        );

        const nextRound = getNextRound(
          applicationNumber,
          plagueName,
          appliedAt,
          northProvinces.indexOf(farmland.province) >= 0
        );

        if (
          nextRound.nextApplication === "Nenhuma" &&
          newReport.treatedTreePercentage <= 70
        ) {
          newReport.status = "error";
          newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${insecticideName}
              contra ${plagueName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros. Recomenda-se pulverizar os restantes.`;
        } else if (
          nextRound.nextApplication === "Nenhuma" &&
          newReport.treatedTreePercentage > 70
        ) {
          newReport.status = "success";
          newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${insecticideName} em 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;
        } else if (
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0 &&
          nextRound.nextApplication !== "Nenhuma"
        ) {
          newReport.status = "warning";
          newReport.message = `Recomenda-se a ${
            nextRound.nextApplication
          } aplicação de ${insecticideName} 
                contra ${plagueName} aos ${normalizeDate(
            nextRound.nextDate
          )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(appliedAt))} abrangeu ${
            newReport.treatedTreePercentage
          }% dos cajueiros.`;
        } else if (
          new Date() - new Date(appliedAt) >= 0 &&
          nextRound.nextApplication !== "Nenhuma"
        ) {
          newReport.status = "info";
          newReport.message = `Recomenda-se a ${
            nextRound.nextApplication
          } aplicação de ${insecticideName} 
                contra ${plagueName} aos ${normalizeDate(
            nextRound.nextDate
          )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(appliedAt))} abrangeu ${
            newReport.treatedTreePercentage
          }% dos cajueiros.`;
        } else if (
          new Date() - new Date(appliedAt) < 0 &&
          nextRound.nextApplication !== "Nenhuma"
        ) {
          newReport.status = "error";
          newReport.message = `Perigo! A ${
            nextRound.nextApplication
          } aplicação de ${insecticideName} 
                contra ${plagueName} aos ${normalizeDate(
            nextRound.nextDate
          )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(appliedAt))} abrangeu ${
            newReport.treatedTreePercentage
          }% dos cajueiros.`;
        } else {
          newReport.status = "info";
          newReport.message = `Recomenda-se uma ${
            nextRound.nextApplication
          } aplicação da fungicida '${insecticideName}' contra a praga '${plagueName}'. A última aplicação que ocorreu aos ${normalizeDate(
            new Date(appliedAt)
          )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;
        }

        normalizedReport.push(newReport);

        return reports;
      });
    } else {
      // check if the last plague reportss have any relevant information
      let lastPlagueReports = checkPlague(reports, farmland);

      let cochonilhaLastRound = lastMonitoringRound(
        reports[i]?.insecticide?.rounds.filter(
          (round) => round.plagueName === "Cochonilha"
        )
      );

      let helopeltisLastRound = lastMonitoringRound(
        reports[i]?.insecticide?.rounds.filter(
          (round) => round.plagueName === "Helopeltis ssp"
        )
      );

      let lastFoundRounds = [
        cochonilhaLastRound,
        helopeltisLastRound,
      ];
      let foundRounds = lastFoundRounds.filter((round) => round);

      // loop through all the existing fungicide reportss.
      foundRounds.map((round) => {
        const {
          plagueName,
          insecticideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
        } = round;

        let newReport = {
          ...report,
          plagueName,
          insecticideName,
          treatedTrees,
          applicationNumber,
          dose,
          appliedAt,
        };

        newReport.treatedTreePercentage = calculatePercentage(
          Number(treatedTrees),
          newReport.trees
        );

        const nextRound = getNextRound(
          applicationNumber,
          plagueName,
          appliedAt,
          northProvinces.indexOf(farmland.province) >= 0
        );

        let cochonilhaReport = lastPlagueReports.find(
          (report) => report.plagueName === "Cochonilha"
        );
        let helopeltisReport = lastPlagueReports.find(
          (report) => report.plagueName === "Helopeltis ssp"
        );

        if (
          plagueName === "Cochonilha" &&
          cochonilhaReport &&
          Number(cochonilhaReport.affectedTrees) === 0
        ) {
          newReport.status = "success";
          newReport.message = `Ótimo! Ocorreu um controle da ${plagueName} aos ${normalizeDate(
            new Date(cochonilhaReport.detectedAt)
          )}, mas nenhum cajueiros 
                foi encontrado infectado. Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${insecticideName} aos ${normalizeDate(
            new Date(appliedAt)
          )}, que 
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.`;

          nextRound.nextApplication !== "Nenhuma"
            ? (newReport.message =
                newReport.message +
                ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                  nextRound.nextDate
                )}`)
            : (newReport.message = newReport.message + "");
        } else if (
          plagueName === "Cochonilha" &&
          cochonilhaReport &&
          Number(cochonilhaReport.affectedTrees) > 0
        ) {
          newReport.status = "warning";
          newReport.message = `Ocorreu um controle da ${plagueName} aos ${normalizeDate(
            new Date(cochonilhaReport.detectedAt)
          )} e ${Number(
            cochonilhaReport.affectedTreePercentage
          )}% dos cajueiros foram encontrados infectados. 
                Em seguida, completou-se ${
                  nextRound.round
                } aplicações da  ${insecticideName} aos ${normalizeDate(
            new Date(appliedAt)
          )} 
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.`;

          nextRound.nextApplication !== "Nenhuma"
            ? (newReport.message =
                newReport.message +
                ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                  nextRound.nextDate
                )}`)
            : (newReport.message = newReport.message + "");
        } else if (
          plagueName === "Helopeltis ssp" &&
          helopeltisReport &&
          Number(helopeltisReport.affectedTrees) === 0
        ) {
          newReport.status = "success";
          newReport.message = `Ótimo! Ocorreu um controle da ${plagueName} aos ${normalizeDate(
            new Date(helopeltisReport.detectedAt)
          )}, mas nenhum cajueiro 
                foi encontrado infectado. Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${insecticideName} aos ${normalizeDate(
            new Date(appliedAt)
          )}, que
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.`;
          nextRound.nextApplication !== "Nenhuma"
            ? (newReport.message =
                newReport.message +
                ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                  nextRound.nextDate
                )}`)
            : (newReport.message = newReport.message + "");
        } else if (
          plagueName === "Helopeltis ssp" &&
          helopeltisReport &&
          Number(helopeltisReport.affectedTrees) > 0
        ) {
          newReport.status = "warning";
          newReport.message = `Ocorreu um controle da ${plagueName} aos ${normalizeDate(
            new Date(helopeltisReport.detectedAt)
          )} e ${Number(
            helopeltisReport.affectedTreePercentage
          )}% dos cajueiros foram encontrados infectados. 
                Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${insecticideName} aos ${normalizeDate(
            new Date(appliedAt)
          )}, que 
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.`;

          nextRound.nextApplication !== "Nenhuma"
            ? (newReport.message =
                newReport.message +
                ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                  nextRound.nextDate
                )}`)
            : (newReport.message = newReport.message + "");
 
        } else {
          newReport.status = "info";
          newReport.message = `Ocorreu uma pulverização da ${insecticideName} aos ${normalizeDate(
            new Date(appliedAt)
          )} que abrangeu ${newReport.treatedTreePercentage}% dos cajueiros.`;
          nextRound.nextApplication !== "Nenhuma"
            ? (newReport.message =
                newReport.message +
                ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                  nextRound.nextDate
                )}`)
            : (newReport.message = newReport.message + "");
        }

        normalizedReport.push(newReport);

        return round;
      });
    }
  }
  return normalizedReport;
};