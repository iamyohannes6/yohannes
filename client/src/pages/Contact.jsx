import { motion, useReducedMotion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import { performanceProps } from '../utils/animations';

export default function Contact() {
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

  const contactItemVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.05,
        duration: 0.2
      }
    })
  };

  const iconHoverVariants = shouldReduceMotion
    ? {}
    : {
        scale: 1.1,
        transition: { duration: 0.2 }
      };

  const itemHoverVariants = shouldReduceMotion
    ? {}
    : {
        x: 5,
        transition: { duration: 0.2 }
      };

  return (
    <div className="relative isolate min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <motion.div
          {...performanceProps}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl lg:text-center"
        >
          <div className="inline-block rounded-lg bg-[#646cff]/10 px-3 py-1 text-sm font-medium text-[#646cff] ring-1 ring-inset ring-[#646cff]/20 mb-4">
            Contact Me
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">
            Get in Touch
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#ffffffb3]">
            I'd love to hear from you! Whether you have a project in mind or just want to say hello.
          </p>
        </motion.div>

        <motion.div
          {...performanceProps}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="rounded-3xl bg-[#ffffff0d] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#646cff]/5 to-transparent" />
            <div className="relative">
              <h3 className="text-xl font-semibold text-[#f5f5f5] mb-6">Contact Information</h3>
              <div className="space-y-6">
                {personalInfo.social?.email && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">Email</p>
                      <a
                        href={`mailto:${personalInfo.social.email}`}
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        {personalInfo.social.email}
                      </a>
                    </div>
                  </motion.div>
                )}

                {personalInfo.social?.github && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">GitHub</p>
                      <a
                        href={personalInfo.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        View Profile
                      </a>
                    </div>
                  </motion.div>
                )}

                {personalInfo.social?.linkedin && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">LinkedIn</p>
                      <a
                        href={personalInfo.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        Connect with Me
                      </a>
                    </div>
                  </motion.div>
                )}

                {personalInfo.social?.twitter && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">Twitter</p>
                      <a
                        href={personalInfo.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        Follow Me
                      </a>
                    </div>
                  </motion.div>
                )}

                {personalInfo.social?.pinterest && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">Pinterest</p>
                      <a
                        href={personalInfo.social.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        Follow Me
                      </a>
                    </div>
                  </motion.div>
                )}

                {personalInfo.social?.instagram && (
                  <motion.div
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={5}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">Instagram</p>
                      <a
                        href={personalInfo.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        Follow Me
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Custom Links */}
                {personalInfo.social?.customLinks?.map((link, index) => (
                  <motion.div
                    key={index}
                    variants={contactItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={6 + index}
                    whileHover={itemHoverVariants}
                    className="flex items-center gap-x-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#646cff] to-[#747bff] transition-transform duration-200 group-hover:scale-110">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#ffffffb3] hover:text-[#646cff] transition-colors duration-200"
                      >
                        Visit Link
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
