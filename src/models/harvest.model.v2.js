import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const harvestsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    rounds: [
      {
        productiveTrees: Number,
        appleQuantity: Number,
        nutQuantity: Number,
        harvestedAt: Date,
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
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Harvest2 = mongoose.model("Harvest2", harvestsSchema);

export default Harvest2;
