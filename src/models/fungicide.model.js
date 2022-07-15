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
    fungicideName: { type: String },
    application: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pesticide",
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

const Fungicide = mongoose.model("Fungicide", fungicidesSchema);

export default Fungicide;
