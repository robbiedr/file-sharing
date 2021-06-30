const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  publicKey: {
    type: String,
    required: true,
    trim: true,
  },
  privateKey: {
    type: String,
    required: true,
    trim: true,
  },
  mimetype: {
    type: String,
    required: true,
    trim: true,
  },
  path: {
    type: String,
    required: true,
    trim: true,
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Files = mongoose.model('Files', FileSchema);

module.exports = Files;