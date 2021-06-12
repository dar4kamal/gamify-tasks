const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
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
      database_id: process.env.TASKS_DB_ID,
      filter: {
        and: [
          {
            property: "user",
            relation: {
              contains: userId,
            },
          },
          ...filters,
        ],
      },
      sorts: sortParams,
    });

    const tasks = results.map((task) => task.properties);

    const output = tasks.map((task, index) => {
      return {
        id: results[index].id,
        name: getTitle(task.name),
        goals: task.goals.relation.map((goal, index) => {
          return {
            id: goal.id,
            name: getTitle(getRollUpItem(task, "goalsName", index)),
          };
        }),
        points: getNumber(task.points),
        done: getBoolean(task.done),
        createdAt: getDate(task.createdAt),
        doneAt: getDate(task.doneAt),
      };
    });
    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
};
