import { motion, useReducedMotion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = shouldReduceMotion
    ? {
        hover: {},
      }
    : {
        hover: {
          scale: 1.02,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        },
      };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-lg transition-colors duration-300 hover:bg-[#242424]"
      style={{ willChange: 'transform' }}
    >
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        </div>
      )}
      
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <div>
            <h3 className="text-xl font-semibold text-[#f5f5f5]">{project.title}</h3>
            <p className="mt-3 text-base text-[#ffffffb3]">{project.description}</p>
          </div>
          
          {project.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-[#ffffff1a] px-3 py-1 text-sm text-[#f5f5f5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
