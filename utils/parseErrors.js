module.exports = (error) => {
  const { details } = error;

  const errors = details.map((error) => {
    return {
      input: error.path[0],
      value: error.context.value,
      message: error.message,
    };
  });
  return errors;
};
