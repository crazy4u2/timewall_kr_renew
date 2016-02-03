/**
 * Created by nicecue on 16. 1. 19.
 */


var UI = (function()
{
    var DOM = ReactDOM;
    var R = React;

    var _frame = { left:0, top:0, right:0, bottom:0 };
    var _size = { width:0, height:0 };

    var _pageComponentList = {};
    var _popupComponentList = {};
    var _history = [];

    var _pageContainer;
    var _app;

    //var _defaultPage = 'SHOP_LIST'; // 취향과 상황에 맞게 설정.....
    var _defaultPage = 'NOTICE';
    var _firstShowFlagList = {};



    var _curPage;
    var _prevPage;
    var _nextPage;

    function _setViewSize()
    {
        _size.width = $(window).width();
        _size.height = $(window).height();
        console.log( '화면 크기 : ', _size );
    }

    function _getViewSize()
    {
        return _size;
    }

    function _onResize()
    {
        console.log( 'UI::onResize' );
        _setViewSize();

        //_app.context.viewSize = _size;
        _app.forceUpdate();
    }

    // 일단 팝업도 _pageComponentList 에 보관한다.
    function _registerPopup( key, component )
    {
        _popupComponentList[key] = component;
        _firstShowFlagList[key] = false;
    }

    function _registerPage( key, component )
    {
        _pageComponentList[key] = component;
        _firstShowFlagList[key] = false;
    }

    function _getPage( key )
    {
        return _pageComponentList[key];
    }

    function _getPopup( key )
    {
        return _popupComponentList[key];
    }

    // 모든 페이지 랜더 및 설정
    function _init( className, callback )
    {
        _setViewSize();
        _renderAllComponents( className, function()
        {
            _hideAllPage();
            _setPage( _defaultPage );
            callback();
        });


        //$('.page-use-coin').css('-webkit-transform', 'translate(0px,100px)');

        window.addEventListener( 'resize', _onResize );
    }

    function _renderAllComponents( className, callback )
    {
        var klass = className || 'app-container';
        var container = container || document.getElementsByClassName(klass)[0];
        _app = DOM.render( R.createElement( App, {viewSize:{width:_size.width, height:_size.height}} ), container, callback );
    }

    function _movePageTo( component, x, y )
    {
        var el = DOM.findDOMNode( component );
        $el = $(el);
        //console.log( 'movePage[',component.props.pageName,'] =>',x,',',y );

        $el.transition({x:x, y:y, duration:0} );
    }

    function _animatePageTo( component, x, y )
    {
        var el = DOM.findDOMNode( component );
        var $el = $(el);
        //console.log( 'animatePage[',component.props.pageName,'] => ',x,',',y );
        $el.transition({x:x, y:y }, 300, 'snap' );
        setTimeout( function(){ $el.transition({x:x,y:y},0);} );

    }

    function _slidePage( pageName, param )
    {
        if( pageName == _curPage.props.pageName )
            return;

        var nextPage = _pageComponentList[pageName];
        var viewSize = UI.getViewSize();

        //console.log( 'slidePage[ ', _curPage.props.pageName,' =>', nextPage.props.pageName ,']' );

        _movePageTo( nextPage, 0+viewSize.width, 0 );
        _animatePageTo( nextPage, 0, 0 );

        _animatePageTo( _curPage, 0-viewSize.width, 0 );

        _addHistory( pageName, param );
        _curPage = nextPage;



        // 처음 보여질 경우 onShowFirst 함수 호출해줌.
        if( !_firstShowFlagList[pageName] )
        {
            _firstShowFlagList[pageName] = true;
            if( typeof nextPage.onShowFirst == 'function' )
                nextPage.onShowFirst();
        }

        // 페이지 슬라이딩 전 onBeforeShow 가 정의 되어 있으면 호출해준다.
        if( typeof nextPage.onBeforeShow == 'function' )
        {
            nextPage.onBeforeShow( param );
        }

        // 페이지 슬라이딩 후 onShow 가 정의 되어 있으면 호출해준다.
        if( typeof nextPage.onShow == 'function' )
        {
            setTimeout( function()
            {
                nextPage.onShow( param );
            }, 300 );
        }
    }

    function _slideBack()
    {
        if( _history.length < 2 )
        {
            console.log('최초 페이지' );
            return false;
        }

        var prevPageName = _history[_history.length-2].pageName;
        var prevPage = _pageComponentList[prevPageName];

        _history.pop();
        var history = _history[_history.length-1];

        // 슬라이딩 전에 onBeforeShow 가 정이되어 있으면 파라미터와 같이 호출해준다.
        if( typeof prevPage.onBeforeShow == 'function' )
        {
            prevPage.onBeforeShow( history.param );
        }

        // 슬라이딩 후에 onShow가 정의 되어 있으면 파라미터와 같이 호출해준다.
        if( typeof prevPage.onShow == 'function' )
        {
            setTimeout( function()
            {
                prevPage.onShow( history.param );
            }, 300 );
        }


        var viewSize = UI.getViewSize();

        var _prevx = 0-viewSize.width;
        _movePageTo( prevPage, _prevx, 0 );
        _animatePageTo( prevPage, 0, 0 );
        _animatePageTo( _curPage, 0+viewSize.width, 0 );

        _curPage = prevPage;

        return true;
    }

    function _setPage( pageName, param )
    {
        if( _curPage )
            _hidePage( _curPage );

        var component = _pageComponentList[pageName];

        // 처음 보여질 경우 onShowFirst 함수 호출해줌.
        if( !_firstShowFlagList[pageName] )
        {
            _firstShowFlagList[pageName] = true;
            if( typeof component.onShowFirst == 'function' )
                component.onShowFirst();
        }

        // 페이지 슬라이딩 전에 onBeforeShow 가 정의 되어 있으면 파라미터와 같이 호출해 준다.
        if( typeof component.onBeforeShow == 'function' )
        {
            component.onBeforeShow( param );
        }

        // 페이지 슬라이딩 후에 onShow 가 정의되어 있으면 파라미터와 같이 호출해준다.
        if( typeof component.onShow == 'function' )
            component.onShow( param );

        _movePageTo( component, 0, 0 );
        _addHistory( pageName, param );

        _curPage = component;
    }

    function _addHistory( pageName, param )
    {
        var history = { pageName:pageName, param:param };
        _history.push( history );
    }

    function _setPageVisibility( component, visibility )
    {
        var el = DOM.findDOMNode( component );
        var displayValue = 'none';
        if( visibility )
            displayValue = 'block';
        $(el).css( 'display', displayValue )
    }

    function _hidePage( component )
    {
        _movePageTo( component, 0, -1000 );
    }

    function _hideAllPage()
    {
        for( var index in _pageComponentList )
        {
            if( _pageComponentList.hasOwnProperty(index) )
            {
                var component = _pageComponentList[index];
                _hidePage( component );
            }
        }
    }

    function _notice( msg, callback )
    {
        // TODO : 추후에 UI 적용 예정
        alert( msg );
        callback();
    }

    function _ask( msg, callback )
    {
        // TODO : 추후에 UI 적용 예정
        confirm( msg, callback );
    }

    function _openPopup( key, param )
    {
        var popComponent;
        if( typeof key == 'string' ) {
            popComponent = _popupComponentList[key];
        } else if( typeof key == 'object' ) {
            popComponent = key;
        }

        var popName = popComponent.props.popName;
        if( !_firstShowFlagList[popName] )
        {
            _firstShowFlagList[popName] = true;

            if( typeof popComponent.onShowFirst == 'function' )
                popComponent.onShowFirst( param );
        }

        if( typeof popComponent.onShow == 'function' ) {
            popComponent.onShow( param );
        }

        var $popContainer = $('.popup-container-wrapper');
        var $popBackground = $('.popup-background');

        $popBackground.css( 'display', 'block' );
        $popContainer.css( 'display', 'block' );

        $popBackground.transition({ opacity:0.5}, 200, 'snap' );

        var el = ReactDOM.findDOMNode( popComponent );
        var $el = $(el);
        $el.css( 'display', 'block' );

        $el.transition({scale:0.7, opacity:0.5},0).transition({ scale:1, y:'-50%', opacity:1}, 200, 'snap' );
    }

    function _closePopup( key )
    {
        var popComponent;
        if( typeof key == 'string' )
            popComponent = _popupComponentList[key];
        else if( typeof key == 'object' )
            popComponent = key;

        var $popBackground = $('.popup-background' );
        var $popContainer = $('.popup-container-wrapper');

        if( typeof popComponent.onClose == 'function' )
            popComponent.onClose();

        var el = ReactDOM.findDOMNode( popComponent );
        var $el = $(el);

        $el.transition({scale:1},0).transition({scale:0.7, y:'-50%', opacity:0.0}, 200, 'snap' );

        $popBackground.animate(
            {
                opacity : 0
            }, 300, function()
            {
                $popBackground.css('display', 'none' );
                $popContainer.css( 'display', 'none');
                $el.css( 'display', 'none' );
            });
    }

    return {

        firstShowFlag : _firstShowFlagList,

        pageList : _pageComponentList,
        popupList : _popupComponentList,
        history : _history,
        init : _init,
        hideAll : _hideAllPage,
        hidePage : _hidePage,

        setPage : _setPage,
        slidePage : _slidePage,
        slideBack : _slideBack,

        registerPage : _registerPage,
        getPage : _getPage,

        registerPopup : _registerPopup,
        openPopup : _openPopup,
        closePopup : _closePopup,
        getPopup : _getPopup,

        getViewSize : _getViewSize,
        notice : _notice,
        ask : _ask
    };
}());

