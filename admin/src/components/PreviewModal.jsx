import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function PreviewModal({ open, onClose, content, type }) {
  const renderProjectPreview = (project) => (
    <div className="bg-white">
      <div className="relative h-96 overflow-hidden rounded-lg">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          <p className="mt-2 text-sm text-gray-300">{project.description}</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Category</h4>
          <p className="mt-1 text-sm text-gray-500">{project.category}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900">Technologies</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Live Demo →
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  )

  const renderAboutPreview = (about) => (
    <div className="bg-white">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={about.image}
          alt="Profile"
        />
      </div>
      
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{about.title}</h2>
          <p className="mt-4 text-gray-500">{about.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {about.skills.map((skill) => (
              <div key={skill.name} className="rounded-lg border border-gray-200 p-4">
                <dt className="font-medium text-gray-900">{skill.name}</dt>
                <dd className="mt-2 text-sm text-gray-500">{skill.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Experience</h3>
          <div className="mt-4 space-y-4">
            {about.experience.map((exp) => (
              <div key={exp.company} className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-900">{exp.company}</h4>
                <p className="text-sm text-gray-500">{exp.position}</p>
                <p className="text-sm text-gray-400">{exp.period}</p>
                <p className="mt-2 text-sm text-gray-500">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Connect</h3>
          <div className="mt-4 flex gap-4">
            {Object.entries(about.socialLinks).map(([platform, url]) => (
              url && (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 capitalize"
                >
                  {platform} →
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Preview
                    </Dialog.Title>
                    <div className="mt-4">
                      {type === 'project' && renderProjectPreview(content)}
                      {type === 'about' && renderAboutPreview(content)}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
