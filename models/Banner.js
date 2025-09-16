const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true }, // file path
    name: { type: String }, // original filename
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
