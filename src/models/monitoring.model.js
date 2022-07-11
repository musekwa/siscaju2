import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const monitoringsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    disease: [
      {
        type: Schema.Types.ObjectId,
        ref: "Disease",
      },
    ],
    plague: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plague",
      },
    ],
    weeding: [
      {
        type: Schema.Types.ObjectId,
        ref: "Weeding",
      },
    ],
    pruning: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pruning",
      },
    ],

    insecticide: [
      // against plagues
      {
        type: Schema.Types.ObjectId,
        ref: "Insecticide",
      },
    ],
    fungicide: [
      // against diseases
      {
        type: Schema.Types.ObjectId,
        ref: "Fungicide",
      },
    ],
    harvest: [
      {
        type: Schema.Types.ObjectId,
        ref: "Harvest",
      },
    ],
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

const Monitoring = mongoose.model("Monitoring", monitoringsSchema);

export default Monitoring;
