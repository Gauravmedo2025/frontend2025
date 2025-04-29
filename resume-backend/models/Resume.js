const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  education: String,
  experience: String,
  skills: [String],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
