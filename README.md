# Gamify Tasks

REST-API CRUD Project that consists of: 
* Users
* Tasks
* Goals
* Rewards

A user can => 
* login & register
* add new Goal
* add new Tasks related to that Goal
* update tasks when done 
* collect points from finishing tasks
* earn rewards by the points collected from tasks


## Tech Stack
Node - Express - Notion Client SDK - Joi Validation

  
## Documentation

* [API Base URL](https://fathomless-mountain-35942.herokuapp.com/)
* [Postman Docs](https://documenter.getpostman.com/view/15049659/TzeUop2a)
* [Notion Database Template](https://www.notion.so/makrwsky/Gamify-tasks-template-42073cbebe194c9b8c6ff41567740723)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NOTION_TOKEN` 
Notion Secret Token that U can get from a notion integration

`USERS_DB_ID` : Users Table ( Database Id from Notion API )

`TASKS_DB_ID` : Tasks Table ( Database Id from Notion API )

`GOALS_DB_ID` : Goals Table ( Database Id from Notion API )

`REWARDS_DB_ID` : Rewards Table ( Database Id from Notion API )
