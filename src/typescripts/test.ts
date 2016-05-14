interface testFunc{
	(name: string,subname:string):boolean;
}

var getInter:testFunc;
getInter = function(a:string,b:string){
	var result = a.search(b);
	return result!==-1 ? true: false;
	// 

}
console.log(getInter('handsome','han'));
