# **Topplista** by /talkiiing

This project is licesend under the [MIT license](LICENSE). Feel free to use it in any way you want, but if your computer explodes, you cannot blame us lmao. 💻🔥😳

---

## Brief description
This repository contains a leaderboard for KGS Go game server. Created by [roamiiing](github.com/roamiiing) and [talkenson](github.com/talkenson). Its functionality includes:
- Listing top-100 players
- Listing players' most recent games
- Watching their games with rewind

## Project structure
This is a client-server web application. The repository consists of two folders: `client` and `server` both of which are **Node.js** packages.

The whole project is written in **TypeScript** which is is an open-source language that builds on JavaScript and provides strict typization. To enforce code style we are using **ESLint**, because we are working in a ~~small~~ team and the code must be consistent.

We are using lots of open-source JavaScript framewokrs and libraries which are listed below.

### Client
The client is a single page web application. Used technologies and libraries:
* **React** - framework for creating user interfaces
* **axios** - makes HTTP requests
* **node-sass and SCSS** - CSS pre-processors
* **luxon** - makes date-time processing in javascript a lot better

### Server
The server is a RESTful API which connects to the KGS server with provided login and password. Used technologies:
* **express** - REST API framework
* **axios** - makes HTTP requests
* **cherio** - scrapes html pages (is used to scrape the leaderboard)
* **nodemon** - watches files and refreshes the process on any change

There are also smaller packages such as:
* **cors** and **helmet** - set the right headers for HTTP responses
* **connect-timeout** and **express-queue** - express middlewares to add automatic timeout and queue management
* **dotenv** - provide environmental variables to the API. The usage is described [here](server/README.md).

The API is documented and the documentation is available [here](server/README.md).

The backend is deployed to a VPS hosting which is configured with nginx.

### How server works
* The application attempts to send a `LOGIN` request to KGS.
* After it is logged in, it constantly sends `GET` requests and gets data.
* The needed data is *cached* in a custom cache service, which is made to make multiple users able to send requests at the same time as KGS responds randomly.
* When the user sends a request, the endpoint handler makes a request and subscribes to the cache changes. When the content is delivered, the handler returns the requested data to user.

The leaderboard itself returns data from the scrapped web page from the kgsgo.com website.

![Server workflow diagram](https://i.ibb.co/s9K0rQb/diagram-server.png)

### How client works
Basically, the client just sends requests to the server, caches them and displays to a user.

Because KGS returns moves for the game without board states at every moment, we have to calculate them ourselves. So we implemented the [flood-fill](https://en.wikipedia.org/wiki/Flood_fill) algorithm and added some Go game logic to it to remove stones from the board when they are surrounded.

The frontend is deployed to a static CDN called [Vercel](vercel.com) at domain topplista.roamiiing.ru, which is owned and configured by ourselves.

## Demonstration

The project is deployed and can be found [**here**](topplista.roamiiing.ru).

[Watch a video demo here](yt.be)
