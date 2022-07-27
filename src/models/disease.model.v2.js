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
    rounds: [
      {
        diseaseName: { type: String, trim: true },
        higherSeverity: Number,
        highSeverity: Number,
        averageSeverity: Number,
        lowSeverity: Number,
        detectedAt: Date,
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
    ],
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

const Disease2 = mongoose.model("Disease2", diseasesSchema);

export default Disease2;
