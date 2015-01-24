var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var AWS = require('aws-sdk');
var url = require('url')
var simpleDB = require("../simpleDB");
//------SQS
var SQSCommand = require("../sqscommand");
//var Queue = require("queuemanager");
var APP_CONFIG_FILE = "./app.json";

var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "uploadedFile.ejs";
AWS.config.loadFromPath(AWS_CONFIG_FILE);
var s3 = new AWS.S3();

var appConfig = helpers.readJSONFile(APP_CONFIG_FILE);
var sqsCommand = new SQSCommand(appConfig);

var task = function(request, callback){
  var url_parts = url.parse(request.url, true);
  console.log("url: ", url_parts.key);
  var key = "";
  key = url_parts.query.key;

  console.log("---------------------------------------------------------")
  s3.getObject(init(key), function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback(null, {template: INDEX_TEMPLATE});
    }
    else {
        //simpleDB.putUpladedMetadata(key, data);
       
        sqsCommand.send(key, data, function(err,data){
          if(err) console.log(err, err.stack);
        })
        console.log("redirect to")
        callback(null, {template: INDEX_TEMPLATE,  params:{data: data, key: key}});          // successful response
      }
    });
}

function init(key) {
  var policyData = helpers.readJSONFile(POLICY_FILE);
  var policy = new Policy(policyData);
  
  var params = {
    Bucket:  policy.getConditionValueByKey("bucket"),
    Key: key
  };
  return params;
}

exports.action = task;