var device = device || {};
device = ( function() {
    return {
        chkDevice: {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPod/i);
            },
            iPAD: function () {
                return navigator.userAgent.match(/iPad/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            Mobile: function () {
                return (chkDevice.Android() || chkDevice.BlackBerry() || chkDevice.iOS() || chkDevice.Opera() || chkDevice.Windows());
            }
        },
        checkDeviceType: function () {
            if (device.chkDevice.Android())
                deviceType = "android";
            else if (device.chkDevice.iOS())
                deviceType = "ios";
            else if (device.chkDevice.iPAD())
                deviceType = "ipad";
            else
                deviceType = "unknown";

            jQuery('html').addClass(deviceType);

            return deviceType;
        }
    }
})();

var twMember = twMember || {};
twMember = (function() {
    return {
        /* set function */
        setSelectYear: function (nowYear, $selectYear) {
            /***************
             * 년 세팅
             ***************/
            var _max = 90,
                _lastYear = nowYear - _max;

            for (var i = nowYear; i >= _lastYear; i--) {
                //_startYear = _startYear + 1;
                $selectYear.append("<option value=" + i + ">" + i + "</option>")
            }
            $selectYear.prepend("<option value=''></option>").attr('selected', 'selected');
        },
        setSelectMonth: function (month, $selectMonth) {
            var j=0;

            for (var i = 1; i < 13; i++) {
                if(i.toString().length<2) j='0'+i;
                else j=i;
                $selectMonth.append("<option value=" + j + ">" + j + "</option>")
            }
            $selectMonth.prepend("<option value=''></option>").attr('selected', 'selected');
        },
        setSelectDay: function (year, month, day, $selectDay) {
            var arrayMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                j=0;

            /*******************************************
             * 윤달 체크 부분
             * 윤달이면 2월 마지막 일자를 29일로 변경
             *******************************************/
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                arrayMonth[1] = 29;
            }

            $selectDay.empty();

            for (var i = 1; i <= arrayMonth[month - 1]; i++) {
                if(i.toString().length<2) j='0'+i;
                else j=i;
                $selectDay.append("<option value=" + j + ">" + j + "</option>")
            }

            $selectDay.prepend("<option value=''></option>").attr('selected', 'selected');

        },
        /* get function */
        /****************************
         *
         * @returns {{nowDate: Date, nowYear: number, nowMonth: number, nowDay: Object}}
         * @ return nowDate : current Date
         * @ return nowYear : current Year
         * @ return nowMonth : current Month
         * @ return nowYear : current day
         *
         */
        getCurrentDate: function () {
            var nowDate = new Date(),
                nowYear = nowDate.getFullYear(),
                nowMonth = eval(nowDate.getMonth()) + 1,
                nowDay = eval(nowDate.getDate());

            return {
                'nowDate': nowDate,
                'nowYear': nowYear,
                'nowMonth': nowMonth,
                'nowDay': nowDay
            }
        },
        /****************************
         *
         * @returns string
         * @ return
         * '000' : valid password
         * '001' : invalid password(length)
         * '002' : invalid password(mix number, string)
         *
         */

        getValidPassword : function(password) {
            if(password) {
                if(password.length>0) {
                    var bPass = /^[a-zA-Z0-9]{8,15}$/.test(password);
                    if (!bPass) {
                        return '001';
                        //비밀번호 입력은 8~15자리로 입력하셔야 합니다.
                    } else {
                        var chk_num = password.search(/[0-9]/g);
                        var chk_eng = password.search(/[a-z]/ig);
                        if (chk_num < 0 || chk_eng < 0) {
                            return '002';
                            //비밀번호는 숫자와 영문자를 혼용하셔야 합니다.
                        } else {
                            return '000';
                        }
                    }
                } else {
                    return '001';
                }
            }
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getSamePassword : function(password,rePassword) {
            if(password&&rePassword) {
                if(password==rePassword) return true;
                else return false;
            }
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getValidEmail : function(email) {
            var reg=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

            if(reg.test(email)) return true;
            else return false;
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getValidPhone : function(phone) {
            var reg=/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/; //한국
            return reg.test(phone);
        },
        checkMemberField : function(validData,flag) {
            /*********************************
             *
             * @param : {phone, rePhone, auth_num, password, loginPassword, rePassword,sex,year,month,day,area}
             *
             *********************************/
            if(!flag) {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(twMember.getValidPassword(validData.password)!='000') {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                if(twMember.getValidPassword(validData.rePassword)!='000') {
                    return {
                        bResult:false,
                        status:'rePassword'
                    };
                }

                if(!twMember.getSamePassword(validData.password,validData.rePassword)) {
                    return {
                        bResult:false,
                        status:'nSamePassword'
                    };
                }

                if(!validData.sex) {
                    return {
                        bResult:false,
                        status:'sex'
                    };
                }

                if(!validData.year) {
                    return {
                        bResult:false,
                        status:'year'
                    };
                }

                if(!validData.month) {
                    return {
                        bResult:false,
                        status:'month'
                    };
                }

                if(!validData.day) {
                    return {
                        bResult:false,
                        status:'day'
                    };
                }

                if(!validData.area) {
                    return {
                        bResult:false,
                        status:'area'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };

            } else if(flag == 'login') {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(!twMember.getValidPhone(validData.rePhone)) {
                    return {
                        bResult:false,
                        status:'rePhone'
                    };
                }

                if(!twMember.getValidPassword(validData.loginPassword)) {
                    return {
                        bResult:false,
                        status:'loginPassword'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };

            } else if (flag == 'findPW') {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(!twMember.getValidEmail(validData.mail)) {
                    return {
                        bResult:false,
                        status:'mail'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag=='dropout') {
                if(!twMember.getValidPassword(validData.password)) {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag == 'pw-change') {
                if(twMember.getValidPassword(validData.pwd)!='000') {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                if(twMember.getValidPassword(validData.newPwd)!='000') {
                    return {
                        bResult:false,
                        status:'newPassword'
                    };
                }

                if(twMember.getValidPassword(validData.newPwd2)!='000') {
                    return {
                        bResult:false,
                        status:'newPassword2'
                    };
                }

                if(!twMember.getSamePassword(validData.newPwd,validData.newPwd2)) {
                    return {
                        bResult:false,
                        status:'nSamePassword'
                    };
                }

                if(twMember.getSamePassword(validData.pwd,validData.newPwd)) {
                    return {
                        bResult:false,
                        status:'oldSamePassword'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag=='change-info') {
                if(!validData.sex) {
                    return {
                        bResult:false,
                        status:'sex'
                    };
                }

                if(!validData.year) {
                    return {
                        bResult:false,
                        status:'year'
                    };
                }

                if(!validData.month) {
                    return {
                        bResult:false,
                        status:'month'
                    };
                }

                if(!validData.day) {
                    return {
                        bResult:false,
                        status:'day'
                    };
                }

                if(!validData.area) {
                    return {
                        bResult:false,
                        status:'area'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            }
        },
        checkMemberFieldFocus:function(status,$enableBtn,flag) {
            var _msg='';

            if(!flag) {
                switch(status) {
                    case 'phone':
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'password':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'rePassword':
                        jQuery('.re-password').val('').focus();
                        _msg="재입력 비밀번호를 확인해주세요.";
                        break;
                    case 'nSamePassword':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호와 재입력 비밀번호가 맞아야 합니다.";
                        break;
                    case 'sex':
                        jQuery('input[name=sex]').focus();
                        _msg="성별을 확인해주세요.";
                        break;
                    case 'year':
                        jQuery('#sel1').val('').focus();
                        _msg="년도를 선택해주세요.";
                        break;
                    case 'month':
                        jQuery('#sel2').val('').focus();
                        _msg="월을 선택해주세요.";
                        break;
                    case 'day':
                        jQuery('#sel3').val('').focus();
                        _msg="일 선택해주세요.";
                        break;
                    case 'area':
                        jQuery('.region input').val('').focus();
                        _msg="지역을 선택해주세요.";
                        break;
                    case 'success':
                        _msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if(flag == 'login') {
                switch(status) {
                    case 'phone':
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'rePhone':
                        jQuery('.re-phone').val('').focus();
                        _msg="기존 휴대폰 번호를 확인해주세요.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'loginPassword':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'findPW') {
                switch(status) {
                    case 'phone' :
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'mail' :
                        jQuery('.e-mail').val('').focus();
                        _msg="이메일 형식이 잘못되었습니다.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'dropout') {
                switch(status) {
                    case 'password' :
                        jQuery('.password').val('').focus();
                        _msg="비밀번호 형식이 잘못되었습니다.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'pw-change') {
                switch(status) {
                    case 'password' :
                        jQuery('.origin-pw').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'newPassword' :
                        jQuery('.new-pw').val('').focus();
                        _msg="새로운 비밀번호를 확인해주세요.";
                        break;
                    case 'newPassword2' :
                        jQuery('.new-pw-check').val('').focus();
                        _msg="새로운 비밀번호를 확인해주세요.";
                        break;
                    case 'nSamePassword' :
                        jQuery('.new-pw').val('').focus();
                        _msg="새로 입력하신 비밀번호가 일치하지 않습니다.";
                        break;
                    case 'oldSamePassword' :
                        jQuery('.new-pw').val('').focus();
                        jQuery('.new-pw-check').val('');
                        _msg="새로 입력하신 비밀번호는 기존 비밀번호와 다르게 입력해주세요.";
                        break;
                    case 'success' :
                        msg="";
                        break;
                    default :
                        return false;
                        break;
                }
            } else if (flag=='change-info') {
                switch(status) {
                    case 'sex':
                        jQuery('input[name=sex]').focus();
                        _msg="성별을 확인해주세요.";
                        break;
                    case 'year':
                        jQuery('#sel1').val('').focus();
                        _msg="년도를 선택해주세요.";
                        break;
                    case 'month':
                        jQuery('#sel2').val('').focus();
                        _msg="월을 선택해주세요.";
                        break;
                    case 'day':
                        jQuery('#sel3').val('').focus();
                        _msg="일 선택해주세요.";
                        break;
                    case 'area':
                        jQuery('.region input').val('').focus();
                        _msg="지역을 선택해주세요.";
                        break;
                    case 'success':
                        _msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            }

            jQuery('.member-contents .comment.notice, .error-log .comment.notice').remove();
            if (_msg!='' && flag=='dropout') {
                jQuery('.error-log').append('<p class="text-type4 left">* '+_msg+'</p>');
            } else if(_msg!='') {
                jQuery('.error-log').append('<p class="comment notice">* '+_msg+'</p>');
            }
            return true;
        }
    }
})();

var twCommonUi = twCommonUi || {};
twCommonUi = (function() {
    return {
        commonAccordion:function(target,callback, flag) {
            var _this=this,
                _t=target;

            jQuery(target+' a').on('tap',function(e) {

                var _$t=jQuery(this);
                console.log(_$t.attr('class'));

                //시 선택
                if(_$t.parents('li').find('.sub li').size()>0) {
                    if (!_$t.attr('class').match('state')) {
                        if (_$t.closest('li').attr('class').match('active')) {
                            _$t.closest('li').removeClass('active')
                                .find('ul').height(0);
                        } else {
                            if(_$t.text()!='세종특별자치시') {
                                jQuery(target).find('.active')
                                    .find('ul').height(0)
                                    .end()
                                    .removeClass('active');

                                var numli = _$t.closest('li').find('li').size();
                                if (numli % 2 == 0) {
                                    numli = numli / 2;
                                } else {
                                    numli = Math.floor(numli / 2) + 1;
                                }

                                _$t.closest('li').find('ul')
                                    .height((_$t.closest('li').find('li').outerHeight()) * numli);

                                _$t.closest('li').addClass('active');
                            } else {
                                console.log('세종');
                                //구 선택
                                if(jQuery('.member-contents .region input').size()>0) {
                                    jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.header-shop .title .my-location').size()>0) {
                                    jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.header-shopmap .title .my-location').size()>0) {
                                    jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.place .btn-location').size()>0) {
                                    jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion();
                                }

                                if (typeof callback == 'function') {
                                    callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                                }
                            }

                            /*
                             _$t.closest('li').find('ul')
                             .end()
                             .addClass('active');
                             */

                        }
                    } else {
                        //구 선택
                        if(jQuery('.member-contents .region input').size()>0) {
                            jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.header-shop .title .my-location').size()>0) {
                            jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.header-shopmap .title .my-location').size()>0) {
                            jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.place .btn-location').size()>0) {
                            jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion();
                        }

                        if (typeof callback == 'function') {
                            callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                        }
                    }
                } else {
                    //구 선택
                    if(jQuery('.member-contents .region input').size()>0) {
                        jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.header-shop .title .my-location').size()>0) {
                        jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.header-shopmap .title .my-location').size()>0) {
                        jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.place .btn-location').size()>0) {
                        jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if (typeof callback == 'function') {
                        callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                    }
                }
                e.stopPropagation();
                e.preventDefault();


            });
        },
        checkEnableJoinButton : function(params,_$enableButton,flag) {
            var _bSaveMember=twMember.checkMemberField(params,flag);
            console.log(_bSaveMember.status);
            twMember.checkMemberFieldFocus(_bSaveMember.status,_$enableButton,flag);
            return _bSaveMember;
        },
        closeRegionAccordion:function(flag) {
            jQuery('.list-location .siList').removeClass('active')
                .find('ul').height(0);
            twCommonUi.hideModal(jQuery('.modal.modal-location'), flag);
        },
        /*****************************************************
         * set count = use sms certification
         * @param _c = target class name
         * @param _m = time
         * @param callback = callback
         */
        setValidTime : function(_c,_m,callback) {//'.valid .time'(target), 5(minute)
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 스크립트 설정
             *********************************************************************************/
            // countdown timer
            var _this=this,
                _minutes=60,
                _$t=jQuery(_c);

            _$t.backward_timer({
                seconds:_m*_minutes,
                format:'m%:s%',
                on_exhausted:function(timer) {
                    callback.call();
                }
            }).backward_timer('start');

        },
        /*****************************************************
         * reset count = use sms certification
         * @param _t = target class name
         */
        resetValidTime : function(_t) {
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 재 시작
             *********************************************************************************/
            jQuery(_t).backward_timer('restart');
        },
        /*****************************************************
         * stop count = use sms certification
         * @param _t = target class name
         */
        stopValidTime : function(_t) {
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 취소
             *********************************************************************************/
            jQuery(_t).backward_timer('cancel');
        },
        setContentsHeight:function() {
            var _pt=0;
            /*if(jQuery('.member .member-reg').size()>0) {
             _pt=parseInt(jQuery('.member .member-reg').css('padding-top'))+1;
             }*/
            jQuery('.contents').css('height',jQuery(window).height()-jQuery('.header').height()-_pt);
        },
        /******************************
         * 리뷰 별평점
         * //20151027 park add -start
         ******************************/
        reviewScore : function(_c,callback) {
            //jQuery(this.$dcBody).on('tap',_c,function(e) {
            jQuery(_c).on('click', function(e) {
                e.stopImmediatePropagation();

                var _score=parseInt(Math.ceil(e.offsetX)),
                    _level=0;

                if(_score<30) {
                    jQuery(this).find('.rate').css('width','21%');
                    _level=1;
                } else if(_score<59) {
                    jQuery(this).find('.rate').css('width','41%');
                    _level=2;
                } else if(_score<88) {
                    jQuery(this).find('.rate').css('width','61%');
                    _level=3;
                } else if(_score<117) {
                    jQuery(this).find('.rate').css('width','81%');
                    _level=4;
                } else {
                    jQuery(this).find('.rate').css('width','100%');
                    _level=5;
                }
                if(typeof callback==='function') {
                    callback.call(this,_level);
                }
            });
        },
        setFile : function(fileCls,quality,callback) {
            /* 이미지 클라이언트 추가 */
            jQuery(fileCls).change(function (evt) {
                jQuery('.source-img').remove();
                var full_path= evt.target.value,
                    file = evt.target.files[0],
                    id = jQuery('.source-img').size(),
                    reader = new FileReader();

                if (file.type != 'image/jpeg' && file.type != 'image/png') {
                    alert('이미지 파일만 업로드 가능합니다.');
                    return false;
                } else {

                }

                reader.onload = function (e) {
                    var i = document.createElement('img');
                    i.src = e.target.result;
                    i.setAttribute('class', 'source-img');
                    i.id = 'img' + id;
                    i.onload = function () {
                        image_width = jQuery(i).width(),
                            image_height = jQuery(i).height();
                    }

                    jQuery('.result-img').attr('src','').hide();
                    jQuery(evt.currentTarget).closest('.pic').addClass('active').find('.upload-pic').append(i);
                    //timewalletCommonUi.fileCompress(quality,i);

                }

                reader.onerror = function (event) {
                    alert("파일을 읽어들이지 못했습니다. code " + event.target.error.code);
                }
                reader.readAsDataURL(file);

                // This code is only for demo ...
                console.group("File " + 1);
                console.log("name : " + file.name);
                console.log("size : " + file.size);
                console.log("type : " + file.type);
                console.log("date : " + file.lastModified);
                console.groupEnd();

                callback(file,full_path);

                jQuery(fileCls).off('change');
            });
            /*///// 이미지 클라이언트 추가 */
            if(jQuery('.result-img').size()>0) {
                if(jQuery('.result-img').attr('src').length>1) {
                    jQuery(fileCls).trigger('change');
                }
            }


        },
        //20151027 park add -end

        // 1,000,000 천단위 콤마 세팅.
        setComma : function(num) {
            console.log(num.toString());
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    };
})();
