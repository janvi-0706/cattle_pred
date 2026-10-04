export const cattleBreeds = [
  {
    id: 1, name: "Gir", type: "Cattle", origin: "Gujarat",
    description: "Known as the 'milk queen' of Indian zebu cattle. Highly heat-tolerant with distinctive convex forehead.",
    milk: 2800, dailyMilk: 8.5, fat: 4.5, snf: 8.5, protein: 3.2, lactose: 4.8,
    lactationDays: 330, feedReq: 15, color: "Reddish-brown with white spots", emoji: "🐄",
  },
  {
    id: 2, name: "Sahiwal", type: "Cattle", origin: "Punjab",
    description: "Best indigenous dairy breed of India, renowned for high milk yield and docile temperament.",
    milk: 2200, dailyMilk: 7.0, fat: 4.5, snf: 8.5, protein: 3.1, lactose: 4.7,
    lactationDays: 315, feedReq: 14, color: "Reddish-brown", emoji: "🐄",
  },
  {
    id: 3, name: "Tharparkar", type: "Cattle", origin: "Rajasthan",
    description: "Dual-purpose breed well-adapted to arid desert conditions with good milk yield.",
    milk: 1500, dailyMilk: 5.0, fat: 4.2, snf: 8.3, protein: 3.0, lactose: 4.6,
    lactationDays: 300, feedReq: 12, color: "White to grey", emoji: "🐄",
  },
  {
    id: 4, name: "Red Sindhi", type: "Cattle", origin: "Sindh Region",
    description: "Excellent dairy breed with high heat and disease resistance. Popular across tropical regions.",
    milk: 2000, dailyMilk: 6.5, fat: 4.8, snf: 8.6, protein: 3.3, lactose: 4.8,
    lactationDays: 308, feedReq: 13, color: "Deep red to reddish-brown", emoji: "🐄",
  },
  {
    id: 5, name: "Kankrej", type: "Cattle", origin: "Gujarat",
    description: "Strong draft breed with moderate milk production, known for distinctive lyre-shaped horns.",
    milk: 1200, dailyMilk: 4.0, fat: 4.3, snf: 8.4, protein: 3.0, lactose: 4.7,
    lactationDays: 300, feedReq: 12, color: "Silver grey", emoji: "🐄",
  },
  {
    id: 6, name: "Hariana", type: "Cattle", origin: "Haryana",
    description: "Medium-sized dual-purpose breed well-adapted to north Indian plains.",
    milk: 1400, dailyMilk: 4.5, fat: 4.1, snf: 8.2, protein: 2.9, lactose: 4.6,
    lactationDays: 312, feedReq: 12, color: "White", emoji: "🐄",
  },
];

export const buffaloBreeds = [
  {
    id: 7, name: "Murrah", type: "Buffalo", origin: "Haryana / Punjab",
    description: "World's best milk-producing buffalo breed. Recognized for highest fat-corrected milk yield.",
    milk: 2500, dailyMilk: 8.0, fat: 7.5, snf: 9.8, protein: 4.2, lactose: 5.0,
    lactationDays: 313, feedReq: 18, color: "Jet black", emoji: "🐃",
  },
  {
    id: 8, name: "Nili-Ravi", type: "Buffalo", origin: "Punjab",
    description: "High-yielding dual-purpose buffalo breed with excellent milk quality and large body size.",
    milk: 2800, dailyMilk: 9.0, fat: 7.0, snf: 9.5, protein: 4.0, lactose: 5.1,
    lactationDays: 311, feedReq: 19, color: "Black with white markings", emoji: "🐃",
  },
  {
    id: 9, name: "Jaffarabadi", type: "Buffalo", origin: "Gujarat",
    description: "Heaviest Indian buffalo breed renowned for very high fat content milk.",
    milk: 2000, dailyMilk: 6.5, fat: 8.0, snf: 10.0, protein: 4.5, lactose: 4.9,
    lactationDays: 308, feedReq: 20, color: "Black", emoji: "🐃",
  },
  {
    id: 10, name: "Surti", type: "Buffalo", origin: "Gujarat",
    description: "Medium-sized breed with good milk production and high fat content, popular in Gujarat.",
    milk: 1400, dailyMilk: 4.5, fat: 7.5, snf: 9.8, protein: 4.2, lactose: 5.0,
    lactationDays: 310, feedReq: 16, color: "Rusty brown to black", emoji: "🐃",
  },
  {
    id: 11, name: "Bhadawari", type: "Buffalo", origin: "Uttar Pradesh",
    description: "Compact breed known for highest fat content milk in India, often above 8%.",
    milk: 1000, dailyMilk: 3.5, fat: 8.0, snf: 10.0, protein: 4.5, lactose: 4.8,
    lactationDays: 286, feedReq: 15, color: "Copper to reddish-brown", emoji: "🐃",
  },
  {
    id: 12, name: "Pandharpuri", type: "Buffalo", origin: "Maharashtra",
    description: "Long-horned buffalo breed from Maharashtra with good milk yield and strong constitution.",
    milk: 1800, dailyMilk: 6.0, fat: 7.8, snf: 9.9, protein: 4.3, lactose: 4.9,
    lactationDays: 300, feedReq: 17, color: "Black", emoji: "🐃",
  },
];

export const allBreeds = [...cattleBreeds, ...buffaloBreeds];

export const mockDetectionPool = [
  { breed: cattleBreeds[0], confidence: 94 },
  { breed: cattleBreeds[1], confidence: 89 },
  { breed: cattleBreeds[2], confidence: 91 },
  { breed: cattleBreeds[3], confidence: 87 },
  { breed: buffaloBreeds[0], confidence: 96 },
  { breed: buffaloBreeds[1], confidence: 92 },
  { breed: buffaloBreeds[2], confidence: 88 },
  { breed: buffaloBreeds[3], confidence: 85 },
];

export const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];
