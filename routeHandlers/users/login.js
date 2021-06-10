const notion = require("../../notionClient");
const {
  getDate,
  getText,
  getTitle,
  getEmail,
  getNumber,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { results } = await notion.databases.query({
      database_id: process.env.USERS_DB_ID,
    });
    const usersData = results.map((user) => user.properties);

    const selectedUser = usersData.find(
      (user) =>
        getEmail(user.email) === email && getText(user.password) === password
    );
    if (!selectedUser)
      return res.json({
        statusCode: 404,
        errors: [{ input: "user", message: "User not found ... " }],
      });

    const output = {
      id: results[usersData.indexOf(selectedUser)].id,
      name: getTitle(selectedUser.name),
      goals: selectedUser.goals.relation.map((goal, index) => {
        return {
          id: goal.id,
          name: getTitle(getRollUpItem(selectedUser, "goalsName", index)),
          createdAt: getDate(
            getRollUpItem(selectedUser, "goalsCreatedAt", index)
          ),
          done: getBoolean(getRollUpItem(selectedUser, "goalsDone", index)),
        };
      }),
      tasks: selectedUser.tasks.relation.map((task, index) => {
        return {
          id: task.id,
          name: getTitle(getRollUpItem(selectedUser, "tasksName", index)),
          createdAt: getDate(
            getRollUpItem(selectedUser, "tasksCreatedAt", index)
          ),
          done: getBoolean(getRollUpItem(selectedUser, "tasksDone", index)),
          points: getNumber(getRollUpItem(selectedUser, "tasksPoint", index)),
        };
      }),
      rewards: selectedUser.rewards.relation.map((reward, index) => {
        return {
          id: reward.id,
          name: getTitle(getRollUpItem(selectedUser, "rewardsName", index)),
          winAt: getDate(getRollUpItem(selectedUser, "rewardWinAt", index)),
          points: getNumber(getRollUpItem(selectedUser, "rewardsPoint", index)),
          achevied: getBoolean(
            getRollUpItem(selectedUser, "rewardsAchevied", index)
          ),
        };
      }),
      totalPoints: selectedUser.totalPoints.number,
    };

    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json({ statusCode: 500, errors: [{ message: error.message }] });
  }
};
