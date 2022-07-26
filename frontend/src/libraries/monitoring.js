
import { months } from "../app/months";

// get the last registered weeding report for this division
const lastMonitoringRound = (rounds, flag) => {
  if (rounds && rounds?.length >= 1) {
    return rounds[rounds?.length - 1];
  }

  // else if (flag === "pruning" && rounds && rounds?.length > 1) {
  //   return rounds[rounds?.length - 1];
  //   .sort(
  //     (a, b) => new Date(b.prunedAt) - new Date(a.prunedAt)
  //   )[0];
  // } else if (flag === "weeding" && rounds && rounds?.length > 1) {
  //   return rounds[rounds?.length-1];
  //   .sort(
  //     (a, b) => new Date(b.weededAt) - new Date(a.weededAt)
  //   )[0];
  // }
  // else if (flag === "disease" && rounds && rounds?.length > 1) {
  //   return rounds[rounds?.length - 1];
  //   .sort(
  //     (a, b) => new Date(b.weededAt) - new Date(a.weededAt)
  //   )[0];

  // }
  else {
    return;
  }
};

const calculatePercentage = (number, total) => {
  // console.log (total);
  return ((Number(number) * 100) / Number(total)).toFixed(1);
};

const calculateTotal = (number, otherNumber) => {
  return Number(number) + Number(otherNumber);
};

const normalizeDate = (date) => {
  return (
    new Date(date).getDate() +
    "-" +
    months[new Date(date).getMonth()] +
    "-" +
    new Date(date).getFullYear()
  );
};

// ------------------------------- start Weeding Report ------------------------

