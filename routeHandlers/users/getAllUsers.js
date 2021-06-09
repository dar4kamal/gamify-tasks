const {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} = require("../../utils/getData");
const notion = require("../../notionClient");

module.exports = async (req, res) => {
  try {
    const { results } = await notion.databases.query({
      database_id: process.env.USERS_DB_ID,
    });

    const usersData = results.map((user) => user.properties);

    const output = usersData.map((user) => {
      return {
        name: getTitle(user.name),
        goals: user.goals.relation.map((goal, index) => {
          return {
            id: goal.id,
            name: getTitle(getRollUpItem(user, "goalsName", index)),
            createdAt: getDate(getRollUpItem(user, "goalsCreatedAt", index)),
            done: getBoolean(getRollUpItem(user, "goalsDone", index)),
          };
        }),
        tasks: user.tasks.relation.map((task, index) => {
          return {
            id: task.id,
            name: getTitle(getRollUpItem(user, "tasksName", index)),
            createdAt: getDate(getRollUpItem(user, "tasksCreatedAt", index)),
            done: getBoolean(getRollUpItem(user, "tasksDone", index)),
            points: getNumber(getRollUpItem(user, "tasksPoint", index)),
          };
        }),
        rewards: user.rewards.relation.map((reward, index) => {
          return {
            id: reward.id,
            name: getTitle(getRollUpItem(user, "rewardsName", index)),
            winAt: getDate(getRollUpItem(user, "rewardWinAt", index)),
            points: getNumber(getRollUpItem(user, "rewardsPoint", index)),
            achevied: getBoolean(getRollUpItem(user, "rewardsAchevied", index)),
          };
        }),
        totalPoints: user.totalPoints.number,
      };
    });
    return res.json(output);
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
};
