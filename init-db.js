#!/usr/bin/env node

var argv = require('optimist')
    .usage('Install Mongolike.\nUsage: $0')
    .demand('d')
    .alias('d', 'database')
    .describe('d', 'Database to be installed in')
    .default('h', 'localhost')
    .alias('h', 'host')
    .describe('h', 'Database host')
    .default('p', '5432')
    .alias('p', 'port')
    .describe('u', 'User')
    .default('u', 'postgres')
    .alias('u', 'user')
    .argv,

pg = require('pg'),
fs   = require('fs');

var sqlFiles = fs.readdirSync(__dirname + "/sql/").sort();

var conString = "postgres://" + argv.u + ":" + argv.p + "@" + argv.h + "/" + argv.d;

var client = new pg.Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error('could not connect to postgres', err.toString());
  }

  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if (err) {
      return console.error('error running query', err);
    }
    readAndApply(client, sqlFiles, 0);
  });
});

function readAndApply (client, sqlFiles, current) {
  if (current === sqlFiles.length) {
    console.log("Complete");
    client.end();
  } else {
    console.log("Applying " + sqlFiles[current]);
    var file = fs.readFileSync(__dirname + "/sql/" + sqlFiles[current], "utf8");
    // [todo] - check for current version, if possible, run a migration from each version instead of dropping and recreating
    client.query(file, function (err, result) {
      if (err) {
        console.log("Error: " + err);
      } else {
        readAndApply(client, sqlFiles, current + 1);
      }
    });
  }
}
