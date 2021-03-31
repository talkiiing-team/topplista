# go-peaderboard

* Start the development process: `npm start`
* Build: `npm run build`

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
