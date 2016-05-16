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
var ExcutePages = (function () {
    function ExcutePages() {
    }
    ExcutePages.prototype.edit = function () {
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
    ExcutePages.prototype.about = function () {
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
    return ExcutePages;
}());
var exc = new ExcutePages();
