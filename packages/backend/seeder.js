const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Customer = require("./models/Customer");

// Load .env from root
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Sai", "Arjun",
  "Rohan", "Ishaan", "Shaurya", "Krishna", "Om",
  "Ananya", "Saanvi", "Diya", "Aditi", "Isha",
  "Kavya", "Meera", "Sneha", "Pooja", "Priya",
  "Lakshmi", "Rajesh", "Suresh", "Neha", "Varun",
  "Manish", "Deepa", "Sunita", "Kiran", "Ritu"
];

const lastNames = [
  "Sharma", "Patel", "Gupta", "Verma", "Reddy",
  "Singh", "Kumar", "Joshi", "Chaturvedi", "Tripathi",
  "Shukla", "Agarwal", "Mehta", "Jain", "Choudhary",
  "Iyer", "Nair", "Das", "Mukherjee", "Bhattacharya"
];

function getRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate Indian mobile number starting with 7,8,9 + 9 random digits
function getIndianMobileNumber() {
  const firstDigit = ['7', '8', '9'][Math.floor(Math.random() * 3)];
  let number = firstDigit;
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
}

const seedCustomers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing customers
    await Customer.deleteMany();

    // Add your own customer first
    const myCustomer = {
      name: "Dhananjay Borse",
      contact: "9876543210",
      energyNeeds: 2500,
      type: "residential",
    };

    // Generate 29 fake customers
    const fakeCustomers = Array.from({ length: 29 }).map(() => ({
      name: getRandomName(),
      contact: getIndianMobileNumber(),
      energyNeeds: faker.number.int({ min: 100, max: 5000 }),
      type: faker.helpers.arrayElement(["residential", "commercial"]),
    }));

    await Customer.insertMany([myCustomer, ...fakeCustomers]);

    console.log("Fake customers with Indian names and mobile numbers added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedCustomers();
