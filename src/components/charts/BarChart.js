// ==================== BAR CHART COMPONENT ====================
// A modern, responsive bar chart component for displaying data visually
// Version: 1.0 - Initial release

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { getThemeClasses } from '../../shared/constants/theme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({ data, options }) => {
  const theme = useTheme()
  const themeClasses = getThemeClasses(theme.isDarkMode)

  return (
    <div className={`${themeClasses.background} ${themeClasses.surface} rounded-lg shadow-sm`}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default BarChart
