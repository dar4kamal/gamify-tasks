const {
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
  getDate,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const {
  addTitle,
  addNumber,
  addRelation,
  addDate,
} = require("../../utils/addData");
const parseErrors = require("../../utils/parseErrors");
const { ValidateTask } = require("../../validation/tasks");

module.exports = async (req, res) => {
  try {
    const { name, points, userId, goalId } = req.body;

    const { error } = ValidateTask({ name, points, userId, goalId }, "new");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }
    const results = await notion.pages.create({
      parent: { database_id: process.env.TASKS_DB_ID },
      properties: {
        name: addTitle(name),
        points: addNumber(points),
        user: addRelation(userId),
        goals: addRelation(goalId),
        createdAt: addDate(new Date().toISOString()),
      },
    });

    const task = results.properties;

    const output = {
      id: results.id,
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
