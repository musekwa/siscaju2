import { calculatePercentage, getNextRound, lastMonitoringRound, normalizeDate, sprayingMonths } from ".";
import { northProvinces } from "../app/provinces";
import { checkDisease } from "./checkDisease";

// ---------------------------- Start fungicide report --------------------------


export const checkFungicide = (reports, farmland)=>{

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
                fungicida nos meses de julho, agosto e setembro.`
              : `Neste ano, a aplicação da fungicida ainda não foi monitorada.`,
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

    if (!reports[i]?.disease?.rounds && !reports[i]?.fungicide?.rounds) {
        report.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "warning"
              : "info";
        report.message =
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se a aplicação rotineira da 
                fungicida nos meses de julho, agosto e setembro.`
            : `Recomenda-se o controle das doenças e a aplicação rotineira da 
                fungicida nos meses de julho, agosto e setembro.`;

        normalizedReport.push(report);

    } 
    else if (
      reports[i]?.disease?.rounds &&
      reports[i]?.disease?.rounds?.length > 0 &&
      !reports[i]?.fungicide?.rounds
    )
    {
        // check if the last disease reportss have any relevant information
        let lastDiseaseRounds = checkDisease(reports, farmland);

        
        let oidioLastRound = lastDiseaseRounds.find(
          (round) => round.diseaseName === "Oídio"
        );
        let antracnoseLastRound = lastDiseaseRounds.find(
          (round) => round.diseaseName === "Antracnose"
        );
        let queimaLastRound = lastDiseaseRounds.find(
          (round) => round.diseaseName === "Queima"
        );

        let foundLastRounds = [ oidioLastRound, antracnoseLastRound, queimaLastRound ];
        let foundRounds = foundLastRounds.filter(round => round);

        foundRounds.map((round)=>{

            const { 
                diseaseName,
                higherSeverity,
                highSeverity,
                averageSeverity,
                lowSeverity,
                detectedAt,
            } = round;

            let newReport = {
              ...report,
              diseaseName,
              higherSeverity,
              highSeverity,
              averageSeverity,
              lowSeverity,
              detectedAt,
            };

            newReport.affectedTrees = 
                Number(higherSeverity) + Number(highSeverity) + Number(averageSeverity) + Number(lowSeverity);
            newReport.affectedTreePercentage = calculatePercentage(newReport.affectedTrees, newReport.trees);

            if (newReport.affectedTreePercentage === 0) {
                newReport.status =
                  sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
                    ? "warning"
                    : "info";
                newReport.message =
                  sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
                    ? `Recomenda-se a aplicação rotineira da 
                        fungicida nos meses de julho, agosto e setembro. 
                        A última monitoria das doenças que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        não detectou nenhuma ${diseaseName}.`
                    : `Recomenda-se o controle das doenças e a aplicação rotineira da 
                        fungicida nos meses de julho, agosto e setembro.                         
                        A última monitoria das doenças que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        não detectou nenhuma ${diseaseName}.`;
            }
            else if (newReport.affectedTreePercentage > 0){
                newReport.status =
                  sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
                    ? "error"
                    : "warning";
                newReport.message =
                  sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
                    ? `Recomenda-se a aplicação da 
                        fungicida contra a ${diseaseName}. 
                        A última monitoria das doenças que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} 
                        detectou ${
                          newReport.affectedTreePercentage
                        }% dos cajueiros doentes.`
                    : `Recomenda-se a aplicação da 
                        fungicida contra a ${diseaseName}. 
                        A última monitoria das doenças que ocorreu aos ${normalizeDate(
                          new Date(detectedAt)
                        )} detectou ${
                        newReport.affectedTreePercentage
                      }% dos cajueiros doentes.`;                
            }

            normalizedReport.push(newReport);

            return round;
        })

    }
    else if (
        !reports[i]?.disease?.rounds && 
        reports[i]?.fungicide?.rounds && 
        reports[i]?.fungicide?.rounds.length > 0
    ) { // considering there is no disease reports yet, but there fungicide reports already
     
        let oidioLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
          ));

        let antracnoseLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Antracnose",
          ));

        let queimaLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Queima"
          ));
        
        let lastFungicideRounds = [ oidioLastRound, antracnoseLastRound, queimaLastRound ];
        let foundRounds = lastFungicideRounds.filter((lastRound) => lastRound);
        
        // all fungicide reports with
        foundRounds.map((round) => {
            const {  
                diseaseName,
                fungicideName,
                treatedTrees,
                applicationNumber,
                dose,
                appliedAt,
            } = round;

            let newReport = {
              ...report,
              diseaseName,
              fungicideName,
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
              diseaseName,
              appliedAt,
              northProvinces.indexOf(farmland.province) >= 0
            );

          if (
            nextRound.nextApplication === "Nenhuma" &&
            newReport.treatedTreePercentage <= 70
          ) {
            newReport.status = "error";
            newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${fungicideName}
              contra ${diseaseName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros. Recomenda-se pulverizar os restantes.`;
          } else if (
            nextRound.nextApplication === "Nenhuma" &&
            newReport.treatedTreePercentage > 70
          ) {
            newReport.status = "success";
            newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${fungicideName} em 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;
          } else if (sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0 && nextRound.nextApplication !== "Nenhuma") {
            newReport.status = "warning";
            newReport.message = `Recomenda-se a ${
              nextRound.nextApplication
            } aplicação de ${fungicideName} 
                contra ${diseaseName} aos ${normalizeDate(
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
            } aplicação de ${fungicideName} 
                contra ${diseaseName} aos ${normalizeDate(
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
            } aplicação de ${fungicideName} 
                contra ${diseaseName} aos ${normalizeDate(
              nextRound.nextDate
            )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } else {
            newReport.status = "info";
            newReport.message = `Recomenda-se uma ${
              nextRound.nextApplication
            } aplicação da fungicida '${fungicideName}' contra a praga '${diseaseName}'. A última aplicação que ocorreu aos ${normalizeDate(
              new Date(appliedAt)
            )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;
          }

          normalizedReport.push(newReport);

          return reports;
        });            
      }
      else {

        // check if the last disease reportss have any relevant information
        let lastDiseaseReports = checkDisease(reports, farmland);

        let oidioLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
          ));

        let antracnoseLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Antracnose"
          ));

        let queimaLastRound = lastMonitoringRound(
          reports[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Queima"
          ));

        let lastFoundRounds = [
          oidioLastRound,
          antracnoseLastRound,
          queimaLastRound,
        ];
        let foundRounds = lastFoundRounds.filter((round) => round);        
        
        // loop through all the existing fungicide reportss.
        foundRounds.map((round) => {
            const {                
                diseaseName,
                fungicideName,
                treatedTrees,
                applicationNumber,
                dose,
                appliedAt, 
            } = round;

          let newReport = {
            ...report,
            diseaseName,
            fungicideName,
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
            diseaseName,
            appliedAt,
            northProvinces.indexOf(farmland.province) >= 0
          );

          let oidioReport = lastDiseaseReports.find((report) => report.diseaseName === "Oídio");
          let antracnoseReport = lastDiseaseReports.find(
            (report) => report.diseaseName === "Antracnose"
          );
          let queimaReport = lastDiseaseReports.find(
            (report) => report.diseaseName === "Queima"
          );

        if (
            diseaseName === "Oídio" &&
            oidioReport &&
            Number(oidioReport.affectedTrees) === 0
            ) {
            newReport.status = "success";
            newReport.message =
              `Ótimo! Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(oidioReport.detectedAt)
              )}, mas nenhum cajueiros 
                foi detectado doente. Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )}, que 
                abrangeu ${newReport.treatedTreePercentage}% dos cajueiros.`
                
            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message  + "");

            } else if (
            diseaseName === "Oídio" &&
            oidioReport &&
            Number(oidioReport.affectedTrees) > 0
            ) {
            newReport.status = "warning";
            newReport.message =
              `Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(oidioReport.detectedAt)
              )} e ${Number(
                oidioReport.affectedTreePercentage
              )}% dos cajueiros foram detectados doentes. 
                Em seguida, completou-se ${
                  nextRound.round
                } aplicações da  ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )} 
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.`

            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message + "");

            } else if (
            diseaseName === "Antracnose" &&
            antracnoseReport &&
            Number(antracnoseReport.affectedTrees) === 0
            ) {
            newReport.status = "success";
            newReport.message =
              `Ótimo! Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(antracnoseReport.detectedAt)
              )}, mas nenhum cajueiros 
                foi detectado doente. Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )}, que
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.` 
            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message + "");
            } else if (
            diseaseName === "Antracnose" &&
            antracnoseReport &&
            Number(antracnoseReport.affectedTrees) > 0
            ) {
            newReport.status = "warning";
            newReport.message =
              `Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(antracnoseReport.detectedAt)
              )} e ${Number(
                antracnoseReport.affectedTreePercentage
              )}% dos cajueiros foram detectados doentes. 
                Em seguida, completou-se ${
                  nextRound.round
                } aplicações da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )}, que 
                abrangeu ${newReport.treatedTreePercentage} dos cajueiros.` 
                
            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message + "");

            } else if (
            diseaseName === "Queima" &&
            queimaReport &&
            Number(queimaReport.affectedTrees) === 0
            ) {
            newReport.status = "success";
            newReport.message =
              `Ótimo! Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(queimaReport.detectedAt)
              )}, mas nenhum cajueiros 
                    foi detectado doente. Em seguida, completou-se ${
                      nextRound.round
                    } aplicações da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )} 
                    abrangeu ${
                      newReport.treatedTreePercentage
                    } dos cajueiros.` 
            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message + "");
            } else if (
            diseaseName === "Queima" &&
            queimaReport &&
            Number(queimaReport.affectedTrees) > 0
            ) {
            newReport.status = "warning";
            newReport.message =
              `Ocorreu um controle da ${diseaseName} aos ${normalizeDate(
                new Date(queimaReport.detectedAt)
              )} e ${Number(
                queimaReport.affectedTreePercentage
              )}% dos cajueiros foram detectados doentes. 
                    Em seguida, completou-se ${
                      nextRound.round
                    } aplicações da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )} 
                    abrangeu ${
                      newReport.treatedTreePercentage
                    } dos cajueiros.`
            nextRound.nextApplication !== "Nenhuma"
              ? (newReport.message =
                  newReport.message +
                  ` Recomenda-se a próxima aplicação aos ${normalizeDate(
                    nextRound.nextDate
                  )}`)
              : (newReport.message = newReport.message + "");
            } else {
            newReport.status = "info";
            newReport.message =
              `Ocorreu uma pulverização da ${fungicideName} aos ${normalizeDate(
                new Date(appliedAt)
              )} que abrangeu ${
                newReport.treatedTreePercentage
              } dos cajueiros.` 
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
    
    }