export const checkWeeding = (report, farmland) => {

  const normalizedReport = [];
  const weedingMonths = [1, 4, 7, 10]; // january, april, july and october

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let weedingReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status:
          weedingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? "warning"
            : "info",
        message:
          weedingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se uma limpeza rotineira nos meses de janeiro, 
                abril, julho e outubro.`
            : `Neste ano, a limpeza ainda não foi monitorada.`,
      };

      normalizedReport.push(weedingReport);
    }

    return normalizedReport;
  }

  let divisions = [];

  for (let i = 0; i < report?.length; i++) {
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === report[i].division
    );
    let sowingYear = foundDivision.sowingYear;

    divisions.push({
      sowingYear,
      trees: foundDivision.trees,
      lastWeeding:
        report[i]?.weeding?.rounds && report[i]?.weeding.rounds?.length > 0
          ? lastMonitoringRound(report[i]?.weeding?.rounds, "weeding")
          : null,
    });
  }

  const currentMonth = new Date().getMonth() + 1;

  for (let i = 0; i < divisions?.length; i++) {
    let weedingReport = {
      sowingYear: divisions[i].sowingYear,
    };

    let lastWeedingMonth;
    let lastWeedingYear;

    weedingReport.weedingType = divisions[i]?.lastWeeding?.weedingType;

    if (divisions[i].lastWeeding) {
      lastWeedingMonth =
        new Date(divisions[i].lastWeeding.weededAt).getMonth() + 1;
      lastWeedingYear = new Date(
        divisions[i].lastWeeding.weededAt
      ).getFullYear();

      weedingReport.weededAt = new Date(divisions[i].lastWeeding.weededAt);
      weedingReport.month = months[currentMonth - 1];
      weedingReport.weedingType = divisions[i].lastWeeding.weedingType;

      weedingReport.totallyCleanedTreePercentage = calculatePercentage(
        divisions[i].lastWeeding.totallyCleanedTrees,
        divisions[i].trees
      );
      weedingReport.partiallyCleanedTreePercentage = calculatePercentage(
        divisions[i].lastWeeding.partiallyCleanedTrees,
        divisions[i].trees
      );

      weedingReport.cleanedTrees = calculateTotal(
        divisions[i].lastWeeding.totallyCleanedTrees,
        divisions[i].lastWeeding.partiallyCleanedTrees
      );

      weedingReport.cleanedTreePercentage = calculatePercentage(
        weedingReport.cleanedTrees,
        divisions[i].trees
      );

      // weedingReport.weededAt = normalizeDate(new Date(divisions[i].lastWeeding.weededAt));

      if (
        weedingMonths.indexOf(lastWeedingMonth) >= 0 &&
        lastWeedingMonth === currentMonth &&
        lastWeedingYear === new Date().getFullYear()
      ) {
        if (weedingReport.cleanedTreePercentage === 0) {
          weedingReport.status = "error";
          weedingReport.message = `Recomenda-se uma limpeza dos cajueiros neste mês de ${months[
            currentMonth - 1
          ].toLocaleLowerCase()}.`;

          normalizedReport.push(weedingReport);
        } else if (weedingReport.cleanedTreePercentage <= 30) {
          weedingReport.status = "error";
          weedingReport.message = `Recomenda-se uma ${weedingReport.weedingType.toLocaleLowerCase()} mais abrangente. 
          A última ocorreu aos ${normalizeDate(
            weedingReport.weededAt
          )} e abrangeu APENAS ${weedingReport.cleanedTreePercentage}% 
            dos cajueiros.`;

          normalizedReport.push(weedingReport);
        } else if (weedingReport.cleanedTreePercentage <= 60) {
          weedingReport.status = "warning";
          weedingReport.message = `Recomenda-se uma ${weedingReport.weedingType.toLocaleLowerCase()} abrangente. A última ocorreu aos ${normalizeDate(
            weedingReport.weededAt
          )} e abrangeu ${weedingReport.cleanedTreePercentage}% 
            dos cajueiros.`;

          normalizedReport.push(weedingReport);
        } else if (weedingReport.cleanedTreePercentage > 60) {
          weedingReport.status = "success";
          weedingReport.message = `Ótimo! Ocorreu uma ${weedingReport.weedingType.toLocaleLowerCase()} aos ${normalizeDate(
            weedingReport.weededAt
          )} que abrangeu ${
            weedingReport.cleanedTreePercentage
          }% dos cajueiros.`;

          normalizedReport.push(weedingReport);
        }
      } else if (lastWeedingYear < new Date().getFullYear()) {
        weedingReport.status = "error";
        weedingReport.message = `Recomenda-se urgentemente uma limpeza neste ano. 
                A última ${
                  weedingReport.weedingType
                } ocorreu aos ${normalizeDate(
          weedingReport.weededAt
        )} e abrangeu ${weedingReport.cleanedTreePercentage}% dos cajueiros.`;

        normalizedReport.push(weedingReport);
      } else if (
        weedingMonths.indexOf(
          new Date(weedingReport.weededAt).getMonth() + 1
        ) >= 0 &&
        new Date().getMonth() + 1 >
          new Date(weedingReport.weededAt).getMonth() + 1
      ) {
        // weeding took place in a passed recommende months

        // filter recommended months except the one in which the weeding took place in the past.
        let recommendedMonths = weedingMonths.filter(
          (month) => month != new Date(weedingReport.weededAt).getMonth() + 1
        );

        // filter months in which weeding needs to take place.
        let filteredMonths = [];
        for (let i = 0; i < months.length; i++) {
          if (recommendedMonths.includes(i + 1)) {
            filteredMonths.push(months[i]);
          }
        }

        weedingReport.status = "warning";
        weedingReport.message = `Ótimo! Recomenda-se também uma limpeza em cada seguinte mês: ${filteredMonths.toString()}. 
                A última ${
                  weedingReport.weedingType
                } ocorreu aos ${normalizeDate(
          weedingReport.weededAt
        )} e abrangeu ${weedingReport.cleanedTreePercentage}% dos cajueiros.`;

        normalizedReport.push(weedingReport);
      } else {
        weedingReport.status = "warning";
        weedingReport.message = `Recomenda-se também uma limpeza nos meses seguintes: Janeiro, Abril, Julho e Outubro. 
                A última ${
                  weedingReport.weedingType
                } ocorreu aos ${normalizeDate(
          weedingReport.weededAt
        )} e abrangeu ${weedingReport.cleanedTreePercentage}% dos cajueiros.`;

        normalizedReport.push(weedingReport);
      }
    } else {
      weedingReport.status = "info";
      weedingReport.message = `Neste ano, a limpeza ainda não foi monitorada.`;

      normalizedReport.push(weedingReport);
    }
  }

  return normalizedReport;
};;

//  --------------------------- Start pruning report -------------------------------

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
      trees: foundDivision.trees,
    };

    // if (!report[i]?.pruning?.rounds) {

    //     pruningReport.status = "info";
    //     pruningReport.message = `Neste ano, a poda ainda não foi monitorada.`;

    //     normalizedReport.push(pruningReport);

    // }
    // else 
    if (
        report[i]?.pruning?.rounds &&
        report[i]?.pruning?.rounds?.length > 0
      ) {
        let formationPruning = lastMonitoringRound(
          report[i]?.pruning?.rounds.filter(
            (round) => round.pruningType === "Poda de formação"
          ),
          "pruning"
        );

        formationPruning = {
            ...formationPruning,
            pruningType: "Poda de formação",
        }

        let sanitationPruning = lastMonitoringRound(
          report[i]?.pruning?.rounds.filter(
            (round) => round.pruningType === "Poda de sanitação"
          ),
          "pruning"
        );

        sanitationPruning = {
            ...sanitationPruning,
            pruningType: "Poda de sanitação",
        }
    

        let renewalPruning = lastMonitoringRound(
          report[i]?.pruning?.rounds.filter(
            (round) => round.pruningType === "Poda de rejuvenescimento"
          ),
          "pruning"
        );

        renewalPruning = {
            ...renewalPruning,
            pruningType: "Poda de rejuvenescimento",
        }

        let maintenancePruning = lastMonitoringRound(
          report[i]?.pruning?.rounds.filter(
            (round) => round.pruningType === "Poda de manutenção"
          ),
          "pruning"
        );

        maintenancePruning = {
            ...maintenancePruning,
            pruningType: "Poda de manutenção",
        }


        const allPrunings = [ formationPruning, sanitationPruning, renewalPruning, maintenancePruning ];

        for (let i = 0; i < allPrunings.length; i++ ){

            if (allPrunings[i] && allPrunings[i]?.prunedAt) {

                const report = {
                    ...pruningReport,

                }
                report.pruningType = allPrunings[i].pruningType;
                report.prunedAt = new Date(allPrunings[i].prunedAt);
                report.totallyPrunedTreePercentage = calculatePercentage(
                  allPrunings[i].totallyPrunedTrees,
                  report.trees
                );
                report.partiallyPrunedTreePercentage = calculatePercentage(
                  allPrunings[i].partiallyPrunedTrees,
                  report.trees
                );

                report.prunedTrees = calculateTotal(allPrunings[i].partiallyPrunedTrees, allPrunings[i].totallyPrunedTrees);
                report.prunedTreePercentage = calculatePercentage(report.prunedTrees, report.trees);

            /**
             * status = error :
             *      if (currentYear - prunedYear == 0  or currentYear - prunedYear == 0) 
             *          and prunedTreePercentage is less or equal to 30.
             *      
             *          
             */

                report.status =
                  (new Date().getFullYear() -
                    new Date(allPrunings[i].prunedAt).getFullYear() ===
                    0 ||
                    new Date().getFullYear() -
                      new Date(allPrunings[i].prunedAt).getFullYear() ===
                      1) &&
                  report.prunedTreePercentage <= 30 // pruning was done very few trees
                    ? "error"
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage < 60 //  pruning was done on some trees
                    ? "error"
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage >= 60 // pruning was done on most of trees
                    ? "success"
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() <=
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning next year
                    ? "info"
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() >
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning within some months
                    ? "warning"
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                      2 // recommended pruning this year.
                    ? "warning"
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() >=
                      2
                    ? "error"
                    : "error";



                report.message =
                  (new Date().getFullYear() -
                    new Date(allPrunings[i].prunedAt).getFullYear() ===
                    0 ||
                    new Date().getFullYear() -
                      new Date(allPrunings[i].prunedAt).getFullYear() ===
                      1) &&
                  report.prunedTreePercentage <= 30 // pruning was done very few trees
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} mais abrangente. A última poda ocorreu aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu APENAS ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage < 60 //  pruning was done on some trees
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} abrangente. A última poda ocorreu aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage >= 60 // pruning was done on most of trees
                    ? `Ótimo! Ocorreu uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} que abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() <=
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning next year
                    ? `É recomendado fazer uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} no próximo ano. A última poda ocorreu aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() >
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning within some months
                    ? `É recomendado fazer uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} nos próximos meses. A última poda ocorreu há mais de 1 ano, aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                      2 // recommended pruning this year.
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}. A última poda ocorreu há dois anos, aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() >=
                      2
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}. A última poda ocorreu há mais de 2 anos, aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`
                    : `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}. A última poda ocorreu há mais de 2 anos, aos ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )} e abrangeu ${
                        report.prunedTreePercentage
                      }% dos cajueiros.`;

                normalizedReport.push(report);

            }

        }


    } 
    else {
        pruningReport.status = "info";
        pruningReport.message = `A poda ainda não foi monitorada.`;

        normalizedReport.push(pruningReport);
      }
  }
//   console.log("report ", normalizedReport);
  return normalizedReport;
};

//  --------------------------- Start disease report -------------------------------

export const checkDisease = (report, farmland) => {
  
    const normalizedReport = [];

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let diseaseReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, as doenças ainda não foram monitoradas.`,
      };

      normalizedReport.push(diseaseReport);
    }

    return normalizedReport;
  }

  // const divisions = [];

  for (let i = 0; i < report?.length; i++) {
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === report[i].division
    );
    let sowingYear = foundDivision.sowingYear;

    let diseaseReport = {
      sowingYear,
      trees: foundDivision.trees,
    };

    if (!report[i]?.disease?.rounds){

        diseaseReport.status = "info";
        diseaseReport.message = `Neste ano, as doenças ainda não foram monitoradas.`;

        normalizedReport.push(diseaseReport);

    }
    else if (
        report[i]?.disease?.rounds &&
        report[i]?.disease?.rounds?.length > 0
      ) {
        let oidio = lastMonitoringRound(
          report[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
          ),
          "disease"
        );

        let antracnose = lastMonitoringRound(
          report[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Antracnose"
          ),
          "disease"
        );



        if (oidio && antracnose) {
          let oidioReport = {
            ...diseaseReport,
          };

          let antracnoseReport = {
            ...diseaseReport,
          };

        //   console.log("oidio: ", oidio);
        //   console.log('antracnose: ', antracnose);

          oidioReport.diseaseName = oidio.diseaseName;
          antracnoseReport.diseaseName = antracnose.diseaseName;

          oidioReport.detectedAt = new Date(oidio.detectedAt);
          antracnoseReport.detectedAt = new Date(antracnose.detectedAt);

          oidioReport.higherSeverity = calculatePercentage(
            oidio.higherSeverity,
            diseaseReport.trees
          );
          antracnoseReport.higherSeverity = calculatePercentage(
            antracnose.higherSeverity,
            diseaseReport.trees
          );

          oidioReport.highSeverity = calculatePercentage(
            oidio.highSeverity,
            diseaseReport.trees
          );
          antracnoseReport.highSeverity = calculatePercentage(
            antracnose.highSeverity,
            diseaseReport.trees
          );

          oidioReport.averageSeverity = calculatePercentage(
            oidio.averageSeverity,
            diseaseReport.trees
          );
          antracnoseReport.averageSeverity = calculatePercentage(
            antracnose.averageSeverity,
            diseaseReport.trees
          );

          oidioReport.lowSeverity = calculatePercentage(
            oidio.lowSeverity,
            diseaseReport.trees
          );
          antracnoseReport.lowSeverity = calculatePercentage(
            antracnose.lowSeverity,
            diseaseReport.trees
          );

          oidioReport.affectedTrees =
            Number(oidio.lowSeverity) +
            Number(oidio.averageSeverity) +
            Number(oidio.highSeverity) +
            Number(oidio.higherSeverity);

          antracnoseReport.affectedTrees =
            Number(antracnose.lowSeverity) +
            Number(antracnose.averageSeverity) +
            Number(antracnose.highSeverity) +
            Number(antracnose.higherSeverity);

          const oidioPercentage = calculatePercentage(
            oidioReport.affectedTrees,
            diseaseReport.trees
          );
          const antracnosePercentage = calculatePercentage(
            antracnoseReport.affectedTrees,
            diseaseReport.trees
          );

          if (
            oidioPercentage === 0 &&
            antracnosePercentage > 0 &&
            antracnosePercentage <= 30
          ) 
          {
            oidioReport.status = "success";
            oidioReport.message = `Ótimo! Ocorreu uma monitoria da doença ${oidio.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${oidio.diseaseName.toLowerCase()}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(new Date(antracnose.detectedAt))} 
                detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          } 
          else if (oidioPercentage === 0 && antracnosePercentage > 30) {
            oidioReport.status = "success";
            oidioReport.message = `Ótimo! Ocorreu uma monitoria da doença ${oidio.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${oidio.diseaseName.toLowerCase()}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. A última monitoria que ocorreu aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )} 
                detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          } 
          else if (
            oidioPercentage > 0 &&
            oidioPercentage <= 30 &&
            antracnosePercentage === 0
          ) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `Ótimo! Ocorreu uma monitoria da doença ${antracnose.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${antracnose.diseaseName.toLowerCase()}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "warning";
            oidioReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. A última monitoria que ocorreu aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} 
                detectou ${oidioPercentage}% dos cajueiros doentes.`;

            normalizedReport.push(oidioReport);

          } 
          else if (oidioPercentage > 30 && antracnosePercentage === 0) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `Ótimo! Ocorreu uma monitoria da doença ${antracnose.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${antracnose.diseaseName.toLowerCase()}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "error";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}%
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);
          } 
          else if (oidioPercentage === 0 && antracnosePercentage === 0) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `Ótimo! Ocorreu uma monitoria da doença ${antracnose.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${antracnose.diseaseName.toLowerCase()}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "success";
            oidioReport.message = `Ótimo! Ocorreu uma monitoria da doença ${oidio.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${oidio.diseaseName.toLowerCase()}.`;

            normalizedReport.push(oidioReport);

          } 
          else if (
            oidioPercentage > 0 &&
            oidioPercentage <= 30 &&
            antracnosePercentage > 0 &&
            antracnosePercentage <= 30
          ) {
            oidioReport.status = "warning";
            oidioReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )} detectou ${oidioPercentage}% dos cajueiros doentes.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(antracnose.detectedAt))} detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          } 
          else if (oidioPercentage > 30 && antracnosePercentage > 30) {
            oidioReport.status = "error";
            oidioReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )} detectou ${oidioPercentage}% dos cajueiros doentes.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}.
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )} detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          } 
          else if (oidioPercentage < 30 && antracnosePercentage > 30) {
            oidioReport.status = "warning";
            oidioReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )} e detectou ${oidioPercentage}% dos cajueiros doentes.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )} detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          } 
          else if (oidioPercentage > 30 && antracnosePercentage < 30) {
            oidioReport.status = "error";
            oidioReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(oidio.detectedAt)
                 )} detectou ${oidioPercentage}% dos cajueiros doentes.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(antracnose.detectedAt)
                 )} detectou ${antracnosePercentage}% dos cajueiros doentes.`;

            normalizedReport.push(antracnoseReport);

          }

        } 
        else if (oidio && !antracnose) {

          diseaseReport.diseaseName = oidio.diseaseName;
          diseaseReport.detectedAt = new Date(oidio.detectedAt);
          diseaseReport.higherSeverity = calculatePercentage(
            oidio.higherSeverity,
            diseaseReport.trees
          );
          diseaseReport.highSeverity = calculatePercentage(
            oidio.highSeverity,
            diseaseReport.trees
          );

          diseaseReport.averageSeverity = calculatePercentage(
            oidio.averageSeverity,
            diseaseReport.trees
          );
          diseaseReport.lowSeverity = calculatePercentage(
            oidio.lowSeverity,
            diseaseReport.trees
          );

          diseaseReport.affectedTrees =
            Number(oidio.lowSeverity) +
            Number(oidio.averageSeverity) +
            Number(oidio.highSeverity) +
            Number(oidio.higherSeverity);

          const diseasePertcentage = calculatePercentage(
            diseaseReport.affectedTrees,
            diseaseReport.trees
          );

          if (diseasePertcentage === 0) {
            diseaseReport.status = "success";
            diseaseReport.message = `Ótimo! Ocorreu uma monitoria da doença ${oidio.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${oidio.diseaseName.toLowerCase()}.`;

            normalizedReport.push(diseaseReport);

          } 
          else if (diseasePertcentage <= 30) {
            diseaseReport.status = "warning";
            diseaseReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(oidio.detectedAt)
                 )} detectou o seguinte: severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%).`;

            normalizedReport.push(diseaseReport);

          } else if (diseasePertcentage > 30) {
            diseaseReport.status = "error";
            diseaseReport.message = `Recomenda-se uma pulverização contra a ${oidio.diseaseName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )} detectou o seguinte: severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%).`;

            normalizedReport.push(diseaseReport);
          }
        } else if (antracnose && !oidio) {

          diseaseReport.diseaseName = antracnose.diseaseName;
          diseaseReport.detectedAt = new Date(antracnose.detectedAt);
          diseaseReport.higherSeverity = calculatePercentage(
            antracnose.higherSeverity,
            diseaseReport.trees
          );
          diseaseReport.highSeverity = calculatePercentage(
            antracnose.highSeverity,
            diseaseReport.trees
          );

          diseaseReport.averageSeverity = calculatePercentage(
            antracnose.averageSeverity,
            diseaseReport.trees
          );
          diseaseReport.lowSeverity = calculatePercentage(
            antracnose.lowSeverity,
            diseaseReport.trees
          );

          diseaseReport.affectedTrees =
            Number(antracnose.lowSeverity) +
            Number(antracnose.averageSeverity) +
            Number(antracnose.highSeverity) +
            Number(antracnose.higherSeverity);

          const diseasePercentage = calculatePercentage(
            diseaseReport.affectedTrees,
            diseaseReport.trees
          );

          if (diseasePercentage === 0) {
            diseaseReport.status = "success";
            diseaseReport.message = `Ótimo! Ocorreu uma monitoria da doença ${antracnose.diseaseName.toLowerCase()} aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )} e nenhum cajueiro foi encontrado doente de ${antracnose.diseaseName.toLowerCase()}.`;

            normalizedReport.push(diseaseReport);

          } else if (diseasePercentage) {
            diseaseReport.status = "warning";
            diseaseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}.
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )} detectou o seguinte: severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%).`;

            normalizedReport.push(diseaseReport);
          } else if (diseasePercentage > 30) {
            diseaseReport.status = "error";
            diseaseReport.message = `Recomendada-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}.
                A última monitoria que ocorreu aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )} detectou o seguinte: severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${diseaseReport.lowSeverity}%).`;

            normalizedReport.push(diseaseReport);

          }
        } 
        else {
          diseaseReport.status = "info";
          diseaseReport.message = `Neste ano, as doenças ainda não foram monitoradas.`;

          normalizedReport.push(diseaseReport);
        }
      }
}

  return normalizedReport;
};





//  --------------------------- Start plague report -------------------------------

export const checkPlague = (report, farmland) => {

  const normalizedReport = [];

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let plagueReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, as pragas ainda não foram monitoradas.`,
      };

      normalizedReport.push(plagueReport);
    }

    return normalizedReport;
  }

  // const divisions = [];

  for (let i = 0; i < report?.length; i++) {
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === report[i].division
    );
    let sowingYear = foundDivision.sowingYear;

    let plagueReport = {
      sowingYear,
      trees: foundDivision.trees,
    };

    if (!report[i]?.plague?.rounds){

        plagueReport.status = "info";
        plagueReport.message = `Neste ano, as pragas ainda não foram monitoradas.`;

        normalizedReport.push(plagueReport);

    }
    else if (
        report[i]?.plague?.rounds &&
        report[i]?.plague?.rounds?.length > 0
      ) {
        let cochonilha = lastMonitoringRound(
          report[i]?.plague?.rounds.filter(
            (round) => round.plagueName === "Cochonilha"
          ),
          "plague"
        );

        let helopeltis = lastMonitoringRound(
          report[i]?.plague?.rounds.filter(
            (round) => round.plagueName === "Helopeltis ssp"
          ),
          "plague"
        );

        if (cochonilha && helopeltis) {
          let cochonilhaReport = {
            ...plagueReport,
          };

          let helopeltisReport = {
            ...plagueReport,
          };

          cochonilhaReport.plagueName = cochonilha.plagueName;
          helopeltisReport.plagueName = helopeltis.plagueName;

          cochonilhaReport.detectedAt = new Date(cochonilha.detectedAt);
          helopeltisReport.detectedAt = new Date(helopeltis.detectedAt);

          cochonilhaReport.higherAttack = calculatePercentage(
            cochonilha.higherAttack,
            plagueReport.trees
          );
          helopeltisReport.higherAttack = calculatePercentage(
            helopeltis.higherAttack,
            plagueReport.trees
          );

          cochonilhaReport.highAttack = calculatePercentage(
            cochonilha.highAttack,
            plagueReport.trees
          );
          helopeltisReport.highAttack = calculatePercentage(
            helopeltis.highAttack,
            plagueReport.trees
          );

          cochonilhaReport.averageAttack = calculatePercentage(
            cochonilha.averageAttack,
            plagueReport.trees
          );
          helopeltisReport.averageAttack = calculatePercentage(
            helopeltis.averageAttack,
            plagueReport.trees
          );

          cochonilhaReport.lowAttack = calculatePercentage(
            cochonilha.lowAttack,
            plagueReport.trees
          );
          helopeltisReport.lowAttack = calculatePercentage(
            helopeltis.lowAttack,
            plagueReport.trees
          );

          cochonilhaReport.affectedTrees =
            cochonilha.lowAttack +
            cochonilha.averageAttack +
            cochonilha.highAttack +
            cochonilha.higherAttack;

          helopeltisReport.affectedTrees =
            helopeltis.lowAttack +
            helopeltis.averageAttack +
            helopeltis.highAttack +
            helopeltis.higherAttack;

          const cochonilhaPercentage = calculatePercentage(
            cochonilhaReport.affectedTrees,
            plagueReport.trees
          );
          const helopeltisPercentage = calculatePercentage(
            helopeltisReport.affectedTrees,
            plagueReport.trees
          );

          if (
            cochonilhaPercentage === 0 &&
            helopeltisPercentage > 0 &&
            helopeltisPercentage <= 30
          ) {
            cochonilhaPercentage.status = "success";
            cochonilhaPercentage.message = `Ótimo! Ocorreu uma monitoria da praga ${cochonilha.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado pela ${cochonilha.plagueName.toLowerCase()}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% 
                dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);
          } 
          else if (cochonilhaPercentage === 0 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "success";
            cochonilhaReport.message = `Ótimo! Ocorreu uma monitoria da praga ${cochonilha.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )} e nenhum cajueiro foi encontrdo infectado pela ${cochonilha.plagueName.toLowerCase()}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);
          } 
          else if (
            cochonilhaPercentage > 0 &&
            cochonilhaPercentage <= 30 &&
            helopeltisPercentage === 0
          ) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `Ótimo! Ocorreu uma monitoria da praga ${helopeltis.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )} nenhum cajueiro foi encontrado infectado pela ${helopeltis.plagueName.toLowerCase()}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);
          } 
          else if (cochonilhaPercentage > 30 && helopeltisPercentage === 0) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `Ótimo! Ocorreu uma monitoria da praga ${helopeltis.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado pela ${helopeltis.plagueName.toLowerCase()}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "error";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados`;

            normalizedReport.push(cochonilhaReport);

          } 
          else if (cochonilhaPercentage === 0 && helopeltisPercentage === 0) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `Ótimo! Ocorreu uma monitoria da praga ${helopeltis.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado pela ${helopeltis.plagueName.toLowerCase()}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "success";
            cochonilhaReport.message = `Ótimo! Ocorreu uma monitoria da praga ${cochonilha.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado pela ${cochonilha.plagueName.toLowerCase()}.`;

            normalizedReport.push(cochonilhaReport);
          } 
          else if (
            cochonilhaPercentage > 0 &&
            cochonilhaPercentage <= 30 &&
            helopeltisPercentage > 0 &&
            helopeltisPercentage <= 30
          ) {
            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage > 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

                 
            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage < 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage > 30 && helopeltisPercentage < 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                  A última monitoria que ocorreu aos ${normalizeDate(
                    new Date(cochonilha.detectedAt)
                  )} detectdou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          }
        } 
        else if (cochonilha && !helopeltis) {

          plagueReport.plagueName = cochonilha.plagueName;
          plagueReport.detectedAt = new Date(cochonilha.detectedAt);
          plagueReport.higherAttack = calculatePercentage(
            cochonilha.higherAttack,
            plagueReport.trees
          );
          plagueReport.highAttack = calculatePercentage(
            cochonilha.highAttack,
            plagueReport.trees
          );

          plagueReport.averageAttack = calculatePercentage(
            cochonilha.averageAttack,
            plagueReport.trees
          );
          plagueReport.lowAttack = calculatePercentage(
            cochonilha.lowAttack,
            plagueReport.trees
          );

          plagueReport.affectedTrees =
            cochonilha.lowAttack +
            cochonilha.averageAttack +
            cochonilha.highAttack +
            cochonilha.higherAttack;

          const plaguePertcentage = calculatePercentage(
            plagueReport.affectedTrees,
            plagueReport.trees
          );

          if (plaguePertcentage === 0) {
            plagueReport.status = "success";
            plagueReport.message = `Ótimo! Ocorreu uma monitoria da praga ${cochonilha.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado.`;

            normalizedReport.push(plagueReport);

          } else if (plaguePertcentage <= 30) {
            plagueReport.status = "warning";
            plagueReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou o seguinte: grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%).`;

            normalizedReport.push(plagueReport);
          } else if (plaguePertcentage > 30) {
            plagueReport.status = "error";
            plagueReport.message = `Recomendada-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou o seguinte: grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de atque baixo (${
              plagueReport.lowAttack
            }%).`;

            normalizedReport.push(plagueReport);

          }
        } 
        else if (helopeltis && !cochonilha) {

          plagueReport.plagueName = helopeltis.plagueName;
          plagueReport.detectedAt = new Date(helopeltis.detectedAt);
          plagueReport.higherAttack = calculatePercentage(
            helopeltis.higherAttack,
            plagueReport.trees
          );
          plagueReport.highAttack = calculatePercentage(
            helopeltis.highAttack,
            plagueReport.trees
          );

          plagueReport.averageAttack = calculatePercentage(
            helopeltis.averageAttack,
            plagueReport.trees
          );
          plagueReport.lowAttack = calculatePercentage(
            helopeltis.lowAttack,
            plagueReport.trees
          );

          plagueReport.affectedTrees =
            helopeltis.lowAttack +
            helopeltis.averageAttack +
            helopeltis.highAttack +
            helopeltis.higherAttack;

          const plaguePertcentage = calculatePercentage(
            plagueReport.affectedTrees,
            plagueReport.trees
          );

          if (plaguePertcentage === 0) {
            plagueReport.status = "success";
            plagueReport.message = `Ótimo! Ocorreu uma monitoria da praga ${helopeltis.plagueName.toLowerCase()} aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )} e nenhum cajueiro foi encontrado infectado.`;

            normalizedReport.push(plagueReport);

          } else if (plaguePertcentage) {
            plagueReport.status = "warning";
            plagueReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                  A última monitoria que ocorreu aos ${normalizeDate(
                    new Date(helopeltis.detectedAt)
                  )} detectou o seguinte: grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%).`;

            normalizedReport.push(plagueReport);

          } 
          else if (plaguePertcentage > 30) {
            plagueReport.status = "error";
            plagueReport.message = `Recomendada-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou o seguinte: grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%).`;

            normalizedReport.push(plagueReport);
          }

        } 
        else {
          plagueReport.status = "info";
          plagueReport.message = `Neste ano, as pragas ainda não foram monitoradas.`;

          normalizedReport.push(plagueReport);
        }
      }
}

  return normalizedReport;
};



