const mongoose = require("mongoose");

const DownloadSchema = new mongoose.Schema({
  filename: {
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

const Downloads = mongoose.model('Downloads', DownloadSchema);

module.exports = Downloads;