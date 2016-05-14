/// <reference path="jquery.d.ts" />

class GlobalMethod{
	ifValEmpty(jdomInput:JQuery){
		for(let i = 0;i < jdomInput.length; i++){
			if (jdomInput.eq(i).val() === '' ){
				return true;
			}
		}
		return false; 
	}
}  
let ts = new GlobalMethod();

class ExcutePages{
	edit(){
		function setBtnDisable():void{
			$('.edit-input').on('keyup mouseup touchend',function(){
				console.log(ts.ifValEmpty($('.edit-input')));
				if(!ts.ifValEmpty($('.edit-input'))){
					$('.button-block .as-btn').prop('disabled',false);
				}else{
					$('.button-block .as-btn').prop('disabled',true);
				}
			})
		} 
		function ajaxSbmit():void{ 
			var origTitle: string;
			var origAuthor: string;
			var origTime: Date;
			var origCoverPic: string;
			var origContent: string;
			var trsTitle: string;
			var trsAuthor: string;
			var trsTime: Date;
			var trsCoverPic: string;
			var trsContent: string;
			var data:Object;
			$('.button-block .as-btn').on('click',function(){
				$(this).prop('disabled',true);
				origTitle = $('.origin-title .edit-input').val();
				origAuthor = $('.origin-author .edit-input').val();
				origTime = $('.origin-time .edit-input').val();
				origCoverPic = $('.origin-cover .edit-input').val();
				origContent = $('.origin-content .edit-input').val();
				trsTitle = $('.trans-title .edit-input').val();
				trsAuthor = $('.trans-author .edit-input').val();
				trsTime = $('.trans-time .edit-input').val();
				trsCoverPic = $('.trans-cover .edit-input').val();
				trsContent = $('.trans-content .edit-input').val();
				data = {
					oTitle: origTitle,
					oAuthor: origAuthor,
					oTime: origTime,
					oCoverPic: origCoverPic,
					oContent: origContent,
					tTitle: trsTitle,
					tAuthor: trsAuthor,
					tTime: trsTime,
					tCoverPic: trsCoverPic,
					tContent: trsContent
				}
				$.ajax({
					type: 'POST',
					url:'/editupload',
					data: data,
					dataType: 'json',
					success: function(result){
						console.log('success',result)
					},
					error: function(e){
						console.log('ajax err',e)
					},
					complete: function(){
						console.log('ajax complete');
						function setEnable():void{
							$('.button-block .as-btn').prop('disabled',false);
						}
						setTimeout(setEnable,2000);
					}
				})
				
			})
		}
		setBtnDisable()
		ajaxSbmit()  
		
	}
}
let exc = new ExcutePages();