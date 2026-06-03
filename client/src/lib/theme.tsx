import {
  createContext, useContext, useState, useEffect,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme:    Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeCtx>({
  theme:    'dark',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  // On mount: read the value the anti-FOUC script already set, or localStorage
  useEffect(() => {
    const attr  = document.documentElement.getAttribute('data-theme')
    const saved = localStorage.getItem('habityn-theme')
    const initial =
      (attr === 'light' || attr === 'dark')   ? attr  :
      (saved === 'light' || saved === 'dark') ? saved :
      window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    setTheme(initial as Theme)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('habityn-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
