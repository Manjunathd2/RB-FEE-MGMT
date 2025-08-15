const FeeCategory = require('../models/FeeCategory');
const FeeStructure = require('../models/FeeStructure');

// --- Fee Categories ---

exports.getFeeCategories = async (req, res) => {
  try {
    const categories = await FeeCategory.find({ isActive: true });
    categories.sort((a, b) => a.name.localeCompare(b.name));
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFeeCategory = async (req, res) => {
  try {
    const category = await FeeCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFeeCategory = async (req, res) => {
  try {
    const category = await FeeCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Fee category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFeeCategory = async (req, res) => {
  try {
    const category = await FeeCategory.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Fee category not found' });
    }
    res.json({ message: 'Fee category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Fee Structures ---

exports.getFeeStructures = async (req, res) => {
  try {
    let structures = await FeeStructure.find({ isActive: true }).populate('feeTypes.categoryId');
    structures.sort((a, b) => a.class.localeCompare(b.class));
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.create(req.body);
    const populatedStructure = await structure.populate('feeTypes.categoryId').execPopulate?.() || await FeeStructure.findById(structure._id).populate('feeTypes.categoryId');
    res.status(201).json(populatedStructure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('feeTypes.categoryId');
    if (!structure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }
    res.json(structure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFeeStructure = async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!structure) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }
    res.json({ message: 'Fee structure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
