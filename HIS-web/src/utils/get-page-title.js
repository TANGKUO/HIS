import defaultSettings from '@/settings'

const title = defaultSettings.title || '东软云医院'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
