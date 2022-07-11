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

    cleanTrees: Number,
    weededAt: {
      type: Date,
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

const Weeding = mongoose.model("Weeding", weedingsSchema);

export default Weeding;
