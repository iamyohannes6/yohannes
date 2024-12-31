import { useReducedMotion } from 'framer-motion';
import { motion } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';
import ProjectCard from '../components/ProjectCard';
import ImageCarousel from '../components/ImageCarousel';
import { fadeInUp, stagger, performanceProps } from '../utils/animations';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const { personalInfo, loading, error } = usePersonalInfo();
  const shouldReduceMotion = useReducedMotion();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

  // Get all images from Pinterest boards
  const allPinterestImages = personalInfo?.pinterestBoards?.reduce((acc, board) => {
    return [...acc, ...(board.images || [])];
  }, []) || [];

  // Combine with existing gallery images if needed
  const allImages = [...allPinterestImages];

  return (
    <div className="relative isolate min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a] opacity-80" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <motion.div
          {...performanceProps}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-2xl lg:text-center"
        >
          <motion.div
            variants={itemVariants}
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-16 max-w-7xl"
        >
          <div className="space-y-20">
            {personalInfo.projects && personalInfo.projects.map((project, index) => (
              <motion.article
                key={index}
                variants={itemVariants}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-[#1a1a1a] object-cover shadow-xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#ffffff1a]" />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        variants={itemVariants}
                        className="inline-flex items-center rounded-full bg-[#646cff]/10 px-3 py-1 text-sm font-medium text-[#646cff] ring-1 ring-inset ring-[#646cff]/20"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="group relative max-w-xl">
                    <h3 className="text-2xl font-bold tracking-tight text-[#f5f5f5] group-hover:text-[#646cff]">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 transition-transform duration-200 hover:translate-x-2"
                        >
                          {project.title}
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-[#ffffffb3]">{project.description}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Pinterest Boards */}
        {personalInfo?.pinterestBoards?.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-32"
          >
            {personalInfo.pinterestBoards.map((board, index) => (
              board.images?.length > 0 && (
                <motion.div
                  key={board.name || index}
                  variants={itemVariants}
                  className="mx-auto max-w-7xl mt-16 sm:mt-20"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
                        {board.name || `Pinterest Board ${index + 1}`}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#646cff]/50 to-transparent" />
                    </div>
                    <ImageCarousel 
                      images={board.images} 
                      aspectRatio={board.aspectRatio || '16/9'}
                      autoSlideInterval={5000}
                      key={`carousel-${board.name}-${board.aspectRatio}`}
                    />
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        )}

        {/* Contact Button */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 flex justify-center"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-x-2 rounded-full bg-[#646cff] px-6 py-2.5 transition-transform duration-200 hover:scale-[1.02]"
            >
              <span className="text-sm font-semibold text-white">
                Contact Me
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
