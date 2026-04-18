export const generateStatusColor = (status: string) => {
  if (status === "Applied") {
    return "rgb(95, 202, 255)";
  }
  if (status === "Offer") {
    return "rgb(162, 255, 95)";
  }
  if (status === "Rejected") {
    return " rgb(255, 100, 100)";
  }
  if (status === "Interview") {
    return "rgb(255, 248, 111)";
  }
};
