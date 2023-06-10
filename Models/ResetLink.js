const mongoose = require("mongoose");

/**
 * ResetLinkSchema
 */
const ResetLinkSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
    },
    email: {
      type: String,
    },
    expire: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * ResetLink Model
 */
ResetLink = new mongoose.model("ResetLink", ResetLinkSchema);

/**
 * Export ResetLink Model
 */
module.exports = ResetLink;
