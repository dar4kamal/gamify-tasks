const addTitle = (input) => {
  return {
    title: [
      {
        text: {
          content: input,
        },
      },
    ],
  };
};
const addEmail = (input) => {
  return { email: input };
};
const addText = (input) => {
  return {
    rich_text: [
      {
        text: {
          content: input,
        },
      },
    ],
  };
};

const addNumber = (input) => {
  return { number: input };
};
const addDate = (input) => {
  return { date: { start: input, end: null } };
};
const addBoolean = (input) => {
  return { checkbox: input };
};

module.exports = {
  addDate,
  addText,
  addEmail,
  addTitle,
  addNumber,
  addBoolean,
};
