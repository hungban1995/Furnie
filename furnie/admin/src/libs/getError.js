const getError = (err) => {
  if (err.response && err.response.data) {
    return err.response.data.error;
  }
  return err.message;
};
export default getError;
