import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    galleries: []  // Array of galleries, each with a name and images
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(personalInfo);
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
        [category]: [...prev.skills[category], '']
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
          className="bg-[#ffffff0d] rounded-lg shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#f5f5f5]">Admin Dashboard</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminAuth');
                window.location.reload();
              }}
              className="text-[#ffffffb3] hover:text-[#f5f5f5]"
            >
              Logout
            </button>
          </div>

          {/* Message Display */}
          {message.content && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {message.content}
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-[#ffffff1a] mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-[#646cff] text-[#646cff]'
                      : 'border-transparent text-[#ffffffb3] hover:text-[#f5f5f5] hover:border-[#ffffff4d]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5]">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5]">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5]">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleBasicInfoChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="profilePhoto" className="block text-sm font-medium text-[#f5f5f5]">
                    Profile Photo URL
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="profilePhoto"
                      id="profilePhoto"
                      value={formData.profilePhoto || ''}
                      onChange={handleBasicInfoChange}
                      className="block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#f5f5f5]">Social Media Links</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-[#f5f5f5]">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="github"
                      id="github"
                      value={formData.social?.github || ''}
                      onChange={(e) => handleSocialChange('github', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-[#f5f5f5]">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      id="linkedin"
                      value={formData.social?.linkedin || ''}
                      onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-[#f5f5f5]">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={formData.social?.twitter || ''}
                      onChange={(e) => handleSocialChange('twitter', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label htmlFor="pinterest" className="block text-sm font-medium text-[#f5f5f5]">
                      Pinterest URL
                    </label>
                    <input
                      type="url"
                      name="pinterest"
                      id="pinterest"
                      value={formData.social?.pinterest || ''}
                      onChange={(e) => handleSocialChange('pinterest', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="https://pinterest.com/username"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-[#f5f5f5]">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      id="instagram"
                      value={formData.social?.instagram || ''}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#f5f5f5]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.social?.email || ''}
                      onChange={(e) => handleSocialChange('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Custom Links Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#f5f5f5]">Additional Links</h3>
                    <button
                      type="button"
                      onClick={handleCustomLinkAdd}
                      className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff]"
                    >
                      Add Link
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {formData.social?.customLinks?.map((link, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleCustomLinkChange(index, 'title', e.target.value)}
                            placeholder="Link Title"
                            className="block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                            placeholder="https://example.com"
                            className="block w-full rounded-md border-0 bg-[#ffffff0d] py-1.5 text-[#f5f5f5] shadow-sm ring-1 ring-inset ring-[#ffffff1a] focus:ring-2 focus:ring-inset focus:ring-[#646cff] sm:text-sm sm:leading-6"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCustomLinkRemove(index)}
                          className="rounded-md bg-red-500 p-1.5 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Experience</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      experience: [...prev.experience, { title: '', company: '', period: '', description: '' }]
                    }))}
                    className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff]"
                  >
                    Add Experience
                  </button>
                </div>
                {formData.experience?.map((exp, index) => (
                  <div key={index} className="space-y-4 bg-[#ffffff0d] p-4 rounded-lg">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const newExperience = [...formData.experience];
                          newExperience.splice(index, 1);
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={e => {
                          const newExperience = [...formData.experience];
                          newExperience[index] = { ...exp, title: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const newExperience = [...formData.experience];
                          newExperience[index] = { ...exp, company: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Period</label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={e => {
                          const newExperience = [...formData.experience];
                          newExperience[index] = { ...exp, period: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={e => {
                          const newExperience = [...formData.experience];
                          newExperience[index] = { ...exp, description: e.target.value };
                          setFormData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Education</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      education: [...prev.education, { degree: '', institution: '', period: '', description: '' }]
                    }))}
                    className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff]"
                  >
                    Add Education
                  </button>
                </div>
                {formData.education?.map((edu, index) => (
                  <div key={index} className="space-y-4 bg-[#ffffff0d] p-4 rounded-lg">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const newEducation = [...formData.education];
                          newEducation.splice(index, 1);
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index] = { ...edu, degree: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index] = { ...edu, institution: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Period</label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index] = { ...edu, period: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Description</label>
                      <textarea
                        value={edu.description}
                        onChange={e => {
                          const newEducation = [...formData.education];
                          newEducation[index] = { ...edu, description: e.target.value };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Services Section */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Services</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      services: [...prev.services, { title: '', description: '' }]
                    }))}
                    className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff]"
                  >
                    Add Service
                  </button>
                </div>
                {formData.services?.map((service, index) => (
                  <div key={index} className="space-y-4 bg-[#ffffff0d] p-4 rounded-lg">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const newServices = [...formData.services];
                          newServices.splice(index, 1);
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={e => {
                          const newServices = [...formData.services];
                          newServices[index] = { ...service, title: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#f5f5f5]">Description</label>
                      <textarea
                        value={service.description}
                        onChange={e => {
                          const newServices = [...formData.services];
                          newServices[index] = { ...service, description: e.target.value };
                          setFormData(prev => ({ ...prev, services: newServices }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Skills</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      skills: { ...(prev.skills || {}), ['']: [] }
                    }))}
                    className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff]"
                  >
                    Add Category
                  </button>
                </div>
                {formData.skills && Object.entries(formData.skills).map(([category, skills], index) => (
                  <div key={index} className="space-y-4 bg-[#ffffff0d] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={category}
                        onChange={e => {
                          const newSkills = { ...formData.skills };
                          const oldCategory = Object.keys(newSkills)[index];
                          const skillsArray = newSkills[oldCategory];
                          delete newSkills[oldCategory];
                          newSkills[e.target.value] = skillsArray;
                          setFormData(prev => ({ ...prev, skills: newSkills }));
                        }}
                        placeholder="Category Name"
                        className="text-lg font-semibold bg-transparent text-[#f5f5f5] border-b border-[#ffffff1a] focus:border-[#646cff] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = { ...formData.skills };
                          delete newSkills[category];
                          setFormData(prev => ({ ...prev, skills: newSkills }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Category
                      </button>
                    </div>
                    <div className="space-y-2">
                      {skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={e => {
                              const newSkills = { ...formData.skills };
                              newSkills[category][skillIndex] = e.target.value;
                              setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            placeholder="Skill"
                            className="flex-1 rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = { ...formData.skills };
                              newSkills[category] = skills.filter((_, i) => i !== skillIndex);
                              setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newSkills = { ...formData.skills };
                          newSkills[category] = [...skills, ''];
                          setFormData(prev => ({ ...prev, skills: newSkills }));
                        }}
                        className="mt-2 text-sm text-[#646cff] hover:text-[#747bff]"
                      >
                        + Add Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Galleries Section */}
            {activeTab === 'galleries' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-[#f5f5f5]">Image Galleries</h3>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      galleries: [...(prev.galleries || []), { name: '', images: [], aspectRatio: '1/1' }]
                    }))}
                    className="rounded-md bg-[#646cff] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#747bff]"
                  >
                    Add New Gallery
                  </button>
                </div>

                {formData.galleries?.map((gallery, galleryIndex) => (
                  <div key={galleryIndex} className="space-y-6 bg-[#ffffff0d] p-6 rounded-lg">
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#f5f5f5] mb-1">Gallery Name</label>
                        <input
                          type="text"
                          value={gallery.name}
                          onChange={e => {
                            const newGalleries = [...formData.galleries];
                            newGalleries[galleryIndex] = { ...gallery, name: e.target.value };
                            setFormData(prev => ({ ...prev, galleries: newGalleries }));
                          }}
                          placeholder="Enter gallery name"
                          className="block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#f5f5f5] mb-1">Aspect Ratio</label>
                        <select
                          value={gallery.aspectRatio}
                          onChange={e => {
                            const newGalleries = [...formData.galleries];
                            newGalleries[galleryIndex] = { ...gallery, aspectRatio: e.target.value };
                            setFormData(prev => ({ ...prev, galleries: newGalleries }));
                          }}
                          className="block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                        >
                          <option value="1/1">Square (1:1)</option>
                          <option value="9/16">Portrait (9:16)</option>
                          <option value="16/9">Landscape (16:9)</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newGalleries = formData.galleries.filter((_, index) => index !== galleryIndex);
                          setFormData(prev => ({ ...prev, galleries: newGalleries }));
                        }}
                        className="text-red-500 hover:text-red-700 py-1.5"
                      >
                        Remove Gallery
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-[#f5f5f5]">Images</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newGalleries = [...formData.galleries];
                            newGalleries[galleryIndex].images = [...(gallery.images || []), { url: '', caption: '' }];
                            setFormData(prev => ({ ...prev, galleries: newGalleries }));
                          }}
                          className="text-sm text-[#646cff] hover:text-[#747bff]"
                        >
                          + Add Image
                        </button>
                      </div>

                      {gallery.images?.map((image, imageIndex) => (
                        <div key={imageIndex} className="space-y-4 bg-[#ffffff1a] p-4 rounded-lg">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const newGalleries = [...formData.galleries];
                                newGalleries[galleryIndex].images = gallery.images.filter((_, idx) => idx !== imageIndex);
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5]">Image URL</label>
                            <input
                              type="url"
                              value={image.url}
                              onChange={e => {
                                const newGalleries = [...formData.galleries];
                                newGalleries[galleryIndex].images[imageIndex] = { ...image, url: e.target.value };
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                              placeholder="https://example.com/image.jpg"
                              className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#f5f5f5]">Caption</label>
                            <input
                              type="text"
                              value={image.caption}
                              onChange={e => {
                                const newGalleries = [...formData.galleries];
                                newGalleries[galleryIndex].images[imageIndex] = { ...image, caption: e.target.value };
                                setFormData(prev => ({ ...prev, galleries: newGalleries }));
                              }}
                              placeholder="Image caption"
                              className="mt-1 block w-full rounded-md border-0 bg-[#ffffff1a] py-1.5 text-[#f5f5f5]"
                            />
                          </div>
                          {image.url && (
                            <div className="mt-2">
                              <div className="relative w-32 h-32" style={{ aspectRatio: gallery.aspectRatio }}>
                                <img
                                  src={image.url}
                                  alt={image.caption}
                                  className="h-full w-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x300?text=Invalid+Image+URL';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-[#646cff] hover:text-[#747bff]"
                  >
                    + Add Project
                  </button>
                </div>
                {formData.projects.map((project, index) => (
                  <div key={index} className="space-y-4 p-4 border border-[#ffffff1a] rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-[#f5f5f5]">Project {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove Project
                      </button>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                        className="block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                      />
                      <textarea
                        placeholder="Project Description"
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        rows={3}
                        className="block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={project.image}
                        onChange={(e) => handleProjectChange(index, 'image', e.target.value)}
                        className="block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="Live Demo URL"
                        value={project.liveUrl}
                        onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)}
                        className="block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="GitHub URL"
                        value={project.githubUrl}
                        onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)}
                        className="block w-full rounded-md bg-[#ffffff0d] border border-[#ffffff1a] text-[#f5f5f5] px-3 py-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`
                  bg-[#646cff] text-white px-6 py-2 rounded-md
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#747bff]'}
                `}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
