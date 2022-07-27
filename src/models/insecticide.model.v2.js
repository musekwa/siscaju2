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
    rounds: [
      {
        plagueName: { type: String, trim: true },
        insecticideName: { type: String, trim: true },
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
          default: Date.now,
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

const Insecticide2 = mongoose.model("Insecticide2", insecticidesSchema);
// const Application = mongoose.model("Application", applicationsSchema);

// export {
// Insecticide,
// Application,
// }

export default Insecticide2;
