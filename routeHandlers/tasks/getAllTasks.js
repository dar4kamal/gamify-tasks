const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");
const notion = require("../../notionClient");

module.exports = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
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
        property: "user",
        relation: {
          contains: userId,
        },
      },
    });

    const tasks = results.map((task) => task.properties);

    const output = tasks.map((task) => {
      return {
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
