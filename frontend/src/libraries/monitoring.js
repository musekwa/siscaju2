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
  return Math.floor((Number(number) * 100) / Number(total));
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

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let weedingReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, a limpeza ainda não foi monitorada.`,
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

  const weedingMonths = [1, 4, 7, 10];

  const currentMonth = new Date().getMonth() + 1;

  for (let i = 0; i < divisions?.length; i++) {

    let weedingReport = {
      sowingYear: divisions[i].sowingYear,
    };

    

    let lastWeedingMonth;
    let lastWeedingYear;

    weedingReport.weedingType = divisions[i]?.lastWeeding?.weedingType;

    if (divisions[i].lastWeeding) {

        lastWeedingMonth = new Date(divisions[i].lastWeeding.weededAt).getMonth() + 1;
        lastWeedingYear = new Date(divisions[i].lastWeeding.weededAt).getFullYear();            

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

        let cleanedTreePercentage = calculatePercentage(
          weedingReport.cleanedTrees,
          divisions[i].trees
        );

        // weedingReport.weededAt = normalizeDate(new Date(divisions[i].lastWeeding.weededAt));



      if (
        weedingMonths.indexOf(lastWeedingMonth) >= 0 &&
        lastWeedingMonth === currentMonth && lastWeedingYear === new Date().getFullYear()
      ) {


        if (cleanedTreePercentage === 0) {

          weedingReport.status = "error";
          weedingReport.message = `Recomenda-se uma limpeza dos cajueiros neste mês.`;

          normalizedReport.push(weedingReport);
        
        }
        else if (cleanedTreePercentage <= 30){
          weedingReport.status = "warning";
          weedingReport.message = `Recomenda-se ainda a limpeza dos cajueiros não limpos, 
            depois da limpeza feita  aos ${normalizeDate(weedingReport.weededAt)}: apenas ${weedingReport.totallyCleanedTreePercentage}% 
            de cajueiros totalmente limpos e ${weedingReport.partiallyCleanedTreePercentage} % de cajueiros 
            parcialmente limpos.`;

           normalizedReport.push(weedingReport);

        }
        else if (cleanedTreePercentage <= 60){
          weedingReport.status = "warning";
          weedingReport.message = `Recomenda-se completar a limpeza 
            dos cajueiros não limpos depois de ${normalizeDate(weedingReport.weededAt)}: apenas ${weedingReport.totallyCleanedTreePercentage}% de 
            cajueiros totalmente limpos e ${weedingReport.partiallyCleanedTreePercentage}% de 
            cajueiros parcialmente limpos.`;

           normalizedReport.push(weedingReport);

        }
        else if (cleanedTreePercentage > 60) {
          weedingReport.status = "success";
          weedingReport.message = `${weedingReport.weedingType} aos ${normalizeDate(weedingReport.weededAt)}:  ${weedingReport.totallyCleanedTreePercentage}% de 
           cajueiros totalmente limpos e ${weedingReport.partiallyCleanedTreePercentage}% 
           de cajueiros parcialmente limpos.`;

           normalizedReport.push(weedingReport);

        }
        
        
        } 
        // else {
        //   weedingReport.status = "success";
        //   weedingReport.message = `${
        //     divisions[i].lastWeeding.weedingType
        //   } aos ${normalizeDate(
        //     new Date(divisions[i].lastWeeding.weededAt)
        //   )}:  ${calculatePercentage(
        //     divisions[i].lastWeeding.totallyCleanedTrees,
        //     divisions[i].trees
        //   )}% de cajueiros totalmente limpos e ${calculatePercentage(
        //     divisions[i].lastWeeding.partiallyCleanedTrees,
        //     divisions[i].trees
        //   )} % de cajueiros parcialmente limpos`;
        // }

        else if (lastWeedingYear < new Date().getFullYear()){

            weedingReport.status = "error";
            weedingReport.message = `Recomenda-se urgentemente uma limpeza neste ano. 
                A última ${weedingReport.weedingType} ocorreu aos ${normalizeDate(weedingReport.weededAt)} e abrangiu ${cleanedTreePercentage}% dos cajueiros.`;

            normalizedReport.push(weedingReport);

        }
        else {
            weedingReport.status = "warning";
            weedingReport.message = `Recomenda-se também uma limpeza nos meses seguintes: Janeiro, Abril, Julho e Outubro. 
                A última ${weedingReport.weedingType} ocorreu aos ${normalizeDate(weedingReport.weededAt)} e abrangiu ${cleanedTreePercentage}% dos cajueiros.`;

            normalizedReport.push(weedingReport);           
        }

      } 
      else {
        weedingReport.status = "info";
        weedingReport.message = `Neste ano, a limpeza ainda não foi monitorada.`;


        normalizedReport.push(weedingReport); 
      }
    } 
    

  return normalizedReport;
};

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
                    ? "warning"
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
                    ? "info"
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
                    ? `${allPrunings[i].pruningType} feita APENAS em ${
                        report.prunedTreePercentage
                      }% de cajueiros aos (${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}): ${
                        report.totallyPrunedTreePercentage
                      }% de cajueiros totalmente podados 
                            e ${
                              report.partiallyPrunedTreePercentage
                            }% de cajueiros parcialmente podados.`
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage < 60 //  pruning was done on some trees
                    ? `${allPrunings[i].pruningType} feita em ${
                        report.prunedTreePercentage
                      }% de cajueiros aos (${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}): ${
                        report.totallyPrunedTreePercentage
                      }% de cajueiros totalmente podados 
                            e ${
                              report.partiallyPrunedTreePercentage
                            }% de cajueiros parcialmente podados.`
                    : (new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        0 ||
                        (new Date().getFullYear() -
                          new Date(allPrunings[i].prunedAt).getFullYear() ===
                          1 &&
                          new Date().getMonth() >
                            new Date(allPrunings[i].prunedAt).getMonth())) &&
                      report.prunedTreePercentage >= 60 // pruning was done on most of trees
                    ? `${allPrunings[i].pruningType} feita em ${
                        report.prunedTreePercentage
                      }% de cajueiros aos (${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}): ${
                        report.totallyPrunedTreePercentage
                      }% de cajueiros totalmente podados 
                            e ${
                              report.partiallyPrunedTreePercentage
                            }% de cajueiros parcialmente podados.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() <=
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning next year
                    ? `É recomendado fazer uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} no próximo ano, porque a última ocorreu em ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                        1 &&
                      new Date().getMonth() >
                        new Date(allPrunings[i].prunedAt).getMonth() // recommended pruning within some months
                    ? `É recomendado fazer uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() ===
                      2 // recommended pruning this year.
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}.`
                    : new Date().getFullYear() -
                        new Date(allPrunings[i].prunedAt).getFullYear() >=
                      2
                    ? `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}, porque a última ocorreu há mais de 2 anos (${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}).`
                    : `Recomenda-se uma ${allPrunings[
                        i
                      ].pruningType.toLowerCase()}, porque a última ocorreu há mais de 2 anos (${normalizeDate(
                        new Date(allPrunings[i].prunedAt)
                      )}).`;

                normalizedReport.push(report);

            }
            // else {


            //     pruningReport.status = "info";
            //     pruningReport.message = `Nenhuma-- monitoria da ${allPrunings[i].pruningType.toLowerCase()} feita até agora.`;

            //     // console.log("allprunings: ", pruningReport);

            //     normalizedReport.push(pruningReport);
            // }
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
            oidio.lowSeverity +
            oidio.averageSeverity +
            oidio.highSeverity +
            oidio.higherSeverity;

          antracnoseReport.affectedTrees =
            antracnose.lowSeverity +
            antracnose.averageSeverity +
            antracnose.highSeverity +
            antracnose.higherSeverity;

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
          ) {
            oidioReport.status = "success";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          } else if (oidioPercentage === 0 && antracnosePercentage > 30) {
            oidioReport.status = "success";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          } else if (
            oidioPercentage > 0 &&
            oidioPercentage <= 30 &&
            antracnosePercentage === 0
          ) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "warning";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}%
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);
          } else if (oidioPercentage > 30 && antracnosePercentage === 0) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "error";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}%
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);
          } else if (oidioPercentage === 0 && antracnosePercentage === 0) {
            antracnoseReport.status = "success";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )}.`;

            normalizedReport.push(antracnoseReport);

            oidioReport.status = "success";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )}.`;

            normalizedReport.push(oidioReport);
          } else if (
            oidioPercentage > 0 &&
            oidioPercentage <= 30 &&
            antracnosePercentage > 0 &&
            antracnosePercentage <= 30
          ) {
            oidioReport.status = "warning";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          } else if (oidioPercentage > 30 && antracnosePercentage > 30) {
            oidioReport.status = "error";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          } else if (oidioPercentage < 30 && antracnosePercentage > 30) {
            oidioReport.status = "warning";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "error";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          } else if (oidioPercentage > 30 && antracnosePercentage < 30) {
            oidioReport.status = "error";
            oidioReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi 
                detectada em ${oidioPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(oidio.detectedAt)
                )}.`;

            normalizedReport.push(oidioReport);

            antracnoseReport.status = "warning";
            antracnoseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi 
                detectada em ${antracnosePercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(antracnose.detectedAt)
                )}.`;

            normalizedReport.push(antracnoseReport);
          }
        } else if (oidio && !antracnose) {
          //   diseaseReport.status = "info";
          //   diseaseReport.message = `A doença antracnose nunca foi monitorada desde o dia do registo.`;

          //   normalizedReport.push(diseaseReport);

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
            oidio.lowSeverity +
            oidio.averageSeverity +
            oidio.highSeverity +
            oidio.higherSeverity;

          const diseasePertcentage = calculatePercentage(
            diseaseReport.affectedTrees,
            diseaseReport.trees
          );

          if (diseasePertcentage === 0) {
            diseaseReport.status = "success";
            diseaseReport.message = `A doença ${oidio.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(oidio.detectedAt)
            )}.`;

            normalizedReport.push(diseaseReport);

            // }
            // else if (diseasePertcentage < 10) {

            //   diseaseReport.status = "warning";
            //   diseaseReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi detectada em cajueiros aos (${normalizeDate(
            //     new Date(oidio.detectedAt)
            //   )}): severidade muito alta (${
            //     diseaseReport.higherSeverity
            //   }%); severidade alta (${
            //     diseaseReport.highSeverity
            //   }%); severidade média (${
            //     diseaseReport.averageSeverity
            //   }%) e severidade baixa (${diseaseReport.lowSeverity}%).`;

            //   normalizedReport.push(diseaseReport);
          } else if (diseasePertcentage <= 30) {
            diseaseReport.status = "warning";
            diseaseReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi detectada em alguns cajueiros aos (${normalizeDate(
              new Date(oidio.detectedAt)
            )}): severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%). É recomendada uma pulverização.`;

            normalizedReport.push(diseaseReport);
          } else if (diseasePertcentage > 30) {
            diseaseReport.status = "error";
            diseaseReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi detectada em muitos cajueiros aos (${normalizeDate(
              new Date(oidio.detectedAt)
            )}): severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%). É recomendada urgentemente uma pulverização.`;

            normalizedReport.push(diseaseReport);
          }
        } else if (antracnose && !oidio) {
          //   diseaseReport.status = "info";
          //   diseaseReport.message = `A doença oídio nunca foi monitorada desde o dia do registo.`;

          //   normalizedReport.push(diseaseReport);

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
            antracnose.lowSeverity +
            antracnose.averageSeverity +
            antracnose.highSeverity +
            antracnose.higherSeverity;

          const diseasePertcentage = calculatePercentage(
            diseaseReport.affectedTrees,
            diseaseReport.trees
          );

          if (diseasePertcentage === 0) {
            diseaseReport.status = "success";
            diseaseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(antracnose.detectedAt)
            )}.`;

            normalizedReport.push(diseaseReport);

            // }
            // else if (diseasePertcentage < 10) {

            //   diseaseReport.status = "warning";
            //   diseaseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi detectada em cajueiros aos (${normalizeDate(
            //     new Date(antracnose.detectedAt)
            //   )}): severidade muito alta (${
            //     diseaseReport.higherSeverity
            //   }%); severidade alta (${
            //     diseaseReport.highSeverity
            //   }%); severidade média (${
            //     diseaseReport.averageSeverity
            //   }%) e severidade baixa (${diseaseReport.lowSeverity}%).`;

            //   normalizedReport.push(diseaseReport);
          } else if (diseasePertcentage) {
            diseaseReport.status = "warning";
            diseaseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi detectada em alguns cajueiros aos (${normalizeDate(
              new Date(antracnose.detectedAt)
            )}): severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%). É recomendada uma pulverização.`;

            normalizedReport.push(diseaseReport);
          } else if (diseasePertcentage > 30) {
            diseaseReport.status = "error";
            diseaseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi detectada em muitos cajueiros aos (${normalizeDate(
              new Date(antracnose.detectedAt)
            )}): severidade muito alta (${
              diseaseReport.higherSeverity
            }%); severidade alta (${
              diseaseReport.highSeverity
            }%); severidade média (${
              diseaseReport.averageSeverity
            }%) e severidade baixa (${
              diseaseReport.lowSeverity
            }%). É recomendada urgentemente uma pulverização.`;

            normalizedReport.push(diseaseReport);
          }
        } else {
          diseaseReport.status = "info";
          diseaseReport.message = `Neste ano, as doenças ainda não foram monitoradas.`;

          normalizedReport.push(diseaseReport);
        }
      }
}
//  console.log("doenca: ", normalizedReport);
  // console.log("report ", normalizedReport);
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
            cochonilhaPercentage.message = `A praga ${cochonilha.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `A prga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          } else if (cochonilhaPercentage === 0 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "success";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          } else if (
            cochonilhaPercentage > 0 &&
            cochonilhaPercentage <= 30 &&
            helopeltisPercentage === 0
          ) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}%
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;

            normalizedReport.push(cochonilhaReport);
          } else if (cochonilhaPercentage > 30 && helopeltisPercentage === 0) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "error";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}%
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;

            normalizedReport.push(cochonilhaReport);
          } else if (cochonilhaPercentage === 0 && helopeltisPercentage === 0) {
            helopeltisReport.status = "success";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}.`;

            normalizedReport.push(helopeltisReport);

            cochonilhaReport.status = "success";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}.`;

            normalizedReport.push(cochonilhaReport);
          } else if (
            cochonilhaPercentage > 0 &&
            cochonilhaPercentage <= 30 &&
            helopeltisPercentage > 0 &&
            helopeltisPercentage <= 30
          ) {
            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          } else if (cochonilhaPercentage > 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;
//  continue from here
            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          } else if (cochonilhaPercentage < 30 && helopeltisPercentage > 30) {
            cochonilhaReport.status = "warning";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "error";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          } else if (cochonilhaPercentage > 30 && helopeltisPercentage < 30) {
            cochonilhaReport.status = "error";
            cochonilhaReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi 
                detectada em ${cochonilhaPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(cochonilha.detectedAt)
                )}.`;

            normalizedReport.push(cochonilhaReport);

            helopeltisReport.status = "warning";
            helopeltisReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi 
                detectada em ${helopeltisPercentage}% 
                dos cajueiros aos ${normalizeDate(
                  new Date(helopeltis.detectedAt)
                )}.`;

            normalizedReport.push(helopeltisReport);
          }
        } else if (cochonilha && !helopeltis) {
          //   diseaseReport.status = "info";
          //   diseaseReport.message = `A doença antracnose nunca foi monitorada desde o dia do registo.`;

          //   normalizedReport.push(diseaseReport);

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
            plagueReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}.`;

            normalizedReport.push(plagueReport);

            // }
            // else if (diseasePertcentage < 10) {

            //   diseaseReport.status = "warning";
            //   diseaseReport.message = `A doença ${oidio.diseaseName.toLowerCase()} foi detectada em cajueiros aos (${normalizeDate(
            //     new Date(oidio.detectedAt)
            //   )}): severidade muito alta (${
            //     diseaseReport.higherSeverity
            //   }%); severidade alta (${
            //     diseaseReport.highSeverity
            //   }%); severidade média (${
            //     diseaseReport.averageSeverity
            //   }%) e severidade baixa (${diseaseReport.lowSeverity}%).`;

            //   normalizedReport.push(diseaseReport);
          } else if (plaguePertcentage <= 30) {
            plagueReport.status = "warning";
            plagueReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi detectada em alguns cajueiros aos (${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}): grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); graud de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%). É recomendada uma pulverização.`;

            normalizedReport.push(plagueReport);
          } else if (plaguePertcentage > 30) {
            plagueReport.status = "error";
            plagueReport.message = `A praga ${cochonilha.plagueName.toLowerCase()} foi detectada em muitos cajueiros aos (${normalizeDate(
              new Date(cochonilha.detectedAt)
            )}): grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de atque baixo (${
              plagueReport.lowAttack
            }%). É recomendada urgentemente uma pulverização.`;

            normalizedReport.push(plagueReport);
          }
        } else if (helopeltis && !cochonilha) {
          //   diseaseReport.status = "info";
          //   diseaseReport.message = `A doença oídio nunca foi monitorada desde o dia do registo.`;

          //   normalizedReport.push(diseaseReport);

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
            plagueReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} não foi detectada aos ${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}.`;

            normalizedReport.push(plagueReport);

            // }
            // else if (diseasePertcentage < 10) {

            //   diseaseReport.status = "warning";
            //   diseaseReport.message = `A doença ${antracnose.diseaseName.toLowerCase()} foi detectada em cajueiros aos (${normalizeDate(
            //     new Date(antracnose.detectedAt)
            //   )}): severidade muito alta (${
            //     diseaseReport.higherSeverity
            //   }%); severidade alta (${
            //     diseaseReport.highSeverity
            //   }%); severidade média (${
            //     diseaseReport.averageSeverity
            //   }%) e severidade baixa (${diseaseReport.lowSeverity}%).`;

            //   normalizedReport.push(diseaseReport);
          } else if (plaguePertcentage) {
            plagueReport.status = "warning";
            plagueReport.message = `A doença ${helopeltis.plagueName.toLowerCase()} foi detectada em alguns cajueiros aos (${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}): grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%). É recomendada uma pulverização.`;

            normalizedReport.push(plagueReport);

          } else if (plaguePertcentage > 30) {
            plagueReport.status = "error";
            plagueReport.message = `A praga ${helopeltis.plagueName.toLowerCase()} foi detectada em muitos cajueiros aos (${normalizeDate(
              new Date(helopeltis.detectedAt)
            )}): grau de ataque muito alto (${
              plagueReport.higherAttack
            }%); grau de ataque alto (${
              plagueReport.highAttack
            }%); grau de ataque médio (${
              plagueReport.averageAttack
            }%) e grau de ataque baixo (${
              plagueReport.lowAttack
            }%). É recomendada urgentemente uma pulverização.`;

            normalizedReport.push(plagueReport);
          }
        } else {
          plagueReport.status = "info";
          plagueReport.message = `Neste ano, as pragas ainda não foram monitoradas.`;

          normalizedReport.push(plagueReport);
        }
      }
}
//  console.log("doenca: ", normalizedReport);
//   console.log("report--plague ", normalizedReport);
  return normalizedReport;
};





//  --------------------------- Start harvest report -------------------------------

export const checkHarvest = (report, farmland) => {
  const normalizedReport = [];

  // if (report && report.length === 0) {
  for (let i = 0; i < farmland?.divisions.length; i++) {
    let pruningReport = {
      sowingYear: farmland.divisions[i].sowingYear,
      status: "info",
      message: `Monitoria de colheita de castanha e pêra de caju só a partir de ${months[9]}`,
    };

    normalizedReport.push(pruningReport);
  }

 

  return normalizedReport;
  // }
};
