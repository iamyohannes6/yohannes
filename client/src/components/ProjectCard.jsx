import { motion } from 'framer-motion';
import { hoverScale } from '../utils/animations';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      {...hoverScale}
      className="flex flex-col overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-lg transition-colors duration-300 hover:bg-[#242424]"
    >
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        </div>
      )}
      
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-[#f5f5f5]">{project.title}</h3>
            <p className="mt-3 text-base text-[#ffffffb3]">{project.description}</p>
          </motion.div>
          
          {project.tags && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-[#ffffff1a] px-3 py-1 text-sm text-[#f5f5f5]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
        
        {(project.demoUrl || project.githubUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center gap-4"
          >
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#646cff] hover:text-[#747bff] transition-colors duration-200"
              >
                View Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#646cff] hover:text-[#747bff] transition-colors duration-200"
              >
                View Code
              </a>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
