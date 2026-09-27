/**
 * Arcade Gamestore - Global Store Configuration
 * Modify this file to update store phone numbers, WhatsApp, or guarantees.
 */

const STORE_CONFIG = {
  storeName: "Arcade Gamestore",
  // Payment number for bKash & Nagad Send Money
  paymentNumber: "01687279529",
  // WhatsApp order submission and contact support (International format for wa.me)
  whatsappNumber: "8801305365568",
  deliveryGuarantee: "Every order will be clear within 24h guaranteed ⚡",
  currency: "৳",
  methods: ["bKash", "Nagad"],
  twoStepTutorialUrl: "https://www.youtube.com/watch?v=nWbPEaIoIM0"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORE_CONFIG };
}
