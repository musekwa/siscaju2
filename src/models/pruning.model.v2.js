import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const pruningsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    rounds: [
      {
        pruningType: { type: String, trim: true },
        partiallyPrunedTrees: Number,
        totallyPrunedTrees: Number,
        prunedAt: { type: Date },
        user: {
          fullname: String,
          email: String,
          phone: String,
        },
        createdAt: {
          type: Date,
          default: function () {
            return new Date().getFullYear();
          },
        },
      },
    ],
    division: {
      type: ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Pruning2 = mongoose.model("Pruning2", pruningsSchema);

export default Pruning2;
