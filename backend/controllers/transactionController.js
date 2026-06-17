import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;
    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      date,
      description
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await transaction.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
