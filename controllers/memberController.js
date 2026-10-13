const mongoose = require("mongoose");
const Member = require("../models/Member");

const normalizeId = (id) =>
  id && typeof id === "object" && "$oid" in id ? id.$oid : id;

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();

    res.json(members);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const members = Array.isArray(req.body) ? req.body : [req.body];

    if (members.length === 0 || members.some((member) => !member || typeof member !== "object" || Array.isArray(member))) {
      return res.status(400).json({ message: "Request body must contain a member or an array of members." });
    }

    const normalizedMembers = members.map((member) => ({
      ...member,
      _id: normalizeId(member._id),
    }));
    const createdMembers = await Member.insertMany(normalizedMembers);

    return res.status(201).json(createdMembers);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Member ID" });
    }

    const member = await Member.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json(member);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Member ID" });
    }

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json({ message: "Member deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
