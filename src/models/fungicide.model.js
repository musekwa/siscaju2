import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const fungicidesSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    name: { type: String },
    treatedTrees: Number,
    applicationNumber: {
      type: String,
      default: "primeira",
      enum: {
        values: ["primeira", "segunda", "terceira", "quarta", "quinta"],
        message: ["Esta aplicação não é recomendada!"],
      },
    },
    appliedAt: Date,
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

const Fungicide = mongoose.model("Fungicide", fungicidesSchema);

export default Fungicide;
