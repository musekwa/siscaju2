import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

// const applicationsSchema = mongoose.Schema({
//   treatedTrees: Number,
//   applicationNumber: {
//     type: String,
//   },
//   insecticideDose: Number, // in g/l
//   appliedAt: Date,
// }, { timestamps: true });



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

const Insecticide = mongoose.model("Insecticide", insecticidesSchema);
// const Application = mongoose.model("Application", applicationsSchema);

// export {
// Insecticide,
// Application,
// } 

export default Insecticide;
