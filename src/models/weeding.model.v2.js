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
    rounds: [
      {
        weedingType: { type: String, trim: true },
        totallyCleanedTrees: Number,
        partiallyCleanedTrees: Number,
        weededAt: Date,
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

const Weeding2 = mongoose.model("Weeding2", weedingsSchema);

export default Weeding2;
