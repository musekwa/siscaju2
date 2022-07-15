import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const plaguesSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    name: { type: String, trim: true },
    higherAttack: Number,
    highAttack: Number,
    averageAttack: Number,
    lowAttack: Number,
    detectedAt: {
      type: Date,
    },
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
    division: {
      type: ObjectId,
      // ref: "FarmDivision",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Plague = mongoose.model("Plague", plaguesSchema);

export default Plague;
