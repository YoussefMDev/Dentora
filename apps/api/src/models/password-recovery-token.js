import mongoose from "mongoose";

const passwordRecoveryTokenSchema = new mongoose.Schema(
  {
    staffAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffAccount",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      minlength: 64,
      maxlength: 64,
      match: /^[a-f0-9]{64}$/,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  },
);

passwordRecoveryTokenSchema.index({ tokenHash: 1 }, { unique: true });
passwordRecoveryTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordRecoveryToken =
  mongoose.models.PasswordRecoveryToken ??
  mongoose.model("PasswordRecoveryToken", passwordRecoveryTokenSchema);
