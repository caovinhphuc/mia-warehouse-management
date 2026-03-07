// ==================== PIE CHART COMPONENT ====================
// A modern, responsive pie chart component for displaying data visually
// Version: 1.0 - Initial release

import { Pie } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { getThemeClasses } from '../../shared/constants/theme'

const PieChart = ({ data, options }) => {
  const theme = useTheme()
  const themeClasses = getThemeClasses(theme.isDarkMode)

  return (
    <div className={`${themeClasses.background} ${themeClasses.surface} rounded-lg shadow-sm`}>
      <Pie data={data} options={options} />
    </div>
  )
}

export default PieChart
