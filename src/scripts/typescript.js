/// <reference path="jquery.d.ts" />
var GlobalMethod = (function () {
    function GlobalMethod() {
    }
    GlobalMethod.prototype.ifValEmpty = function (jdomInput) {
        for (var i = 0; i < jdomInput.length; i++) {
            if (jdomInput.eq(i).val() === '') {
                return true;
            }
        }
        return false;
    };
    return GlobalMethod;
}());
var ts = new GlobalMethod();
// global method
var PublicMethod = (function () {
    function PublicMethod() {
    }
    PublicMethod.prototype.navSlide = function () {
        function naviSlide() {
            var itemsOperate = $('.nav .more-operate .more-oprate-items');
            var moreIcon = $('.nav .more-operate .fa-ellipsis-v');
            $('.nav .more-operate .nav-alink').on('mouseenter', function () {
                itemsOperate.slideDown('fast');
                console.log(moreIcon);
                moreIcon.css({
                    'transform': 'scale(1.5) rotate(90deg)'
                });
            });
            $('.nav .more-operate').on('mouseleave', function () {
                itemsOperate.slideUp('fast');
                moreIcon.css({
                    'transform': 'rotate(0deg)'
                });
            });
        }
        function logout(jqdom) {
            jqdom.on('click', function () {
                $.ajax({
                    type: 'POST',
                    url: '/logout',
                    data: { info: 'logout' },
                    dataType: 'json',
                    success: function (result) {
                        console.log('success logout', result);
                        window.location.href = "/login";
                    },
                    error: function (e) {
                        console.log('logout ajax err', e);
                    },
                    complete: function () {
                        console.log('logout complete');
                    }
                });
            });
        }
        naviSlide();
        logout($('.nav .nav-ul .more-operate .log-out'));
    };
    return PublicMethod;
}());
var pub = new PublicMethod();
// public method
var ExecutePages = (function () {
    function ExecutePages() {
    }
    ExecutePages.prototype.edit = function () {
        pub.navSlide();
        // public method
        function setBtnDisable() {
            $('.edit-input').on('keyup mouseup touchend', function () {
                console.log(ts.ifValEmpty($('.edit-input')));
                if (!ts.ifValEmpty($('.edit-input'))) {
                    $('.button-block .as-btn').prop('disabled', false);
                }
                else {
                    $('.button-block .as-btn').prop('disabled', true);
                }
            });
        }
        function ajaxSbmit() {
            var origTitle;
            var origAuthor;
            var origTime;
            var origCoverPic;
            var origContent;
            var trsTitle;
            var trsAuthor;
            var trsTime;
            var trsCoverPic;
            var trsContent;
            var data;
            $('.button-block .as-btn').on('click', function () {
                $(this).prop('disabled', true);
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
                };
                $.ajax({
                    type: 'POST',
                    url: '/editupload',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        console.log('success', result);
                    },
                    error: function (e) {
                        console.log('ajax err', e);
                    },
                    complete: function () {
                        console.log('ajax complete');
                        function setEnable() {
                            $('.button-block .as-btn').prop('disabled', false);
                        }
                        setTimeout(setEnable, 2000);
                    }
                });
            });
        }
        setBtnDisable();
        ajaxSbmit();
    };
    // edit page function
    ExecutePages.prototype.about = function () {
        pub.navSlide();
        // public method
        function setTurnto() {
            var imgClickCount = 0;
            var timer;
            $('.about-image-container img').on('click', function () {
                imgClickCount++;
                console.log(imgClickCount);
                var jqthis = $(this);
                imgClickCount === 3 ? function () { jqthis.trigger('willChange'); imgClickCount = 0; }() : null;
            });
            $('.about-image-container img').on('willChange', function () {
                console.log('trogger chage');
                clearTimeout(timer);
                var jqthis = $(this);
                jqthis.parent().addClass('avartor-alter');
                function removeAnimate() {
                    jqthis.parent().removeClass('avartor-alter');
                    console.log('remove ani');
                }
                timer = setTimeout(removeAnimate, 5100);
            });
        }
        setTurnto();
    };
    // about page function
    ExecutePages.prototype.login = function () {
        pub.navSlide();
        // public method
        function setBtnDisable() {
            $('.login-area label input').on('keyup mouseup touchend', function () {
                if (!ts.ifValEmpty($('.login-area label input'))) {
                    $('.login-btn-container .as-btn').prop('disabled', false);
                }
                else {
                    $('.login-btn-container .as-btn').prop('disabled', true);
                }
            });
        }
        function loginAjax() {
            var account;
            var password;
            var data;
            $('.login-btn-container .as-btn').on('click', function () {
                $(this).prop('disabled', true);
                account = $('.account-label .login-account').val();
                password = $('.password-label .login-password').val();
                data = {
                    account: account,
                    password: password
                };
                $.ajax({
                    type: 'POST',
                    url: '/login',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        console.log('success', result);
                    },
                    error: function (e) {
                        console.log('login ajax err', e);
                    },
                    complete: function () {
                        console.log('ajax complete');
                        function setEnable() {
                            $('.login-btn-container .as-btn').prop('disabled', false);
                        }
                        setTimeout(setEnable, 2000);
                    }
                });
            });
        }
        setBtnDisable();
        loginAjax();
    };
    // login page
    ExecutePages.prototype.article = function () {
        pub.navSlide();
        // public method
    };
    // article page
    ExecutePages.prototype.articleManage = function () {
        pub.navSlide();
        // public method
    };
    // article manage page
    ExecutePages.prototype.start = function () {
        pub.navSlide();
        // public method
    };
    return ExecutePages;
}());
var exec = new ExecutePages();
// event pages method
