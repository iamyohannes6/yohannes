import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import ProjectCard from '../components/ProjectCard';
import ImageCarousel from '../components/ImageCarousel';

export default function Portfolio() {
  const { personalInfo, loading, error } = usePersonalInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#646cff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-md">
          Error loading projects: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-screen bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
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
            My Work
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">
            Featured Projects
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#ffffffb3]">
            Here are some of my featured projects that showcase my skills and experience.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="space-y-20">
            {personalInfo.projects && personalInfo.projects.map((project, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-[#1a1a1a] object-cover shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#ffffff1a]" />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + techIndex * 0.1 }}
                        className="inline-flex items-center rounded-full bg-[#646cff]/10 px-3 py-1 text-sm font-medium text-[#646cff] ring-1 ring-inset ring-[#646cff]/20"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="group relative max-w-xl">
                    <h3 className="text-2xl font-bold tracking-tight text-[#f5f5f5] group-hover:text-[#646cff]">
                      {project.liveUrl ? (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 10 }}
                          className="inline-flex items-center gap-2"
                        >
                          {project.title}
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </motion.a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[#ffffffb3]">{project.description}</p>
                  </div>

                  {project.githubUrl && (
                    <div className="mt-6 flex border-t border-[#ffffff1a] pt-6">
                      <motion.a
                        whileHover={{ x: 10 }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-[#f5f5f5] hover:text-[#646cff]"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        View on GitHub
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Image Galleries */}
        {personalInfo.galleries?.length > 0 && (
          <div className="mt-32">
            {personalInfo.galleries.map((gallery, index) => (
              <motion.div
                key={gallery.name || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="mx-auto max-w-7xl mt-16 sm:mt-20"
              >
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                      {gallery.name}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
                  </div>
                  <ImageCarousel 
                    images={gallery.images} 
                    aspectRatio={gallery.aspectRatio}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
