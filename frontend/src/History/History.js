import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History() {
    const { transactionHistory } = useGlobalContext()
    const history = transactionHistory()

    return (
        <HistoryStyled>
            <h2 className="heading">Recent Transactions</h2>

            <div className="history-list">
                {history.map((item) => {
                    const { _id, title, description, amount, type, createdAt } = item

                    // ✅ UPI transactions use description, others use title
                    const label = type === 'upi' ? description || 'UPI Payment' : title

                    return (
                        <div key={_id} className="history-item">
                            <div className="left">
                                <span className={`dot ${type}`}></span>

                                <div>
                                    <p className="title">
                                        {/* ✅ UPI badge */}
                                        {type === 'upi' && <span className="upi-badge">UPI</span>}
                                        {label}
                                    </p>
                                    <span className="date">
                                        {new Date(createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className={`amount ${type === 'upi' ? 'expense' : type}`}>
                                {type === 'income' ? '+' : '-'}₹{Math.abs(amount)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    height: 100%;

    .heading {
        font-weight: 700;
        font-size: 1.9rem;
        background: linear-gradient(135deg, #6a00f4, #b721ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 0.6px;
    }

    .history-list {
        background: linear-gradient(135deg, #2b1055, #6a00f4);
        padding: 1.3rem;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 360px;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    }

    .history-list::-webkit-scrollbar { width: 6px; }
    .history-list::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
    }

    .history-item {
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(12px);
        border-radius: 14px;
        padding: 16px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(255,255,255,0.15);
        transition: all 0.25s ease;
    }

    .history-item:hover {
        transform: translateY(-4px) scale(1.02);
        background: rgba(255,255,255,0.12);
    }

    .left {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .dot.income {
        background: linear-gradient(135deg, #00ffae, #00c853);
        box-shadow: 0 0 10px #00ffae;
    }

    .dot.expense {
        background: linear-gradient(135deg, #ff1744, #ff5252);
        box-shadow: 0 0 10px #ff1744;
    }

    /* ✅ UPI dot — purple */
    .dot.upi {
        background: linear-gradient(135deg, #6a00f4, #b721ff);
        box-shadow: 0 0 10px #b721ff;
    }

    .title {
        font-weight: 600;
        font-size: 1.05rem;
        color: white;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    /* ✅ UPI badge */
    .upi-badge {
        background: linear-gradient(135deg, #6a00f4, #b721ff);
        color: white;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 20px;
        letter-spacing: 0.5px;
    }

    .date {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.6);
    }

    .amount {
        font-weight: 700;
        font-size: 1.25rem;
        letter-spacing: 0.6px;
    }

    .income { color: #00ffae; }
    .expense { color: #ff4d6d; }
`;

export default History;