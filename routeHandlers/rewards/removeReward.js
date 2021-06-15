const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const { addBoolean } = require("../../utils/addData");
const parseErrors = require("../../utils/parseErrors");
const checkNotionId = require("../../utils/checkNotionId");

module.exports = async (req, res) => {
  try {
    const { rewardId } = req.params;

    // validate goal Id
    const { error: idError } = checkNotionId(rewardId, "rewardId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }

    // check if goal exists
    let results = await notion.pages.retrieve({
      page_id: rewardId,
    });

    // TODO until notion provide a proper deletion for a page
    // * results = await notion.request({
    // *   path: `pages/${rewardId}`,
    // *   method: "DELETE",
    // *   body: {
    // *     parent: { database_id: process.env.REWARDS_DB_ID },
    // *   },
    // * });

    // check if given Id refers to a reward item
    const isReward = results.parent.database_id == process.env.REWARDS_DB_ID;
    if (!isReward)
      return res.json({
        statusCode: 400,
        errors: [{ input: "rewardId", message: "Invalid Id" }],
      });

    results = await notion.pages.update({
      page_id: rewardId,
      properties: {
        removed: addBoolean(true),
      },
    });

    const reward = results.properties;

    const output = {
      name: getTitle(reward.name),
      points: getNumber(reward.points),
      achevied: getBoolean(reward.achevied),
      winAt: getDate(reward.winAt),
      removed: getBoolean(reward.removed),
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
