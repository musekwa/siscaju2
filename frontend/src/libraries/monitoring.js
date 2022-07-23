import { months } from '../app/months'

// get the last registered weeding report for this division
const lastMonitoringRound = (rounds, flag)=>{
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
}

const calculatePercentage = (number, total)=>{
    // console.log (total);
    return Math.floor((Number(number) * 100) / Number(total));
}

const calculateTotal = (number, otherNumber)=>{
    return Number(number) + Number(otherNumber);
}

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

export const checkWeeding = (report, farmland)=>{
    
    const normalizedReport = [];

    if (report && report.length === 0) {
        for (let i = 0; i < farmland?.divisions.length; i++) {
            let weedingReport = {
              sowingYear: farmland.divisions[i].sowingYear,
              status: "info",
              message: `Nunca foi monitorada desde o dia do registo (${normalizeDate(
                farmland.divisions[i].createdAt
              )})`,
            };

            normalizedReport.push(weedingReport);

        }

        return normalizedReport;
        
    }

    let divisions = []

    for (let i = 0; i < report?.length; i++) {

       let foundDivision = farmland?.divisions.find(division=>division._id === report[i].division);
        let sowingYear = foundDivision.sowingYear;

        divisions.push({
          sowingYear,
          trees: foundDivision.trees,
          lastWeeding:
            report[i]?.weeding?.rounds && report[i]?.weeding.rounds?.length > 0
              ? lastMonitoringRound(report[i]?.weeding?.rounds, 'weeding')
              : null,
        });
    }

   

    const weedingMonths = [ 1, 4, 7, 10 ];

    const currentMonth = new Date().getMonth() + 1;


    for( let i = 0; i < divisions?.length; i++){

        let weedingReport = {
            sowingYear: divisions[i].sowingYear,
        };

        let lastWeedingMonth;

        // console.log("div", foundDivision);

        if (divisions[i].lastWeeding) {
            lastWeedingMonth = new Date(divisions[i].lastWeeding.weededAt).getMonth() + 1;
            weedingReport.lastWeedingAt = normalizeDate(new Date(divisions[i].lastWeeding.weededAt));

            if (
                weedingMonths.indexOf(lastWeedingMonth) >= 0 &&
                lastWeedingMonth === currentMonth
            ) {
                
                weedingReport.month = months[currentMonth - 1];
                weedingReport.weedingType = divisions[i].lastWeeding.weedingType;
                weedingReport.totallyCleanedTrees = calculatePercentage(
                  divisions[i].lastWeeding.totallyCleanedTrees,
                  divisions[i].trees
                );
                weedingReport.totallyCleanedTrees = calculatePercentage(
                  divisions[i].lastWeeding.partiallyCleanedTrees,
                  divisions[i].trees
                );

                weedingReport.cleanedTrees = calculateTotal(
                  divisions[i].lastWeeding.totallyCleanedTrees,
                  divisions[i].lastWeeding.partiallyCleanedTrees
                );


               console.log(weedingReport.cleanedTrees);

                if (weedingReport.cleanedTrees < 50) {
                  weedingReport.status = "warning";
                  weedingReport.message = `Recomendada ainda uma ${divisions[
                    i
                  ].lastWeeding.weedingType.toLowerCase()} dos cajueiros, depois da limpeza feita  aos ${normalizeDate(
                    new Date(divisions[i].lastWeeding.weededAt)
                  )}:  ${calculatePercentage(
                    divisions[i].lastWeeding.totallyCleanedTrees,
                    divisions[i].trees
                  )}% de cajueiros totalmente limpos e ${calculatePercentage(
                    divisions[i].lastWeeding.partiallyCleanedTrees,
                    divisions[i].trees
                  )} % de cajueiros parcialmente limpos`;
                } 
                
                else {
                  weedingReport.status = "success";
                  weedingReport.message = `${
                    divisions[i].lastWeeding.weedingType
                  } aos ${normalizeDate(
                    new Date(divisions[i].lastWeeding.weededAt)
                  )}:  ${calculatePercentage(
                    divisions[i].lastWeeding.totallyCleanedTrees,
                    divisions[i].trees
                  )}% de cajueiros totalmente limpos e ${calculatePercentage(
                    divisions[i].lastWeeding.partiallyCleanedTrees,
                    divisions[i].trees
                  )} % de cajueiros parcialmente limpos`;
                }

            }
            else {
                weedingReport.status = "info";
                weedingReport.month = months[currentMonth - 1];
                weedingReport.weedingType =
                  divisions[i].lastWeeding.weedingType;
                weedingReport.message = `Última limpeza foi ${
                  divisions[i].lastWeeding.weedingType
                } e ocorreu em ${normalizeDate(
                  new Date(divisions[i].lastWeeding.weededAt)
                )}.`;
            }
        }
        
        else if (weedingMonths.indexOf(currentMonth + 1) >= 0) {
            weedingReport.status = "info";
            weedingReport.month = months[currentMonth];
            weedingReport.message =
                `Próximo mês de limpeza é de ${months[currentMonth]}`
            weedingReport.lastWeedingAt = "Nenhuma";
        } 
        else {
            weedingReport.status = 'warning';
            weedingReport.month = months[currentMonth - 1];
            weedingReport.message = `Nenhuma limpeza feita até este mês de ${months[currentMonth - 1]}`;
        }

        normalizedReport.push(weedingReport);

    }
    return normalizedReport;
}


