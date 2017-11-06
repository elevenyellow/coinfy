var bitcoin = require('bitcoin');

var client = new bitcoin.Client({
  host: '34.200.242.216',
  port: 8332,
  user: 'user',
  pass: 'pass'
});

client.getDifficulty(function(err, difficulty) {
  if (err) {
    return console.error(err);
  }

  console.log('Difficulty: ' + difficulty);
});