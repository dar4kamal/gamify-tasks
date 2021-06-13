const notion = require("../../notionClient");
const parseErrors = require("../../utils/parseErrors");
const { Validate } = require("../../validation/goals");
const { getDate, getTitle } = require("../../utils/getData");
const { addDate, addTitle, addRelation } = require("../../utils/addData");

module.exports = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const { error } = Validate({ name, userId }, "new");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }
    const results = await notion.pages.create({
      parent: { database_id: process.env.GOALS_DB_ID },
      properties: {
        name: addTitle(name),
        users: addRelation(userId),
        createdAt: addDate(new Date().toISOString()),
      },
    });

    const goal = results.properties;

    const output = {
      id: results.id,
      name: getTitle(goal.name),
      tasks: [],
      createdAt: getDate(goal.createdAt),
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
