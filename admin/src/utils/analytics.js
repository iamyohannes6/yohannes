import { getAnalytics, logEvent } from 'firebase/analytics'
import { app } from '../config/firebase'

const analytics = getAnalytics(app)

export const trackEvent = (eventName, eventParams = {}) => {
  try {
    logEvent(analytics, eventName, eventParams)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

export const trackPageView = (pageName) => {
  trackEvent('page_view', { page_name: pageName })
}

export const trackProjectView = (projectId, projectName) => {
  trackEvent('project_view', {
    project_id: projectId,
    project_name: projectName,
  })
}

export const trackContactSubmission = () => {
  trackEvent('contact_submission')
}

export const trackAdminAction = (actionType, details = {}) => {
  trackEvent('admin_action', {
    action_type: actionType,
    ...details,
  })
}

export const trackError = (errorCode, errorMessage) => {
  trackEvent('error', {
    error_code: errorCode,
    error_message: errorMessage,
  })
}
