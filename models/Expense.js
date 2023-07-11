import mongoose from "mongoose";
import pagination from "mongoose-paginate-v2"

const expenseSchema = mongoose.Schema(
  {
    title: {
      required: [true, "Title is required"],
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    type: {
      type: String,
      default: "expense",
    },
    amount: {
      required: [true, "Amount is required"],
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
    toJSON:{
      virtual:true,
    },
    toObject:{
      virtual:true,
    }
  }
);

expenseSchema.plugin(pagination)

export const Expense = mongoose.model("Expense", expenseSchema);