// ---------------------------- Start insecticide report --------------------------


export const checkInsecticide = (report, farmland)=>{


    let sprayingMonths = [ 7, 8, 9];  // july, august and september

    const normalizedReport = [];

    if (report && report.length === 0) {
        for (let i = 0; i < farmland?.divisions.length; i++) {
        let insecticideReport = {
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

        normalizedReport.push(insecticideReport);
        }

        return normalizedReport;
    }

    for (let i = 0; i < report?.length; i++) {

    // find the report-related farmland division.
    let foundDivision = farmland?.divisions.find(
      (division) => division._id === report[i].division
    );

    // find the sowing year of this farmland division
    let sowingYear = foundDivision.sowingYear;

    // 
    let diseaseReport = {
      sowingYear,
      trees: foundDivision.trees,
    };

    let insecticideReport = {
        sowingYear,
        trees: foundDivision.trees,
    };

    if (!report[i]?.disease?.rounds && !report[i]?.insecticide?.rounds) {
        insecticideReport.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "warning"
              : "info";
        insecticideReport.message =
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se a aplicação rotineira da 
                insecticida nos meses de julho, agosto e setembro.`
            : `Neste ano, a ocorrência das doenças e a aplicação da insecticida ainda não foram monitoradas.`;
        insecticideReport.oidioReport = {};
        insecticideReport.antracnoseReport = {}

        normalizedReport.push(insecticideReport);

    } 
    else if (
      report[i]?.disease?.rounds &&
      report[i]?.disease?.rounds?.length > 0 &&
      !report[i]?.insecticide?.rounds
    )
    {
        // check if the last disease reports have any relevant information
        let lastDiseaseReports = checkDisease(report, farmland);

        
        let oidioReport = lastDiseaseReports.find(report=>report.diseaseName === "Oídio");
        let antracnoseReport = lastDiseaseReports.find((report) => report.diseaseName === "Antracnose");

        insecticideReport.oidioReport = oidioReport;
        insecticideReport.antracnoseReport = antracnoseReport;

        if (!oidioReport && !antracnoseReport) {

            insecticideReport.status = "info"
            insecticideReport.message = `Neste ano, as doenças (oídio e antracnose) ainda não foram monitoradas. 
            Mas, recomenda-se a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);
            
        }
        else if (oidioReport && oidioReport.affectedTrees === 0 && !antracnoseReport){

            insecticideReport.status = "info"
            insecticideReport.message = `Nenhum cajueiro doente de oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(new Date(oidioReport.detectedAt))}. Recomenda-se a monitoria da antracnose e a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (oidioReport && oidioReport.affectedTrees > 0 && !antracnoseReport) {
            
            insecticideReport.status = "warning"
            insecticideReport.message = `${calculatePercentage(
              oidioReport.affectedTrees,
              oidioReport.trees
            )}% dos cajueiros doentes de oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a oídio, (2) a monitoria da antracnose e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (!oidioReport && antracnoseReport && antracnoseReport.affectedTrees === 0) {

            insecticideReport.status = "info";
            insecticideReport.message = `Nenhum cajueiro doente de antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(antracnoseReport.detectedAt)
            )}. Recomenda-se a monitoria da oídio e a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (!oidioReport && antracnoseReport && antracnoseReport.affectedTrees > 0) {

            insecticideReport.status = "warning"
            insecticideReport.message = `${calculatePercentage(
              antracnoseReport.affectedTrees,
              antracnoseReport.trees
            )}% dos cajueiros doentes de antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a oídio, (2) a monitoria da antracnose e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);
        }
        else {
            
            insecticideReport.status = "error";
            insecticideReport.message = `${calculatePercentage(
              antracnoseReport.affectedTrees,
              antracnoseReport.trees
            )}% dos cajueiros doentes de antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )} e ${calculatePercentage(
              oidioReport.affectedTrees,
              oidioReport.trees
            )}% dos cajueiros doentes de oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se a pulverização contra a antracnose e a oídio.`;


            normalizedReport.push(insecticideReport);
        }

    }
    else if (
        // true
        !report[i]?.disease?.rounds && 
        report[i]?.insecticide?.rounds && 
        report[i]?.insecticide?.rounds.length > 0
    ) { // considering there is no disease report yet, but there insecticide report already

        let lambda = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Lambda Cyhalothrin"
          ),
          "insecticide"
        );

        let beta = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Beta-ciflutrina",
          ),
          "insecticide"
        );

        let acetamiprid = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Acetamiprid"
          ),
          "insecticide"
        );

        let outroInsecticide = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "outro"
            ),
            "insecticide"
            );
        
        let lastInsecticideReports = [ lambda, beta, acetamiprid, outroInsecticide ];
        let foundReports = lastInsecticideReports.filter(lastReport => lastReport);

        

       
            
    }
        
    
    }
        return normalizedReport;
    
    }
        // if (oidio && antracnose) {
        //   let oidioReport = {
        //     ...diseaseReport,
        //   };

        //   let antracnoseReport = {
        //     ...diseaseReport,
        //   };


    // }     
        // //   console.log("oidio: ", oidio);
        // //   console.log('antracnose: ', antracnose);

        //   oidioReport.diseaseName = oidio.diseaseName;
        //   antracnoseReport.diseaseName = antracnose.diseaseName;

        //   oidioReport.detectedAt = new Date(oidio.detectedAt);
        //   antracnoseReport.detectedAt = new Date(antracnose.detectedAt);

        //   oidioReport.higherSeverity = calculatePercentage(
        //     oidio.higherSeverity,
        //     diseaseReport.trees
        //   );
        //   antracnoseReport.higherSeverity = calculatePercentage(
        //     antracnose.higherSeverity,
        //     diseaseReport.trees
        //   );

        //   oidioReport.highSeverity = calculatePercentage(
        //     oidio.highSeverity,
        //     diseaseReport.trees
        //   );
        //   antracnoseReport.highSeverity = calculatePercentage(
        //     antracnose.highSeverity,
        //     diseaseReport.trees
        //   );

        //   oidioReport.averageSeverity = calculatePercentage(
        //     oidio.averageSeverity,
        //     diseaseReport.trees
        //   );
        //   antracnoseReport.averageSeverity = calculatePercentage(
        //     antracnose.averageSeverity,
        //     diseaseReport.trees
        //   );

        //   oidioReport.lowSeverity = calculatePercentage(
        //     oidio.lowSeverity,
        //     diseaseReport.trees
        //   );
        //   antracnoseReport.lowSeverity = calculatePercentage(
        //     antracnose.lowSeverity,
        //     diseaseReport.trees
        //   );

        //   oidioReport.affectedTrees =
        //     Number(oidio.lowSeverity) +
        //     Number(oidio.averageSeverity) +
        //     Number(oidio.highSeverity) +
        //     Number(oidio.higherSeverity);

        //   antracnoseReport.affectedTrees =
        //     Number(antracnose.lowSeverity) +
        //     Number(antracnose.averageSeverity) +
        //     Number(antracnose.highSeverity) +
        //     Number(antracnose.higherSeverity);

        //   const oidioPercentage = calculatePercentage(
        //     oidioReport.affectedTrees,
        //     diseaseReport.trees
        //   );
        //   const antracnosePercentage = calculatePercentage(
        //     antracnoseReport.affectedTrees,
        //     diseaseReport.trees
        //   );

    //       if (
    //         oidioPercentage === 0 &&
    //         antracnosePercentage > 0 &&
    //         antracnosePercentage <= 30
    //       ) 
    //       {
    //         oidioReport.status = "success";
    //         oidioReport.message = `Ótimo! Ocorreu uma monitoria da doença ${oidio.diseaseName.toLowerCase()} aos ${normalizeDate(
    //           new Date(oidio.detectedAt)
    //         )} e nenhum cajueiro foi encontrado doente de ${oidio.diseaseName.toLowerCase()}.`;

    //         normalizedReport.push(oidioReport);

    //         antracnoseReport.status = "warning";
    //         antracnoseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}. 
    //             A última monitoria que ocorreu aos ${normalizeDate(new Date(antracnose.detectedAt))} 
    //             detectou ${antracnosePercentage}% dos cajueiros doentes.`;

    //         normalizedReport.push(antracnoseReport);        
        
    // }

       //   if (oidio && antracnose) {
      //     let oidioReport = {
      //       ...diseaseReport,
      //     };
      //     let antracnoseReport = {
      //       ...diseaseReport,
      //     };
      //     oidioReport.diseaseName = oidio.diseaseName;
      //     antracnoseReport.diseaseName = antracnose.diseaseName;
      //     oidioReport.detectedAt = new Date(oidio.detectedAt);
      //     antracnoseReport.detectedAt = new Date(antracnose.detectedAt);
      //     oidioReport.higherSeverity = calculatePercentage(
      //       oidio.higherSeverity,
      //       diseaseReport.trees
      //     );
      //     antracnoseReport.higherSeverity = calculatePercentage(
      //       antracnose.higherSeverity,
      //       diseaseReport.trees
      //     );
      //     oidioReport.highSeverity = calculatePercentage(
      //       oidio.highSeverity,
      //       diseaseReport.trees
      //     );
      //     antracnoseReport.highSeverity = calculatePercentage(
      //       antracnose.highSeverity,
      //       diseaseReport.trees
      //     );
      //     oidioReport.averageSeverity = calculatePercentage(
      //       oidio.averageSeverity,
      //       diseaseReport.trees
      //     );
      //     antracnoseReport.averageSeverity = calculatePercentage(
      //       antracnose.averageSeverity,
      //       diseaseReport.trees
      //     );
      //     oidioReport.lowSeverity = calculatePercentage(
      //       oidio.lowSeverity,
      //       diseaseReport.trees
      //     );
      //     antracnoseReport.lowSeverity = calculatePercentage(
      //       antracnose.lowSeverity,
      //       diseaseReport.trees
      //     );
      //     oidioReport.affectedTrees =
      //       oidio.lowSeverity +
      //       oidio.averageSeverity +
      //       oidio.highSeverity +
      //       oidio.higherSeverity;
      //     antracnoseReport.affectedTrees =
      //       antracnose.lowSeverity +
      //       antracnose.averageSeverity +
      //       antracnose.highSeverity +
      //       antracnose.higherSeverity;
      //     const oidioPercentage = calculatePercentage(
      //       oidioReport.affectedTrees,
      //       diseaseReport.trees
      //     );
      //     const antracnosePercentage = calculatePercentage(
      //       antracnoseReport.affectedTrees,
      //       diseaseReport.trees
      //     );
      //   }


//  --------------------------- Start harvest report -------------------------------

export const checkHarvest = (report, farmland) => {

  const normalizedReport = [];
  const harvestMonths = [10, 11, 12, 1, 2 ]


  // if (report && report.length === 0) {
  for (let i = 0; i < farmland?.divisions.length; i++) {
    let pruningReport = {
      sowingYear: farmland.divisions[i].sowingYear,
      status:
        harvestMonths.indexOf(new Date().getMonth() + 1) > 0
          ? "warning"
          : "info",
      message:
        harvestMonths.indexOf(new Date().getMonth() + 1) > 0
          ? `Recomenda-se a monitoria da produção de castanha e pêra do caju neste mês.`
          : `Monitoria da colheita de castanha e pêra do caju só a partir de ${months[9]}.`,
    };

    normalizedReport.push(pruningReport);
  }

 

  return normalizedReport;
  // }
};
