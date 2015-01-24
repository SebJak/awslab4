var AWS = require('aws-sdk');
var ip = require('ip');

AWS.config.loadFromPath('./config.json');
var simpledb = new AWS.SimpleDB();


var putIpAddress = function(){
	var params = {
	  Attributes: [ /* required */
	    {
	      Name: "Ip_Address", /* required */
	      Value: ip.address(), /* required */
	    },
	  ],
	  DomainName: "Jakowski-DB", /* required */
	  ItemName: 'RequestAddress', /* required */
	};
	
	simpledb.putAttributes(params, function(err, data) {
	  if (err){
	  	console.log("---------ERROR-----------------",err, err.stack); // an error occurred
	  }
	  else {
	  	console.log("---------SUCCESS-----------------",data);  
	  }            // successful response
	});
};

var putUpladedMetadata = function(key, data){
	var params = {
	  Attributes: [ /* required */
	    {
	      Name: "Key", /* required */
	      Value: key, /* required */
	    },
	    {
	      Name: "LastModified", /* required */
	      Value: data.LastModified, /* required */
	    },
	    {
	      Name: "ContentLength", /* required */
	      Value: data.ContentLength, /* required */
	    },
	    {
	      Name: "ContentType", /* required */
	      Value: data.ContentType, /* required */
	    },
	    {
	      Name: "IP_Uploader", /* required */
	      Value: data.Metadata.addressip, /* required */
	    },
	  ],
	  DomainName: "Jakowski-DB", /* required */
	  ItemName: 'UploadedFiles', /* required */
	};
	
	simpledb.putAttributes(params, function(err, data) {
	  if (err){
	  	console.log("---------ERROR-----------------",err, err.stack); // an error occurred
	  }
	  else {
	  	console.log("---------SUCCESS-----------------",data);  
	  }            // successful response
	});
};

var createDomain = function(){
	var params = {
  		DomainName: 'Jakowski-DB' /* required */
	};
	simpledb.createDomain(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
};

var getAtributes = function(itemName){

	var params = {
	  DomainName: 'Jakowski-DB', /* required */
	  ItemName: itemName, /* required */
	  ConsistentRead: true
	};

	simpledb.getAttributes(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
};

exports.putIpAddress = putIpAddress;
exports.createDomain = createDomain;
exports.getAtributes = getAtributes;
exports.putUpladedMetadata = putUpladedMetadata;