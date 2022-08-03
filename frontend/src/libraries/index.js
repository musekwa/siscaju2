import { months } from "../app/months";
// get the last registered weeding report for this division
export const lastMonitoringRound = (rounds) => {
  if (rounds && rounds?.length >= 1) {
    return rounds[rounds?.length - 1];
  }
  else {
    return;
  }
};

export const calculatePercentage = (number, total) => {
  return ((Number(number) * 100) / Number(total)).toFixed(1);
};

export const normalizeDate = (date) => {
  return (
    new Date(date).getDate() +
    "-" +
    months[new Date(date).getMonth()] +
    "-" +
    new Date(date).getFullYear()
  );
};

export const calculateTotal = (number, otherNumber) => {
  return Number(number) + Number(otherNumber);
};


export const sprayingMonths = [ 7, 8, 9];  // july, august and september
export const sprayingRounds = [1, 2, 3, 4] // primeira, segunda, terceira, intercalar


export const getNextRound = (applicationNumber, name, appliedAt, isNorth) => {
  if (
    (name === "Oídio" && isNorth) ||
    name === "Antracnose" ||
    name === "Queima" ||
    name === "Cochonilha"
  ) {
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
  } else if (name === "Oídio" && !isNorth) {
    let days = new Date(appliedAt).getDate() + 21;

    if (applicationNumber === "primeira") {
      return {
        nextApplication: "segunda",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 1,
      };
    } else if (applicationNumber === "segunda") {
      return {
        nextApplication: "intercalar",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 2,
      };
    } else if (applicationNumber === "intercalar") {
      return {
        nextApplication: "terceira",
        nextDate: new Date(new Date(appliedAt).setDate(days)),
        round: 3,
      };
    } 
    else if (applicationNumber === "terceira") {
      return {
        nextApplication: "Nenhuma",
        nextDate: null,
        round: 4,
      };
    }
  }
  else if (name === "Helopeltis ssp") {
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



  }
};



