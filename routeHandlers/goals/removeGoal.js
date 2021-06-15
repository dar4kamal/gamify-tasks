const {
  getDate,
  getTitle,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");
const notion = require("../../notionClient");
const { addBoolean } = require("../../utils/addData");
const parseErrors = require("../../utils/parseErrors");
const checkNotionId = require("../../utils/checkNotionId");

module.exports = async (req, res) => {
  try {
    const { goalId } = req.params;

    // validate goal Id
    const { error: idError } = checkNotionId(goalId, "goalId");
    if (idError) {
      return res.json({ statusCode: 400, errors: parseErrors(idError) });
    }

    // check if goal exists
    let results = await notion.pages.retrieve({
      page_id: goalId,
    });

    // TODO until notion provide a proper deletion for a page
    // * results = await notion.request({
    // *   path: `pages/${goalId}`,
    // *   method: "DELETE",
    // *   body: {
    // *     parent: { database_id: process.env.GOALS_DB_ID },
    // *   },
    // * });

    // check if given Id refers to a goal item
    const isGoal = results.parent.database_id == process.env.GOALS_DB_ID;
    if (!isGoal)
      return res.json({
        statusCode: 400,
        errors: [{ input: "goalId", message: "Invalid Id" }],
      });

    results = await notion.pages.update({
      page_id: goalId,
      properties: {
        removed: addBoolean(true),
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
      removed: getBoolean(goal.removed),
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    if (error.message.startsWith("Could not find page with ID"))
      return res.json({
        statusCode: 404,
        errors: [{ input: "goalId", message: "Goal Not Found ..." }],
      });
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
