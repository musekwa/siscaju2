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
    pruningType: {
      type: String,
      enum: {
        values: [
          "Poda de formação",
          "Poda de sanitação",
          "Poda de manutenção",
          "Poda de rejuvenescimento",
        ],
        message: ["Este tipo de poda não é recomendado!"],
      },
    },
    prunedTrees: Number,
    prunedAt: { type: Date },
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

const Pruning = mongoose.model("Pruning", pruningsSchema);

export default Pruning;
