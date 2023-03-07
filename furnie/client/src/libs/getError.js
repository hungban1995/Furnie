const getError = (err) => {
  if (err.response && err.response.data.error) {
    return {
      error: true,
      message: err.response.data.error,
    };
  }
  return {
    error: true,
    message: err.message,
  };
};
export default getError;