//  --------------------------- Start pruning report -------------------------------

export const checkPruning = (report, farmland)=>{


    const normalizedReport = [];

    if (report && report.length === 0) {
      for (let i = 0; i < farmland?.divisions.length; i++) {
        let pruningReport = {
          sowingYear: farmland.divisions[i].sowingYear,
          status: "info",
          message: `Nunca foi monitorada desde o dia do registo (${normalizeDate(farmland.divisions[i].createdAt)})`,
        };

        normalizedReport.push(pruningReport);
      }

      return normalizedReport;
    }

    // const divisions = [];

    for (let i = 0; i < report?.length; i++) {

        let foundDivision = farmland?.divisions.find(
            (division) => division._id === report[i].division );
        let sowingYear = foundDivision.sowingYear;

        let pruningReport = {
          sowingYear,
          trees: foundDivision.trees,
        };

       

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
            pruningReport.totallyPrunedTrees = calculatePercentage(sanitationPruning.totallyPrunedTrees, pruningReport.trees);
            pruningReport.partiallyPrunedTrees = calculatePercentage(sanitationPruning.partiallyPrunedTrees, pruningReport.trees);
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
            pruningReport.message = `Nunca foi monitorada desde o dia do registo (${normalizeDate(
              farmland.divisions[i].createdAt
            )})`;

            normalizedReport.push(pruningReport);
          }
        } 
        else {
          pruningReport.status = "info";
          pruningReport.message = `Nunca foi monitorada desde o dia do registo (${normalizeDate(
            farmland.divisions[i].createdAt
          )})`;

          normalizedReport.push(pruningReport);
        }
           
            
    }
        // console.log("report ", normalizedReport);
    return normalizedReport;
}




//  --------------------------- Start disease report -------------------------------

