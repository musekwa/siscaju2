import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

const weedingRecommendationsSchema = mongoose.Schema(
  {
  year: {
    type: Number,
    default: function () {
      return new Date().getFullYear();
    },
  },
  rounds: [{
    
  }],
  rounds: [
    {
      start: Date, // date when the division was weeded
      end: Date, // estimated next weeding date
      score: { 
        type: Number, 
        enum: {
          values: [25, 50, 75, 100],
        }
      },
      status: {
        type: String,
        enum: {
          values: ['unstarted', 'valid', 'toBeExpired', 'expired']
        }
      },
      message: { type: String, default: "void" }
    },
  ],
  classification: {
      // classification after end date
      type: String,
      enum: {
        values: ["bad", "average", "good", "better"],
        message: "{VALUE} estado invalido",
      },
    },
  division: {
    type: ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{ timestamps: true });

const WeedingRecommendation = mongoose.model("WeedingRecommendation", weedingRecommendationsSchema);




const recommendationsSchema = mongoose.Schema(
  {
    year: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
    },
    disease: {
        type: Schema.Types.ObjectId,
        ref: "DiseaseRecommendation",
      },
    
    plague: {
        type: Schema.Types.ObjectId,
        ref: "PlagueRecommendation",
      },
    weeding: {
        type: Schema.Types.ObjectId,
        ref: "WeedingRecommendation",
      },
    pruning: {
        type: Schema.Types.ObjectId,
        ref: "PruningRecommendation",
      },

    insecticide: {
        type: Schema.Types.ObjectId,
        ref: "InsecticideRecommendation",
      },
    fungicide: {
        type: Schema.Types.ObjectId,
        ref: "FungicideRecommendation",
      },
    harvest:  {
        type: Schema.Types.ObjectId,
        ref: "HarvestRecommendation",
      },
    division: {
      type: ObjectId,
      // ref: "FarmDivision",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // user: {
    //   fullname: String,
    //   email: String,
    //   phone: String,
    // },
  },
  { timestamps: true }
);

const Recommendation = mongoose.model("Recommendation", recommendationsSchema);

export { Recommendation, WeedingRecommendation, }; 
