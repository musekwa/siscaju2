import {
  lastMonitoringRound,
  calculatePercentage,
  normalizeDate,
  calculateTotal,
} from ".";

//  --------------------------- Start pruning report -------------------------------

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();

export const checkPruning = (report, farmland) => {
  const normalizedReport = [];

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let pruningReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, a poda ainda não foi monitorada.`,
      };

      normalizedReport.push(pruningReport);
    }

    return normalizedReport;
  }

  // const divisions = [];

  for (let i = 0; i < report?.length; i++) {
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === report[i].division
    );
    let sowingYear = foundDivision.sowingYear;

    let pruningReport = {
      sowingYear,
      trees: report[i].trees,
    };


    if (report[i]?.pruning?.rounds && report[i]?.pruning?.rounds?.length > 0) {
      let formationPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de formação"
        ),
        "pruning"
      );

      formationPruning = {
        ...formationPruning,
        pruningType: "Poda de formação",
      };

      let sanitationPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de sanitação"
        ),
        "pruning"
      );

      sanitationPruning = {
        ...sanitationPruning,
        pruningType: "Poda de sanitação",
      };

      let renewalPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de rejuvenescimento"
        ),
        "pruning"
      );

      renewalPruning = {
        ...renewalPruning,
        pruningType: "Poda de rejuvenescimento",
      };

      let maintenancePruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de manutenção"
        ),
        "pruning"
      );

      maintenancePruning = {
        ...maintenancePruning,
        pruningType: "Poda de manutenção",
      };

      let substitutionPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de renovação"
        ),
        "pruning"
      );

      substitutionPruning = {
        ...substitutionPruning,
        pruningType: "Poda de renovação",
      };

      const allPrunings = [
        formationPruning,
        sanitationPruning,
        renewalPruning,
        maintenancePruning,
        substitutionPruning,
      ];



    for (let i = 0; i < allPrunings.length; i++) {

        if (!allPrunings[i]?.prunedAt){ // no report associated to this pruning type is registered!!!

            if (  
              CURRENT_YEAR - pruningReport.sowingYear <= 3 &&
              (allPrunings[i].pruningType === "Poda de formação" || allPrunings[i].pruningType === "Poda de sanitação")
            ) 
            {
                const report = {
                  ...pruningReport,
                  pruningType: allPrunings[i].pruningType,
                };
    
                report.status = "warning";
                report.message = `Recomenda-se monitorar esta unidade de produção 
                        para identificar cajueiros que necessitam uma ${report.pruningType.toLowerCase()}.`;
                
                normalizedReport.push(report);
            }
            else if (
              CURRENT_YEAR - pruningReport.sowingYear > 3 &&
              (allPrunings[i].pruningType === "Poda de manutenção" ||
                allPrunings[i].pruningType === "Poda de sanitação")
            ) {
              const report = {
                ...pruningReport,
                pruningType: allPrunings[i].pruningType,
              };

              report.status = "warning";
              report.message = `Recomenda-se monitorar esta unidade de produção 
                        para identificar cajueiros que necessitam uma ${report.pruningType.toLowerCase()}.`;

              normalizedReport.push(report);
            } else if (
              !allPrunings[i]?.prunedAt &&
              CURRENT_YEAR - pruningReport.sowingYear >= 5 &&
              (allPrunings[i].pruningType === "Poda de rejuvenescimento" ||
                allPrunings[i].pruningType === "Poda de renovação")
            ) {
              const report = {
                ...pruningReport,
                pruningType: allPrunings[i].pruningType,
              };

              report.status = "warning";
              report.message = `Recomenda-se monitorar esta unidade de produção 
                        para identificar cajueiros que necessitam uma ${report.pruningType.toLowerCase()}.`;

              normalizedReport.push(report);
            } 

        }
        else {  // there already exists a report associated to this pruning type

            const {
                pruningType,
                partiallyPrunedTrees,
                totallyPrunedTrees,
                prunedAt,
            } = allPrunings[i];

            const report = {
                ...pruningReport,
                pruningType,
                partiallyPrunedTrees,
                totallyPrunedTrees,
                prunedAt : new Date(prunedAt),
            };

            report.totallyPrunedTreePercentage = calculatePercentage(
                totallyPrunedTrees,
                report.trees
            );

            report.partiallyPrunedTreePercentage = calculatePercentage(
              partiallyPrunedTrees,
              report.trees
            );

            report.prunedTrees = calculateTotal(
                partiallyPrunedTrees,
                totallyPrunedTrees
            );


            report.prunedTreePercentage = calculatePercentage(
              report.prunedTrees,
              report.trees
            );


            if (
              CURRENT_YEAR - report.sowingYear <= 3 &&
              pruningType === "Poda de formação"
            ) {  // there was done a formation pruning 

                if (CURRENT_YEAR === new Date(prunedAt).getFullYear()){
                    report.status = "info";
                    report.message = `Ótimo! Ocorreu uma ${pruningType.toLowerCase()} aos ${normalizeDate(
                      new Date(prunedAt)
                    )} que abrangeu ${
                      report.prunedTreePercentage
                    }% dos cajueiros. Recomenda-se outra ${pruningType.toLowerCase()} em ${
                      new Date(prunedAt).getFullYear() + 1
                    }.`;
      
                    normalizedReport.push(report);

                }
                else if (CURRENT_YEAR - new Date(prunedAt).getFullYear() === 1) {
                    report.status = "warning";
                    report.message = `Recomenda-se uma ${pruningType.toLowerCase()} neste ano de ${
                      new Date(prunedAt).getFullYear() + 1
                    }. A última ${pruningType.toLowerCase()} que abrangeu ${
                      report.prunedTreePercentage
                    }% dos cajueiros ocorreu ano passado aos  ${normalizeDate(
                      new Date(prunedAt)
                    )}.`;

                    normalizedReport.push(report);
                }
                else if ((CURRENT_YEAR - new Date(prunedAt).getFullYear()) > 1) {
                    report.status = "error";
                    report.message = `Recomenda-se URGENTEMENTE uma ${pruningType.toLowerCase()} neste ano de ${new Date().getFullYear()}. 
                        A última ${pruningType.toLowerCase()} que abrangeu ${report.prunedTreePercentage}% dos 
                        cajueiros ocorreu há anos atrás aos ${normalizeDate(new Date(prunedAt))}.`;

                    normalizedReport.push(report);

                }


            } else if (
              CURRENT_YEAR - report.sowingYear > 3 &&
              CURRENT_YEAR - report.sowingYear < 10 &&
              pruningType === "Poda de manutenção"
            ) {
              if (CURRENT_YEAR === new Date(prunedAt).getFullYear()) {
                report.status = "info";
                report.message = `Ótimo! Ocorreu uma ${pruningType.toLowerCase()} aos ${normalizeDate(
                  new Date(prunedAt)
                )} que abrangeu ${
                  report.prunedTreePercentage
                }% dos cajueiros. Recomenda-se outra ${pruningType.toLowerCase()} entre ${
                  new Date(prunedAt).getFullYear() + 1
                } e ${new Date(prunedAt).getFullYear() + 2}.`;

                normalizedReport.push(report);
              } else if (
                CURRENT_YEAR - new Date(prunedAt).getFullYear() ===
                1
              ) {
                report.status = "info";
                report.message = `Recomenda-se uma ${pruningType.toLowerCase()} neste (${
                  new Date(prunedAt).getFullYear() + 1
                }) ou próximo ano  (${
                  new Date(prunedAt).getFullYear() + 2
                }). A última ${pruningType.toLowerCase()} que abrangeu ${
                  report.prunedTreePercentage
                }% dos cajueiros ocorreu aos  ${normalizeDate(
                  new Date(prunedAt)
                )}.`;

                normalizedReport.push(report);
              } else if (
                CURRENT_YEAR - new Date(prunedAt).getFullYear() ===
                2
              ) {
                report.status = "warning";
                report.message = `Recomenda-se uma ${pruningType.toLowerCase()} neste ano de ${new Date(
                  prunedAt
                ).getFullYear() + 2}. 
                        A última ${pruningType.toLowerCase()} que abrangeu ${
                  report.prunedTreePercentage
                }% dos 
                        cajueiros ocorreu há 2 anos atrás aos ${normalizeDate(
                          new Date(prunedAt)
                        )}.`;

                normalizedReport.push(report);
              }
              else if (CURRENT_YEAR - new Date(prunedAt).getFullYear() >
                2) {
                    report.status = "error";
                    report.message = `Recomenda-se URGENTEMENTE uma ${pruningType.toLowerCase()} neste ano de ${CURRENT_YEAR}. 
                            A última ${pruningType.toLowerCase()} que abrangeu ${
                      report.prunedTreePercentage
                    }% dos 
                            cajueiros ocorreu há ${
                              CURRENT_YEAR - new Date(prunedAt).getFullYear()
                            } anos atrás aos ${normalizeDate(
                      new Date(prunedAt)
                    )}.`;

                    normalizedReport.push(report);
                }


            } else if (
              CURRENT_YEAR - report.sowingYear >= 5 &&
              (pruningType === "Poda de rejuvenescimento" ||
                pruningType === "Poda de renovação")
            ) {

                if (CURRENT_YEAR - new Date(prunedAt).getFullYear() <= 1){

                    report.status = "info";
                    report.message = `Ocorreu uma ${pruningType.toLowerCase()} aos ${normalizeDate(
                      new Date(prunedAt)
                    )}. Recomenda-se uma próxima ${pruningType.toLowerCase()} em ${new Date(prunedAt).getFullYear() + 2}`;
    
                    normalizedReport.push(report);

                }
                else if (CURRENT_YEAR - new Date(prunedAt).getFullYear() >= 2) {
                    report.status = "warning";
                    report.message = `Ocorreu uma ${pruningType.toLowerCase()} aos ${normalizeDate(
                      new Date(prunedAt)
                    )}. Recomenda-se URGENETEMENTE monitorar os cajueiros que necessitam uma ${pruningType.toLowerCase()}.`;

                    normalizedReport.push(report);                    
                }
            }
            else if (
                pruningType === "Poda de sanitação"
            ){
                if (CURRENT_YEAR === new Date(prunedAt).getFullYear()) {
                  report.status = "info";
                  report.message = `Ótimo! Ocorreu uma ${pruningType.toLowerCase()} aos ${normalizeDate(
                    new Date(prunedAt)
                  )} que abrangeu ${
                    report.prunedTreePercentage
                  }% dos cajueiros. Recomenda-se outra ${pruningType.toLowerCase()} em ${
                    new Date(prunedAt).getFullYear() + 1
                  }.`;

                  normalizedReport.push(report);
                } else if (
                  CURRENT_YEAR - new Date(prunedAt).getFullYear() ===
                  1
                ) {
                  report.status = "warning";
                  report.message = `Recomenda-se uma ${pruningType.toLowerCase()} neste ano de ${
                    new Date(prunedAt).getFullYear() + 1
                  }. A última ${pruningType.toLowerCase()} que abrangeu ${
                    report.prunedTreePercentage
                  }% dos cajueiros ocorreu ano passado aos  ${normalizeDate(
                    new Date(prunedAt)
                  )}.`;

                  normalizedReport.push(report);
                } else if (
                  CURRENT_YEAR - new Date(prunedAt).getFullYear() >
                  1
                ) {
                  report.status = "error";
                  report.message = `Recomenda-se URGENTEMENTE uma ${pruningType.toLowerCase()} neste ano de ${new Date().getFullYear()}. 
                        A última ${pruningType.toLowerCase()} que abrangeu ${
                    report.prunedTreePercentage
                  }% dos 
                        cajueiros ocorreu há anos atrás aos ${normalizeDate(
                          new Date(prunedAt)
                        )}.`;

                  normalizedReport.push(report);
                }


            }

        }
      }
    } else {
      pruningReport.status = "info";
      pruningReport.message = `A poda dos cajueiros ainda não foi monitorada.`;

      normalizedReport.push(pruningReport);
    }
  }
  return normalizedReport;
};
