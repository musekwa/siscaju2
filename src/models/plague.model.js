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
    trees: {
      higherSeverity: Number,
      highSeverity: Number,
      averageSeverity: Number,
      lowSeverity: Number,
      noSeverity: Number,
    },
    controlledAt: {
      type: Date,
      default: Date.now,
    },

    division: {
      type: ObjectId,
      ref: "FarmDivision",
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
