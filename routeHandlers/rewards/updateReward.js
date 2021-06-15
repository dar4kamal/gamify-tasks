const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
} = require("../../utils/getData");
const {
  addDate,
  addTitle,
  addNumber,
  addBoolean,
} = require("../../utils/addData");
const notion = require("../../notionClient");
const parseErrors = require("../../utils/parseErrors");
const { Validate } = require("../../validation/rewards");
const checkNotionId = require("../../utils/checkNotionId");

module.exports = async (req, res) => {
  try {
    const { rewardId } = req.params;
    const { name, points, achevied } = req.body;

    // validate reward Id
    const { error: idError } = checkNotionId(rewardId, "rewardId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }
    // validate reward properties
    const { error } = Validate({ name, points, achevied }, "update");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }

    // check if reward exists
    let results = await notion.pages.retrieve({
      page_id: rewardId,
    });

    // update reward
    results = await notion.pages.update({
      page_id: rewardId,
      properties: {
        name: name && addTitle(name),
        points: points && addNumber(points),
        achevied: achevied && addBoolean(achevied),
        winAt: achevied && addDate(new Date().toISOString()),
      },
    });

    const reward = results.properties;

    const output = {
      name: getTitle(reward.name),
      winAt: getDate(reward.winAt),
      points: getNumber(reward.points),
      achevied: getBoolean(reward.done),
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    if (error.message.startsWith("Could not find page with ID"))
      return res.json({
        statusCode: 404,
        errors: [{ input: "rewardId", message: "Reward Not Found ..." }],
      });
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
