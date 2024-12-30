import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';

export default function Contact() {
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
    <div className="relative isolate bg-[#0a0a0a] min-h-screen">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#646cff] to-[#747bff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            variants={item}
            className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl"
          >
            Let's Connect
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 text-lg leading-8 text-[#ffffffb3]"
          >
            Feel free to reach out through any of these platforms.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-[#ffffff1a] bg-[#ffffff0d] sm:mt-20"
        >
          <div className="p-8 sm:p-10">
            <motion.div variants={item} className="space-y-6">
              {personalInfo.social?.email && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">Email</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={`mailto:${personalInfo.social.email}`}
                        className="hover:text-[#646cff]"
                      >
                        {personalInfo.social.email}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.linkedin && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">LinkedIn</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={personalInfo.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Connect with me on LinkedIn
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.github && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">GitHub</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={personalInfo.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Check out my code on GitHub
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.pinterest && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">Pinterest</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={personalInfo.social.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Follow my pins on Pinterest
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.instagram && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">Instagram</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={personalInfo.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Follow me on Instagram
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.twitter && (
                <div className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">Twitter</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={personalInfo.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Follow me on Twitter
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {personalInfo.social?.customLinks?.map((link, index) => (
                <div key={index} className="flex items-center gap-x-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#646cff]">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="text-base leading-7">
                    <h3 className="font-semibold text-[#f5f5f5]">{link.title}</h3>
                    <p className="text-[#ffffffb3]">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#646cff]"
                      >
                        Visit {link.title}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#747bff] to-[#646cff] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  );
}
