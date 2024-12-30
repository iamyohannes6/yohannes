import { useState, useEffect } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.5])
  const springConfig = { damping: 15, stiffness: 100 }
  const backgroundYSpring = useSpring(backgroundY, springConfig)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:14px_24px]"
          style={{
            y: backgroundYSpring,
            opacity: backgroundOpacity,
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)'
          }}
        />
        <motion.div 
          className="absolute inset-0"
          style={{
            y: useSpring(useTransform(scrollY, [0, 500], [0, -50]), springConfig),
            background: 'radial-gradient(circle 800px at 100% 200px, #646cff15, transparent), radial-gradient(circle 800px at 0% 300px, #747bff15, transparent)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg shadow-black/5' : ''
      }`}>
        <div className="relative">
          {/* Navbar Background with Blur */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          } border-b border-[#ffffff1a]`} />
          
          {/* Navbar Content */}
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex lg:flex-1">
                <NavLink
                  to="/"
                  className="relative group -m-1.5 p-1.5"
                >
                  <span className="text-xl font-bold tracking-tight text-[#f5f5f5] transition-colors group-hover:text-[#646cff]">
                    Yohannes
                  </span>
                  <span className="absolute -bottom-0.5 left-1/2 w-0 h-[2px] bg-[#646cff] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300" />
                </NavLink>
              </div>

              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-[#f5f5f5] transition-colors hover:bg-[#ffffff0d]"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Desktop navigation */}
              <div className="hidden lg:flex lg:gap-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group relative px-3 py-2 text-sm font-semibold transition-all ${
                        isActive
                          ? 'text-[#646cff]'
                          : 'text-[#f5f5f5] hover:text-[#646cff]'
                      }`
                    }
                  >
                    {item.name}
                    <span className={`absolute inset-x-3 -bottom-px h-[2px] transform transition-all duration-300 ${
                      location.pathname === item.href
                        ? 'bg-[#646cff]'
                        : 'bg-[#646cff] scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </NavLink>
                ))}
              </div>

              {/* Hire me button */}
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a
                  href="https://www.linkedin.com/in/yohannes-goitom-1b29022ab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-[#646cff] px-4 py-1.5 transition-all duration-300 hover:bg-[#747bff]"
                >
                  <div className="relative flex items-center gap-x-2">
                    <span className="text-sm font-semibold text-white">
                      Hire me
                    </span>
                    <svg
                      className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#646cff] via-[#747bff] to-[#646cff] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            mobileMenuOpen ? 'fixed' : 'hidden'
          } inset-0 z-50 lg:hidden`}
          aria-modal="true"
        >
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0a0a0a] p-6 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <NavLink
                to="/"
                className="group relative -m-1.5 p-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl font-bold tracking-tight text-[#f5f5f5] transition-colors group-hover:text-[#646cff]">
                  Yohannes
                </span>
                <span className="absolute -bottom-0.5 left-1/2 w-0 h-[2px] bg-[#646cff] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300" />
              </NavLink>
              <button
                type="button"
                className="-m-2.5 rounded-lg p-2.5 text-[#f5f5f5] transition-colors hover:bg-[#ffffff0d]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group relative block rounded-lg px-3 py-2 text-base font-semibold transition-all ${
                        isActive
                          ? 'text-[#646cff] bg-[#646cff15]'
                          : 'text-[#f5f5f5] hover:text-[#646cff] hover:bg-[#646cff15]'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {location.pathname === item.href && (
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </NavLink>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="https://www.linkedin.com/in/yohannes-goitom-1b29022ab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-full bg-[#646cff] px-4 py-2 text-center transition-all duration-300 hover:bg-[#747bff]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="relative flex items-center justify-center gap-x-2">
                    <span className="text-sm font-semibold text-white">
                      Hire me
                    </span>
                    <svg
                      className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#646cff] via-[#747bff] to-[#646cff] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative">
        <main className="min-h-screen pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Parallax Footer */}
        <motion.footer
          style={{
            y: useSpring(useTransform(scrollY, [0, 500], [0, -30]), springConfig)
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="text-center">
              <p className="text-sm leading-5 text-[#ffffffb3]">
                &copy; {new Date().getFullYear()} Yohannes Goitom. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
