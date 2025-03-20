export default ({ config }) => {
    return {
      ...config,
      extra: {
        googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
      },
    };
  };
  