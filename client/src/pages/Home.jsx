import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePersonalInfo } from '../context/PersonalInfoContext';

export default function Home() {
  const { personalInfo, loading } = usePersonalInfo();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#646cff]"></div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#646cff] to-[#747bff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="relative min-h-screen">
        {/* Background elements */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#646cff] to-[#747bff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        {/* Main container with fixed height */}
        <div className="relative mx-auto max-w-7xl px-6 py-12 flex flex-col min-h-screen">
          {/* Content wrapper */}
          <div className="flex-grow">
            {/* Grid container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16 h-full">
              {/* Text content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start justify-center"
              >
                <h1 className="text-4xl font-bold tracking-tight text-[#f5f5f5] sm:text-6xl">
                  {personalInfo.name}
                </h1>
                <p className="mt-4 text-xl text-[#f5f5f5]">{personalInfo.title}</p>
                <p className="mt-6 text-lg leading-8 text-[#ffffffb3]">
                  {personalInfo.bio}
                </p>
                <div className="mt-8 flex gap-4">
                  {personalInfo.social?.github && (
                    <a
                      href={personalInfo.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f5f5f5] hover:text-[#646cff]"
                    >
                      <span className="sr-only">GitHub</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>

              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative flex items-center justify-center lg:justify-end"
              >
                <div className="relative w-72 h-96">
                  {/* Enhanced glowing background effect */}
                  <div className="absolute -inset-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-3xl animate-glow" />
                  </div>
                  
                  {/* Card frame with increased blur and glow */}
                  <div className="relative bg-[#1a1a1a] rounded-3xl border border-[#ffffff30] backdrop-blur-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(168,85,247,0.6)]">
                    {/* Card inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                    
                    {/* Profile image */}
                    {personalInfo.profilePhoto && (
                      <div className="relative h-full w-full">
                        <img
                          src={personalInfo.profilePhoto}
                          alt={personalInfo.name}
                          className="h-full w-full object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-transparent to-[#1a1a1a]/30" />
                      </div>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-[#ffffff30]" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-[#ffffff30]" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation buttons in fixed position at bottom */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-center gap-4 py-8"
          >
            <Link
              to="/about"
              className="rounded-md bg-[#646cff] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff] transition-all duration-200"
            >
              About Me
            </Link>
            <Link
              to="/portfolio"
              className="rounded-md bg-[#ffffff0d] px-6 py-3 text-sm font-semibold text-[#f5f5f5] shadow-sm hover:bg-[#ffffff1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff] transition-all duration-200"
            >
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="rounded-md bg-[#ffffff0d] px-6 py-3 text-sm font-semibold text-[#f5f5f5] shadow-sm hover:bg-[#ffffff1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff] transition-all duration-200"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Background gradient bottom */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#747bff] to-[#646cff] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}