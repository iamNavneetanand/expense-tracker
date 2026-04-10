import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';
import PieChart from "../Chart/PieChart";

const DEFAULT_BUDGETS = {
  education: 5000,
  groceries: 8000,
  health: 3000,
  subscriptions: 2000,
  takeaways: 4000,
  clothing: 5000,
  travelling: 10000,
  other: 3000,
};

const CATEGORY_ICONS = {
  education: '📚',
  groceries: '🛒',
  health: '💊',
  subscriptions: '📺',
  takeaways: '🍔',
  clothing: '👗',
  travelling: '✈️',
  other: '💰',
};

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()

    const [budgets, setBudgets] = useState(() => {
        const saved = localStorage.getItem("budgetLimits");
        return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        getIncomes()
        getExpenses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ✅ This month vs last month spending
    const getSpendingSummary = () => {
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        let thisMonthTotal = 0;
        let lastMonthTotal = 0;
        const categoryTotals = {};

        expenses.forEach(exp => {
            const d = new Date(exp.date);
            if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
                thisMonthTotal += exp.amount;
                categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
            }
            if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) {
                lastMonthTotal += exp.amount;
            }
        });

        const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
        const change = lastMonthTotal === 0 ? 0 : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1);
        const isUp = thisMonthTotal >= lastMonthTotal;

        return { thisMonthTotal, lastMonthTotal, topCategory, change, isUp };
    };

    const summary = getSpendingSummary();

    const getMonthlySpending = () => {
        const now = new Date();
        const spending = {};
        expenses.forEach(exp => {
            const expDate = new Date(exp.date);
            if (expDate.getMonth() === now.getMonth() &&
                expDate.getFullYear() === now.getFullYear()) {
                spending[exp.category] = (spending[exp.category] || 0) + exp.amount;
            }
        });
        return spending;
    };

    const monthlySpending = getMonthlySpending();

    const exportToCSV = () => {
        const allTransactions = [
            ...incomes.map(t => ({
                Date: new Date(t.createdAt).toLocaleDateString(),
                Title: t.title,
                Amount: t.amount,
                Type: 'Income',
                Category: t.category || 'N/A',
                Description: t.description || ''
            })),
            ...expenses.map(t => ({
                Date: new Date(t.createdAt).toLocaleDateString(),
                Title: t.title,
                Amount: -t.amount,
                Type: 'Expense',
                Category: t.category || 'N/A',
                Description: t.description || ''
            })),
        ];

        if (allTransactions.length === 0) return alert("No transactions to export!");

        allTransactions.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        const headers = ['Date', 'Title', 'Amount', 'Type', 'Category', 'Description'];
        const csvRows = [
            headers.join(','),
            ...allTransactions.map(row => headers.map(h => `"${row[h]}"`).join(','))
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BudgetWise_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleBudgetEdit = (category) => {
        setEditingCategory(category);
        setEditValue(budgets[category]);
    };

    const handleBudgetSave = (category) => {
        const updated = { ...budgets, [category]: Number(editValue) };
        setBudgets(updated);
        localStorage.setItem("budgetLimits", JSON.stringify(updated));
        setEditingCategory(null);
    };

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const thisMonthName = monthNames[now.getMonth()];
    const lastMonthName = monthNames[now.getMonth() === 0 ? 11 : now.getMonth() - 1];

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="header-row">
                    <h1>All Transactions</h1>
                    <button className="export-btn" onClick={exportToCSV}>
                        📥 Export to CSV
                    </button>
                </div>

                {/* ===== STAT CARDS ===== */}
                <div className="stat-cards">
                    <div className="card income">
                        <h2>Total Income</h2>
                        <p>{dollar} {totalIncome()}</p>
                    </div>
                    <div className="card balance">
                        <h2>Total Balance</h2>
                        <p>{dollar} {totalBalance()}</p>
                    </div>
                    <div className="card expense">
                        <h2>Total Expense</h2>
                        <p>{dollar} {totalExpenses()}</p>
                    </div>
                </div>

                {/* ===== SPENDING SUMMARY CARD ===== */}
                <div className="summary-section">
                    <div className="summary-card this-month">
                        <p className="summary-label">📅 {thisMonthName} Spending</p>
                        <p className="summary-amount">₹{summary.thisMonthTotal.toLocaleString()}</p>
                        <p className={`summary-change ${summary.isUp ? 'up' : 'down'}`}>
                            {summary.isUp ? '▲' : '▼'} {Math.abs(summary.change)}% vs {lastMonthName}
                        </p>
                    </div>

                    <div className="summary-card last-month">
                        <p className="summary-label">📅 {lastMonthName} Spending</p>
                        <p className="summary-amount">₹{summary.lastMonthTotal.toLocaleString()}</p>
                        <p className="summary-sub">Previous month</p>
                    </div>

                    <div className="summary-card top-category">
                        <p className="summary-label">🏆 Top Category</p>
                        <p className="summary-amount">
                            {summary.topCategory
                                ? `${CATEGORY_ICONS[summary.topCategory[0]]} ${summary.topCategory[0].charAt(0).toUpperCase() + summary.topCategory[0].slice(1)}`
                                : 'No data'}
                        </p>
                        <p className="summary-sub">
                            {summary.topCategory ? `₹${summary.topCategory[1].toLocaleString()} spent` : ''}
                        </p>
                    </div>

                    <div className="summary-card savings">
                        <p className="summary-label">💰 This Month Savings</p>
                        <p className="summary-amount" style={{color: totalIncome() - summary.thisMonthTotal >= 0 ? '#00ffae' : '#ff4d6d'}}>
                            ₹{(totalIncome() - summary.thisMonthTotal).toLocaleString()}
                        </p>
                        <p className="summary-sub">Income - this month expenses</p>
                    </div>
                </div>

                {/* ===== BUDGET TRACKER FULL WIDTH ===== */}
                <div className="budget-section">
                    <h2 className="budget-heading">🎯 Monthly Budget</h2>
                    <div className="budget-grid">
                        {Object.keys(budgets).map(category => {
                            const spent = monthlySpending[category] || 0;
                            const limit = budgets[category];
                            const percent = Math.min((spent / limit) * 100, 100);
                            const isOver = spent >= limit;
                            const isWarning = percent >= 80 && !isOver;

                            return (
                                <div key={category} className="budget-card">
                                    <div className="budget-item-header">
                                        <span className="category-label">
                                            {CATEGORY_ICONS[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                            {isOver && <span className="badge over">Over!</span>}
                                            {isWarning && <span className="badge warning">⚠️</span>}
                                        </div>
                                    </div>

                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${percent}%`,
                                                background: isOver
                                                    ? '#ff1744'
                                                    : isWarning
                                                    ? '#ff9800'
                                                    : 'linear-gradient(135deg, #6a00f4, #b721ff)'
                                            }}
                                        />
                                    </div>

                                    <div className="budget-amounts">
                                        <span>₹{spent} spent</span>
                                        {editingCategory === category ? (
                                            <div className="edit-row">
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleBudgetSave(category)}>✅</button>
                                                <button onClick={() => setEditingCategory(null)}>❌</button>
                                            </div>
                                        ) : (
                                            <span className="limit-label" onClick={() => handleBudgetEdit(category)}>
                                                ₹{limit} limit ✏️
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== BOTTOM: CHART + RIGHT SIDE ===== */}
                <div className="bottom-con">
                    <div className="chart-con">
                        <Chart />
                    </div>
                    <div className="right-con">
                        <History />
                        <div className="pie-section">
                            <PieChart />
                        </div>
                    </div>
                </div>

            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`

    .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .export-btn {
        background: linear-gradient(135deg, #6a00f4, #b721ff);
        color: white;
        border: none;
        padding: 0.7rem 1.5rem;
        border-radius: 30px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0px 4px 15px rgba(106, 0, 244, 0.3);
        transition: all 0.2s ease;
        &:hover { opacity: 0.85; transform: translateY(-2px); }
    }

    /* ===== STAT CARDS ===== */
    .stat-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin: 1.5rem 0;
    }

    .card {
    border-radius: 20px;
    padding: 1.2rem 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    
    h2 { 
        color: white;   /* ✅ THIS is what you need */
        font-size: 1rem; 
        font-weight: 600; 
        opacity: 0.85; 
        margin-bottom: 0.5rem; 
    }

    p { 
        font-size: 2rem; 
        font-weight: 700; 
    }
}

    .card.income {
    background: linear-gradient(135deg, #2b1055, #6a00f4);
    color: white;

    p { color: #00ffae; }
}

.card.balance {
    background: linear-gradient(135deg, #6a00f4, #b721ff);
    color: white;

    p { color: white; font-size: 2.2rem; }
}

.card.expense {
    background: linear-gradient(135deg, #2b1055, #6a00f4);
    color: white;

    p { color: #ff4d6d; }
}

    /* ===== SPENDING SUMMARY ===== */
    .summary-section {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .summary-card {
        background: linear-gradient(135deg, #2b1055, #6a00f4);
        border-radius: 20px;
        padding: 1.2rem 1.5rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    .summary-label {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.6);
        font-weight: 600;
    }

    .summary-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }

    .summary-sub {
        font-size: 0.78rem;
        color: rgba(255,255,255,0.5);
    }

    .summary-change {
        font-size: 0.85rem;
        font-weight: 700;
    }

    .summary-change.up { color: #ff4d6d; }
    .summary-change.down { color: #00ffae; }

    /* ===== BOTTOM LAYOUT ===== */
    .bottom-con {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 2rem;
        margin-top: 1rem;
    }

    .chart-con {
        background: linear-gradient(135deg, #2b1055, #6a00f4);
        border-radius: 20px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        height: 350px;
    }

    .right-con {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .pie-section { background: transparent; }

    /* ===== BUDGET TRACKER ===== */
    .budget-section {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .budget-heading {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6a00f4, #b721ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 1.2rem;
    }

    .budget-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.2rem;
    }

    .budget-card {
        background: linear-gradient(135deg, #2b1055, #6a00f4);
        border-radius: 16px;
        padding: 1.2rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .budget-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .category-label {
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .budget-amounts {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.7);
    }

    .limit-label {
        cursor: pointer;
        color: rgba(255,255,255,0.6);
        &:hover { color: #b721ff; }
    }

    .badge {
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 20px;
    }

    .badge.over { background: #ff1744; color: white; }
    .badge.warning { background: #ff9800; color: white; }

    .progress-bar-bg {
        background: rgba(255,255,255,0.15);
        border-radius: 10px;
        height: 6px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        border-radius: 10px;
        transition: width 0.5s ease;
    }

    .edit-row {
        display: flex;
        gap: 4px;
        align-items: center;
        input {
            width: 65px;
            padding: 2px 6px;
            border-radius: 6px;
            border: none;
            font-size: 0.78rem;
        }
        button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 0.8rem;
        }
    }
`;

export default Dashboard;