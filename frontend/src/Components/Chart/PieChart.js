import React from "react";
import { Pie } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const { totalIncome, totalExpenses, totalBalance } = useGlobalContext();

  const data = {
    labels: ["Income", "Expense", "Balance"],
    datasets: [
      {
        data: [
          totalIncome(),
          totalExpenses(),
          totalBalance(),
        ],
        backgroundColor: [
          "#00ffae",
          "#ff4d6d",
          "#7b2ff7",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          padding: 15,
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <StyledPie>
      <h2 className="heading">Financial Overview</h2>
      <Pie data={data} options={options} />
    </StyledPie>
  );
}

export default PieChart;

const StyledPie = styled.div`
  background: linear-gradient(135deg, #2b1055, #6a00f4);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);

  .heading {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #6a00f4, #b721ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;