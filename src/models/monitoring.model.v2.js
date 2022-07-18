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
    disease: {
        type: Schema.Types.ObjectId,
        ref: "Disease2",
    },
    plague: {
        type: Schema.Types.ObjectId,
        ref: "Plague2",
    },
    weeding: {
        type: Schema.Types.ObjectId,
        ref: "Weeding2",
    },
    pruning:
      {
        type: Schema.Types.ObjectId,
        ref: "Pruning2",
      },

    insecticide: {
        type: Schema.Types.ObjectId,
        ref: "Insecticide2",
    },
    fungicide: {
        type: Schema.Types.ObjectId,
        ref: "Fungicide2",
    },
    harvest: {
        type: Schema.Types.ObjectId,
        ref: "Harvest2",
    },
    division: {
      type: ObjectId,
      // ref: "FarmDivision",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

const Monitoring2 = mongoose.model("Monitoring2", monitoringsSchema);

export default Monitoring2;
