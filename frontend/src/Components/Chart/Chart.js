import React from 'react'
import { Chart as ChartJs, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

function Chart() {
  const { incomes, expenses } = useGlobalContext()

  const labels = incomes.map((inc) => dateFormat(inc.date))

  // 🔥 Ferrilat Premium Gradient Chart
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomes.map(i => i.amount),
        borderColor: '#7b2ff7',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );

          gradient.addColorStop(0, 'rgba(123,47,247,0.8)');
          gradient.addColorStop(1, 'rgba(123,47,247,0.05)');

          return gradient;
        },
        fill: true,
        tension: 0.5,
        pointRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 3,
        pointBorderColor: '#7b2ff7',
      },

      // Optional: expense wave (can remove if you want only 1 wave)
      {
        label: 'Expense',
        data: expenses.map(e => e.amount),
        borderColor: '#ff4d6d',
        backgroundColor: 'rgba(255,77,109,0.08)',
        tension: 0.5,
        pointRadius: 5,
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#7b2ff7',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa' }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.05)'
        },
        ticks: { color: '#aaa' }
      }
    }
  }

  return (
    <ChartStyled>
      <Line data={data} options={options} />
    </ChartStyled>
  )
}

const ChartStyled = styled.div`
  background: linear-gradient(135deg, #2b1055, #6a00f4);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  height: 100%;
`;

export default Chart