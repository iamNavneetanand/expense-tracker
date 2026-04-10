import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

function ViewTransactions() {
  const { incomes, expenses } = useGlobalContext();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const allTransactions = [...incomes, ...expenses];

  const filtered = allTransactions.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchType =
      type === "all" ? true : item.type === type;

    return matchSearch && matchType;
  });

  return (
    <Wrapper>
      <h1>View Transactions</h1>

      {/* 🔥 Premium Search + Filter */}
      <div className="filter-container">
        <div className="search-box">
          <span className="icon">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* 🔥 Minimal Transaction List */}
      <div className="list">
        {filtered.map((item) => (
          <div key={item._id} className="row">
            <div className="left">
              <h3>{item.title}</h3>
              <p>{item.category}</p>
            </div>

            <div
              className={
                item.type === "expense"
                  ? "amount expense"
                  : "amount income"
              }
            >
              {item.type === "expense" ? "-" : "+"}₹
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

export default ViewTransactions;

const Wrapper = styled.div`
  h1 {
    margin-bottom: 1.2rem;
    font-weight: 600;
  }

  /* ⭐ Premium Filter UI */
  .filter-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    position: relative;
  }

  .search-box input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.5rem;
    border-radius: 14px;
    border: none;
    outline: none;
    font-size: 14px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(12px);
    transition: 0.3s;
  }

  .search-box input:focus {
    background: rgba(255,255,255,0.3);
  }

  .icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
  }

  select {
    padding: 0.85rem 1rem;
    border-radius: 14px;
    border: none;
    font-size: 14px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(12px);
    cursor: pointer;
    transition: 0.3s;
  }

  select:hover {
    background: rgba(255,255,255,0.3);
  }

  /* ⭐ Minimal List */
  .list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.9rem 1rem;
    border-radius: 10px;
    background: #fcf6f9;
    transition: 0.2s;
  }

  .row:hover {
    background: #f3edf5;
  }

  .left h3 {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .left p {
    font-size: 0.8rem;
    color: #777;
  }

  .amount {
    font-weight: 600;
  }

  .income {
    color: #00c853;
  }

  .expense {
    color: #ff1744;
  }
`;
