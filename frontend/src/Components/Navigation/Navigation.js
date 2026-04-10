import React, { useState } from "react";
import styled from "styled-components";
import avatar from "../../img/avatar.png";
import { signout } from "../../utils/Icons";
import { useAuth } from "../../context/authContext";

function Navigation({ active, setActive }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (num) => {
    setActive(num);
    setMenuOpen(false);
  };

  return (
    <NavigationStyled menuOpen={menuOpen}>
      <div className="nav-header">
        {/* ⭐ Profile Section */}
        <div className="user-con">
          <img src={avatar} alt="user" />
          <div className="text">
            <h2>Budget Wise</h2>
          </div>
        </div>

        {/* ⭐ Hamburger for mobile */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ⭐ Menu */}
      <ul className="menu-items">
        <li onClick={() => handleNav(1)} className={active === 1 ? "menu-item active" : "menu-item"}>
          Dashboard
        </li>
        <li onClick={() => handleNav(2)} className={active === 2 ? "menu-item active" : "menu-item"}>
          View Transactions
        </li>
        <li onClick={() => handleNav(3)} className={active === 3 ? "menu-item active" : "menu-item"}>
          Incomes
        </li>
        <li onClick={() => handleNav(4)} className={active === 4 ? "menu-item active" : "menu-item"}>
          Expenses
        </li>
      </ul>

      {/* ⭐ Sign Out */}
      <div className="bottom-nav">
        <button onClick={logout}>
          {signout} Sign Out
        </button>
      </div>
    </NavigationStyled>
  );
}

const NavigationStyled = styled.div`
  padding: 2rem 1.5rem;
  width: 270px;
  height: 100%;
  background: linear-gradient(145deg, #2b1055, #6a00f4);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .user-con {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.3);
    }

    .text h2 {
      color: white;
      font-weight: 600;
      letter-spacing: 1px;
      font-size: 1.3rem;
      margin: 0;
    }

    p {
      opacity: 0.7;
      font-size: 0.9rem;
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .menu-item {
    list-style: none;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      transform: translateX(5px);
    }
  }

  .active {
    background: linear-gradient(90deg, #7b2ff7, #f107a3);
    color: #fff;
    font-weight: bold;
  }

  .bottom-nav {
    margin-top: 2rem;

    button {
      width: 100%;
      padding: 0.8rem;
      border: none;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover {
        background: #ff1744;
      }
    }
  }

  /* ===== MOBILE ===== */
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-radius: 20px;
    padding: 1rem 1.5rem;

    .hamburger {
      display: block;
      margin-bottom: 1.5rem;
    }

    .user-con {
      margin-bottom: 0;

      img { width: 45px; height: 45px; }
      .text h2 { font-size: 1.1rem; }
    }

    .menu-items {
      display: ${({ menuOpen }) => menuOpen ? 'flex' : 'none'};
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .bottom-nav {
      display: ${({ menuOpen }) => menuOpen ? 'block' : 'none'};
      margin-top: 1rem;
    }
  }
`;

export default Navigation;