const mongoose = require("mongoose");
const Loan = require("../models/Loan");

const normalizeId = (id) =>
  id && typeof id === "object" && "$oid" in id ? id.$oid : id;

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();

    res.json(loans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Loan ID" });
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json(loan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const loans = Array.isArray(req.body) ? req.body : [req.body];

    if (loans.length === 0 || loans.some((loan) => !loan || typeof loan !== "object" || Array.isArray(loan))) {
      return res.status(400).json({ message: "Request body must contain a loan or an array of loans." });
    }

    const normalizedLoans = loans.map((loan) => ({
      ...loan,
      _id: normalizeId(loan._id),
      member_id: normalizeId(loan.member_id),
      items: Array.isArray(loan.items)
        ? loan.items.map((item) => ({ ...item, book_id: normalizeId(item.book_id) }))
        : loan.items,
    }));
    const createdLoans = await Loan.insertMany(normalizedLoans);

    return res.status(201).json(createdLoans);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getAllLoans,
  getLoanById,
  createLoan
};
