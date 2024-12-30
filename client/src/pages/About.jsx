import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';

export default function About() {
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
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl lg:text-center"
        >
          <motion.h2
            variants={item}
            className="text-base font-semibold leading-7 text-[#646cff]"
          >
            About Me
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-2 text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl"
          >
            {personalInfo.name}
          </motion.p>
          <motion.p
            variants={item}
            className="mt-6 text-lg leading-8 text-[#ffffffb3]"
          >
            {personalInfo.bio}
          </motion.p>
        </motion.div>

        {/* Skills Section */}
        {personalInfo.skills && Object.keys(personalInfo.skills).length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <motion.h2
              variants={item}
              className="text-2xl font-bold tracking-tight text-[#f5f5f5] mb-8"
            >
              Skills & Expertise
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(personalInfo.skills).map(([category, skills]) => (
                <motion.div
                  key={category}
                  variants={item}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-[#646cff] capitalize">{category}</h3>
                  <ul className="space-y-2">
                    {skills.map((skill, index) => (
                      <li
                        key={index}
                        className="text-[#ffffffb3] flex items-center"
                      >
                        <svg
                          className="h-5 w-5 text-[#646cff] mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Experience Section */}
        {personalInfo.experience?.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <motion.h2
              variants={item}
              className="text-2xl font-bold tracking-tight text-[#f5f5f5] mb-8"
            >
              Experience
            </motion.h2>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#646cff]">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {exp.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#ffffffb3]">
                    <p className="font-semibold">{exp.company}</p>
                    <p className="text-sm text-[#ffffff80]">{exp.period}</p>
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
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <motion.h2
              variants={item}
              className="text-2xl font-bold tracking-tight text-[#f5f5f5] mb-8"
            >
              Education
            </motion.h2>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.education.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#646cff]">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                    </div>
                    {edu.degree}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#ffffffb3]">
                    <p className="font-semibold">{edu.institution}</p>
                    <p className="text-sm text-[#ffffff80]">{edu.period}</p>
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
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
          >
            <motion.h2
              variants={item}
              className="text-2xl font-bold tracking-tight text-[#f5f5f5] mb-8"
            >
              Services
            </motion.h2>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {personalInfo.services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-[#f5f5f5]">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#646cff]">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    {service.title}
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
