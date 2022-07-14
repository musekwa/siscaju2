import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const diseasesSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    name: { type: String, trim: true },
    higherSeverity: Number,
    highSeverity: Number,
    averageSeverity: Number,
    lowSeverity: Number,
    detectedAt: Date,
    division: {
      type: ObjectId,
      // ref: "FarmDivision",
    },
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Disease = mongoose.model("Disease", diseasesSchema);

export default Disease;
