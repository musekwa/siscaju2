
import { months } from "../app/months";
import { applicationNumber } from "../app/insecticides"
import { northProvinces } from "../app/provinces";

// get the last registered weeding report for this division
const lastMonitoringRound = (rounds, flag) => {
  if (rounds && rounds?.length >= 1) {
    return rounds[rounds?.length - 1];
  }
  else {
    return;
  }
};

const calculatePercentage = (number, total) => {
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

const applications = (application) =>{

  switch(application){
    case 'primeira':
      return 0;
    case 'segunda':
      return 1;
    case 'terceira':
      return 2;
    case 'intercalar':
      return 3;
    default:
      return ;
  }
}

const getNextRound = (applicationNumber, name, appliedAt, isNorth) =>{
  
    if ((name === "Oídio" && isNorth) || name === "Antracnose" || name === "Queima") {

      let days = new Date(appliedAt).getDate() + 21;

      if (applicationNumber === "primeira") {
        return {
          nextApplication: "segunda",
          nextDate: new Date(new Date(appliedAt).setDate(days)),
          round: 1,
        };
      } 
      else if (applicationNumber === "segunda") {
        return {
          nextApplication: "terceira",
          nextDate: new Date(new Date(appliedAt).setDate(days)),
          round: 2,
        };
      } 
      else if (applicationNumber === "terceira") {
        return {
          nextApplication: "Nenhum",
          nextDate: null,
          round: 3,
        };
      }

    } 
    else if (name === "Oídio" && !isNorth) {
       
      let days = new Date(appliedAt).getDate() + 21;

      if (applicationNumber === "primeira") {
        return {
          nextApplication: "segunda",
          nextDate: new Date(new Date(appliedAt).setDate(days)),
          round: 1,
        };
      } else if (applicationNumber === "segunda") {
        return {
          nextApplication: "terceira",
          nextDate: new Date(new Date(appliedAt).setDate(days)),
          round: 2,
        };
      } else if (applicationNumber === "terceira") {
        return {
          nextApplication: "quarta",
          nextDate: new Date(new Date(appliedAt).setDate(days)),
          round: 3,
        };
      }
      else if (applicationNumber === "quarta"){
        return {
          nextApplication: "Nenhum",
          nextDate: null,
          round: 4
        }
      }

    }
    //  else if (name === "Acetamiprid") {

    //   let days = new Date(appliedAt).getDate() + 21;

    //   if (applicationNumber === "primeira") {
    //     return {
    //       nextApplication: "segunda",
    //       nextDate: new Date(new Date(appliedAt).setDate(days)),
    //       round: 1,
    //     };
    //   } else if (applicationNumber === "segunda") {
    //     return {
    //       nextApplication: "terceira",
    //       nextDate: new Date(new Date(appliedAt).setDate(days)),
    //       round: 2,
    //     };
    //   } else if (applicationNumber === "terceira") {
    //     return {
    //       nextApplication: "Nenhuma",
    //       nextDate: null,
    //       round: 3,
    //     };
    //   }
    // }
}


const getNextApplicationRound = (applicationNumber, name, appliedAt) => {
  if (name === "Lambda Cyhalothrin" || name === "Beta-ciflutrina") {
    let days = new Date(appliedAt).getDate() + 42;

    if (applicationNumber === "primeira") {
      return {
        nextApplication: "segunda",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 1,
      };
    } else if (applicationNumber === "segunda") {
      return {
        nextApplication: "Nenhuma",
        nextDate: null,
        round: 2,
      };
    }
  } else if (name === "Acetamiprid") {
    let days = new Date(appliedAt).getDate() + 21;

    if (applicationNumber === "primeira") {
      return {
        nextApplication: "segunda",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 1,
      };
    } else if (applicationNumber === "segunda") {
      return {
        nextApplication: "terceira",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 2,
      };
    } else if (applicationNumber === "terceira") {
      return {
        nextApplication: "Nenhuma",
        nextDate: null,
        round: 3,
      };
    }
  }
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

        let queima = lastMonitoringRound(
          report[i]?.disease?.rounds.filter(
            (round) => round.diseaseName === "Queima"
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
            diseaseReport.message = `Recomenda-se uma pulverização contra a ${antracnose.diseaseName.toLowerCase()}.
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
            Number(cochonilha.lowAttack) +
            Number(cochonilha.averageAttack) +
            Number(cochonilha.highAttack) +
            Number(cochonilha.higherAttack);

          helopeltisReport.affectedTrees =
            Number(helopeltis.lowAttack) +
            Number(helopeltis.averageAttack) +
            Number(helopeltis.highAttack) +
            Number(helopeltis.higherAttack);

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
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
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
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
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
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
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
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
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
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage > 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

                 
            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage < 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(cochonilha.detectedAt)
                 )} detectou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
                 A última monitoria que ocorreu aos ${normalizeDate(
                   new Date(helopeltis.detectedAt)
                 )} detectou ${helopeltisPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(helopeltisReport);

          } 
          else if (cochonilhaPercentage > 30 && helopeltisPercentage < 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
                  A última monitoria que ocorreu aos ${normalizeDate(
                    new Date(cochonilha.detectedAt)
                  )} detectdou ${cochonilhaPercentage}% dos cajueiros infectados.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
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
            Number(cochonilha.lowAttack) +
            Number(cochonilha.averageAttack) +
            Number(cochonilha.highAttack) +
            Number(cochonilha.higherAttack);

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
            plagueReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
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
            plagueReport.message = `Recomenda-se uma pulverização contra a ${cochonilha.plagueName.toLowerCase()}. 
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
            Number(helopeltis.lowAttack) +
            Number(helopeltis.averageAttack) +
            Number(helopeltis.highAttack) +
            Number(helopeltis.higherAttack);

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
            plagueReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
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
            plagueReport.message = `Recomenda-se uma pulverização contra a ${helopeltis.plagueName.toLowerCase()}. 
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
    let sprayingRounds = [1, 2, 3, 4] // primeira, segunda, terceira, intercalar

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
    let plagueReport = {
      sowingYear,
      trees: foundDivision.trees,
    };

    let insecticideReport = {
        sowingYear,
        trees: foundDivision.trees,
    };

    if (!report[i]?.plague?.rounds && !report[i]?.insecticide?.rounds) {
        insecticideReport.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "warning"
              : "info";
        insecticideReport.message =
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se a aplicação rotineira da 
                insecticida nos meses de julho, agosto e setembro.`
            : `Neste ano, a ocorrência das pragas e a aplicação da insecticida ainda não foram monitoradas.`;
        insecticideReport.cochonilhaReport = {};
        insecticideReport.helopeltisReport = {}

        normalizedReport.push(insecticideReport);

    } 
    else if (
      report[i]?.plague?.rounds &&
      report[i]?.plague?.rounds?.length > 0 &&
      !report[i]?.insecticide?.rounds
    )
    {
        // check if the last disease reports have any relevant information
        let lastPlagueReports = checkPlague(report, farmland);

        
        let cochonilhaReport = lastPlagueReports.find(report=>report.plagueName === "Cochonilha");
        let helopeltisReport = lastPlagueReports.find(
          (report) => report.plagueName === "Helopeltis ssp"
        );

        insecticideReport.cochonilhaReport = cochonilhaReport;
        insecticideReport.helopeltisReport = helopeltisReport;

        if (!cochonilhaReport && !helopeltisReport) {

            insecticideReport.status = "info"
            insecticideReport.message = `Neste ano, as pragas (cochonilha e helopeltis ssp) ainda não foram monitoradas. 
            Mas, recomenda-se a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);
            
        }
        else if (cochonilhaReport && cochonilhaReport.affectedTrees === 0 && !helopeltisReport){

            insecticideReport.status = "info"
            insecticideReport.message = `Nenhum cajueiro infectado pela cochonilha segundo a última monitoria ocorrida aos 
            ${normalizeDate(new Date(cochonilhaReport.detectedAt))}. Recomenda-se a monitoria da 'helopeltis ssp' e a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (cochonilhaReport && cochonilhaReport.affectedTrees > 0 && !helopeltisReport) {
            
            insecticideReport.status = "warning"
            insecticideReport.message = `${calculatePercentage(
              cochonilhaReport.affectedTrees,
              cochonilhaReport.trees
            )}% dos cajueiros infectados pela cochonilha segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(cochonilhaReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a cochonilha, (2) a monitoria da helopeltis ssp e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (!cochonilhaReport && helopeltisReport && helopeltisReport.affectedTrees === 0) {

            insecticideReport.status = "info";
            insecticideReport.message = `Nenhum cajueiro infectado pela 'helopeltis ssp' segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(helopeltisReport.detectedAt)
            )}. Recomenda-se a monitoria da cochonilha e a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);

        }
        else if (!cochonilhaReport && helopeltisReport && helopeltisReport.affectedTrees > 0) {

            insecticideReport.status = "warning"
            insecticideReport.message = `${calculatePercentage(
              helopeltisReport.affectedTrees,
              helopeltisReport.trees
            )}% dos cajueiros infectados pela 'helopeltis ss' segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(helopeltisReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a 'helopeltis ssp', (2) a monitoria de cochonilha e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(insecticideReport);
        }
        else {
            
            insecticideReport.status = "error";
            insecticideReport.message = `${calculatePercentage(
              helopeltisReport.affectedTrees,
              helopeltisReport.trees
            )}% dos cajueiros infectados pela 'helopeltis ssp' segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(helopeltisReport.detectedAt)
            )} e ${calculatePercentage(
              cochonilhaReport.affectedTrees,
              cochonilhaReport.trees
            )}% dos cajueiros infectados pela cochonilha segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(cochonilhaReport.detectedAt)
            )}. Recomenda-se a pulverização contra a 'helopeltis ssp' e a cochonilha.`;


            normalizedReport.push(insecticideReport);
        }

    }
    else if (
        // true
        !report[i]?.plague?.rounds && 
        report[i]?.insecticide?.rounds && 
        report[i]?.insecticide?.rounds.length > 0
    ) { // considering there is no plague report yet, but there insecticide report already
     
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

        let outraInsecticide = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Outra"
          ),
          "insecticide"
        );
        
        let lastInsecticideReports = [ lambda, beta, acetamiprid, outraInsecticide ];
        let foundReports = lastInsecticideReports.filter(lastReport => lastReport);
        
        let normalizedFoundReports = foundReports.map(report=>{
          let newReport = {
            ...report,
          }
          newReport.sowingYear = sowingYear;
          newReport.trees = foundDivision.trees;
          newReport.treatedTreePercentage = calculatePercentage(
            newReport.treatedTrees,
            foundDivision.trees
          );
          newReport.appliedAt = report.appliedAt

          const nextRound = getNextApplicationRound(newReport.applicationNumber, newReport.insecticideName, newReport.appliedAt);
        

            if (nextRound.nextApplication === 'Nenhuma' && newReport.treatedTreePercentage <= 60) {
              newReport.status = "error";
              newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.insecticideName}
              contra ${newReport.plagueName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros. Recomenda-se pulverizar os restantes.`;
            }
            else if (nextRound.nextApplication === 'Nenhuma' && newReport.treatedTreePercentage > 60) {
              newReport.status = "success";
              newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.insecticideName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;              
            }
            else if (sprayingMonths.indexOf(new Date().getMonth()+ 1) >= 0){
              newReport.status = "warning";
              newReport.message = `Recomenda-se a ${nextRound.nextApplication} aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(nextRound.nextDate)}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${newReport.treatedTreePercentage}% dos cajueiros.`
            }
            else if (new Date() - new Date(newReport.appliedAt) >=0 ) {
              newReport.status = "info";
              newReport.message = `Recomenda-se a ${
                nextRound.nextApplication
              } aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(
                nextRound.nextDate
              )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
                newReport.treatedTreePercentage
              }% dos cajueiros.`;
            }
            else if (new Date() - new Date(newReport.appliedAt) < 0) {
              newReport.status = "error";
              newReport.message = `Perigo! A ${
                nextRound.nextApplication
              } aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(
                nextRound.nextDate
              )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
                newReport.treatedTreePercentage
              }% dos cajueiros.`;
            }
            else {
              newReport.status = "info";
              newReport.message = 
              `Recomenda-se uma ${nextRound.nextApplication} aplicação da insecticida '${
                newReport.insecticideName
              }' contra a praga '${newReport?.plagueName}' aos ${normalizeDate(
                nextRound?.nextDate)}. A última aplicação que ocorreu aos ${normalizeDate(
                new Date(newReport.appliedAt)
              )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;

            }

          normalizedReport.push(newReport);
          
          return report;

        })            
      }
      else {

        // check if the last disease reports have any relevant information
        let lastPlagueReports = checkPlague(report, farmland);

        let lambda = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Lambda Cyhalothrin"
          ),
          "insecticide"
        );

        // get the last report on helopeltis plague
        let helopeltis = lastPlagueReports.find(
          (report) => report.plagueName === "Helopeltis ssp"
        );

        // get the last report on cochonilha plague
        let cochonilha = lastPlagueReports.find(
          (report) => report.plagueName === "Cochonilha"
        );

        let beta = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Beta-ciflutrina"
          ),
          "insecticide"
        );

        let acetamiprid = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Acetamiprid"
          ),
          "insecticide"
        );

        let outraInsecticide = lastMonitoringRound(
          report[i]?.insecticide?.rounds.filter(
            (round) => round.insecticideName === "Outra"
          ),
          "insecticide"
        );

        let lastInsecticideReports = [
          lambda,
          beta,
          acetamiprid,
          outraInsecticide,
        ];
        let foundReports = lastInsecticideReports.filter(
          (lastReport) => lastReport
        );

        // loop through all the existing insecticide reports.
        let normalizedFoundReports = foundReports.map((report) => {
          let newReport = {
            ...report,
          };

          newReport.sowingYear = sowingYear;
          newReport.trees = foundDivision.trees;
          newReport.treatedTreePercentage = calculatePercentage(
            newReport.treatedTrees,
            foundDivision.trees
          );

          newReport.appliedAt = report.appliedAt;

          const nextRound = getNextApplicationRound(
            newReport.applicationNumber,
            newReport.insecticideName,
            newReport.appliedAt
          );

          if (
            nextRound.nextApplication === "Nenhuma" &&
            helopeltis?.affectedTrees > 0 &&
            helopeltis?.affectedTrees <= newReport.treatedTrees &&
            (newReport.insecticideName === "Beta-ciflutrina" ||
              newReport.insecticideName === "Lambda Cyhalothrin")
          ) {

            newReport.status = "success";
            newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.insecticideName} 
              contra a ${newReport.plagueName}.`;

          } else if (
            nextRound.nextApplication === "Nenhuma" &&
            cochonilha?.affectedTrees > 0 &&
            cochonilha?.affectedTrees <= newReport.treatedTrees &&
            (newReport.insecticideName === "Acetamiprid")
          ) {

            newReport.status = "success";
            newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.insecticideName} 
              contra a ${newReport.plagueName}.`;

          } 
          else if (
            nextRound.nextApplication === "Nenhuma" &&
            sprayingMonths.indexOf(new Date().getMonth()+1) >= 0
          ) {
            newReport.status = "info";
            newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.insecticideName}
              contra ${newReport.plagueName} em 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;
          } 
          else if (
            nextRound.nextApplication !== "Nenhuma" &&
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
          ) {
            newReport.status = "warning";
            newReport.message = `Recomenda-se a ${
              nextRound.nextApplication
            } aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(
              nextRound.nextDate
            )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;

          } 
          else if (new Date() - new Date(newReport.appliedAt) >= 0) {
            newReport.status = "info";
            newReport.message = `Recomenda-se a ${
              nextRound.nextApplication
            } aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(
              nextRound.nextDate
            )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } 
          else if (new Date() - new Date(newReport.appliedAt) < 0) {
            newReport.status = "error";
            newReport.message = `Perigo! A ${
              nextRound.nextApplication
            } aplicação de ${newReport.insecticideName} 
                contra ${newReport.plagueName} aos ${normalizeDate(
              nextRound.nextDate
            )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } else {
            newReport.status = "info";
            newReport.message = `Recomenda-se uma ${
              nextRound.nextApplication
            } aplicação da insecticida '${
              newReport.insecticideName
            }' contra a praga '${newReport?.plagueName}' aos ${normalizeDate(
              nextRound?.nextDate
            )}. A última aplicação que ocorreu aos ${normalizeDate(
              new Date(newReport.appliedAt)
            )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;
          }

          normalizedReport.push(newReport);

          return report;
        });
      }
    }
      return normalizedReport;
    
    }





// ---------------------------- Start fungicide report --------------------------


export const checkFungicide = (report, farmland)=>{


    let sprayingMonths = [ 7, 8, 9];  // july, august and september
    let sprayingRounds = [1, 2, 3, 4] // primeira, segunda, terceira, intercalar

    const normalizedReport = [];

    if (report && report.length === 0) {
        for (let i = 0; i < farmland?.divisions.length; i++) {
        let fungicideReport = {
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

        normalizedReport.push(fungicideReport);
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

    let fungicideReport = {
        sowingYear,
        trees: foundDivision.trees,
    };

    if (!report[i]?.disease?.rounds && !report[i]?.disease?.rounds) {
        fungicideReport.status =
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
              ? "warning"
              : "info";
        fungicideReport.message =
          sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
            ? `Recomenda-se a aplicação rotineira da 
                fungicida nos meses de julho, agosto e setembro.`
            : `Neste ano, a ocorrência das doenças e a aplicação da fungicida ainda não foram monitoradas.`;
        fungicideReport.oidioReport = {};
        fungicideReport.antracnoseReport = {}
        fungicideReport.queimaReport = {}

        normalizedReport.push(fungicideReport);

    } 
    else if (
      report[i]?.disease?.rounds &&
      report[i]?.disease?.rounds?.length > 0 &&
      !report[i]?.fungicide?.rounds
    )
    {
        // check if the last disease reports have any relevant information
        let lastDiseaseReports = checkDisease(report, farmland);

        
        let oidioReport = lastDiseaseReports.find(
          (report) => report.diseaseName === "Oídio"
        );
        let antracnoseReport = lastDiseaseReports.find(
          (report) => report.diseaseName === "Antracnose"
        );
        let queimaReport = lastDiseaseReports.find(
          (report) => report.diseaseName === "Queima"
        );

        fungicideReport.oidioReport = oidioReport;
        fungicideReport.antracnoseReport = antracnoseReport;
        fungicideReport.queimaReport = queimaReport;

        if (!oidioReport && !antracnoseReport) {

            fungicideReport.status = "info"
            fungicideReport.message = `Neste ano, as doenças (oídio, antracnose e queima) ainda não foram monitoradas. 
            Mas, recomenda-se a aplicação rotineira de fungicida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(fungicideReport);
            
        }
        else if (oidioReport && oidioReport.affectedTrees === 0 && !antracnoseReport && !queimaReport){

            fungicideReport.status = "info"
            fungicideReport.message = `Nenhum cajueiro infectado pela oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se (1) a monitoria de 'antracnose' e 'queima' e (2) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(fungicideReport);

        }
        else if (oidioReport && oidioReport.affectedTrees > 0 && !antracnoseReport && !queimaReport) {
            
            fungicideReport.status = "warning"
            fungicideReport.message = `${calculatePercentage(
              oidioReport.affectedTrees,
              oidioReport.trees
            )}% dos cajueiros infectados pela oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a oídio, (2) a monitoria da helopeltis ssp e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(fungicideReport);

        }
        else if (!oidioReport && !queimaReport && antracnoseReport && antracnoseReport.affectedTrees === 0) {

            fungicideReport.status = "info";
            fungicideReport.message = `Nenhum cajueiro infectado pela antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(antracnoseReport.detectedAt)
            )}. Recomenda-se a monitoria da cochonilha e a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(fungicideReport);

        }
        else if (!oidioReport && !queimaReport && antracnoseReport && antracnoseReport.affectedTrees > 0) {

            fungicideReport.status = "warning"
            fungicideReport.message = `${calculatePercentage(
              antracnoseReport.affectedTrees,
              antracnoseReport.trees
            )}% dos cajueiros infectados pela antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(antracnoseReport.detectedAt)
            )}. Recomenda-se (1) a pulverização contra a antracnose, (2) a monitoria de 'oídio' e 'queima' e (3) a aplicação rotineira de insecticida nos meses de 
            julho, agosto e setembro.`;

            normalizedReport.push(fungicideReport);
        }
        else if (!queimaReport) {
            
            fungicideReport.status = "error";
            fungicideReport.message = `${calculatePercentage(
              antracnoseReport.affectedTrees,
              antracnoseReport.trees
            )}% dos cajueiros infectados pela antracnose segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(antracnoseReport.detectedAt)
            )} e ${calculatePercentage(
              oidioReport.affectedTrees,
              oidioReport.trees
            )}% dos cajueiros infectados pela oídio segundo a última monitoria ocorrida aos 
            ${normalizeDate(
              new Date(oidioReport.detectedAt)
            )}. Recomenda-se a pulverização contra a antracnose e a oídio.`;


            normalizedReport.push(fungicideReport);
        }

    }
    else if (
        // true
        !report[i]?.disease?.rounds && 
        report[i]?.fungicide?.rounds && 
        report[i]?.fungicide?.rounds.length > 0
    ) { // considering there is no disease report yet, but there fungicide report already
     
        let oidioLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
          ),
          "fungicide"
        );

        let antracnoseLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Antracnose",
          ),
          "fungicide"
        );

        let queimaLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Queima"
          ),
          "fungicide"
        );

        // let outraInsecticide = lastMonitoringRound(
        //   report[i]?.insecticide?.rounds.filter(
        //     (round) => round.insecticideName === "Outra"
        //   ),
        //   "insecticide"
        // );
        
        let lastFungicideReports = [ oidioLastRound, antracnoseLastRound, queimaLastRound ];
        let foundReports = lastFungicideReports.filter(
          (lastReport) => lastReport
        );
        
        let normalizedFoundReports = foundReports.map(report=>{
          let newReport = {
            ...report,
          }
          newReport.sowingYear = sowingYear;
          newReport.trees = foundDivision.trees;
          newReport.treatedTreePercentage = calculatePercentage(
            newReport.treatedTrees,
            foundDivision.trees
          );
          newReport.appliedAt = report.appliedAt

          // const nextRound = getNextApplicationRound(newReport.applicationNumber, newReport.fungicideName, newReport.appliedAt);
            const nextRound = getNextRound(newReport.applicationNumber, newReport.diseaseName, newReport.appliedAt, northProvinces.indexOf(farmland.province) >= 0)

            if (nextRound.nextApplication === 'Nenhuma' && newReport.treatedTreePercentage <= 60) {
              newReport.status = "error";
              newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.fungicideName}
              contra ${newReport.diseaseName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros. Recomenda-se pulverizar os restantes.`;
            }
            else if (nextRound.nextApplication === 'Nenhuma' && newReport.treatedTreePercentage > 60) {
              newReport.status = "success";
              newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.fungicideName} em APENAS 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;              
            }
            else if (sprayingMonths.indexOf(new Date().getMonth()+ 1) >= 0){
              newReport.status = "warning";
              newReport.message = `Recomenda-se a ${
                nextRound.nextApplication
              } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
                nextRound.nextDate
              )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
                newReport.treatedTreePercentage
              }% dos cajueiros.`;
            }
            else if (new Date() - new Date(newReport.appliedAt) >= 0 ) {
              newReport.status = "info";
              newReport.message = `Recomenda-se a ${
                nextRound.nextApplication
              } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
                nextRound.nextDate
              )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
                newReport.treatedTreePercentage
              }% dos cajueiros.`;
            }
            else if (new Date() - new Date(newReport.appliedAt) < 0) {
              newReport.status = "error";
              newReport.message = `Perigo! A ${
                nextRound.nextApplication
              } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
                nextRound.nextDate
              )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
                newReport.treatedTreePercentage
              }% dos cajueiros.`;
            }
            else {
              newReport.status = "info";
              newReport.message = 
              `Recomenda-se uma ${nextRound.nextApplication} aplicação da fungicida '${
                newReport.fungicideName
              }' contra a praga '${newReport?.diseaseName}' aos ${normalizeDate(
                nextRound?.nextDate)}. A última aplicação que ocorreu aos ${normalizeDate(
                new Date(newReport.appliedAt)
              )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;

            }

          normalizedReport.push(newReport);
          
          return report;

        })            
      }
      else {

        // check if the last disease reports have any relevant information
        let lastDiseaseReports = checkDisease(report, farmland);

        let oidioLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Oídio"
          ),
          "fungicide"
        );

        let antracnoseLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Antracnose"
          ),
          "fungicide"
        );

        let queimaLastRound = lastMonitoringRound(
          report[i]?.fungicide?.rounds.filter(
            (round) => round.diseaseName === "Queima"
          ),
          "fungicide"
        );

        // let outraInsecticide = lastMonitoringRound(
        //   report[i]?.insecticide?.rounds.filter(
        //     (round) => round.insecticideName === "Outra"
        //   ),
        //   "insecticide"
        // );

        let lastFungicideReports = [
          oidioLastRound,
          antracnoseLastRound,
          queimaLastRound,
        ];
        let foundReports = lastFungicideReports.filter(
          (lastReport) => lastReport
        );        
        
        // loop through all the existing insecticide reports.
        let normalizedFoundReports = foundReports.map((report) => {
          let newReport = {
            ...report,
          };

          newReport.sowingYear = sowingYear;
          newReport.trees = foundDivision.trees;
          newReport.treatedTreePercentage = calculatePercentage(
            newReport.treatedTrees,
            foundDivision.trees
          );

          newReport.appliedAt = report.appliedAt;

          // const nextRound = getNextApplicationRound(
          //   newReport.applicationNumber,
          //   newReport.insecticideName,
          //   newReport.appliedAt
          // );
            const nextRound = getNextRound(
              newReport.applicationNumber,
              newReport.diseaseName,
              newReport.appliedAt,
              northProvinces.indexOf(farmland.province) >= 0
            );



          if (
            nextRound.nextApplication === "Nenhuma" &&
            antracnoseLastRound?.affectedTrees > 0 &&
            antracnoseLastRound?.affectedTrees <= newReport.treatedTrees
          ) {

            newReport.status = "success";
            newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.fungicideName} 
              contra a ${newReport.diseaseName}.`;

          } else if (
            nextRound.nextApplication === "Nenhuma" &&
            oidioLastRound?.affectedTrees > 0 &&
            oidioLastRound?.affectedTrees <= newReport.treatedTrees
          ) {
            newReport.status = "success";
            newReport.message = `Ótimo! Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.fungicideName} 
              contra a ${newReport.diseaseName}.`;
          } else if (
            nextRound.nextApplication === "Nenhuma" &&
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
          ) {
            newReport.status = "info";
            newReport.message = `Completou-se as recomendadas ${nextRound.round} aplicações de ${newReport.fungicideName}
              contra ${newReport.diseaseName} em 
              ${newReport.treatedTreePercentage}% dos cajueiros.`;
          } else if (
            nextRound.nextApplication !== "Nenhuma" &&
            sprayingMonths.indexOf(new Date().getMonth() + 1) >= 0
          ) {
            newReport.status = "warning";
            newReport.message = `Recomenda-se a ${
              nextRound.nextApplication
            } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
              nextRound.nextDate
            )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } else if (new Date() - new Date(newReport.appliedAt) >= 0) {
            newReport.status = "info";
            newReport.message = `Recomenda-se a ${
              nextRound.nextApplication
            } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
              nextRound.nextDate
            )}. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } else if (new Date() - new Date(newReport.appliedAt) < 0) {
            newReport.status = "error";
            newReport.message = `Perigo! A ${
              nextRound.nextApplication
            } aplicação de ${newReport.fungicideName} 
                contra ${newReport.diseaseName} aos ${normalizeDate(
              nextRound.nextDate
            )} não ocorreu na data recomendada. A última aplicação que ocorreu aos 
                ${normalizeDate(new Date(newReport.appliedAt))} abrangeu ${
              newReport.treatedTreePercentage
            }% dos cajueiros.`;
          } else {
            newReport.status = "info";
            newReport.message = `Recomenda-se uma ${
              nextRound.nextApplication
            } aplicação da insecticida '${
              newReport.fungicideName
            }' contra a praga '${newReport?.diseaseName}' aos ${normalizeDate(
              nextRound?.nextDate
            )}. A última aplicação que ocorreu aos ${normalizeDate(
              new Date(newReport.appliedAt)
            )} abrangeu ${newReport.affectedTreePercentage}% dos cajueiros.`;
          }

          normalizedReport.push(newReport);

          return report;
        });
      }
    }
      return normalizedReport;
    
    }





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
