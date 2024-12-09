// Convert country names to ISO 3166-1 alpha-2 country codes
export function getCountryCode(countryName: string): string | null {
  const countryMap: { [key: string]: string } = {
    "United States": "US",
    "United Kingdom": "GB",
    Canada: "CA",
    Australia: "AU",
    Germany: "DE",
    France: "FR",
    Italy: "IT",
    Spain: "ES",
    Japan: "JP",
    China: "CN",
    India: "IN",
    Brazil: "BR",
    Mexico: "MX",
    Russia: "RU",
    "South Korea": "KR",
    Netherlands: "NL",
    Sweden: "SE",
    Norway: "NO",
    Denmark: "DK",
    Finland: "FI",
    Switzerland: "CH",
    Austria: "AT",
    Belgium: "BE",
    Portugal: "PT",
    Greece: "GR",
    Ireland: "IE",
    "New Zealand": "NZ",
    Singapore: "SG",
    "Czech Republic": "CZ",
    // Add more countries as needed
  };

  return countryMap[countryName] || null;
}
