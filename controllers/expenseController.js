import { Expense } from "../models/Expense.js";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandlerClass.js";

export const createExp = expressAsyncHandler(async (req, res, next) => {
  const { title, description, amount } = req.body;

  try {
    const expense = await Expense.create({
      title,
      description,
      amount,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

//get all incomes

export const fetchAllExp = expressAsyncHandler(async (req, res, next) => {

  const {page}=req.query
 
    const expenses = await Expense.paginate({},{limit:10,page,populate:'user'});

    let totalExpenseValue=0;

    expenses.docs.forEach(expense=>totalExpenseValue+=expense.amount)

    res.status(200).json({
      success: true,
      totalExpenseValue,
      expenses,
    });
  
});

// get single income

export const fetchSingleExp = expressAsyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return next(new ErrorHandler("Invalid ID", 400));
  res.status(200).json({
    success: true,
    expense,
  });
});

// update and delete income

export const updateExp = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { title, amount, description } = req.body;

  const expensePresent = await Expense.findById(id);

  if (!expensePresent) return next(new ErrorHandler("Invalid ID", 400));

  const expense = await Expense.findByIdAndUpdate(
    id,
    { title, amount, description },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    expense,
  });
});

export const deleteExp = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;

  const expensePresent = await Expense.findById(id);

  if (!expensePresent) return next(new ErrorHandler("Invalid ID", 400));

  const expense = await Expense.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});
