import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

function Transactions() {
  const { incomes, expenses, getIncomes, getExpenses } = useGlobalContext();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  const allTransactions = [...incomes, ...expenses];

  const filtered = allTransactions.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Wrapper>
      <h1>View Transactions</h1>

      {/* 🔥 SEARCH */}
      <div className="search">
        <input
          placeholder="Search transaction..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔥 TRANSACTION LIST */}
      <div className="list">
        {filtered.map((item) => (
          <div className="card" key={item._id}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.category}</p>
            </div>

            <span className={item.type}>
              {item.type === "expense" ? "-" : "+"}₹{item.amount}
            </span>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

export default Transactions;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .search input {
    padding: 12px;
    border-radius: 10px;
    border: none;
    width: 100%;
    font-size: 16px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card {
    background: linear-gradient(135deg, #2b1055, #6a00f4);
    color: white;
    padding: 15px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
  }

  .income {
    color: #00ffae;
  }

  .expense {
    color: #ff1744;
  }
`;