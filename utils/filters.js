const numberFilters = [
  "equals",
  "less_than",
  "greater_than",
  "less_than_or_equal_to",
  "greater_than_or_equal_to",
];
const textFilters = ["contains"];
const dateFilters = [
  "equals",
  "before",
  "after",
  "on_or_before",
  "on_or_after",
];
const booleanFilters = ["equals"];

const createFilter = ({ name, value, type, condition }) => {
  let object = {};
  object.property = name;
  object[type] = {};
  switch (type) {
    case "number":
      object[type][condition] = Number(value);
      break;
    case "date":
      object[type][condition] = new Date(value);
      break;
    case "checkbox":
      object[type][condition] = Boolean(value);
      break;
    default:
      object[type][condition] = value;
      break;
  }
  return object;
};

module.exports = {
  textFilters,
  dateFilters,
  createFilter,
  numberFilters,
  booleanFilters,
};
