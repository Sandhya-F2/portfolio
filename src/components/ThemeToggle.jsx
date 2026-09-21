import { useTheme } from '../context/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun" aria-hidden="true"></i>
      ) : (
        <i className="fas fa-moon" aria-hidden="true"></i>
      )}
    </button>
  )
}
