const notion = require("../../notionClient");
const parseErrors = require("../../utils/parseErrors");
const { Validate } = require("../../validation/rewards");
const { getTitle, getNumber } = require("../../utils/getData");
const { addTitle, addRelation, addNumber } = require("../../utils/addData");

module.exports = async (req, res) => {
  try {
    const { name, points, userId } = req.body;

    const { error } = Validate({ name, userId, points }, "new");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }
    const results = await notion.pages.create({
      parent: { database_id: process.env.REWARDS_DB_ID },
      properties: {
        name: addTitle(name),
        user: addRelation(userId),
        points: addNumber(points),
      },
    });

    const reward = results.properties;

    const output = {
      id: results.id,
      name: getTitle(reward.name),
      points: getNumber(reward.points),
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
