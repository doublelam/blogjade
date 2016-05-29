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
    // navigation items with toggle slide animate
    PublicMethods.prototype.getPosition = function () {
        localStorage.clear();
        if (!localStorage.getItem('tempusername')) {
            $.ajax({
                type: 'GET',
                url: '/ip-address',
                dataType: 'json',
                success: function (result) {
                    console.log('ip address is ', result);
                    // 暂时设置ip
                    // result.ipAddress = '115.192.200.42';
                    $.ajax({
                        type: 'GET',
                        dataType: 'jsonp',
                        crossDomain: true,
                        url: 'http://api.map.baidu.com/location/ip?ak=papzu8GfZQdx0lAGOdi2vM29oGVyaZ6t&ip=' + result.ipAddress + '&coor=bd09ll',
                        success: function (data) {
                            console.log(data);
                            if (data.status === 0) {
                                if (!data.content.address_detail.province) {
                                    console.log('地址不明');
                                    localStorage.setItem('tempusername', '中国网友');
                                    localStorage.setItem('ipaddress', result.ipAddress);
                                }
                                else {
                                    var addr = data.content.address_detail.city ? data.content.address_detail.city : data.content.address_detail.province;
                                    var username = addr + '网友';
                                    console.log(username);
                                    localStorage.setItem('tempusername', username);
                                    localStorage.setItem('ipaddress', result.ipAddress);
                                }
                            }
                            else {
                                console.log('地址不明');
                                localStorage.setItem('tempusername', '墙外网友');
                                localStorage.setItem('ipaddress', result.ipAddress);
                            }
                        },
                        error: function (e) {
                            console.log('err when getting from baidu ip api 从百度api获取地理位置时发生错误:', e);
                        },
                        complete: function () {
                        }
                    });
                },
                error: function (e) {
                    console.log('get ip address error 获取ip地址时发生错误：', e);
                },
                complete: function () {
                }
            });
        }
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
                        $('.origin-content .edit-input').val(result.result.oContent);
                        $('.trans-title .edit-input').val(result.result.tTitle);
                        $('.trans-author .edit-input').val(result.result.tAuthor);
                        $('.trans-time .edit-input').val(result.result.tTime.split('T')[0]);
                        $('.trans-cover .edit-input').val(result.result.coverPic);
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
                origTitle = $.trim($('.origin-title .edit-input').val());
                origAuthor = $('.origin-author .edit-input').val();
                origTime = $('.origin-time .edit-input').val();
                origContent = $('.origin-content .edit-input').val();
                trsTitle = $.trim($('.trans-title .edit-input').val());
                trsAuthor = $('.trans-author .edit-input').val();
                trsTime = $('.trans-time .edit-input').val();
                trsCoverPic = $('.trans-cover .edit-input').val();
                trsContent = $('.trans-content .edit-input').val();
                data = {
                    oTitle: origTitle,
                    oAuthor: origAuthor,
                    oTime: origTime,
                    oContent: origContent,
                    tTitle: trsTitle,
                    tAuthor: trsAuthor,
                    tTime: trsTime,
                    coverPic: trsCoverPic,
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
                        else if (result.info === 'update success') {
                            alert('修改成功');
                            window.location.href = '/article-manage';
                        }
                        else {
                            alert('好像哪里发生错误了 ...(｡•ˇ‸ˇ•｡) ...');
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
        function addBtnAfterComments(jqdom) {
            jqdom.append('<a class="fa fa-commenting reply-for-comments"></a>');
        }
        function setComments() {
            $('.comments-of-class1').on('click', '.fa-commenting', function () {
                var thisIndex = $(this);
                thisIndex.after("<div class=\"reply-area\" style=\"display:none\"><input placeholder=\"\u8BF4\u70B9\u4EC0\u4E48\u5427...\"><button disabled=\"disabled\">\u8BC4\u8BBA</button></div>").next('.reply-area').slideDown('fast').prev('.reply-for-comments').removeClass('fa-commenting').addClass('fa-comment');
                if (thisIndex.parent('.class1-comment').attr('fold') === 'true') {
                    var inId = thisIndex.parent('.class1-comment').attr('comment-id');
                    console.log('need unfold', inId);
                    $.ajax({
                        type: 'POST',
                        url: '/get-comments',
                        data: { in_id: inId },
                        dataType: 'json',
                        success: function (result) {
                            console.log('success', result);
                            if (result.info === 'get comments success') {
                                if (result.data.length > 0) {
                                    thisIndex.parents('.class1-comment').append('<ul class="comments-of-class2"></ul>');
                                    var commtsHtml = '';
                                    for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                                        var val = _a[_i];
                                        commtsHtml += "<li class=\"class2-comment\" comment-id=\"" + val._id + "\" comment-name=\"" + val.tempName + "\"><i class=\"fa fa-user\"></i><span class=\"comment-name\"><a>" + val.tempName + "</a>@<a>" + val.followedName + ":</a></span><span class=\"comment-content\">" + val.content + "</span><a class=\"fa fa-commenting reply-for-comments\"></a></li>";
                                    }
                                    thisIndex.parents('.class1-comment').find('.comments-of-class2').prepend(commtsHtml);
                                    thisIndex.parents('.class1-comment').attr('fold', 'false');
                                }
                            }
                            else {
                                alert('好像哪里发生错误了 ...(｡•ˇ‸ˇ•｡) ...');
                            }
                        },
                        error: function (e) {
                            console.log('comment article ajax err', e);
                            alert('好像发生错误了 ...(｡•ˇ‸ˇ•｡) ...' + e.responseText);
                        },
                        complete: function () {
                        }
                    });
                }
                // 点击时进行ajax获取对评论的回复
            });
            $('.comments-of-class1').on('click', '.fa-comment', function () {
                $(this).next('.reply-area').slideUp('fast', function () {
                    $(this).prev('.reply-for-comments').removeClass('fa-comment').addClass('fa-commenting').next('.reply-area').remove();
                });
            });
        }
        function setCommentBtnDisable() {
            $('.article-comments-area').on('keyup mouseup touchend change', ' .reply-area input', function () {
                console.log(glb.ifValEmpty($(this)));
                if (!glb.ifValEmpty($(this))) {
                    $(this).next('button').prop('disabled', false);
                }
                else {
                    $(this).next('button').prop('disabled', true);
                }
            });
        }
        function getComments(forId, inId, callback) {
            $.ajax({
                type: 'POST',
                url: '/get-comments',
                data: { for_id: forId, in_id: inId },
                dataType: 'json',
                success: function (result) {
                    console.log('success', result);
                    if (result.info === 'get comments success') {
                        callback(result);
                    }
                    else {
                        alert('好像哪里发生错误了 ...(｡•ˇ‸ˇ•｡) ...');
                    }
                },
                error: function (e) {
                    console.log('comment article ajax err', e);
                    alert('好像发生错误了 ...(｡•ˇ‸ˇ•｡) ...' + e.responseText);
                },
                complete: function () {
                }
            });
        }
        function postComments() {
            function articleReply() {
                $('.article-comments-area').on('click', '.reply-area-for-article button', function () {
                    var thisIndex = $(this);
                    var val = thisIndex.prev('input').val();
                    var inId = thisIndex.parents('.article-comments-area').attr('article-id');
                    var forId = inId;
                    var followedName = $('.main-article .main-title').html();
                    thisIndex.prop('disabled', true);
                    var data = { content: val, in_id: inId, for_id: forId, ipAddr: localStorage.getItem('ipaddress'), followedName: followedName, tempName: localStorage.getItem('tempusername') };
                    $.ajax({
                        type: 'POST',
                        url: '/comment-post',
                        data: data,
                        dataType: 'json',
                        success: function (result) {
                            console.log('success', result);
                            if (result.info === 'comment post success') {
                                $('.comments-of-class1').prepend("<li comment-id=\"" + result.id + "\"  comment-name=\"" + data.tempName + "\" fold=true class=\"class1-comment\"><i class=\"fa fa-user\"></i><span class=\"comment-name\"><a>" + data.tempName + ":</a></span><span class=\"comment-content\">" + data.content + "</span><a class=\"fa fa-commenting reply-for-comments\"></a></li>");
                                thisIndex.prev('input').val('');
                            }
                            else {
                                alert('好像哪里发生错误了 ...(｡•ˇ‸ˇ•｡) ...');
                            }
                        },
                        error: function (e) {
                            console.log('comment article ajax err', e);
                            alert('好像发生错误了 ...(｡•ˇ‸ˇ•｡) ...' + e.responseText);
                        },
                        complete: function () {
                        }
                    });
                });
            }
            function commentsReply() {
                $('.article-comments-area').on('click', '.class1-comment .reply-area button', function () {
                    var thisIndex = $(this);
                    var val = thisIndex.prev('input').val();
                    var inId = thisIndex.parents('.class1-comment').attr('comment-id');
                    var forId = thisIndex.parent('.reply-area').parent('li').attr('comment-id');
                    var followedName = thisIndex.parent('.reply-area').parent('li').attr('comment-name');
                    var data = { content: val, followedName: followedName, in_id: inId, for_id: forId, ipAddr: localStorage.getItem('ipaddress'), tempName: localStorage.getItem('tempusername') };
                    var beFollName = thisIndex.parent('.reply-area').parent('li').attr('comment-name');
                    thisIndex.prop('disabled', true);
                    console.log(data);
                    $.ajax({
                        type: 'POST',
                        url: '/comment-post',
                        data: data,
                        dataType: 'json',
                        success: function (result) {
                            console.log('success', result);
                            if (result.info === 'comment post success') {
                                thisIndex.prev('input').val('');
                                if (thisIndex.parents('.class1-comment').find('.comments-of-class2').length === 0) {
                                    thisIndex.parents('.class1-comment').append('<ul class="comments-of-class2"></ul>');
                                }
                                thisIndex.parents('.class1-comment').find('.comments-of-class2').prepend("<li class=\"class2-comment\" comment-id=\"" + result.id + "\" comment-name=\"" + data.tempName + "\"><i class=\"fa fa-user\"></i><span class=\"comment-name\"><a>" + data.tempName + "</a>@<a>" + beFollName + ":</a></span><span class=\"comment-content\">" + data.content + "</span><a class=\"fa fa-commenting reply-for-comments\"></a></li>");
                            }
                            else {
                                alert('好像哪里发生错误了 ...(｡•ˇ‸ˇ•｡) ...');
                            }
                        },
                        error: function (e) {
                            console.log('comment article ajax err', e);
                            alert('好像发生错误了 ...(｡•ˇ‸ˇ•｡) ...' + e.responseText);
                        },
                        complete: function () {
                        }
                    });
                });
            }
            articleReply();
            commentsReply();
        }
        function getCommentsSetting() {
            // when get comments in article area
            function getCommentsInArticle() {
                var forId = $('.article-comments-area').attr('article-id');
                var inId = forId;
                getComments(forId, inId, function (rsult) {
                    var commentsListInArticle = '';
                    for (var _i = 0, _a = rsult.data; _i < _a.length; _i++) {
                        var val = _a[_i];
                        commentsListInArticle += "<li class=\"class1-comment\" comment-id=\"" + val._id + "\" comment-name=\"" + val.tempName + "\" fold=true><i class=\"fa fa-user\"></i><span class=\"comment-name\"><a>" + val.tempName + ":</a></span><span class=\"comment-content\">" + val.content + "</span><a class=\"fa fa-commenting reply-for-comments\"></a></li>";
                    }
                    $('.comments-of-class1').prepend(commentsListInArticle);
                });
            }
            getCommentsInArticle();
        }
        addBtnAfterComments($('.article-comments-area .class1-comment,.article-comments-area .class2-comment'));
        setComments();
        setCommentBtnDisable();
        postComments();
        getCommentsSetting();
        pub.getPosition();
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
