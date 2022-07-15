import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const applicationsSchema = mongoose.Schema({
  treatedTrees: Number,
  applicationNumber: {
    type: String,
    enum: {
      values: ["primeira", "segunda", "terceira", "quarta"],
      message: ["Esta aplicação não é recomendada!"],
    },
  },
  insecticideDose: Number, // in g/l
  appliedAt: Date,
}, { timestamps: true });



const insecticidesSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    insecticideName: { type: String },
    application: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    division: {
      type: ObjectId,
      // ref: "FarmDivision",
    },
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
  { timestamps: true }
);

const Insecticide = mongoose.model("Insecticide", insecticidesSchema);
const Application = mongoose.model("Application", applicationsSchema);

export {
Insecticide,
Application,
} 
