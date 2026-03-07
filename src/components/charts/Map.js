// ==================== MAP COMPONENT ====================
// A modern, responsive map component for displaying data visually
// Version: 1.0 - Initial release

import 'leaflet/dist/leaflet.css'
import { Map as ReactMap, TileLayer } from 'react-leaflet'
import { useTheme } from '../../hooks/useTheme'
import { getThemeClasses } from '../../shared/constants/theme'

const Map = ({ data, options }) => {
  const theme = useTheme()
  const themeClasses = getThemeClasses(theme.isDarkMode)

  return (
    <div className={`${themeClasses.background} ${themeClasses.surface} rounded-lg shadow-sm`}>
      <ReactMap center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </ReactMap>
    </div>
  )
}

export default Map
