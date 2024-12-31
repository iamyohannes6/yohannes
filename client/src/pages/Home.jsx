import { motion, useReducedMotion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import { Link } from 'react-router-dom';
import { performanceProps } from '../utils/animations';

export default function Home() {
  const { personalInfo } = usePersonalInfo();
  const shouldReduceMotion = useReducedMotion();

  const contentVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.1,
        duration: 0.2
      }
    })
  };

  const buttonHoverVariants = shouldReduceMotion
    ? {}
    : {
        scale: 1.02,
        transition: { duration: 0.2 }
      };

  return (
    <div className="relative isolate min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16 h-full">
            <div className="flex flex-col items-start justify-center max-w-2xl mx-auto lg:mx-0">
              <motion.div
                {...performanceProps}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <div className="inline-block rounded-lg bg-[#646cff]/10 px-3 py-1 text-sm font-medium text-[#646cff] ring-1 ring-inset ring-[#646cff]/20">
                  Welcome to my portfolio
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-[#f5f5f5] sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">
                  {personalInfo.name}
                </h1>
                
                <p className="text-xl text-[#f5f5f5] bg-clip-text text-transparent bg-gradient-to-r from-[#646cff] to-[#747bff]">
                  {personalInfo.title}
                </p>
                
                <p className="text-lg leading-8 text-[#ffffffb3]">
                  {personalInfo.bio}
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-x-2 rounded-full bg-[#646cff] px-6 py-2.5 transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <span className="text-sm font-semibold text-white">
                      About Me
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
                  </Link>

                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-x-2 rounded-full bg-[#ffffff0d] px-6 py-2.5 transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <span className="text-sm font-semibold text-[#f5f5f5]">
                      Get in Touch
                    </span>
                    <svg
                      className="h-5 w-5 text-[#f5f5f5] transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </Link>
                </div>

                {personalInfo.socialLinks && (
                  <div className="flex gap-4 mt-8">
                    {personalInfo.socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        custom={index}
                        variants={socialVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={buttonHoverVariants}
                        className="rounded-lg bg-[#ffffff0d] p-2 transition-colors duration-200 hover:bg-[#ffffff1a]"
                      >
                        <span className="sr-only">{link.platform}</span>
                        <img
                          src={link.icon}
                          alt={link.platform}
                          className="h-6 w-6"
                          loading="lazy"
                        />
                      </motion.a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              {...performanceProps}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="relative flex items-center justify-center lg:justify-end pt-8 lg:pt-0"
            >
              <div className="relative w-80 h-96 max-w-full">
                <div className="absolute -inset-1">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#646cff] via-[#747bff] to-[#646cff] opacity-75 blur-2xl"
                  />
                </div>
                
                <div 
                  className="relative bg-[#1a1a1a] rounded-3xl border border-[#ffffff30] backdrop-blur-xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.02]"
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#646cff]/20 via-[#747bff]/20 to-[#646cff]/20"
                  />
                  
                  {personalInfo.profilePhoto && (
                    <div className="relative h-full w-full">
                      <img
                        src={personalInfo.profilePhoto}
                        alt={personalInfo.name}
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-[#1a1a1a]/30"
                      />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#646cff]/30 to-[#747bff]/30 backdrop-blur-xl border border-[#ffffff30]" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-[#747bff]/30 to-[#646cff]/30 backdrop-blur-xl border border-[#ffffff30]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#747bff] to-[#646cff] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}