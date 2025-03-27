export default ({ config }) => {
  return {
    ...config,
    extra: {
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    },
    plugins: [
      "expo-secure-store",
    ],
  };
};