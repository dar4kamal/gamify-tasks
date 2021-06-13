const Joi = require("joi");
const getErrorMessages = require("../utils/getErrorMessages");
const idRegex = new RegExp(
  /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
);

const nameMessages = getErrorMessages("string", "name", [
  "base",
  "empty",
  "min",
  "max",
  "required",
]);

const notionIdMessages = (name) =>
  getErrorMessages("string", name, ["base", "empty", "pattern", "required"]);

const GoalSchema = (mode = "new") =>
  Joi.object({
    name:
      mode == "update"
        ? Joi.string().min(3).max(30).messages(nameMessages)
        : Joi.string().min(3).max(30).required().messages(nameMessages),
    taskId:
      mode == "update"
        ? Joi.string().pattern(idRegex).messages(notionIdMessages("taskId"))
        : Joi.string()
            .pattern(idRegex)
            .required()
            .messages(notionIdMessages("taskId")),
    done: Joi.boolean(),
  });

module.exports = {
  Validate: (data, mode) =>
    GoalSchema(mode).validate(data, { abortEarly: false }),
};
