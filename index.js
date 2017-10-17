#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var defaultOptions = require('./default');

var args = process.argv.slice(2);


// --configPath=./config
var cliOptions = {};
args.forEach(function (arg) {
  var splitArr = arg.split('=');
  if (splitArr.length) {
    var k = splitArr[0].split('--');
    var v = splitArr.pop();
    if (k.length) {
      k = k.pop();
      cliOptions[k] = v;
    }
  }
});

var options = Object.assign({}, defaultOptions, cliOptions);
var passedEnv = options.env || "development";

prompt.start();

if (!fs.existsSync(path.join(process.cwd(), options.configFile))) {
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
  var fpath = path.join(process.cwd(), options.configFile),
    envFilePath = path.join(process.cwd(), options.configPath,  env + "." + options.template),
    envFile,
    targetFile,
    config;

  if (!fs.existsSync(envFilePath)) {
    console.log("FAIL:", env + "." + options.template, "config file not found, aborting!");
    return;
  }

  envFile = require(envFilePath) || {};

  if (fs.existsSync(fpath)) {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), options.configFile), 'utf8')) || {};
    config.expo = config.expo || {};
    config.expo.extra = envFile;
    fs.writeFileSync(path.join(process.cwd(), options.outputFile), JSON.stringify(config, null, 2), 'utf8');
  }
}

function createConfigFile() {
  var appJson = fs.readFileSync(path.join(process.cwd(), options.outputFile), "utf8");
  fs.writeFileSync(path.join(process.cwd(), options.configFile), appJson, 'utf8');
}