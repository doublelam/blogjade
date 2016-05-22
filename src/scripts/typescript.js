/// <reference path="jquery.d.ts" />
var GlobalMethods = (function () {
    function GlobalMethods() {
    }
    GlobalMethods.prototype.ifValEmpty = function (jdomInput) {
        for (var i = 0; i < jdomInput.length; i++) {
            if (jdomInput.eq(i).val() === '') {
                return true;
            }
        }
        return false;
    };
    GlobalMethods.prototype.hintErrInpt = function (jdomInput) {
        jdomInput.addClass('input-err-hint');
        return jdomInput;
    };
    GlobalMethods.prototype.enterPressFakeClick = function (jqdom, jqdomTarget) {
        jqdom.on('keypress', function (e) {
            if (e.keyCode === 13 && !jqdomTarget.prop('disabled')) {
                jqdomTarget.trigger('click');
            }
        });
        return jqdom;
    };
    GlobalMethods.prototype.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        return r !== null ? decodeURI(r[2]) : null;
    };
    return GlobalMethods;
}());
var glb = new GlobalMethods();
// global method
var PublicMethods = (function () {
    function PublicMethods() {
    }
    PublicMethods.prototype.navSlide = function () {
        function naviSlide() {
            var itemsOperate = $('.nav .more-operate .more-oprate-items');
            var moreIcon = $('.nav .more-operate .fa-ellipsis-v');
            $('.nav .more-operate .nav-alink').on('mouseenter', function () {
                itemsOperate.slideDown('fast');
                console.log(moreIcon);
                moreIcon.addClass('nav-more-rotate');
            });
            $('.nav .more-operate').on('mouseleave', function () {
                itemsOperate.slideUp('fast');
                moreIcon.removeClass('nav-more-rotate');
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
    return PublicMethods;
}());
var pub = new PublicMethods();
// public method
var ExecutePages = (function () {
    function ExecutePages() {
    }
    ExecutePages.prototype.edit = function () {
        var articleId = glb.getUrlParam('articleid');
        function setBtnDisable() {
            $('.edit-input').on('keyup mouseup touchend', function () {
                console.log(glb.ifValEmpty($('.edit-input')));
                if (!glb.ifValEmpty($('.edit-input'))) {
                    $('.button-block .as-btn').prop('disabled', false);
                }
                else {
                    $('.button-block .as-btn').prop('disabled', true);
                }
            });
        }
        function ajaxGetContent() {
            $.ajax({
                type: 'POST',
                url: '/get-article-content',
                data: { id: articleId },
                dataType: 'json',
                success: function (result) {
                    if (result.info === 'get success') {
                        console.log(result.result);
                        $('.origin-title .edit-input').val(result.result.oTitle);
                        $('.origin-author .edit-input').val(result.result.oAuthor);
                        $('.origin-time .edit-input').val(result.result.oTime.split('T')[0]);
                        $('.origin-cover .edit-input').val(result.result.oCoverPic);
                        $('.origin-content .edit-input').val(result.result.oContent);
                        $('.trans-title .edit-input').val(result.result.tTitle);
                        $('.trans-author .edit-input').val(result.result.tAuthor);
                        $('.trans-time .edit-input').val(result.result.tTime.split('T')[0]);
                        $('.trans-cover .edit-input').val(result.result.tCoverPic);
                        $('.trans-content .edit-input').val(result.result.tContent);
                    }
                    else {
                        alert('发生了错误 Σ(;ﾟдﾟ)');
                    }
                },
                error: function (e) {
                    console.log('ajax err', e);
                },
                complete: function () {
                    console.log('ajax complete');
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
                var upData = JSON.stringify(data);
                var articleId = $(this).attr('updatefor');
                console.log(upData);
                $.ajax({
                    type: 'POST',
                    url: '/editupload',
                    data: { data: upData, id: articleId },
                    dataType: 'json',
                    success: function (result) {
                        console.log('success', result);
                        if (result.info === 'creat success') {
                            alert('创建成功');
                            window.location.href = '/article-manage';
                        }
                    },
                    error: function (e) {
                        console.log('ajax err', e);
                        alert('创建失败 错误：' + e);
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
        pub.navSlide();
        articleId ? ajaxGetContent() : null;
        // public method
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
        function fakeClickWhenEnter() {
            glb.enterPressFakeClick($('body'), $('.login-btn-container .as-btn'));
        }
        function setBtnDisable() {
            function setBtnIfShow() {
                if (!glb.ifValEmpty($('.login-area label input'))) {
                    $('.login-btn-container .as-btn').prop('disabled', false);
                }
                else {
                    $('.login-btn-container .as-btn').prop('disabled', true);
                }
            }
            $('.login-area label input').on('keyup mouseup touchend', function () {
                $(this).removeClass('input-err-hint');
                setBtnIfShow();
            });
            setBtnIfShow();
        }
        function loginAjax() {
            var account;
            var password;
            var data;
            $('.login-btn-container .as-btn').on('click', function () {
                $('.login-area label input').blur();
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
                        if (result.info === 'wrong account') {
                            glb.hintErrInpt($('.login-area .input-container .account-label .login-account'));
                        }
                        else if (result.info === 'incorrect password') {
                            glb.hintErrInpt($('.login-area .input-container .password-label .login-password'));
                        }
                        else if (result.info === 'login success') {
                            window.location.href = '/article-manage';
                        }
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
        fakeClickWhenEnter();
    };
    // login page
    ExecutePages.prototype.article = function () {
        pub.navSlide();
        // public method
    };
    // article page
    ExecutePages.prototype.articleManage = function () {
        function slideUpDom(jqdom) {
            jqdom.slideUp('fast', function () {
                jqdom.remove();
            });
        }
        function articleDelete() {
            var deleteBtn = $('.article-content .manage-btns .btn-delete');
            deleteBtn.on('click', function () {
                var thisContainer = $(this).parents('.article-display');
                var articleId = $(this).parents('.article-content').attr('article_id');
                if (confirm('删除后不可恢复，确定删除？')) {
                    $.ajax({
                        type: 'POST',
                        url: '/article-remove',
                        data: { articleId: articleId },
                        dataType: 'json',
                        success: function (result) {
                            console.log('success', result);
                            if (result.info === 'delete error') {
                                alert('出错啦 (⊙⊙！) ');
                            }
                            else if (result.info === 'delete success') {
                                slideUpDom(thisContainer);
                            }
                        },
                        error: function (e) {
                            console.log('delete ajax err', e);
                        },
                        complete: function () {
                        }
                    });
                }
                else {
                    return false;
                }
            });
        }
        articleDelete();
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
