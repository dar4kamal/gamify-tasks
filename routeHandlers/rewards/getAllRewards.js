const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const handleQuery = require("../../utils/handleQuery");

module.exports = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const query = req.query;
    const { sortParams, filters } = handleQuery(query);

    if (!userId)
      return res.json({
        statusCode: 401,
        errors: [
          {
            input: "userId",
            message: "Unauthorized access, please provide a user id",
          },
        ],
      });

    const { results } = await notion.databases.query({
      database_id: process.env.REWARDS_DB_ID,
      filter: {
        and: [
          {
            property: "user",
            relation: {
              contains: userId,
            },
          },
          {
            property: "removed",
            checkbox: {
              equals: false,
            },
          },
          ...filters,
        ],
      },
      sorts: sortParams,
    });

    const rewards = results.map((reward) => reward.properties);

    const output = rewards.map((reward, index) => {
      return {
        id: results[index].id,
        name: getTitle(reward.name),
        winAt: getDate(reward.winAt),
        points: getNumber(reward.points),
        achevied: getBoolean(reward.achevied),
      };
    });
    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
};
