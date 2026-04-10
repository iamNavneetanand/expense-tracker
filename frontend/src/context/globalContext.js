import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://expense-tracker-backend-36o7.onrender.com/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [upiTransactions, setUpiTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getIncomes();
    getExpenses();
    getUPITransactions();
  }, []);

  /* ===================== INCOME ===================== */

  const addIncome = async (income) => {
    try {
      await axios.post(`${BASE_URL}add-income`, income);
      getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding income");
    }
  };

  const getIncomes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}get-incomes`);
      setIncomes(response.data);
      setError(null); // ✅ clear error on success
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching incomes");
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-income/${id}`);
      getIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting income");
    }
  };

  const totalIncome = () => {
    return incomes.reduce((acc, income) => acc + income.amount, 0);
  };


  /* ===================== EXPENSE ===================== */

  const addExpense = async (expense) => {
    try {
      await axios.post(`${BASE_URL}add-expense`, expense);
      getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding expense");
    }
  };

  const getExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      setExpenses(response.data);
      setError(null); // ✅ clear error on success
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching expenses");
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}delete-expense/${id}`);
      getExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting expense");
    }
  };

  const totalExpenses = () => {
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };


  /* ===================== UPI ===================== */

  const getUPITransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}upi-transactions`);
      setUpiTransactions(response.data);
      setError(null);
    } catch (err) {
      console.log("UPI fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  /* ===================== BALANCE ===================== */

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };


  /* ===================== HISTORY ===================== */

  const transactionHistory = () => {
    const upiWithType = upiTransactions
      .filter(t => t.status === "success")
      .map(t => ({ ...t, type: "upi" }));

    const history = [...incomes, ...expenses, ...upiWithType];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };


  return (
    <GlobalContext.Provider
      value={{
        incomes,
        expenses,
        upiTransactions,
        error,
        loading,
        setError,

        addIncome,
        getIncomes,
        deleteIncome,
        totalIncome,

        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,

        getUPITransactions,
        totalBalance,
        transactionHistory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};