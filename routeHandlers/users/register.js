const notion = require("../../notionClient");
const {
  addText,
  addTitle,
  addEmail,
  addNumber,
} = require("../../utils/addData");
const {
  getText,
  getTitle,
  getEmail,
  getNumber,
} = require("../../utils/getData");

module.exports = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const { results } = await notion.databases.query({
      database_id: process.env.USERS_DB_ID,
    });
    const usersData = results.map((user) => user.properties);

    const selectedUser = usersData.find(
      (user) =>
        getEmail(user.email) === email && getText(user.password) === password
    );
    if (selectedUser)
      return res.json({
        statusCode: 404,
        errors: [{ input: "user", message: "User already exists ..." }],
      });

    // add new user
    const newResults = await notion.pages.create({
      parent: { database_id: process.env.USERS_DB_ID },
      properties: {
        name: addTitle(name),
        email: addEmail(email),
        password: addText(password),
        totalPoints: addNumber(0),
      },
    });

    const user = newResults.properties;

    const output = {
      name: getTitle(user.name),
      goals: [],
      tasks: [],
      rewards: [],
      totalPoints: getNumber(user.totalPoints),
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
