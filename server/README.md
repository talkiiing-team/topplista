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
