var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error',function(e){
	console.log('error : ',e);
});
var ArticleSchema,AdministratorSchema,CommentsSchema;
var articleModel,commentsModel,accountModel;
db.once('open',function(){
	console.log('mongodb opened');
	ArticleSchema = new mongoose.Schema({
		tTitle: String,
		tAuthor: String,
		tTime: Date,
		coverPic:String,
		tContent:String,
		oTitle: String,
		oAuthor: String,
		oTime: {type:Date,default:Date.now},
		oContent: String
	});
	AdministratorSchema = new mongoose.Schema({
		account: String,
		password: String
	});
	CommentsSchema = new mongoose.Schema({
		ipAddr: String,
		tempName: String,
		follwedName: String,
		for_id: String,
		in_id: String,
		content: String
	});
	exports.accountModel = accountModel = db.model('administrator',AdministratorSchema,'administrator');
	exports.articleModel = articleModel = db.model('articles',ArticleSchema);
	exports.commentsModel = commentsModel = db.model('comments',CommentsSchema);
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

