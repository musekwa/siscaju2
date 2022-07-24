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
          weedingReport.message = `Recomenda-se uma limpeza dos cajueiros este mês.`;

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
                A última ${weedingReport.weedingType} ocorreu aos ${normalizeDate(weedingReport.weededAt)}.`;

            normalizedReport.push(weedingReport);

        }
        else {
            weedingReport.status = "warning";
            weedingReport.message = `Recomenda-se também uma limpeza nos meses seguintes: Janeiro, Abril, Julho e Outubro. 
                A última ${weedingReport.weedingType} ocorreu aos ${months[weedingReport.weededAt.getMonth()]}.`;

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

    if (report[i]?.pruning?.rounds && report[i]?.pruning?.rounds?.length > 0) {
      let formationPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de formação"
        ),
        "pruning"
      );
      let sanitationPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de sanitação"
        ),
        "pruning"
      );

      let renewalPruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de rejuvenescimento"
        ),
        "pruning"
      );

      let maintenancePruning = lastMonitoringRound(
        report[i]?.pruning?.rounds.filter(
          (round) => round.pruningType === "Poda de manutenção"
        ),
        "pruning"
      );

      if (sanitationPruning) {
        // check for any formation pruning within the last 2 year
        // check for any sanitation pruning within the last 2 year

        pruningReport.pruningType = sanitationPruning.pruningType;
        pruningReport.prunedAt = new Date(sanitationPruning.prunedAt);
        pruningReport.totallyPrunedTrees = calculatePercentage(
          sanitationPruning.totallyPrunedTrees,
          pruningReport.trees
        );
        pruningReport.partiallyPrunedTrees = calculatePercentage(
          sanitationPruning.partiallyPrunedTrees,
          pruningReport.trees
        );
        pruningReport.status =
          new Date().getFullYear() -
            new Date(sanitationPruning.prunedAt).getFullYear() ===
          0
            ? "success"
            : new Date().getFullYear() -
                new Date(sanitationPruning.prunedAt).getFullYear() ===
              1
            ? "info"
            : new Date().getFullYear() -
                new Date(sanitationPruning.prunedAt).getFullYear() ===
              2
            ? "warning"
            : "error";

        pruningReport.message =
          new Date().getFullYear() -
            new Date(sanitationPruning.prunedAt).getFullYear() ===
          0
            ? `${
                sanitationPruning.pruningType
              } feita há menos de um ano (${normalizeDate(
                new Date(sanitationPruning.prunedAt)
              )}): ${
                pruningReport.totallyPrunedTrees
              }% de cajueiros totalmente podados 
                    e ${
                      pruningReport.partiallyPrunedTrees
                    }% de cajueiros parcialmente podados.`
            : new Date().getFullYear() -
                new Date(sanitationPruning.prunedAt).getFullYear() ===
              1
            ? `É recomendado fazer uma ${sanitationPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
                new Date(sanitationPruning.prunedAt)
              )}.`
            : new Date().getFullYear() -
                new Date(sanitationPruning.prunedAt).getFullYear() ===
              2
            ? `É recomendado fazer ${sanitationPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
                new Date(sanitationPruning.prunedAt)
              )}.`
            : `Não foi feita nenhuma ${sanitationPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
                new Date(sanitationPruning.prunedAt)
              )}.`;

        normalizedReport.push(pruningReport);
      } else if (formationPruning) {
        pruningReport.pruningType = formationPruning.pruningType;
        pruningReport.prunedAt = new Date(formationPruning.prunedAt);

        pruningReport.totallyPrunedTrees = calculatePercentage(
          formationPruning.totallyPrunedTrees,
          pruningReport.trees
        );
        pruningReport.partiallyPrunedTrees = calculatePercentage(
          formationPruning.partiallyPrunedTrees,
          pruningReport.trees
        );

        pruningReport.status =
          new Date().getFullYear() -
            new Date(formationPruning.prunedAt).getFullYear() ===
          0
            ? "success"
            : new Date().getFullYear() -
                new Date(formationPruning.prunedAt).getFullYear() ===
              1
            ? "info"
            : new Date().getFullYear() -
                new Date(formationPruning.prunedAt).getFullYear() ===
              2
            ? "warning"
            : "error";

        pruningReport.message =
          new Date().getFullYear() -
            new Date(formationPruning.prunedAt).getFullYear() ===
          0
            ? `${
                formationPruning.pruningType
              } feita há menos de um ano (${normalizeDate(
                new Date(formationPruning.prunedAt)
              )}): ${
                pruningReport.totallyPrunedTrees
              }% de cajueiros totalmente podados 
                    e ${
                      pruningReport.partiallyPrunedTrees
                    }% de cajueiros parcialmente podados.`
            : new Date().getFullYear() -
                new Date(formationPruning.prunedAt).getFullYear() ===
              1
            ? `É recomendado fazer uma ${formationPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
                new Date(formationPruning.prunedAt)
              )}.`
            : new Date().getFullYear() -
                new Date(formationPruning.prunedAt).getFullYear() ===
              2
            ? `É recomendado fazer uma ${formationPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
                new Date(formationPruning.prunedAt)
              )}.`
            : `Não foi feita nenhuma ${formationPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
                new Date(formationPruning.prunedAt)
              )}.`;

        normalizedReport.push(pruningReport);
      } else if (renewalPruning) {
        pruningReport.pruningType = renewalPruning.pruningType;
        pruningReport.prunedAt = new Date(renewalPruning.prunedAt);

        pruningReport.totallyPrunedTrees = calculatePercentage(
          renewalPruning.totallyPrunedTrees,
          pruningReport.trees
        );
        pruningReport.partiallyPrunedTrees = calculatePercentage(
          renewalPruning.partiallyPrunedTrees,
          pruningReport.trees
        );

        pruningReport.status =
          new Date().getFullYear() -
            new Date(renewalPruning.prunedAt).getFullYear() ===
          0
            ? "success"
            : new Date().getFullYear() -
                new Date(renewalPruning.prunedAt).getFullYear() ===
              1
            ? "info"
            : new Date().getFullYear() -
                new Date(renewalPruning.prunedAt).getFullYear() ===
              2
            ? "warning"
            : "error";

        pruningReport.message =
          new Date().getFullYear() -
            new Date(renewalPruning.prunedAt).getFullYear() ===
          0
            ? `${
                renewalPruning.pruningType
              } feita há menos de um ano (${normalizeDate(
                new Date(renewalPruning.prunedAt)
              )}): ${
                pruningReport.totallyPrunedTrees
              }% de cajueiros totalmente podados 
                    e ${
                      pruningReport.partiallyPrunedTrees
                    }% de cajueiros parcialmente podados.`
            : new Date().getFullYear() -
                new Date(renewalPruning.prunedAt).getFullYear() ===
              1
            ? `É recomendado fazer uma ${renewalPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
                new Date(renewalPruning.prunedAt)
              )}.`
            : new Date().getFullYear() -
                new Date(renewalPruning.prunedAt).getFullYear() ===
              2
            ? `É necessário fazer uma ${renewalPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
                new Date(renewalPruning.prunedAt)
              )}.`
            : `Não foi feita nenhuma ${renewalPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
                new Date(renewalPruning.prunedAt)
              )}.`;

        normalizedReport.push(pruningReport);
      } else if (maintenancePruning) {
        pruningReport.pruningType = maintenancePruning.pruningType;
        pruningReport.prunedAt = new Date(maintenancePruning.prunedAt);

        pruningReport.totallyPrunedTrees = calculatePercentage(
          maintenancePruning.totallyPrunedTrees,
          pruningReport.trees
        );
        pruningReport.partiallyPrunedTrees = calculatePercentage(
          maintenancePruning.partiallyPrunedTrees,
          pruningReport.trees
        );

        pruningReport.status =
          new Date().getFullYear() -
            new Date(maintenancePruning.prunedAt).getFullYear() ===
          0
            ? "success"
            : new Date().getFullYear() -
                new Date(maintenancePruning.prunedAt).getFullYear() ===
              1
            ? "info"
            : new Date().getFullYear() -
                new Date(maintenancePruning.prunedAt).getFullYear() ===
              2
            ? "warning"
            : "error";

        pruningReport.message =
          new Date().getFullYear() -
            new Date(maintenancePruning.prunedAt).getFullYear() ===
          0
            ? `${
                maintenancePruning.pruningType
              } feita há menos de um ano (${normalizeDate(
                new Date(maintenancePruning.prunedAt)
              )}): ${
                pruningReport.totallyPrunedTrees
              }% de cajueiros totalmente podados 
                    e ${
                      pruningReport.partiallyPrunedTrees
                    }% de cajueiros parcialmente podados.`
            : new Date().getFullYear() -
                new Date(maintenancePruning.prunedAt).getFullYear() ===
              1
            ? `É recomendado fazer uma ${maintenancePruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
                new Date(maintenancePruning.prunedAt)
              )}.`
            : new Date().getFullYear() -
                new Date(maintenancePruning.prunedAt).getFullYear() ===
              2
            ? `É necessário fazer uma ${maintenancePruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
                new Date(maintenancePruning.prunedAt)
              )}.`
            : `Não foi feita nenhuma ${maintenancePruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
                new Date(maintenancePruning.prunedAt)
              )}.`;

        normalizedReport.push(pruningReport);
      } else {
        pruningReport.status = "info";
        pruningReport.message = `Neste ano, a poda ainda não foi monitorada.`;

        normalizedReport.push(pruningReport);
      }
    } else {
      pruningReport.status = "info";
      pruningReport.message = `Neste ano, a poda ainda não foi monitorada.`;

      normalizedReport.push(pruningReport);
    }
  }
  // console.log("report ", normalizedReport);
  return normalizedReport;
};

//  --------------------------- Start disease report -------------------------------

export const checkDisease = (report, farmland) => {
  const normalizedReport = [];

  if (report && report.length === 0) {
    for (let i = 0; i < farmland?.divisions.length; i++) {
      let pruningReport = {
        sowingYear: farmland.divisions[i].sowingYear,
        status: "info",
        message: `Neste ano, as doenças ainda não foram monitoradas.`,
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

    let diseaseReport = {
      sowingYear,
      trees: foundDivision.trees,
    };

    if (report[i]?.disease?.rounds && report[i]?.disease?.rounds?.length > 0) {
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

        const oidioPercentage = calculatePercentage(oidioReport.affectedTrees, diseaseReport.trees);
        const antracnosePercentage = calculatePercentage(antracnoseReport.affectedTrees, diseaseReport.trees);
        
        if (oidioPercentage === 0 && (antracnosePercentage > 0 && antracnosePercentage <= 30) ) {
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

        } 
        else if (oidioPercentage === 0 && (antracnosePercentage > 30)) {
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
        }
        else if (
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
        }
         else if (oidioPercentage === 0 && antracnosePercentage === 0) {
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

    } 
    else if(oidio && !antracnose) {

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
        
        const diseasePertcentage = calculatePercentage(diseaseReport.affectedTrees, diseaseReport.trees );

        if (diseasePertcentage === 0){

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

        } 
        else if (diseasePertcentage > 30) {

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

        

    } 
    else if (antracnose && !oidio) {

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
            
        const diseasePertcentage = calculatePercentage(diseaseReport.affectedTrees, diseaseReport.trees);

        if (diseasePertcentage === 0){

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

        } 
        else if (diseasePertcentage) {

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

        } 
        else if (diseasePertcentage > 30) {

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

        


    }
    else {
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
