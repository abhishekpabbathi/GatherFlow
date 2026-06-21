const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"]
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: "Enter a valid 10-digit Indian mobile number (starts with 6–9)"
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    validate: {
      validator: function (v) {
        if (!v || v === "") return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      },
      message: "Enter a valid email address"
    }
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    minlength: [3, "Enter a real location name (at least 3 characters)"]
  },
  visitType: {
    type: String,
    enum: ["First-time", "Less than 10 times", "Many times"],
    required: [true, "Visit type is required"]
  },
  interestLevel: {
    type: String,
    enum: ["Very Excited", "Interested", "Just Exploring"],
    required: [true, "Interest level is required"]
  },
  updateChannel: {
    type: String,
    enum: ["Email", "SMS", "WhatsApp", "All"],
    default: "All"
  },
  registrationId: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function () {
  if (!this.registrationId) {
    const count = await mongoose.model("User").countDocuments();
    this.registrationId = String(count + 1).padStart(10, "0");
  }
});

module.exports = mongoose.model("User", userSchema);