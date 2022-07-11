import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const weedingsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },

    totallyCleanedTrees: Number,
    partiallyCleanedTrees: Number,
    weededAt: Date,
    controlCount: {
      type: Number,
      default: 0,
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

const Weeding = mongoose.model("Weeding", weedingsSchema);

export default Weeding;
