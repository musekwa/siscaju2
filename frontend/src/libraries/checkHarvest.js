import { months } from "../app/months";

//  --------------------------- Start harvest report -------------------------------

export const checkHarvest = (report, farmland) => {
  const normalizedReport = [];
  const harvestMonths = [10, 11, 12, 1, 2];

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
