const {
  getDate,
  getTitle,
  getBoolean,
  getRollUpItem,
  getRollUpArray,
} = require("../../utils/getData");
const {
  addDate,
  addTitle,
  addBoolean,
  addRelation,
} = require("../../utils/addData");
const notion = require("../../notionClient");
const parseErrors = require("../../utils/parseErrors");
const { Validate } = require("../../validation/goals");
const checkNotionId = require("../../utils/checkNotionId");

module.exports = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { name, taskId, done } = req.body;

    // validate goal Id
    const { error: idError } = checkNotionId(goalId, "goalId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }
    // validate goal properties
    const { error } = Validate({ name, taskId, done }, "update");
    if (error) {
      return res.json({ statusCode: 400, errors: parseErrors(error) });
    }

    // check if goal exists
    let results = await notion.pages.retrieve({
      page_id: goalId,
    });

    const { properties } = results;

    // update goal
    results = await notion.pages.update({
      page_id: goalId,
      properties: {
        name: name && addTitle(name),
        tasks:
          taskId &&
          (getRollUpArray(properties?.tasks).length > 0
            ? {
                relation: [
                  ...getRollUpArray(properties?.tasks),
                  { id: taskId },
                ],
              }
            : addRelation(taskId)),
        done: done && addBoolean(done),
        doneAt: done && addDate(new Date().toISOString()),
      },
    });

    const goal = results.properties;

    const output = {
      name: getTitle(goal.name),
      tasks: goal.tasks.relation.map((task, index) => {
        return {
          id: task.id,
          name: getTitle(getRollUpItem(goal, "tasksName", index)),
        };
      }),
      done: getBoolean(goal.done),
      createdAt: getDate(goal.createdAt),
      doneAt: getDate(goal.doneAt),
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
