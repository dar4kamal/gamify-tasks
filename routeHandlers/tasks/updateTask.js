const {
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
  getDate,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const parseErrors = require("../../utils/parseErrors");
const { ValidateTask } = require("../../validation/tasks");
const checkNotionId = require("../../utils/checkNotionId");
const { addTitle, addNumber, addRelation } = require("../../utils/addData");

module.exports = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, points, userId, goalId } = req.body;

    // validate task Id
    const { error: idError } = checkNotionId(taskId, "taskId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }
    // validate task properties
    const { error } = ValidateTask({ name, points, userId, goalId }, "update");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }

    // check if task exists
    let results = await notion.pages.retrieve({
      page_id: taskId,
    });

    const { properties } = results;

    // update task
    results = await notion.pages.update({
      page_id: taskId,
      properties: {
        name: name ? addTitle(name) : addTitle(getTitle(properties.name)),
        points: points
          ? addNumber(points)
          : addNumber(getNumber(properties.points)),
        user: userId && addRelation(userId),
        goals: goalId && addRelation(goalId),
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
    if (error.message.startsWith("Could not find page with ID"))
      return res.json({
        statusCode: 404,
        errors: [{ input: "taskId", message: "Task Not Found ..." }],
      });
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
