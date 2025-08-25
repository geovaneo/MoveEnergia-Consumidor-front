export const getBaseURL = () => {
  const env = import.meta.env.VITE_APP_ENV

  switch (env) {
    case 'DEV':
      return 'https://consumidorgd.api.qa.moveenergia.com'
    case 'QAS':
      return 'https://consumidorgd.api.qa.moveenergia.com'
    case 'PROD':
      return 'https://consumidorgd.api.prod.moveenergia.com'
    default:
      return 'https://consumidorgd.api.qa.moveenergia.com'
  }
}

