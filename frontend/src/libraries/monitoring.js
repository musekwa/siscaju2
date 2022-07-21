import { months } from '../app/months'

// get the last registered weeding report for this division
const lastWeedingRound = (rounds)=>{
    if (rounds && rounds?.length == 1) {
        return rounds[0];
    }
    else if (rounds && rounds?.length > 1){
        return rounds.sort((a, b)=>new Date(a.weededAt) - new Date(b.weededAt))[0];
    }
    else {
        return ;
    }
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

export const checkWeeding = (report, farmland)=>{
    
    const normalizedReport = [];

    if (report && report.length === 0) {
        for (let i = 0; i < farmland?.divisions.length; i++) {
            let weedingReport = {
              sowingYear: farmland.divisions[i].sowingYear,
              status: "info",
              message: "Esta unidade de produção nunca foi monitorada",
            };

            normalizedReport.push(weedingReport);

        }

        return normalizedReport;
        
    }

    const divisions = []

    for (let i = 0; i < report?.length; i++) {

        let sowingYear = farmland?.divisions.find(division=>division._id === report[i].division).sowingYear;

        divisions.push({
            sowingYear,
            lastWeeding: 
                    (report[i]?.weeding?.rounds && report[i]?.weeding.rounds?.length > 0) 
                    ? lastWeedingRound(report[i]?.weeding?.rounds) 
                    : null,
        })
    }

   

    const weedingMonths = [ 1, 4, 7, 10 ];

    const currentMonth = new Date().getMonth() + 1;


    for( let i = 0; i < divisions?.length; i++){

        let weedingReport = {
            sowingYear: divisions[i].sowingYear,
        };

        let lastWeedingMonth;

        if (divisions[i].lastWeeding) {
            lastWeedingMonth = new Date(divisions[i].lastWeeding.weededAt).getMonth() + 1;
            weedingReport.lastWeedingAt = normalizeDate(new Date(divisions[i].lastWeeding.weededAt));

            if (
                weedingMonths.indexOf(lastWeedingMonth) >= 0 &&
                lastWeedingMonth === currentMonth
            ) {
                weedingReport.status = "success";
                weedingReport.month = months[currentMonth - 1];
                weedingReport.message =
                  `Limpeza foi feita no mês recomendado de ${months[currentMonth - 1]}.`;
            }
            else {
                weedingReport.status = "info";
                weedingReport.month = months[currentMonth - 1];
                weedingReport.message = `Última limpeza ocorreu em ${normalizeDate(
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