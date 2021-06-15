const Joi = require("joi");
const getErrorMessages = require("../utils/getErrorMessages");
const idRegex = new RegExp(
  /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
);

const nameMessages = getErrorMessages("string", "name", [
  "base",
  "empty",
  "min",
  "required",
]);
const pointsMessages = getErrorMessages("number", "points", [
  "base",
  "empty",
  "min",
  "required",
]);

const notionIdMessages = (name) =>
  getErrorMessages("string", name, ["base", "empty", "pattern", "required"]);

const RewardSchema = (mode = "new") =>
  Joi.object({
    name:
      mode == "update"
        ? Joi.string().min(3).messages(nameMessages)
        : Joi.string().min(3).required().messages(nameMessages),
    points:
      mode == "update"
        ? Joi.number().min(1).messages(pointsMessages)
        : Joi.number().min(1).required().messages(pointsMessages),
    userId:
      mode == "update"
        ? Joi.string().pattern(idRegex).messages(notionIdMessages("userId"))
        : Joi.string()
            .pattern(idRegex)
            .required()
            .messages(notionIdMessages("userId")),
    achevied: Joi.boolean(),
  });

module.exports = {
  Validate: (data, mode) =>
    RewardSchema(mode).validate(data, { abortEarly: false }),
};
