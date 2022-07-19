

export const confirmationQuestions = {
  diseases: "Detectou-se algumas doenças nesta unidade de produção",
  plagues: "Detectou-se algumas pragas nesta unidade de produção",
  pruning: "Realizou-se alguma poda de cajueiros nesta unidade de produção",
  weeding: {
    question: `Dos ${totalTrees} cajueiros, 
                ${totallyCleanedTrees} estão totalmente limpos, 
                ${partiallyCleanedTrees} estão totalmente limpos e
                ${partiallyCleanedTrees} estão totalmente limpos e  `,
    totalTrees: 0,
    totallyCleanedTrees: 0,
    partiallyCleanedTrees: 0,
  },
  insecticides: "Aplicou-se algumas insecticidas nesta unidade de produção",
  fungicides: "Aplicou-se algumas fungicidas nesta unidade de produção",
  harvest: "Colheu-se alguma quantidade de caju desta unidade de produção",
};