const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const { addBoolean } = require("../../utils/addData");
const parseErrors = require("../../utils/parseErrors");
const checkNotionId = require("../../utils/checkNotionId");

module.exports = async (req, res) => {
  try {
    const { taskId } = req.params;

    // validate task Id
    const { error: idError } = checkNotionId(taskId, "taskId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }

    // check if task exists
    let results = await notion.pages.retrieve({
      page_id: taskId,
    });

    // TODO until notion provide a proper deletion for a page
    // * results = await notion.request({
    // *   path: `pages/${taskId}`,
    // *   method: "DELETE",
    // *   body: {
    // *     parent: { database_id: process.env.TASKS_DB_ID },
    // *   },
    // * });

    // update task
    results = await notion.pages.update({
      page_id: taskId,
      properties: {
        removed: addBoolean(true),
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
      doneAt: getDate(task.doneAt),
      removed: getBoolean(task.removed),
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
