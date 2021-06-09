require("dotenv").config();
const { Client } = require("@notionhq/client");

// Initializing a client
module.exports = new Client({
  auth: process.env.NOTION_TOKEN,
});
