import React from 'react'
import { Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)

function MonthlyExpenseChart() {
  const { expenses } = useGlobalContext()

  // 🧠 Group expenses month-wise
  const monthData = {}

  expenses.forEach((exp) => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short' })
    monthData[month] = (monthData[month] || 0) + exp.amount
  })

  const labels = Object.keys(monthData)
  const values = Object.values(monthData)

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Spending',
        data: values,
        borderColor: '#ff4d6d',
        backgroundColor: (context) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return null

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          )

          gradient.addColorStop(0, 'rgba(255,77,109,0.7)')
          gradient.addColorStop(1, 'rgba(255,77,109,0.05)')

          return gradient
        },
        fill: true,
        tension: 0.5,
        pointRadius: 5,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ff4d6d',
        pointBorderWidth: 3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ff4d6d',
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#aaa' }
      }
    }
  }

  return (
    <Styled>
      <h3>Monthly Spending</h3>
      <Line data={data} options={options} />
    </Styled>
  )
}

const Styled = styled.div`
  background: linear-gradient(135deg, #2b1055, #6a00f4);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
`;

export default MonthlyExpenseChart