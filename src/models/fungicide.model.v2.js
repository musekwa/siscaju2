import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const fungicidesSchema = mongoose.Schema(
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
        fungicideName: { type: String, trim: true },
        treatedTrees: Number,
        applicationNumber: { type: String, trim: true },
        dose: String,
        appliedAt: Date,
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
      // ref: "FarmDivision",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Fungicide2 = mongoose.model("Fungicide2", fungicidesSchema);

export default Fungicide2;
