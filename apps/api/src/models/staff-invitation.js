import mongoose from "mongoose";

const staffInvitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
      type: String,
      enum: ["Admin", "Staff"],
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
    acceptedAt: {
      type: Date,
      default: null,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StaffAccount",
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  },
);

staffInvitationSchema.index({ tokenHash: 1 }, { unique: true });
staffInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const StaffInvitation =
  mongoose.models.StaffInvitation ??
  mongoose.model("StaffInvitation", staffInvitationSchema);
