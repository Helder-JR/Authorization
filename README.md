# Authorization API 🔐
---
## A RESTful API made with [Node.js](https://nodejs.org/) - [TypeScript](https://www.typescriptlang.org/) - [PostgreSQL](https://www.postgresql.org/) - [Express](http://expressjs.com/) - [Knex](http://knexjs.org/) - [JWT](https://jwt.io/)
<br>

## Main Features 👥 🏡

This API is perfect for simple taks, giving you the ability to CRUD on users and address, and all the responses use the JSON format.
* **Authentication:** The administrator of the system must be logged in before other actions can be performed.
* **Authorization:** The login process generates a JWT to the response header, which can be used to grant access to the users, addresses and operations related to homes.
* **Entities:** To create, delete, update, list all and show one of the users or addresses is simple. Just add the route **`/users`** or **`/addresses`** and the **`/:id`** when it's needed.
* **Homes:** You can associate, dissociate, show addresses associated to a specific user or show users associated to a specific address.

## Installation ⚙
1. Before all, check if you have Node.js and npm installed, going on your terminal and typing:
    - **`node --version`**
    - **`npm --version`**
2. If these commands are unrecognized by your terminal, go to **[Node.js](https://nodejs.org/en/download/)** page to download and install it. Then go to step 1 again.
3. After that, you can clone the project to your local machine using:
    - **`git clone https://github.com/Helder-JR/Authorization.git`**
    - Or if you prefer to download it, just click on the green Code button above and click in **`Download ZIP`**
4. Now you have to enter the project folder and open it on your prefered IDE. I strongly recommend **[Microsoft Visual Studio Code](https://code.visualstudio.com/)**:
    - Just **`cd Authorization-master`** if you are running through terminal, and then **`code .`** to open the project folder on VS Code.
5. Open the terminal inside the IDE (usually **`Ctrl + J`** in VS Code on Windows) and then type the command for the package manager to download the necessary dependencies for the project to work.
    - **`npm install`**
6. Now you have to setup the environment variables by creating a **`.env`** at the root of the project:
    - On Windows: **`echo.> .env`**
    - On Unix based Systems: **`touch .env`**
7. Paste the blank **`.env`** variables below inside the **`.env`** file you created. Don't worry about this now, you will change and understand them:

    ```
    API_HOST=127.0.0.1
    API_PORT=3333

    NODE_ENV=development

    DB_NAME=putheretheusernameyouwantforthedatabase
    DB_USER=putheretheusernameyouwantforthedatabase
    DB_PASS=putheretheusernameyouwantforthedatabase

    ROUNDS=10

    ADMIN_USERNAME=putheretheusernameyouwantfortheadmin
    ADMIN_PASSWORD=putherethepasswordyouwantfortheadmin

    TOKEN_SECRET=4ZPoBiEUYnYd9nNFbslj2BawMDDG9QPKKtpek1EE5wSVrrk5EW7gbYEFJXHmM2PaWv6USy3VKdEBm+gG7imQtg==
    ```
8. Now I'll explain you each one of these variables and their function in the application: Note that all variables will be converted to `string` when read by the dotenv module.
    - **`API_HOST`** is the host that the server will use to listen the requests you make to the API. Be careful if you want to change it!
    - **`API_PORT`** is the port that the server will use to listen the requests you make to the API. You can keep 3333 or change to anyone you want. But be careful!
    - **`NODE_ENV`** is the environment of the API. You can change it to `development` or `staging` or `production`, but make this before starting the API.
    - **`DB_NAME`** is the name of the database, used when you are in a `staging` or `production` environment. `development` uses a local SQLite3 database.
    - **`DB_USER`** is the username used to connect to the database specified above.
    - **`DB_PASS`** is the password used to connect to the database specified above.
    - **`ROUNDS`** is the number of times that the bcrypt encryption algorithm will hash over the password used to create a new administrator. 10 is the default.
    - **`ADMIN_USERNAME`** is the username of the default administrator of the system. You will use it to log in.
    - **`ADMIN_PASSWORD`** is the default password used by the administrator to log into the system.
    - **`TOKEN_SECRET`** it is a base64 token used to create a JWT that will be used to authorize the administrator to use the system operations.
9. After setting all the variables in the **`.env`** file, you only need to run the API. I will teach you below.

## Usage ⚡
After the whole process of setup, now it's time to put this API to run! There are 6 different commands to run the server in specific environments.
<br>
**REMEMBER: DON'T FORGET TO CHANGE THE NODE_ENV ON THE `.env` FILE BEFORE RUNNING THESE COMMANDS!**
<br>
<br>
All comands below only work in the syntax: **`npm run <command>`** (Without the brackets)
<br>
<br>
| COMMAND | DESCRIPTION |
| :-----: | ----------- |
| **`dev:setup`** | Configurates the project to create a SQLite3 database, migrate the scheams and seed it. Used in the development environment. |
| **`dev:start`** | Starts the project in the development environment. |
|  |
| **`stg:setup`** | Configurates the project to the specified database on the `.env`, then migrate the scheams and seed the database. Used in the staging environment. |
| **`stg:start`** | Starts the project in the staging environment. |
|  |
| **`prd:setup`** | Configurates the project to the specified database on the `.env`, then migrate the scheams and seed the database. Used in the production environment. |
| **`prd:start`** | Starts the project in the production environment. |

**Tip:** If you don't know which to use, just start with **`npm run dev:setup`** and then **`npm run dev:start`**.

## Routes 🌐
The routes below are used to take information from and to the API resources.
<br>
**Note:** Before all routes below it's present the **`/api`** route.
<br>
| METHOD | ROUTE | DESCRIPTION | TABLE |
| :----: | ----- | ----------- | :---: |
| **POST** | **`/login`** | Used by the administrator of the system to log in and have access granted to all routes. | **ADMINS** |
| **POST** | **`/register`** | Used to create another administrator in the system. Only available if already logged in. | **ADMINS** |
|  |
| **GET** | **`/users`** | Used to list all users in the system. | **USERS** |
| **GET** | **`/users/:id`** | Used to show a single user present in the system. | **USERS** |
| **POST** | **`/users`** | Used to insert a new user in the system. | **USERS** |
| **PUT** | **`/users/:id`** | Used to change the attributes of an existing user in the system. | **USERS** |
| **DELETE** | **`/users/:id`** | Used to delete an user from the system. | **USERS** |
|  |
| **GET** | **`/addresses`** | Used to list all addresses stored in the system. | **ADDRESSES** |
| **GET** | **`/addresses/:id`** | Used to show a single address entry from the system. | **ADDRESSES** |
| **POST** | **`/addresses`** | Used to create a new address into the system. | **ADDRESSES** |
| **PUT** | **`/addresses/:id`** | Used to change the attributes from an address in the system. | **ADDRESSES** |
| **DELETE** | **`/addresses/:id`** | Used to delete an address entry from the system. | **ADDRESSES** |
|  |
| **GET** | **`/addressof/:user_id`** | Show all addresses associated to a specific user. | **HOMES** |
| **GET** | **`/usersof/:address_id`** | Show all users associated to a specific address | **HOMES** |
| **POST** | **`/homes/:user_id/:address_id`** | Associate an user to an address. | **HOMES** |
| **DELETE** | **`/homes/:user_id/:address_id`** | Dissociate an user from an address. | **HOMES** |

## Testing 👁‍🗨
A file with requests for all routes can be found [here](/api-requests.json), to be imported by Insomnia or other REST clients.

## Future Updates ♻
Future updates include creating more routes related to homes, routes to search in users and addresses using filers, adding the option to delete a adminstrator and also 
create a frontend client for this API.

## About Me 👨🏻‍💻
I'm a brazilian backend developer and computer science undergraduate passionated for continuously learning and self improvement.
<br>
- [LinkedIn](https://www.linkedin.com/in/heldercljr/)
- [Twitter](https://twitter.com/heldercljr)
