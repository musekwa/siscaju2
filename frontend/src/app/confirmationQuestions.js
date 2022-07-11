

export const confirmationQuestions = {
  diseases: "Detectou-se algumas doenças nesta divisão",
  plagues: "Detectou-se algumas pragas nesta divisão",
  pruning: "Realizou-se alguma poda de cajueiros nesta divisão",
  weeding: {
    question: `Dos ${totalTrees} cajueiros, 
                ${totallyCleanedTrees} estão totalmente limpos, 
                ${partiallyCleanedTrees} estão totalmente limpos e
                ${partiallyCleanedTrees} estão totalmente limpos e  `,
    totalTrees: 0,
    totallyCleanedTrees: 0,
    partiallyCleanedTrees: 0,
  },
  insecticides: "Aplicou-se algumas insecticidas nesta divisão",
  fungicides: "Aplicou-se algumas fungicidas nesta divisão",
  harvest: "Colheu-se alguma quantidade de caju desta divisão",
};