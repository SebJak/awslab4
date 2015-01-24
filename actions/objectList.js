var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var AWS = require('aws-sdk');

var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "objectList.ejs";
AWS.config.loadFromPath(AWS_CONFIG_FILE);
var task = function(request, callback){
	var s3 = new AWS.S3();

	s3.listObjects(init(), function(err, data) {
	  if (err) {
	  	console.log(err, err.stack);
	  }// an error occurred
	  else  {
	  	console.log(data);
	  	callback(null, {template: INDEX_TEMPLATE,  params:{objects: data.Contents, bucket: init().Bucket}}); 
	  }            // successful response
	});

};

function init(){

	var policyData = helpers.readJSONFile(POLICY_FILE);
	var policy = new Policy(policyData);
	
	var params = {
		Bucket: policy.getConditionValueByKey("bucket") /* required */
	};

	return params;

};

exports.action = task;