export const checkDisease = (report, farmland)=>{


    const normalizedReport = [];

    if (report && report.length === 0) {
      for (let i = 0; i < farmland?.divisions.length; i++) {
        let pruningReport = {
          sowingYear: farmland.divisions[i].sowingYear,
          status: "info",
          message: `Nunca foi monitorada desde o dia do registo (${normalizeDate(farmland.divisions[i].createdAt)})`,
        };

        normalizedReport.push(pruningReport);
      }

      return normalizedReport;
    }

    // const divisions = [];

    for (let i = 0; i < report?.length; i++) {

        let sowingYear = farmland?.divisions.find(
            (division) => division._id === report[i].division
        ).sowingYear;

        let diseaseReport = {
            sowingYear,

        }

       

        if (
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

        //   let renewalPruning = lastMonitoringRound(
        //     report[i]?.pruning?.rounds.filter(
        //       (round) => round.pruningType === "Poda de rejuvenescimento"
        //     ),
        //     "pruning"
        //   );

        //   let maintenancePruning = lastMonitoringRound(
        //     report[i]?.pruning?.rounds.filter(
        //       (round) => round.pruningType === "Poda de manutenção"
        //     ),
        //     "pruning"
        //   );

          if (oidio) {
            // check for any formation pruning within the last 2 year
            // check for any sanitation pruning within the last 2 year

            // diseaseReport.diseaseName = oidio.diseaseName;
            // diseaseReport.detectedAt = new Date(diseaseReport.detectedAt);
            // diseaseReport.status =
            //   new Date().getFullYear() -
            //     new Date(sanitationPruning.prunedAt).getFullYear() ===
            //   0
            //     ? "success"
            //     : new Date().getFullYear() -
            //         new Date(sanitationPruning.prunedAt).getFullYear() ===
            //       1
            //     ? "info"
            //     : new Date().getFullYear() -
            //         new Date(sanitationPruning.prunedAt).getFullYear() ===
            //       2
            //     ? "warning"
            //     : "error";

            // pruningReport.message =
            //   new Date().getFullYear() -
            //     new Date(sanitationPruning.prunedAt).getFullYear() ===
            //   0
            //     ? `Foi feita uma ${sanitationPruning.pruningType.toLowerCase()} há menos de um ano (${normalizeDate(
            //         new Date(sanitationPruning.prunedAt)
            //       )}).`
            //     : new Date().getFullYear() -
            //         new Date(sanitationPruning.prunedAt).getFullYear() ===
            //       1
            //     ? `É recomendado fazer uma ${sanitationPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
            //         new Date(sanitationPruning.prunedAt)
            //       )}.`
            //     : new Date().getFullYear() -
            //         new Date(sanitationPruning.prunedAt).getFullYear() ===
            //       2
            //     ? `É necessário fazer ${sanitationPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
            //         new Date(sanitationPruning.prunedAt)
            //       )}.`
            //     : `Não foi feita nenhuma ${sanitationPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
            //         new Date(sanitationPruning.prunedAt)
            //       )}.`;

            // normalizedReport.push(pruningReport);
          } else if (antracnose) {
            // pruningReport.pruningType = formationPruning.pruningType;
            // pruningReport.prunedAt = new Date(formationPruning.prunedAt);
            // pruningReport.status =
            //   new Date().getFullYear() -
            //     new Date(formationPruning.prunedAt).getFullYear() ===
            //   0
            //     ? "success"
            //     : new Date().getFullYear() -
            //         new Date(formationPruning.prunedAt).getFullYear() ===
            //       1
            //     ? "info"
            //     : new Date().getFullYear() -
            //         new Date(formationPruning.prunedAt).getFullYear() ===
            //       2
            //     ? "warning"
            //     : "error";

            // pruningReport.message =
            //   new Date().getFullYear() -
            //     new Date(formationPruning.prunedAt).getFullYear() ===
            //   0
            //     ? `Foi feita uma ${formationPruning.pruningType.toLowerCase()} há menos de um ano (${normalizeDate(
            //         new Date(formationPruning.prunedAt)
            //       )}).`
            //     : new Date().getFullYear() -
            //         new Date(formationPruning.prunedAt).getFullYear() ===
            //       1
            //     ? `É recomendado fazer uma ${formationPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
            //         new Date(formationPruning.prunedAt)
            //       )}.`
            //     : new Date().getFullYear() -
            //         new Date(formationPruning.prunedAt).getFullYear() ===
            //       2
            //     ? `É necessário fazer uma ${formationPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
            //         new Date(formationPruning.prunedAt)
            //       )}.`
            //     : `Não foi feita nenhuma ${formationPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
            //         new Date(formationPruning.prunedAt)
            //       )}.`;

            // normalizedReport.push(pruningReport);
        //   } else if (renewalPruning) {
            // pruningReport.pruningType = renewalPruning.pruningType;
            // pruningReport.prunedAt = new Date(renewalPruning.prunedAt);
            // pruningReport.status =
            //   new Date().getFullYear() -
            //     new Date(renewalPruning.prunedAt).getFullYear() ===
            //   0
            //     ? "success"
            //     : new Date().getFullYear() -
            //         new Date(renewalPruning.prunedAt).getFullYear() ===
            //       1
            //     ? "info"
            //     : new Date().getFullYear() -
            //         new Date(renewalPruning.prunedAt).getFullYear() ===
            //       2
            //     ? "warning"
            //     : "error";

            // pruningReport.message =
            //   new Date().getFullYear() -
            //     new Date(renewalPruning.prunedAt).getFullYear() ===
            //   0
            //     ? `Foi feita uma ${renewalPruning.pruningType.toLowerCase()} há menos de um ano (${normalizeDate(
            //         new Date(renewalPruning.prunedAt)
            //       )}).`
            //     : new Date().getFullYear() -
            //         new Date(renewalPruning.prunedAt).getFullYear() ===
            //       1
            //     ? `É recomendado fazer uma ${renewalPruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
            //         new Date(renewalPruning.prunedAt)
            //       )}.`
            //     : new Date().getFullYear() -
            //         new Date(renewalPruning.prunedAt).getFullYear() ===
            //       2
            //     ? `É necessário fazer uma ${renewalPruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
            //         new Date(renewalPruning.prunedAt)
            //       )}.`
            //     : `Não foi feita nenhuma ${renewalPruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
            //         new Date(renewalPruning.prunedAt)
            //       )}.`;

            // normalizedReport.push(pruningReport);
        //   } else if (maintenancePruning) {
            // pruningReport.pruningType = maintenancePruning.pruningType;
            // pruningReport.prunedAt = new Date(maintenancePruning.prunedAt);
            // pruningReport.status =
            //   new Date().getFullYear() -
            //     new Date(maintenancePruning.prunedAt).getFullYear() ===
            //   0
            //     ? "success"
            //     : new Date().getFullYear() -
            //         new Date(maintenancePruning.prunedAt).getFullYear() ===
            //       1
            //     ? "info"
            //     : new Date().getFullYear() -
            //         new Date(maintenancePruning.prunedAt).getFullYear() ===
            //       2
            //     ? "warning"
            //     : "error";

            // pruningReport.message =
            //   new Date().getFullYear() -
            //     new Date(maintenancePruning.prunedAt).getFullYear() ===
            //   0
            //     ? `Foi feita uma ${maintenancePruning.pruningType.toLowerCase()} há menos de um ano (${normalizeDate(
            //         new Date(maintenancePruning.prunedAt)
            //       )}).`
            //     : new Date().getFullYear() -
            //         new Date(maintenancePruning.prunedAt).getFullYear() ===
            //       1
            //     ? `É recomendado fazer uma ${maintenancePruning.pruningType.toLowerCase()} nos próximos meses, porque a última ocorreu em ${normalizeDate(
            //         new Date(maintenancePruning.prunedAt)
            //       )}.`
            //     : new Date().getFullYear() -
            //         new Date(maintenancePruning.prunedAt).getFullYear() ===
            //       2
            //     ? `É necessário fazer uma ${maintenancePruning.pruningType.toLowerCase()}, porque a última ocorreu em ${normalizeDate(
            //         new Date(maintenancePruning.prunedAt)
            //       )}.`
            //     : `Não foi feita nenhuma ${maintenancePruning.pruningType.toLowerCase()} há mais de 2 anos, porque a última ocorreu em ${normalizeDate(
            //         new Date(maintenancePruning.prunedAt)
            //       )}.`;

            // normalizedReport.push(pruningReport);
        //   } else {
            // pruningReport.status = "info";
            // pruningReport.message = `Nunca foi monitorada desde o dia do registo (${normalizeDate(
            //   farmland.divisions[i].createdAt
            // )})`;

            // normalizedReport.push(pruningReport);
          }
        } 
        else {
        //   pruningReport.status = "info";
        //   pruningReport.message = `Nunca foi monitorada desde o dia do registo (${normalizeDate(
        //     farmland.divisions[i].createdAt
        //   )})`;

        //   normalizedReport.push(pruningReport);
        }
           
            
    }
        // console.log("report ", normalizedReport);
    return normalizedReport;
}





//  --------------------------- Start harvest report -------------------------------

export const checkHarvest = (report, farmland)=>{


    const normalizedReport = [];

    // if (report && report.length === 0) {
      for (let i = 0; i < farmland?.divisions.length; i++) {
        let pruningReport = {
          sowingYear: farmland.divisions[i].sowingYear,
          status: "info",
          message:
            `Monitoria de colheita de castanha e pêra de caju só a partir de ${months[9]}`,
        };

        normalizedReport.push(pruningReport);
      }

      return normalizedReport;
    // }

}
