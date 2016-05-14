
var articles = require('../models/articles');
var mrked = require('marked');
var routes = function(app){
	/* GET start page. */
	app.get('/', function(req, res, next) {
		articles.articleModel.find(
			function(error, result){
				if(error){
					console.log('error',error);
					res.send('error'+error);
				}else{
					var titles = new Array();
					var times = new Array();
					var preVs = new Array();
					var oTitles = new Array();

					for(var i = 0;i < result.length;i ++){
						titles.push(result[i].tTitle?result[i].tTitle:'null');
						oTitles.push(result[i].oTitle?result[i].oTitle:'null');
						times.push(result[i].tTime?result[i].tTime:'null');
						preVs.push(result[i].tContent?result[i].tContent.substring(0,50):'null');
						console.log(titles);
					};
					var newRslt = {
						titles: titles,
						oTitles: oTitles,
						times: times,
						preVs: preVs,
					};
					
					res.render('start',{title:'start',result: newRslt});
				}
			}
		);
	});

	/* GET home page. */
	app.get('/article', function(req, res, next) {		
		var urlPara = req.query;
		var titlePara = urlPara.title;
		articles.articleModel.findOne(
			{oTitle:titlePara},
			function(error, result){
				if(error){
					console.log('error',error);
					res.send('error'+error);
				}else{
					if(!result){
						var err = new Error('Not Found');
						err.status = 404;
						next(err);
					}else{

						res.render('article',{title:'start',result: result,mrked:mrked});
					}
				}
			}
		); 
	});
	
	/* GET edit page */
	app.get('/edit',function(req, res, next){
		res.render('edit',{title:'edit'});
	});
	
	/* post editupload */
	app.post('/editupload',function(req, res, next){
		console.log(req.body);
		var newData = req.body;
		articles.db.collection('test').insert(newData);
		res.send(req.body);
		console.log(req.body);
		
	});
};

module.exports = routes;
process.on('uncaughtException',function(e){
	console.log('process error: ',e)
})