// Utility functions for dashboard
export const generateRandomStats = () => {
  return {
    reportsShared: Math.floor(Math.random() * 50) + 10,
    peopleHelped: Math.floor(Math.random() * 25) + 5,
    goalsAchieved: Math.floor(Math.random() * 15) + 3,
    daysStreak: Math.floor(Math.random() * 30) + 1,
  };
};

export const getRandomMotivationalQuote = () => {
  const quotes = [
    "You are braver than you believe, stronger than you seem, and smarter than you think!",
    "Every day is a fresh start. Make it count!",
    "Believe in yourself and all that you are.",
    "Your only limit is your mind.",
    "Dream big, work hard, stay focused.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are capable of amazing things!",
    "Progress, not perfection.",
    "Be yourself; everyone else is already taken.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getRandomFact = () => {
  const facts = [
    "A group of flamingos is called a 'flamboyance'! How cool is that?",
    "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
    "A group of owls is called a 'parliament'.",
    "Octopuses have three hearts and blue blood!",
    "Bananas are berries, but strawberries aren't!",
    "A group of pandas is called an 'embarrassment'.",
    "Butterflies taste with their feet!",
    "A group of rhinos is called a 'crash'.",
    "Sea otters hold hands when they sleep to keep from drifting apart!",
    "A group of pugs is called a 'grumble'.",
  ];
  return facts[Math.floor(Math.random() * facts.length)];
};

export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

export const getRandomColor = () => {
  const colors = [
    { name: "Happy Pink", color: "#ff69b4" },
    { name: "Calm Blue", color: "#4fc3f7" },
    { name: "Energetic Orange", color: "#ff9800" },
    { name: "Peaceful Green", color: "#66bb6a" },
    { name: "Creative Purple", color: "#ab47bc" },
    { name: "Sunny Yellow", color: "#ffeb3b" },
    { name: "Confident Red", color: "#f44336" },
    { name: "Balanced Teal", color: "#26a69a" },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
