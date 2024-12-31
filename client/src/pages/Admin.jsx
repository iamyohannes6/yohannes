import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalInfo } from '../context/PersonalInfoContext';

const AdminDashboard = () => {
  const { personalInfo, updatePersonalInfo, loading: contextLoading, error: contextError } = usePersonalInfo();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profilePhoto: '',
    social: {},
    experience: [],
    education: [],
    services: [],
    skills: {},
    galleries: []
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (personalInfo) {
      setFormData(prev => ({
        ...personalInfo,
        skills: personalInfo.skills || {}
      }));
    }
  }, [personalInfo]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        [platform]: value
      }
    }));
  };

  const handleSkillChange = (category, index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => 
          i === index ? value : skill
        )
      }
    }));
  };

  const addSkill = (category) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills[category] || []), '']
      }
    }));
  };

  const removeSkill = (category, index) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      image: '',
      technologies: [],
      liveUrl: '',
      githubUrl: ''
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleCustomLinkAdd = () => {
    setFormData(prev => ({
      ...prev,
      social: {
        ...(prev.social || {}),
        customLinks: [...(prev.social?.customLinks || []), { title: '', url: '' }]
      }
    }));
  };

  const handleCustomLinkChange = (index, field, value) => {
    setFormData(prev => {
      const customLinks = [...(prev.social?.customLinks || [])];
      customLinks[index] = { ...customLinks[index], [field]: value };
      return {
        ...prev,
        social: {
          ...(prev.social || {}),
          customLinks
        }
      };
    });
  };

  const handleCustomLinkRemove = (index) => {
    setFormData(prev => {
      const customLinks = [...(prev.social?.customLinks || [])];
      customLinks.splice(index, 1);
      return {
        ...prev,
        social: {
          ...(prev.social || {}),
          customLinks
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const result = await updatePersonalInfo(formData);
      if (result.success) {
        setMessage({ type: 'success', content: 'Information updated successfully!' });
      } else {
        throw new Error(result.error || 'Failed to update information');
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = () => {
    const categoryName = '';
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [categoryName]: []
      }
    }));
  };

  const renameCategory = (oldName, newName) => {
    if (newName && newName !== oldName) {
      setFormData(prev => {
        const { [oldName]: categorySkills, ...otherCategories } = prev.skills;
        return {
          ...prev,
          skills: {
            ...otherCategories,
            [newName]: categorySkills || []
          }
        };
      });
    }
  };

  const removeCategory = (categoryName) => {
    setFormData(prev => {
      const { [categoryName]: _, ...remainingCategories } = prev.skills;
      return {
        ...prev,
        skills: remainingCategories
      };
    });
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#646cff]"></div>
      </div>
    );
  }

  if (contextError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-md">
          Error loading data: {contextError}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'galleries', label: 'Galleries' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] rounded-2xl shadow-xl p-8 border border-[#ffffff1a] backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]"
            >
              Admin Dashboard
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sessionStorage.removeItem('adminAuth');
                window.location.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </motion.button>
          </div>

          {/* Message Display with Animation */}
          <AnimatePresence mode="wait">
          {message.content && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`p-4 mb-6 rounded-lg backdrop-blur-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
              {message.content}
            </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs with Animation */}
          <div className="border-b border-[#ffffff1a] mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative py-4 px-1 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-[#646cff]'
                      : 'text-[#ffffffb3] hover:text-[#f5f5f5]'
                    }
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#646cff] to-[#747bff]"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Name</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Bio</label>
                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                    name="bio"
                    value={formData.bio}
                    onChange={handleBasicInfoChange}
                    rows={4}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                  />
                </div>
                  <div className="col-span-2">
                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-[#f5f5f5] mb-2">
                    Profile Photo URL
                  </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      name="profilePhoto"
                      id="profilePhoto"
                      value={formData.profilePhoto || ''}
                      onChange={handleBasicInfoChange}
                      className="mt-1 block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Media Links */}
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                  <div>
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5] mb-6">Social Media Links</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                    <label htmlFor="github" className="block text-sm font-medium text-[#f5f5f5]">
                      GitHub URL
                    </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                      type="url"
                      name="github"
                      id="github"
                      value={formData.social?.github || ''}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                      placeholder="https://github.com/username"
                    />
                  </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/20 to-[#747bff]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative space-y-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium text-[#f5f5f5]">
                      LinkedIn URL
                    </label>
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={formData.social?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                    </motion.div>

                    {/* Add similar styling for other social inputs */}
                  </div>
                </div>

                {/* Custom Links Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Additional Links</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCustomLinkAdd}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Link
                    </motion.button>
                  </div>
                  <motion.div layout className="space-y-4">
                    {formData.social?.customLinks?.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 items-start bg-[#ffffff0d] p-4 rounded-lg border border-[#ffffff1a] hover:border-[#646cff] transition-colors duration-300"
                      >
                        <div className="flex-1">
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={link.title}
                            onChange={(e) => handleCustomLinkChange(index, 'title', e.target.value)}
                            placeholder="Link Title"
                            className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="url"
                            value={link.url}
                            onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleCustomLinkRemove(index)}
                          className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                  </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Experience</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      experience: [...(prev.experience || []), { title: '', company: '', period: '', description: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Experience
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.experience?.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Position {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newExperience = [...(formData.experience || [])];
                          newExperience.splice(index, 1);
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.title}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, title: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Position Title"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Company</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.company}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, company: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Company Name"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Period</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={exp.period}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, period: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="e.g., 2020 - Present"
                      />
                    </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={exp.description}
                        onChange={e => {
                                const newExperience = [...(formData.experience || [])];
                          newExperience[index] = { ...exp, description: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Education Section */}
            {activeTab === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Education</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      education: [...(prev.education || []), { degree: '', institution: '', period: '', description: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Education
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.education?.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Education {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newEducation = [...(formData.education || [])];
                          newEducation.splice(index, 1);
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Degree</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, degree: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Degree or Certificate"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Institution</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.institution}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, institution: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Institution Name"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Period</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={edu.period}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, period: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="e.g., 2018 - 2022"
                      />
                    </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={edu.description}
                        onChange={e => {
                                const newEducation = [...(formData.education || [])];
                          newEducation[index] = { ...edu, description: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your academic achievements and activities..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Services</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      services: [...(prev.services || []), { title: '', description: '', icon: '' }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Service
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.services?.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Service {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newServices = [...(formData.services || [])];
                          newServices.splice(index, 1);
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={service.title}
                        onChange={e => {
                                const newServices = [...(formData.services || [])];
                          newServices[index] = { ...service, title: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Service Title"
                      />
                    </div>

                    <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Icon</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={service.icon}
                              onChange={e => {
                                const newServices = [...(formData.services || [])];
                                newServices[index] = { ...service, icon: e.target.value };
                                setFormData(prev => ({ ...prev, services: newServices }));
                              }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Icon name or URL"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                        value={service.description}
                        onChange={e => {
                                const newServices = [...(formData.services || [])];
                          newServices[index] = { ...service, description: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                        rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe the service you offer..."
                      />
                    </div>
                  </div>
              </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Skills</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={addCategory}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                  </motion.button>
                </div>

                <motion.div layout className="space-y-8">
                  {Object.entries(formData.skills || {}).map(([category, skills]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                        type="text"
                        value={category}
                          onChange={(e) => renameCategory(category, e.target.value)}
                          className="text-base font-medium text-[#f5f5f5] bg-transparent border-b border-transparent hover:border-[#ffffff1a] focus:border-[#646cff] focus:outline-none px-2 py-1 transition-all duration-300"
                        placeholder="Category Name"
                      />
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        type="button"
                            onClick={() => addSkill(category)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Skill
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-4 rounded-lg border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center gap-3">
                              <motion.input
                                whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={skill}
                                onChange={e => handleSkillChange(category, index, e.target.value)}
                                className="flex-1 rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                                placeholder={`${category} skill`}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            type="button"
                                onClick={() => removeSkill(category, index)}
                                className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </motion.button>
                        </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Projects</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                        type="button"
                    onClick={addProject}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                  </motion.button>
                    </div>

                <motion.div layout className="space-y-6">
                  {formData.projects?.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Project {index + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeProject(index)}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                  </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Title</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.title}
                              onChange={e => handleProjectChange(index, 'title', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Project Title"
                            />
              </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Image URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.image}
                              onChange={e => handleProjectChange(index, 'image', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Live URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.liveUrl}
                              onChange={e => handleProjectChange(index, 'liveUrl', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">GitHub URL</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.githubUrl}
                              onChange={e => handleProjectChange(index, 'githubUrl', e.target.value)}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://github.com/username/repo"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Description</label>
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                              value={project.description}
                              onChange={e => handleProjectChange(index, 'description', e.target.value)}
                              rows={3}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Describe your project..."
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Technologies</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={project.technologies.join(', ')}
                              onChange={e => handleProjectChange(index, 'technologies', e.target.value.split(',').map(tech => tech.trim()))}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="React, Node.js, MongoDB, etc."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Galleries Section */}
            {activeTab === 'galleries' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f5f5f5] via-[#646cff] to-[#f5f5f5]">Galleries</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      galleries: [...(prev.galleries || []), { name: '', images: [] }]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Gallery
                  </motion.button>
                </div>

                <motion.div layout className="space-y-6">
                {formData.galleries?.map((gallery, galleryIndex) => (
                    <motion.div
                      key={galleryIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-6 rounded-xl border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-medium text-[#f5f5f5]">Gallery {galleryIndex + 1}</h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                              const newGalleries = [...(formData.galleries || [])];
                              newGalleries.splice(galleryIndex, 1);
                          setFormData(prev => ({ ...prev, galleries: newGalleries }));
                        }}
                            className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                    </div>

                    <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Gallery Name</label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={gallery.name}
                              onChange={e => {
                                const newGalleries = [...(formData.galleries || [])];
                                newGalleries[galleryIndex] = { ...gallery, name: e.target.value };
                            setFormData(prev => ({ ...prev, galleries: newGalleries }));
                          }}
                              className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Gallery Name"
                            />
                      </div>

                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium text-[#f5f5f5]">Images</label>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => {
                                  const newGalleries = [...(formData.galleries || [])];
                                  newGalleries[galleryIndex] = {
                                    ...gallery,
                                    images: [...(gallery.images || []), { url: '', caption: '' }]
                                  };
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#646cff] text-white hover:bg-[#747bff] transition-all duration-300"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Image
                              </motion.button>
                          </div>

                            <div className="grid grid-cols-1 gap-4">
                              {gallery.images?.map((image, imageIndex) => (
                                <motion.div
                                  key={imageIndex}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="group relative bg-gradient-to-br from-[#ffffff0d] to-[#ffffff05] p-4 rounded-lg border border-[#ffffff1a] hover:border-[#646cff] transition-all duration-300"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#646cff]/5 to-[#747bff]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                                      <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Image URL</label>
                                      <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        type="text"
                              value={image.url}
                              onChange={e => {
                                          const newGalleries = [...(formData.galleries || [])];
                                          newGalleries[galleryIndex].images[imageIndex] = {
                                            ...image,
                                            url: e.target.value
                                          };
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                                        className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>

                                    <div className="flex items-center gap-4">
                                      <div className="flex-1">
                                        <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Caption</label>
                                        <motion.input
                                          whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={image.caption}
                              onChange={e => {
                                            const newGalleries = [...(formData.galleries || [])];
                                            newGalleries[galleryIndex].images[imageIndex] = {
                                              ...image,
                                              caption: e.target.value
                                            };
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                                          className="block w-full rounded-lg bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-4 py-2.5 focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/50 transition-all duration-300"
                              placeholder="Image caption"
                            />
                          </div>

                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => {
                                          const newGalleries = [...(formData.galleries || [])];
                                          newGalleries[galleryIndex].images.splice(imageIndex, 1);
                                          setFormData(prev => ({ ...prev, galleries: newGalleries }));
                                        }}
                                        className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 self-end"
                                      >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </motion.button>
                              </div>
                            </div>
                                </motion.div>
                      ))}
                    </div>
                  </div>
              </div>
                </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Save Button */}
            <motion.div 
              className="flex justify-end pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`
                  relative overflow-hidden px-6 py-2.5 rounded-full font-semibold text-white
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#646cff]/50'}
                  bg-gradient-to-r from-[#646cff] to-[#747bff] transition-all duration-300
                `}
              >
                <motion.span
                  initial={{ y: 0 }}
                  animate={{ y: isSubmitting ? 30 : 0 }}
                  className="block"
                >
                  Save Changes
                </motion.span>
                {isSubmitting && (
                  <motion.div 
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
