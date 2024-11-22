export const formatPopulation = (population: number): string => {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  }
  if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
};

export const getCostLabel = (cost: number): string => {
  if (cost >= 8) return "Very Expensive";
  if (cost >= 6) return "Expensive";
  if (cost >= 4) return "Moderate";
  return "Affordable";
};

export const getTransitLabel = (transit: number): string => {
  if (transit >= 8) return "Excellent";
  if (transit >= 6) return "Good";
  if (transit >= 4) return "Fair";
  return "Limited";
};

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Define time intervals
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Check each interval
  if (seconds < intervals.minute) {
    return "just now";
  }

  if (seconds < intervals.hour) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes}m ago`;
  }

  if (seconds < intervals.day) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours}h ago`;
  }

  if (seconds < intervals.week) {
    const days = Math.floor(seconds / intervals.day);
    return `${days}d ago`;
  }

  if (seconds < intervals.month) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks}w ago`;
  }

  if (seconds < intervals.year) {
    const months = Math.floor(seconds / intervals.month);
    return `${months}mo ago`;
  }

  const years = Math.floor(seconds / intervals.year);
  return `${years}y ago`;
};
