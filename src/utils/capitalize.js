export const capitalizeEveryWord = (s) => {
  if (!s) return ""; // Return an empty string if input is falsy

  return s
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join the words back into a single string
};
