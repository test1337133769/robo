/**
 * Arcade Gamestore - Products & Store Configuration
 */

const STORE_CONFIG = {
  storeName: "Arcade Gamestore",
  paymentNumber: "01687279529",
  whatsappNumber: "8801305365568", // International format for wa.me link
  deliveryGuarantee: "Delivery in the same day you order ⚡",
  currency: "৳",
  methods: ["bKash", "Nagad"]
};

const PRODUCTS = [
  // ◼️ Robux In-App (Fully Safe)
  {
    id: "inapp-40",
    name: "40 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 40,
    price: 80,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-80",
    name: "80 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 80,
    price: 120,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-120",
    name: "120 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 120,
    price: 200,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-160",
    name: "160 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 160,
    price: 240,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-200",
    name: "200 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 200,
    price: 320,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-240",
    name: "240 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 240,
    price: 350,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-400",
    name: "400 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 400,
    price: 599,
    badge: "Hot Choice",
    badgeType: "hot",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: true
  },
  {
    id: "inapp-800",
    name: "800 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 800,
    price: 1199,
    badge: "Best Seller 🔥",
    badgeType: "best",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: true
  },
  {
    id: "inapp-1200",
    name: "1,200 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 1200,
    price: 1799,
    badge: "100% Safe",
    badgeType: "safe",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: false
  },
  {
    id: "inapp-1700",
    name: "1,700 Robux (In-App)",
    category: "inapp",
    categoryLabel: "Robux In-App",
    robux: 1700,
    price: 2399,
    badge: "Mega Value 👑",
    badgeType: "mega",
    deliveryType: "Official Store Purchase",
    requirements: "Login Required (Username + Password)",
    icon: "gem",
    popular: true
  },

  // 🌟 Roblox Plus
  {
    id: "roblox-plus",
    name: "Roblox Plus Subscription",
    category: "special",
    categoryLabel: "Special Offer",
    robux: null,
    price: 699,
    badge: "🌟 Special Perk",
    badgeType: "star",
    deliveryType: "Official Store Activation",
    requirements: "Login Required (Username + Password)",
    icon: "crown",
    popular: true
  },

  // ◼️ Robux Web (95% Safe 🔥) (1৳ = 1 Robux | Min buy 500)
  {
    id: "web-500",
    name: "500 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 500,
    price: 500,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | Min 500 Buy",
    icon: "zap",
    popular: true
  },
  {
    id: "web-1000",
    name: "1,000 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 1000,
    price: 1000,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | Instant Queue",
    icon: "zap",
    popular: true
  },
  {
    id: "web-2000",
    name: "2,000 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 2000,
    price: 2000,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | Instant Queue",
    icon: "zap",
    popular: false
  },
  {
    id: "web-3000",
    name: "3,000 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 3000,
    price: 3000,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | High Speed",
    icon: "zap",
    popular: false
  },
  {
    id: "web-5000",
    name: "5,000 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 5000,
    price: 5000,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | VIP Speed",
    icon: "zap",
    popular: true
  },
  {
    id: "web-10000",
    name: "10,000 Robux (Web)",
    category: "web",
    categoryLabel: "Robux Web",
    robux: 10000,
    price: 10000,
    badge: "1৳ = 1 Robux 🔥",
    badgeType: "fire",
    deliveryType: "Super Fast Delivery",
    requirements: "95% Safe | Ultimate Pack",
    icon: "zap",
    popular: false
  },

  // ◼️ Global Gift Code (No Login Required)
  {
    id: "gift-800",
    name: "10$ / 800 Robux Gift Code",
    category: "gift",
    categoryLabel: "Global Gift Code",
    robux: 800,
    price: 1380,
    badge: "No Login Required 🛡️",
    badgeType: "shield",
    deliveryType: "Official Roblox Digital Code",
    requirements: "100% Safe • Delivered on WhatsApp",
    icon: "gift",
    popular: true
  },
  {
    id: "gift-2000",
    name: "25$ / 2,000 Robux Gift Code",
    category: "gift",
    categoryLabel: "Global Gift Code",
    robux: 2000,
    price: 3250,
    badge: "No Login Required 🛡️",
    badgeType: "shield",
    deliveryType: "Official Roblox Digital Code",
    requirements: "100% Safe • Delivered on WhatsApp",
    icon: "gift",
    popular: true
  }
];

const RECENT_BUYERS = [
  { name: "Fahim", city: "Dhaka", item: "1,000 Robux (Web)", time: "2 min ago" },
  { name: "Tanvir", city: "Chittagong", item: "800 Robux In-App", time: "5 min ago" },
  { name: "Arafat", city: "Sylhet", item: "$10 Global Gift Code", time: "9 min ago" },
  { name: "Sakib", city: "Khulna", item: "2,000 Robux (Web)", time: "14 min ago" },
  { name: "Naim", city: "Rajshahi", item: "Roblox Plus", time: "18 min ago" },
  { name: "Rayhan", city: "Gazipur", item: "1,700 Robux In-App", time: "23 min ago" },
  { name: "Sabbir", city: "Barisal", item: "5,000 Robux (Web)", time: "30 min ago" }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORE_CONFIG, PRODUCTS, RECENT_BUYERS };
}
