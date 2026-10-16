import mongoose from "mongoose";

const staffAccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: {
      type: String,
      required: true,
      maxlength: 255,
      match: /^\$argon2id\$/,
    },
    role: {
      type: String,
      enum: ["Admin", "Staff"],
      required: true,
    },
    emailVerifiedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  },
);

staffAccountSchema.index({ email: 1 }, { unique: true });

export const StaffAccount =
  mongoose.models.StaffAccount ??
  mongoose.model("StaffAccount", staffAccountSchema);
