/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL=import.meta.env.VITE_API_URL;
  

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/transactions`);
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
      const { data } = await axios.post(`${API_URL}/api/transactions`, transaction);
      setTransactions([data, ...transactions]);
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`);
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
