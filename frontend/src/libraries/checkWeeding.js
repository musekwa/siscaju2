import { calculatePercentage, normalizeDate, lastMonitoringRound, calculateTotal  } from ".";
import { months } from "../app/months";

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
      trees: report[i].trees,
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
};
