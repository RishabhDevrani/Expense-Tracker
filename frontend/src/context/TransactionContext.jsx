/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://expense-tracker-9d3r.onrender.com/api/transactions');
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTransactions();
    }
  }, [fetchTransactions, user]);

  const addTransaction = async (transaction) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/transactions', transaction);
      setTransactions([data, ...transactions]);
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, addTransaction, deleteTransaction, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
