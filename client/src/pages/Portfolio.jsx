import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import ProjectCard from '../components/ProjectCard';
import ImageCarousel from '../components/ImageCarousel';

export default function Portfolio() {
  const { personalInfo, loading, error } = usePersonalInfo();

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
    <div className="min-h-screen bg-[#0a0a0a] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl lg:max-w-none"
        >
          <motion.h2
            variants={item}
            className="text-3xl font-bold tracking-tight text-[#f5f5f5] sm:text-4xl"
          >
            Projects
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 text-lg leading-8 text-[#ffffffb3]"
          >
            Here are some of my featured projects that showcase my skills and experience.
          </motion.p>

          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {personalInfo.projects && personalInfo.projects.map((project, index) => (
              <motion.article
                key={index}
                variants={item}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="relative z-10 rounded-full bg-[#646cff] px-3 py-1.5 font-medium text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#f5f5f5] group-hover:text-[#646cff]">
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <span className="absolute inset-0" />
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-[#ffffffb3]">{project.description}</p>
                  </div>
                  {project.githubUrl && (
                    <div className="mt-6 flex border-t border-[#ffffff1a] pt-6">
                      <div className="relative flex items-center gap-x-4">
                        <div className="text-sm leading-6">
                          <p className="font-semibold text-[#f5f5f5]">
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#646cff]">
                              View on GitHub
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Image Galleries */}
        {personalInfo.galleries?.length > 0 && (
          <>
            {personalInfo.galleries.map((gallery, index) => (
              <motion.div
                key={gallery.name || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="mx-auto max-w-7xl px-6 mt-16 sm:mt-20 lg:px-8"
              >
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5] mb-8">
                    {gallery.name}
                  </h2>
                  <ImageCarousel 
                    images={gallery.images} 
                    aspectRatio={gallery.aspectRatio}
                  />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
