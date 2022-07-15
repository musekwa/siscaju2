
import mongoose from "mongoose";


const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const pesticidesSchema = mongoose.Schema(
  {
    treatedTrees: Number,
    applicationNumber: {
      type: String,
    },
    dose: Number, // in g/l
    appliedAt: Date,
    user: {
      fullname: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

const Pesticide = mongoose.model("Pesticide", pesticidesSchema);

export default Pesticide; 