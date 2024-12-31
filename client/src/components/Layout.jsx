import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { performanceProps } from '../utils/animations'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  // Optimized scroll transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 150])
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.5])
  const springConfig = { damping: 15, stiffness: 100 }
  const backgroundYSpring = useSpring(backgroundY, springConfig)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ]

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20
    setScrolled(isScrolled)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Optimized animation variants
  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  }

  const navItemVariants = shouldReduceMotion
    ? {
        hover: {},
      }
    : {
        hover: { y: -2 },
      }

  const linkUnderlineVariants = shouldReduceMotion
    ? {
        hover: {},
      }
    : {
        initial: { width: 0, left: "50%" },
        hover: { width: "50%", left: "25%" },
      }

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Parallax Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          {...performanceProps}
          className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:14px_24px]"
          style={{
            y: backgroundYSpring,
            opacity: backgroundOpacity,
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)'
          }}
        />
        <motion.div 
          {...performanceProps}
          className="absolute inset-0"
          style={{
            y: useSpring(useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : -50]), springConfig),
            background: 'radial-gradient(circle 800px at 100% 200px, #646cff15, transparent), radial-gradient(circle 800px at 0% 300px, #747bff15, transparent)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#0a0a0a]/85 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/5' 
          : 'bg-transparent'
      }`}>
        <div className="relative">
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          } after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#646cff]/10 after:via-transparent after:to-[#747bff]/10`} />
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex lg:flex-1">
                <NavLink to="/" className="relative group -m-1.5 p-1.5">
                  <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] to-[#646cff] transition-all duration-300 group-hover:to-[#747bff]">
                    Yohannes
                  </span>
                  {!shouldReduceMotion && (
                    <motion.span 
                      className="absolute -bottom-0.5 left-1/2 w-0 h-[2px] bg-gradient-to-r from-[#646cff] to-[#747bff]"
                      variants={linkUnderlineVariants}
                      initial="initial"
                      whileHover="hover"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </NavLink>
              </div>

              <div className="flex lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="relative -m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-[#f5f5f5]"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative">
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 blur-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
                  </div>
                </motion.button>
              </div>

              <div className="hidden lg:flex lg:gap-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group relative px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'text-[#646cff]'
                          : 'text-[#f5f5f5] hover:text-[#646cff]'
                      }`
                    }
                  >
                    <motion.span
                      variants={navItemVariants}
                      whileHover="hover"
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      {item.name}
                    </motion.span>
                    {!shouldReduceMotion && (
                      <motion.span 
                        className={`absolute inset-0 rounded-lg -z-10 ${
                          location.pathname === item.href
                            ? 'bg-[#646cff]/10'
                            : 'bg-gradient-to-r from-[#646cff]/0 to-[#747bff]/0 hover:from-[#646cff]/10 hover:to-[#747bff]/10'
                        } transition-colors duration-300`}
                      />
                    )}
                    <motion.span 
                      className={`absolute inset-x-3 -bottom-px h-[2px] transform ${
                        location.pathname === item.href
                          ? 'bg-[#646cff]'
                          : 'bg-gradient-to-r from-[#646cff] to-[#747bff] scale-x-0 group-hover:scale-x-100'
                      }`}
                      transition={{ duration: 0.3 }}
                    />
                  </NavLink>
                ))}
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <a
                  href="https://www.linkedin.com/in/yohannes-goitom-1b29022ab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-[#646cff] px-4 py-1.5 transition-all duration-300 hover:bg-[#747bff]"
                >
                  <div className="relative flex items-center gap-x-2">
                    <span className="text-sm font-semibold text-white transition-transform duration-200 group-hover:-translate-x-1">
                      Hire me
                    </span>
                    <svg
                      className="h-5 w-5 text-white transition-transform duration-200 group-hover:translate-x-1"
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
                  {!shouldReduceMotion && (
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#646cff] via-[#747bff] to-[#646cff] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-xl"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0a0a0a]/95 backdrop-blur-xl p-6 border-l border-white/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <NavLink
                    to="/"
                    className="group relative -m-1.5 p-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] to-[#646cff] transition-all duration-300 group-hover:to-[#747bff]">
                      Yohannes
                    </span>
                  </NavLink>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="relative -m-2.5 rounded-lg p-2.5 text-[#f5f5f5]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <div className="relative">
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 blur-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    </div>
                  </motion.button>
                </div>

                <nav className="flow-root">
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `block relative overflow-hidden rounded-lg px-4 py-3 text-base font-semibold transition-all duration-300 ${
                            isActive
                              ? 'text-[#646cff] bg-[#646cff]/10'
                              : 'text-[#f5f5f5] hover:text-[#646cff] hover:bg-[#ffffff0d]'
                          }`
                        }
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <motion.span
                          whileHover={{ x: 8 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10 flex items-center"
                        >
                          {item.name}
                          <motion.svg 
                            className="ml-2 w-4 h-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </motion.span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
