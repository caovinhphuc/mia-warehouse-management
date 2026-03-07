/**
 * Re-export useTheme from App (ThemeContext)
 * Dùng cho charts, widgets, components cần isDarkMode / themeClasses
 *
 * Cách dùng:
 * const { isDarkMode, themeClasses, toggleTheme } = useTheme()
 */
export { useTheme } from '../App'
