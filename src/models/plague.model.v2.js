import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const plaguesSchema = mongoose.Schema(
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
        higherAttack: Number,
        highAttack: Number,
        averageAttack: Number,
        lowAttack: Number,
        detectedAt: {
          type: Date,
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
    ],
    division: {
      type: ObjectId,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Plague2 = mongoose.model("Plague2", plaguesSchema);

export default Plague2;
