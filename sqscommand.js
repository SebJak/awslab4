var AWS = require('aws-sdk');

var SqsCommands = function(sqsUrl){
	this.url = sqsUrl.QueueUrl;
	this.sqs = new AWS.SQS()

}

// TODO 
//Tworzenie obiekty do sqs na podstawie ktorego bedziemy pogli pobrac dane o pliku z S3
	SqsCommands.prototype.send = function(key, message, callback){
		console.log(this.url);

		var params = {
	        MessageBody: key, /* required */
	       	QueueUrl: this.url, /* required */
	        DelaySeconds: 0
      	};

		this.sqs.sendMessage(params, function(err, data){
			if(err) { callback(err); return; }
			callback(null, {MessageId : data.MessageId,
				MD5OfMessageBody : data.MD5OfMessageBody})
		});
	}



module.exports = SqsCommands;