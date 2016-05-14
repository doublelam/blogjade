var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error',function(e){
	console.log('error : ',e);
});
var ArticleSchema;
var articleModel;
db.once('open',function(){
	console.log('db opened');
	ArticleSchema = new mongoose.Schema({
		tTitle: String,
		tAuthor: String,
		tTime: Date,
		tContent:String,
		oTitle: String,
		oAuthor: String,
		oTime: Date,
		oContent: String
	});
	exports.articleModel = articleModel = db.model('test',ArticleSchema,'test');
	// var tt = new articleModel({
	// 	title: 'tttt',
	// 	content: 'yyyy',
	// 	time: '34434345'
	// });
	// tt.save(function(err){

	// })

	exports.db = db;
	
});
mongoose.connect('mongodb://localhost:27017/newdb');

