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
// global method

class PublicMethod{
	navSlide():void{
		function naviSlide():void{
			let itemsOperate = $('.nav .more-operate .more-oprate-items');
			let moreIcon = $('.nav .more-operate .fa-ellipsis-v');
			$('.nav .more-operate .nav-alink').on('mouseenter',function(){
				itemsOperate.slideDown('fast');
				console.log(moreIcon);
				moreIcon.css({
					'transform': 'scale(1.5) rotate(90deg)'
				});
			}); 
			$('.nav .more-operate').on('mouseleave',function(){
				itemsOperate.slideUp('fast');
				moreIcon.css({
					'transform': 'rotate(0deg)'
				});
			}); 
		}
		function logout(jqdom:JQuery):void{
			jqdom.on('click',function(){
				$.ajax({
					type: 'POST',
					url:'/logout',
					data: {info:'logout'},
					dataType: 'json',
					success: function(result){
						console.log('success logout',result);
						window.location.href="/login";
					},
					error: function(e){
						console.log('logout ajax err',e);
					},
					complete: function(){
						console.log('logout complete');
					}
				})
			});
		}
		naviSlide();
		logout($('.nav .nav-ul .more-operate .log-out'));
	}
	// navigation items with toggle slide animate
}
let pub = new PublicMethod();
// public method

class ExecutePages{
	edit():void{
		pub.navSlide();
		// public method
		
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
			var data: Object;
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
	// edit page function
	
	about():void{
		pub.navSlide();
		// public method
		
		function setTurnto():void{
			let imgClickCount:number = 0;
			let timer:number;
			$('.about-image-container img').on('click',function(){
				imgClickCount ++;
				console.log(imgClickCount);
				let jqthis = $(this);
				imgClickCount === 3 ? function(){jqthis.trigger('willChange');imgClickCount = 0}() : null;
			});
			$('.about-image-container img').on('willChange',function(){
				console.log('trogger chage');
				clearTimeout(timer);
				let jqthis = $(this);
				jqthis.parent().addClass('avartor-alter');
				function removeAnimate(){
					jqthis.parent().removeClass('avartor-alter');
					console.log('remove ani');
				}
				timer = setTimeout(removeAnimate, 5100);
			});
		}
		setTurnto();
	}
	// about page function

	login():void{
		pub.navSlide();
		// public method
		
		function setBtnDisable():void{
			$('.login-area label input').on('keyup mouseup touchend',function(){
				if(!ts.ifValEmpty($('.login-area label input'))){
					$('.login-btn-container .as-btn').prop('disabled',false);
				}else{
					$('.login-btn-container .as-btn').prop('disabled',true);
				}
			})
		} 
		function loginAjax():void{
			let account: string;
			let password: string;
			let data: Object;
			$('.login-btn-container .as-btn').on('click',function(){
				$(this).prop('disabled',true);
				account = $('.account-label .login-account').val();
				password = $('.password-label .login-password').val();
				data = {
					account: account,
					password: password
				};
				$.ajax({
					type: 'POST',
					url:'/login',
					data: data,
					dataType: 'json',
					success: function(result){
						console.log('success',result)
					},
					error: function(e){
						console.log('login ajax err',e)
					},
					complete: function(){
						console.log('ajax complete');
						function setEnable():void{
							$('.login-btn-container .as-btn').prop('disabled',false);
						}
						setTimeout(setEnable,2000);
					}
				})
			})
		}
		setBtnDisable();
		loginAjax();
	}	
	// login page
	
	article():void{
		pub.navSlide();
		// public method
	}
	// article page
	
	articleManage():void{
		pub.navSlide();
		// public method
	}
	// article manage page
	
	start():void{
		pub.navSlide();
		// public method
	}
	// start page
}
let exec = new ExecutePages();
// event pages method
