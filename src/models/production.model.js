import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const productionsSchema = mongoose.Schema({
  productiveTrees: Number,
  appleQuantity: Number,
  nutQuantity: Number,
  harvestedAt: Date,
  year: { type: Number, default: new Date().getFullYear(), },
  user: {
    fullname: String,
    email: String,
    phone: String,
  },
});

const Production = mongoose.model("Production", productionsSchema);

export default Production;