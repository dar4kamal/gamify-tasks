const getTitle = (object) => {
  return object?.title[0]?.plain_text;
};
const getEmail = (object) => {
  return object?.email;
};
const getText = (object) => {
  return object?.rich_text[0]?.plain_text;
};
const getNumber = (object) => {
  return object?.number;
};
const getDate = (object) => {
  return object?.date?.start;
};
const getBoolean = (object) => {
  return object?.checkbox;
};

const getRollUpItem = (object, propertyName, index) => {
  return object[propertyName]?.rollup?.array[index];
};

module.exports = {
  getDate,
  getText,
  getEmail,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
};
