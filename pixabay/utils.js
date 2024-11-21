// Utility function to normalize text (remove diacritics)
export const normalizeString = (str) => {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[-']/g, " ") // Replace hyphens and apostrophes with spaces
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove any remaining special characters
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Normalize multiple spaces to single space
};
