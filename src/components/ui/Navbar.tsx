'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaCog, FaHome } from 'react-icons/fa'
import { useTheme } from './ThemeProvider'

const Navbar = () => {
  const pathname = usePathname()
  const { colorThemeClasses } = useTheme()
  
  return (
    <nav className="fixed top-4 right-4 bg-white dark:bg-gray-800 shadow-md rounded-full flex z-50">
      <Link
        href="/"
        className={`p-3 rounded-full transition-colors ${
          pathname === '/' 
            ? colorThemeClasses.accent
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        <FaHome />
      </Link>
      <Link
        href="/settings"
        className={`p-3 rounded-full transition-colors ${
          pathname === '/settings' 
            ? colorThemeClasses.accent
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
      >
        <FaCog />
      </Link>
    </nav>
  )
}

export default Navbar