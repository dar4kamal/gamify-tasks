const {
  getDate,
  getTitle,
  getBoolean,
  getRollUpItem,
  getRollUpNumber,
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
      database_id: process.env.GOALS_DB_ID,
      filter: {
        and: [
          {
            property: "users",
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

    const goals = results.map((goal) => goal.properties);

    const output = goals.map((goal, index) => {
      const tasksCount = getRollUpNumber(goal, "tasksCount");
      const tasksDone = getRollUpNumber(goal, "tasksDone");
      return {
        id: results[index].id,
        name: getTitle(goal.name),
        done: getBoolean(goal.done),
        createdAt: getDate(goal.createdAt),
        doneAt: getDate(goal.doneAt),
        percent: Math.round((tasksDone / tasksCount) * 100),
        tasks: goal.tasks.relation.map((task, index) => {
          return {
            id: task.id,
            name: getTitle(getRollUpItem(goal, "tasksName", index)),
          };
        }),
      };
    });
    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
};
