import { ThemeProvider } from 'next-themes'
import PropTypes from 'prop-types'

function ThemeWrapper({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ThemeWrapper