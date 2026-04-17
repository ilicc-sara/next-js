export const generateStatusColor = (status: string) => {
  if (status === "Applied") {
    return "blue";
  }
  if (status === "Offer") {
    return "green";
  }
  if (status === "Rejected") {
    return "red";
  }
  if (status === "Interview") {
    return "yellow";
  }
};
