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
    production: [
      {
        type: Schema.Types.ObjectId,
        ref: "Production",
      },
    ],
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

const Harvest = mongoose.model("Harvest", harvestsSchema);

export default Harvest;
