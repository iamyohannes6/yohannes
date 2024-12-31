import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';

export default function About() {
  const { personalInfo } = usePersonalInfo();

  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-lg bg-[#646cff]/10 px-3 py-1 text-sm font-medium text-[#646cff] ring-1 ring-inset ring-[#646cff]/20 mb-4"
          >
            About Me
          </motion.div>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#f5f5f5] sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">
            {personalInfo.name}
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#ffffffb3]">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Skills Section */}
        {personalInfo?.skills && Object.keys(personalInfo.skills).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            {Object.entries(personalInfo.skills).map(([category, skills], categoryIndex) => (
              skills && skills.length > 0 && (
                <div key={category} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={`${category}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + (categoryIndex * skills.length + index) * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="relative bg-[#1a1a1a] rounded-xl p-6 shadow-lg border border-[#ffffff1a] backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#646cff]/5 to-transparent rounded-xl" />
                        <div className="relative">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-[#f5f5f5]">{skill}</h3>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </motion.div>
        )}

        {/* Experience Section */}
        {personalInfo.experience?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                Experience
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
            </div>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#646cff] to-[#747bff] shadow-lg"
                    >
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] to-[#646cff]">
                      {exp.title}
                    </span>
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#ffffffb3]">
                    <p className="font-semibold text-[#f5f5f5]">{exp.company}</p>
                    <p className="text-sm text-[#646cff]">{exp.period}</p>
                    <p className="mt-2">{exp.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        )}

        {/* Education Section */}
        {personalInfo.education?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                Education
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
            </div>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#646cff] to-[#747bff] shadow-lg"
                    >
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </motion.div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] to-[#646cff]">
                      {edu.degree}
                    </span>
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#ffffffb3]">
                    <p className="font-semibold text-[#f5f5f5]">{edu.institution}</p>
                    <p className="text-sm text-[#646cff]">{edu.period}</p>
                    <p className="mt-2">{edu.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        )}

        {/* Services Section */}
        {personalInfo.services?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                Services
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
            </div>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#646cff] to-[#747bff] shadow-lg"
                    >
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] to-[#646cff]">
                      {service.title}
                    </span>
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#ffffffb3]">
                    {service.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        )}
      </div>
    </div>
  );
}
