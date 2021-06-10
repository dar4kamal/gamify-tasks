const { createFilter } = require("./filters");
module.exports = (query) => {
  let sortParams = [];
  let filters = [];
  Object.keys(query)?.forEach((queryItem) => {
    if (queryItem == "sort") {
      query[queryItem].split(",").forEach((sort) => {
        const [property, direction] = sort.split(":");
        sortParams.push({ property, direction });
      });
    } else {
      const [type, condition, value] = query[queryItem].split(":");
      filters.push(createFilter({ name: queryItem, type, condition, value }));
    }
  });
  return { sortParams, filters };
};
