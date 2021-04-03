# Backend!

* Start the development process: `npm start`
* Build: `npm run build`
* Start the production process: `npm run prod`
* Build and start the production process: `npm run deploy`
* To provide a login and a password, create a `.env` file and fill it in according to `.env.sample`. **This will work both in production and development.**
* Port can be provided in `.env` file according to `.env.sample`. By default, port is `3000`.
* Allowed origin is also set in `.env`. By default, origin is `*` which means *any* origin.

## API reference

### GET `/`
Why not?

Returns:
```json
{
  "hello": "world"
}
```

### GET `/api/leaderboard`
Just get the TOP-100

Optionally, you can pass `?extended` to get users with two their last games.

Returns:

```json
[
  {
    "place": 1,
    "name": "roamiiing",
    "rank": "9d"
  }
]
```

### GET `/api/game/:timestamp`
* `timestamp`: ISO Date, e.g: `2020-11-11T12:32:22.927Z`

Retuns:

```json
{
  "gameType": "review",
  "score": "UNFINISHED",
  "private": true,
  "komi": -9.5,
  "size": 19,
  "handicap": 6,
  "inPlay": true,
  "timestamp": "some iso timestamp, but this is not the requested one as KGS creates copy of the game",
  "revision": 14,
  "players": {
    "white": {
      "name": "name",
      "rank": 39
    },
    "black": {
      "name": "name",
      "rank": 39
    }
  },
  "moves": [
    {
      "side": "white | black",
      "id": 5,
      "location": {
        "x": 0,
        "y": 0
      }
    }
  ]
}
```

### GET `/api/games/:name`

Get the first **2** games of the given user. Optionally, you can pass `?extended` to get all of them.

Returns:

```json
[
  {
    "gameType": "ranked",
    "score": "W+RESIGN",
    "komi": -9.5,
    "size": 19,
    "players": {
      "white": {
        "name": "name",
        "flags": "=",
        "rank": 39
      },
      "black": {
        "name": "name",
        "flags": "c=",
        "rank": 39
      }
    }
  }
]
```
