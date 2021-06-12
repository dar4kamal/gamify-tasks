const notion = require("../../notionClient");
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
    results = await notion.request({
      path: `pages/${taskId}`,
      method: "DELETE",
      body: {
        parent: { database_id: process.env.TASKS_DB_ID },
      },
    });

    return res.json(results);
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
