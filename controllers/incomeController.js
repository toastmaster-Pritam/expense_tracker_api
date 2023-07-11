import { Income } from "../models/Income.js";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandlerClass.js";

export const createInc = expressAsyncHandler(async (req, res, next) => {
  const { title, description, amount } = req.body;

  try {
    const income = await Income.create({
      title,
      description,
      amount,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      income,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

//get all incomes

export const fetchAllInc = expressAsyncHandler(async (req, res, next) => {
  const { page } = req.query;

  const incomes = await Income.paginate({}, { limit: 10, page,populate:"user" });
  let totalIncomeValue = 0;
  incomes.docs.forEach((income) => (totalIncomeValue += income.amount));
  res.status(200).json({
    success: true,
    totalIncomeValue,
    incomes,
  });
});

// get single income

export const fetchSingleInc = expressAsyncHandler(async (req, res, next) => {
  const income = await Income.findById(req.params.id);
  if (!income) return next(new ErrorHandler("Invalid ID", 400));
  res.status(200).json({
    success: true,
    income,
  });
});

// update and delete income

export const updateIncome = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;
  const { title, amount, description } = req.body;

  const incomePresent = await Income.findById(id);

  if (!incomePresent) return next(new ErrorHandler("Invalid ID", 400));

  const income = await Income.findByIdAndUpdate(
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
    message: "Income updated successfully",
    income,
  });
});

export const deleteIncome = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.params;

  const incomePresent = await Income.findById(id);

  if (!incomePresent) return next(new ErrorHandler("Invalid ID", 400));

  const income = await Income.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Income deleted successfully",
  });
});
