#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var defaultOptions = require('./default');

var passedEnv = process.argv[2] || 'development';

prompt.start();

if (!fs.existsSync(path.join(process.cwd(), defaultOptions.configFile))) {
  //Ask to create a default config file to work with
  console.log("No config file exists to update the environment variables into.");

  prompt.get([{
    name: 'createFile',
    description: 'Would you like to create one now?',
    type: 'string',
    required: true
  }], function (err, result) {
    var validAnswers = { 'y': true, 'yes': true, 'true': true };
    if (validAnswers.hasOwnProperty(result.createFile.toLowerCase())) {
      createConfigFile();
      console.log("SUCCESS: Created config file.");
      buildConfig(passedEnv);
    } else {
      console.log("Okay, Exiting!");
    }
  });
} else {
  // check if the files are there
  buildConfig(passedEnv);
}

function buildConfig(env) {
  var fpath = path.join(process.cwd(), defaultOptions.configFile),
    envFilePath = path.join(process.cwd(), "./" + env + ".config.js"),
    envFile,
    targetFile,
    config;

  if (!fs.existsSync(envFilePath)) {
    console.log("FAIL:", env + ".config.js", "config file not found, aborting!");
    return;
  }

  envFile = require(envFilePath) || {};

  if (fs.existsSync(fpath)) {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), defaultOptions.configFile), 'utf8')) || {};
    config.expo = config.expo || {};
    config.expo.extra = envFile;
    fs.writeFileSync(path.join(process.cwd(), defaultOptions.outputFile), JSON.stringify(config, null, 2), 'utf8');
  }
}

function createConfigFile() {
  var appJson = fs.readFileSync(path.join(process.cwd(), defaultOptions.outputFile), "utf8");
  fs.writeFileSync(path.join(process.cwd(), defaultOptions.configFile), appJson, 'utf8');
}