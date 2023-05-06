const mongoose = require('mongoose');

const pdfRequestCountSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  requestCount: { type: Number, default: 0 },
});

const PdfRequestCount = mongoose.model('PdfRequestCount', pdfRequestCountSchema);

module.exports = PdfRequestCount;
