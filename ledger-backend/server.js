import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const allowedOrigins = [
  "https://ledger-nu-one.vercel.app",
  "https://ledger-git-main-navneets-projects-9678f707.vercel.app",
  "https://ledger-dkq47mr9h-navneets-projects-9678f707.vercel.app",
  "http://localhost:5173", // for local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ---------------- DB Connection ----------------
// Use MONGO_URI from .env, with a local fallback for development
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ledgerDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log("DB Connected successfully"))
  .catch(err => console.log("DB Connection Error:", err));

// ---------------- Models ----------------
const personSchema = new mongoose.Schema({
  type: { type: String, enum: ["customer", "supplier"], required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["customer", "supplier"], required: true },
  personId: { type: mongoose.Schema.Types.ObjectId, ref: "Person", required: true },
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const Person = mongoose.model("Person", personSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// ---------------- Person API Routes ----------------
// Create customer/supplier
app.post("/api/person", async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all persons with their balance
app.get("/api/person", async (req, res) => {
  try {
    const persons = await Person.find().sort({ name: 1 });
    
    // Calculate balance for each person
    const personsWithBalance = await Promise.all(
      persons.map(async (person) => {
        const transactions = await Transaction.find({ personId: person._id });
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalPaid = transactions.reduce((sum, t) => sum + t.paid, 0);
        // Balance is how much money is outstanding (positive if money is owed to us/we owe them)
        const balance = totalAmount - totalPaid; 
        
        return {
          ...person.toObject(),
          balance,
          totalAmount,
          totalPaid
        };
      })
    );
    
    res.json(personsWithBalance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete person
app.delete("/api/person/:id", async (req, res) => {
  try {
    // Check if person has transactions
    const transactionCount = await Transaction.countDocuments({ personId: req.params.id });
    if (transactionCount > 0) {
      return res.status(400).json({ error: "Cannot delete person with existing transactions" });
    }
    
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------------- Transaction API Routes ----------------
// Add transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    const populated = await Transaction.findById(transaction._id).populate("personId");
    res.json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("personId")
      .sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get transactions for a specific person (Not used by the frontend yet, but useful)
app.get("/api/transactions/person/:personId", async (req, res) => {
  try {
    const data = await Transaction.find({ personId: req.params.personId })
      .populate("personId")
      .sort({ date: -1 });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add payment to transaction
app.put("/api/transactions/pay/:id", async (req, res) => {
  try {
    const { payAmount } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    const remaining = transaction.amount - transaction.paid;
    if (payAmount > remaining) {
      return res.status(400).json({ error: "Payment amount exceeds remaining balance" });
    }
    
    transaction.paid += payAmount;
    await transaction.save();
    
    const populated = await Transaction.findById(transaction._id).populate("personId");
    res.json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
