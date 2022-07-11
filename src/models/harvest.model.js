import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const harvestsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    productiveTrees: Number,
    appleQuantity: Number,
    nutQuantity: Number,
    harvestedAt: Date,
    controlledAt: { type: Date, default: Date.now },
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

const Harvest = mongoose.model("Harvest", harvestsSchema);

export default Harvest;
