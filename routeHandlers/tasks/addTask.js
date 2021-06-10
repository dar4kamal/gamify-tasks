const {
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const { addTitle, addNumber, addRelation } = require("../../utils/addData");

module.exports = async (req, res) => {
  try {
    const { name, points, userId, goalId } = req.body;

    const results = await notion.pages.create({
      parent: { database_id: process.env.TASKS_DB_ID },
      properties: {
        name: addTitle(name),
        points: addNumber(points),
        user: addRelation(userId),
        goals: addRelation(goalId),
      },
    });

    const task = results.properties;

    const output = {
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
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
