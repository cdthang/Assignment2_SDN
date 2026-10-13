const mongoose = require("mongoose");
const Book = require("../models/Book");

const getAllBooks = async (req, res) => {
  try {
    const Books = await Book.find();

   res.json(Books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const books = Array.isArray(req.body) ? req.body : [req.body];

    if (books.length === 0 || books.some((book) => !book || typeof book !== "object" || Array.isArray(book))) {
      return res.status(400).json({ message: "Request body must contain a book or an array of books." });
    }

    const normalizedBooks = books.map((book) => ({
      ...book,
      _id: book._id && typeof book._id === "object" ? book._id.$oid : book._id,
    }));
    const createdBooks = await Book.insertMany(normalizedBooks);

    return res.status(201).json(createdBooks);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(book);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;


    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({ message: "Book deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
