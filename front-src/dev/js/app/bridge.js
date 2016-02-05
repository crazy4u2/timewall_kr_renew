/**
 * Created by nicecue on 15. 12. 9.
 */
// 잘생긴 용남
(function(factory)
{
    if( typeof define === 'function' && define.amd )
        define( factory );
    else
        window.BRIDGE = factory();
}( function()
{
    var _deviceType, _interface;
    var APP_EVENT_HANDLER_LIST = {};    // 앱 이벤트 핸들러 리스트

    function _convertJSON( data )
    {
        //console.log( 'type :', typeof data );
        if( typeof data != 'string' )
            return data;
        var result;
        if (/^[\],:{}\s]*$/.test(data.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
        {
            // JSON 문자열일 경우.
            result = JSON.parse( data );
        }
        else
        {
            // JSON 문자열이 아닐경우.
            result = data;
        }
        return result;
    }

    function _checkDeviceType()
    {
        if( navigator.userAgent.match(/Android/i) )
            return 'ANDROID';
            //return 'UNKNOWN'; //모바일웹버전에서테스트시 위의 주석 걸고 여기 풀면 됨
        else if( navigator.userAgent.match(/iPhone|iPad|iPod/i) )
            return 'IOS';
        else
            return 'UNKNOWN';
    }

    function getDeviceType(){ return _deviceType; }

    // iOS 브릿지 라이브러리 초기화
    function _initIosBridge()
    {
        if( window.JSBridge )
            return;

        var PROTOCOL_SCHEME = 'JSBRIDGE';
        var PROTOCOL_MESSAGE = '_JSBRIDGE_MESSAGE_';

        var messageIframe;	// 메세지 전송용 iframe ( URL 호출용도 )
        var queueSendMessage = [];
        var queueReceiveMessage = [];
        var lstMessageHandler = {};

        var lstResponseCallback = {};
        var uuid = 1;

        function _createQueueReadyIframe( doc )
        {
            messageIframe = doc.createElement( 'iframe' );
            messageIframe.style.display = 'none';
            messageIframe.src = PROTOCOL_SCHEME + '://' + PROTOCOL_MESSAGE;
            doc.documentElement.appendChild( messageIframe );
        }

        function init( messageHandler )
        {
            var doc = document;
            _createQueueReadyIframe( doc );

            console.log( 'JSBridge.init' );
            if( JSBridge._messageHandler )
            {
                throw new Error( 'JSBridge.init called twice' );
            }

            JSBridge._messageHandler = messageHandler;
            var lstReceiveMessage = queueReceiveMessage;
            queueReceiveMessage = null;

            for( var i=0; i<lstReceiveMessage.length; i++ )
            {
                _dispatchMessageFromObjC( lstReceiveMessage[i] );
            }
        }

        function send( data, responseCallback )
        {
            _doSend( {data:data}, responseCallback );
        }

        function registerHandler( handlerName, handler )
        {
            lstMessageHandler[handlerName] = handler;
        }

        function callHandler( handlerName, data, responseCallback )
        {
            _doSend( {handlerName:handlerName, data:data}, responseCallback );
        }

        function _doSend( message, responseCallback )
        {
            if( responseCallback )
            {
                var callbackId = 'cb_'+(uuid++)+new Date().getTime();
                lstResponseCallback[callbackId] = responseCallback;
                message['callbackId'] = callbackId;
            }
            queueSendMessage.push( message );
            messageIframe.src = PROTOCOL_SCHEME + '://' + PROTOCOL_MESSAGE;
        }

        function _fetchQueue()
        {
            var messageQueryString = JSON.stringify( queueSendMessage );
            queueSendMessage = [];
            return messageQueryString;
        }

        function _dispatchMessageFromObjC( jsonString )
        {
            setTimeout( function _timeoutDispatchMessageFromObjC()
            {
                var msg = JSON.parse( jsonString );
                //var msgHandler;
                var responseCallback;

                if( msg.responseId )
                {
                    responseCallback = lstResponseCallback[msg.responseId];
                    if( !responseCallback )
                        return;

                    responseCallback( msg.responseData );
                    delete lstResponseCallback[msg.responseId];
                }
                else
                {
                    if( msg.callbackId )
                    {
                        var callbackResponseId = msg.callbackId;
                        responseCallback = function( responseData )
                        {
                            _doSend( {responseId:callbackResponseId, responseData:responseData} );
                        }
                    }

                    var handler = JSBridge._messageHandler;

                    if( msg.handlerName )
                        handler = lstMessageHandler[msg.handlerName];

                    try
                    {
                        handler( msg.data, responseCallback );
                    }
                    catch( exception )
                    {
                        if( typeof console != 'undefined' )
                        {
                            console.log( "JSBridge : WARNING : 핸들러 파라미터중 responseCallback 체크한후 있으면 호출해야됨", msg, exception );
                        }

                    }

                }
            });
        }

        function _handleMessageFromObjC( objMessage )
        {
            if( queueReceiveMessage )
                queueReceiveMessage.push( objMessage );
            else
                _dispatchMessageFromObjC( objMessage );
        }

        window.JSBridge =
        {
            init : init,
            send : send,
            registerHandler : registerHandler,
            callHandler : callHandler,
            _fetchQueue : _fetchQueue,
            _handleMessageFromObjC: _handleMessageFromObjC,
            lstMessageHandler : lstMessageHandler
        };

        var doc = document;
        var readyEvent = doc.createEvent( 'Events' );
        readyEvent.initEvent( 'JSBridgeReady' );
        readyEvent.bridge = JSBridge;
        doc.dispatchEvent( readyEvent );

        console.log( 'iOS 자바스크립트 브릿지 인터페이스 객체 설정' );
    }

    // iOS 브릿지 인터페이스 객체 생성
    function _IOS()
    {
        _initIosBridge();

        var name = 'IOS';
        var _interface;

        function _init()
        {
            // window.performance 부재시 정의( 브릿지 라이브러리에서 내부적으로 추후에 사용됨 );
            window.performance = window.performance || {};
            window.performance.now = window.performance.now || ( function()
                {
                    var st = Date.now();
                    return function(){ return Date.now() - st ;}
                } )() ;

            if( window.JSBridge )
            {
                // 브릿지 라이브러리 초기화 및 기본 핸들러 정의
                JSBridge.init( function( msg, callback )
                {
                    console.log( '디폴트 핸들러 호출' );
                    callback( {msg:msg, error:'정의되지 않은 호출'} );
                });
                _interface = JSBridge;
            }
            else
            {
                console.log( 'iOS 자바스크립트 브릿지 인터페이스 객체를 찾을 수 없습니다' );
                document.addEventListener( 'JSBridgeReady', function()
                {
                    _interface = JSBridge;
                });
            }
        }

        function getUserInfo( cb )
        {
            _interface.callHandler( 'getUserInfo', {}, cb );
        }

        function getUserData( cb )
        {
            _interface.callHandler( 'getUserData', {}, cb );
        }

        function getUserOption( cb )
        {
            _interface.callHandler( 'getUserOption', {}, cb );
        }

        function setUserOption( userOption )
        {
            _interface.callHandler( 'setUserOption', userOption );
        }

        function getUserLocation( cb )
        {
            _interface.callHandler( 'getUserLocation', {}, cb );
        }

        function userJoined( userInfo )
        {
            _interface.callHandler( 'userJoined', userInfo );
        }

        function userLogined( userInfo )
        {
            _interface.callHandler( 'userLogined', userInfo );
        }

        function userUnregistered()
        {
            _interface.callHandler( 'userUnregistered' );
        }

        function updateUserPoint( pointInfo )
        {
            _interface.callHandler( 'updateUserPoint', pointInfo );
        }

        function findPayBeacon()
        {
            _interface.callHandler( 'findPayBeacon' );
        }

        function sendEmail( emailInfo )
        {
            _interface.callHandler( 'sendEmail',  emailInfo );
        }

        function shareToSNS( shareInfo )
        {
            _interface.callHandler( 'shareToSNS', shareInfo );
        }

        function getAppVersion( cb )
        {
            _interface.callHandler( 'getAppVersion', {}, cb );
        }

        function toast( msgInfo )
        {
            _interface.callHandler( 'toast', msgInfo );
        }

        function openAgreementPage()
        {
            _interface.callHandler( 'openAgreementPage' );
        }

        function appAlert( alertInfo )
        {
            _interface.callHandler( 'appAlert', alertInfo );
        }

        function webIsReady( cb )
        {
            _interface.callHandler( 'webIsReady', {}, cb );
        }

        function getBluetoothState( cb )
        {
            _interface.callHandler( 'getBluetoothState', {}, cb );
        }

        function getCheckinState( cb )
        {
            _interface.callHandler( 'getCheckinState', {}, cb );
        }

        function getDeviceInfo( cb )
        {
            _interface.callHandler( 'getDeviceInfo', {}, cb );
        }

        _init();
        return {
            name : name,
            getUserInfo : getUserInfo,
            getUserData : getUserData,
            getUserOption : getUserOption,
            setUserOption : setUserOption,
            getUserLocation : getUserLocation,
            userJoined : userJoined,
            userLogined : userLogined,
            userUnregistered : userUnregistered,
            updateUserPoint : updateUserPoint,
            findPayBeacon : findPayBeacon,
            sendEmail : sendEmail,
            shareToSNS : shareToSNS,
            getAppVersion : getAppVersion,
            toast : toast,
            openAgreementPage : openAgreementPage,
            appAlert : appAlert,
            webIsReady : webIsReady,
            getBluetoothState : getBluetoothState,
            getCheckinState : getCheckinState,
            getDeviceInfo : getDeviceInfo
        };

    }

    // 안드로이드 브릿지 인터페이스 객체 생성e
    function _Android()
    {
        var _interface;
        var name = 'ANDROID';

        // 결과값이 JSON 문자열일 경우 JSON 오브젝트로 변환.
        function _convertJson( text )
        {
            //console.log( 'type :', typeof text );
            var result;
            if( typeof text != 'string' )
                return text;

            if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
            {
                // JSON 문자열일 경우.
                result = JSON.parse( text );
            }
            else
            {
                // JSON 문자열이 아닐경우.
                result = text;
            }
            return result;
        }

        function _convertParam( object )
        {
            return JSON.stringify( object );
        }

        function _init()
        {
            if( window.TimeWallet )
            {
                _interface = window.TimeWallet;
            }
            else
                console.log( '안드로이드 자바스크립트 인터페이스 객체를 찾을 수 없습니다' );
        }

        function getUserInfo( cb )
        {
            var userInfo = _convertJson( _interface.getUserInfo());
            cb( userInfo );
        }

        function getUserData( cb )
        {
            var userData = _convertJson( _interface.getUserData());
            cb( userData );
        }

        function getUserOption( cb )
        {
            var userOption = _convertJson( _interface.getUserOption());
            cb( userOption );
        }

        function setUserOption( userOption )
        {
            var strJson = _convertParam( userOption );
            _interface.setUserOption( strJson );
        }

        function getUserLocation( cb )
        {
            var userLocation = _convertJson( _interface.getUserLocation() );
            cb( userLocation );
        }

        function userJoined( userInfo )
        {
            _interface.userJoined( userInfo );
        }

        function userLogined( userInfo )
        {
            _interface.userLogined( userInfo );
        }

        function userUnregistered()
        {
            _interface.userUnregistered();
        }

        function updateUserPoint( pointInfo )
        {
            _interface.updateUserPoint( pointInfo );
        }

        function findPayBeacon()
        {
            _interface.findPayBeacon();
        }

        function sendEmail( emailInfo )
        {
            var strJson = _convertParam( emailInfo );
            _interface.sendEmail( strJson );
        }

        function shareToSNS( shareInfo )
        {
            _interface.shareToSNS( shareInfo );
        }

        function getAppVersion( cb )
        {
            var versionInfo = _convertJson( _interface.getAppVersion() );
            cb( versionInfo );
        }

        function toast( msgInfo )
        {
            var strJson = _convertParam( msgInfo );
            _interface.toast( strJson );
        }

        function openAgreementPage()
        {
            _interface.openAgreementPage();
        }

        function appAlert( alertInfo )
        {
            var strJson = _convertParam( alertInfo );
            _interface.appAlert( strJson );
        }

        function webIsReady( cb )
        {
            var readyInfo = _convertJson(_interface.webIsReady());
            cb( readyInfo );
        }

        function getBluetoothState( cb )
        {
            var state = _convertJson( _interface.getBluetoothState() );
            cb( state );
        }

        function getCheckinState( cb )
        {
            var state = _convertJson( _interface.getCheckinState() );
            cb( state );
        }

        function getDeviceInfo( cb )
        {
            var deviceInfo = _convertJson( _interface.getDeviceInfo() );
            cb( deviceInfo );
        }

        _init();
        return {
            name : name,
            getUserInfo : getUserInfo,
            getUserData : getUserData,
            getUserOption : getUserOption,
            setUserOption : setUserOption,
            getUserLocation : getUserLocation,
            userJoined : userJoined,
            userLogined : userLogined,
            userUnregistered : userUnregistered,
            updateUserPoint : updateUserPoint,
            findPayBeacon : findPayBeacon,
            sendEmail : sendEmail,
            shareToSNS : shareToSNS,
            getAppVersion : getAppVersion,
            toast : toast,
            openAgreementPage : openAgreementPage,
            appAlert : appAlert,
            webIsReady : webIsReady,
            getBluetoothState : getBluetoothState,
            getCheckinState : getCheckinState,
            getDeviceInfo : getDeviceInfo
        };
    }

    // 데스크탑용 브릿지 인터페이스 객체 생성
    function _Unknown()
    {
        var name = 'UNKNOWN';

        function _init()
        {
            // 전역공간 오염을 막기위해서 데스크탑 모드일 경우만 테스트 데이터 정의
            __TEST_DATA__ =
            {
                USER_INFO :
                {
                    INDEX : CONF.userIndex, // 1:로그인 유저, 285:임시가입 유저
                    ID : 'nicecue',
                    STATE : 0, // 0:임시, 1:가입회원, -1:탈퇴요청중, -2:탈퇴완료, -3:계정블럭, -4:임시회원 데이터이전완료
                    BIRTHDAY :
                    {
                        YEAR : '1973',
                        MONTH : '3',
                        DAY : '8'
                    },
                    EMAIL : 'nicecue@gmail.com',
                    SEXUALITY : 'M',
                    ADDRESS : '서울시 관안구 봉천동',
                    PHONE : '01034438873'
                },
                USER_DATA :
                {
                    USER_INDEX : -1,
                    MIN : 10,
                    COIN : 10
                },
                USER_OPTIONS :
                {
                    ALLOW_NOTICE : true,
                    ALLOW_PUSH : true,
                    AUTO_EXCHANGE_COIN : true,
                    AUTO_CHECKIN : true
                },
                BLUETOOTH_STATE : true,
                USER_LOCATION :
                {
                    LATI : '37.498019',
                    LONGI : '127.024659'
                },
                DEVICE_INFO :
                {
                    APP_ID : '데스크탑 푸시용 APP ID',
                    APP_ORG_ID : '데스크탑 APP ORG ID',
                    DEVICE_ID : '데스크탑 기기고유 ID',
                    DEVICE_ORG_ID : '데스크탑 DEVICE ORG ID',
                    OS : 2 // 1:안드로이드, 2:iOS
                },
                VERSION_INFO :
                {
                    SERVER : '1.0',
                    CLIENT : '1.0'
                },
                CHECKIN_INFO :
                {
                    CHECKED_IN : false,
                    SHOP_INDEX : -1,
                    CHECKIN_TIME : '',
                    UPDATE_TIME : ''
                },

                // 앱 이벤트 정보
                APP_EVENT_DATA :
                {
                    'CHECK-IN' :
                    {
                        SHOP_INDEX : 497,
                        SHOP_NAME : '딘타이펑',
                        CHECKIN_TIME : '2015년 12월 14일'
                    },

                    'CHECK-UPDATE' :
                    {
                        SHOP_INDEX : 497,
                        SHOP_NAME : '딘타이펑',
                        UPDATE_TIME : '2015년 12월 14일',
                        SAVING_MIN : 10, // 적립중인 민
                        MIN : 100, // 보유 민
                        SHOW_COIN_EXCHANGE_POPUP : false, // 최초 10민 적립, 코인교환 팝업 노출 여부
                        SHOW_EXCHAGEABLE_MIN_SAVING_COMPLETED : false, // 코인 교환 가능민 모두 적립 시
                        EXCHANGEABLE_MIN : 10, // 코인 교환 가능 민
                        EXCHANGE_RATE : 100.0 // 코인 교환 비율
                    },

                    'CHECK-OUT' :
                    {
                        SHOP_INDEX : 497,
                        SHOP_NAME : '딘타이펑',
                        CHECKOUT_TIME : '2015년 12월 14일',
                        SAVED_MIN : 15, // 적립된 민
                        MIN : 100, // 보유 민
                        //SHOW_COIN_EXCHANGE_POPUP : true, // 최초 10민 적립, 코인교환 팝업 노출 여부
                        //SHOW_EXCHAGEABLE_MIN_SAVING_COMPLETED : false, // 코인 교환 가능민 모두 적립 시
                        EXCHANGEABLE_MIN : 10, // 교환 가능 민
                        EXCHANGE_RATE: 100.0 // 코인 교환 비율
                    },

                    'BLUETOOTH-CHANGED' :
                    {
                        ON : true
                    },

                    'PAY-BEACON-RESULT' :
                    {
                         SUCCESS : false, // 검색 성공 유무, 테스트 중이라 일부러 true에서 false로 값 바꿈.
                         ERR_CODE : 0, // 0:성공, 1:타임아웃
                         BEACON_INFO :
                         {
                             UUID : '48534442-4C45-4144-80C0-180000000002',
                             MAJOR : '6',
                             MINOR : '8013'
                         }
                    },
                    'RESUME' :
                    {
                        CHECKIN_INFO :
                        {

                        },
                        LOCATION_INFO :
                        {

                        }
                    }
                }
            };
        }

        function getUserInfo( cb )
        {
            cb( __TEST_DATA__.USER_INFO );
        }

        function getUserData( cb )
        {
            cb( __TEST_DATA__.USER_DATA );
        }

        function getUserOption( cb )
        {
            cb( __TEST_DATA__.USER_OPTIONS );
        }

        function setUserOption( options )
        {
            for( var key in options )
            {
                if( options.hasOwnProperty(key))
                {
                    if( __TEST_DATA__.USER_OPTIONS.hasOwnProperty(key) )
                        __TEST_DATA__.USER_OPTIONS[key] = options[key];
                    else
                        alert( '알수없는 유저 옵션 설정 : ' + key );
                }
            }
        }

        function getUserLocation( cb )
        {
            cb( __TEST_DATA__.USER_LOCATION );
        }

        function userJoined( userInfo )
        {
            console.log( '신규 가입 : ', userInfo );
            location.href = '#/shop-list';
        }

        function userLogined( userIndex )
        {
            console.log( '로그인 : ', userIndex );
            __TEST_DATA__.USER_INFO.INDEX = userIndex;
            __TEST_DATA__.USER_INFO.USER_INDEX = userIndex;
        }

        function userUnregistered()
        {
            console.log( '탈퇴' );
            __TEST_DATA__.USER_INFO.INDEX = -1;
            __TEST_DATA__.USER_DATA.USER_INDEX = -1;
            location.href = '#/shop-list';
        }

        function updateUserPoint( pointInfo )
        {
            __TEST_DATA__.USER_DATA.COIN = pointInfo.COIN;
            __TEST_DATA__.USER_DATA.MIN = pointInfo.MIN;
        }

        function findPayBeacon()
        {
            // 2초뒤 PAY-BEACON-RESULT 이벤트 발생
            setTimeout( function(){ trigger( 'PAY-BEACON-RESULT' ); }, 2000 );
        }

        function sendEmail( emailInfo )
        {
            console.log( '이메일 보내기 : ', emailInfo );
        }

        function shareToSNS( shareInfo )
        {
            alert('SNS 공유하기');
        }

        function getAppVersion( cb )
        {
            cb( __TEST_DATA__.VERSION_INFO );
        }

        function toast( messageInfo )
        {
            alert( messageInfo.TEXT );
        }

        function openAgreementPage()
        {
            alert( '데스크탑모드에서는 약관보기 페이지로 이동할 수 없습니다' );
        }

        function appAlert( alertInfo )
        {
            alert( alertInfo.TITLE +': '+ alertInfo.TEXT );
        }

        function webIsReady( cb )
        {
            var result =
            {
                'USER_INFO' : __TEST_DATA__.USER_INFO
            };

            cb(  result );
        }

        function getBluetoothState( cb )
        {
            cb( __TEST_DATA__.BLUETOOTH_STATE );
        }

        function getCheckinState( cb )
        {
            cb( __TEST_DATA__.CHECKIN_INFO.CHECKED_IN );
        }

        function getDeviceInfo( cb )
        {
            cb( __TEST_DATA__.DEVICE_INFO );
        }

        _init(); // 초기화
        return {
            name : name,
            getUserInfo : getUserInfo,
            getUserData : getUserData,
            getUserOption : getUserOption,
            setUserOption : setUserOption,
            getUserLocation : getUserLocation,
            userJoined : userJoined,
            userLogined : userLogined,
            userUnregistered : userUnregistered,
            updateUserPoint : updateUserPoint,
            findPayBeacon : findPayBeacon,
            sendEmail : sendEmail,
            shareToSNS : shareToSNS,
            getAppVersion : getAppVersion,
            toast : toast,
            openAgreementPage : openAgreementPage,
            appAlert : appAlert,
            webIsReady : webIsReady,
            getBluetoothState : getBluetoothState,
            getCheckinState : getCheckinState,
            getDeviceInfo : getDeviceInfo
        };
    }

    // os 체크후 os 별 브릿지 인터페이스 생성
    function _init()
    {
        _interface = _Unknown();
        return;

        _deviceType = _checkDeviceType();
        if( _deviceType == 'ANDROID' )
        {
            _interface = _Android();
            console.log( 'BRIDGE 설정 : Android ', _interface );
        }
        else if( _deviceType == 'IOS' )
        {
            _interface = _IOS();
            console.log( 'BRIDGE 설정 : iOS ', _interface );
        }
        else
        {
            _interface = _Unknown();
            console.log( 'BRIDGE 설정 : PC ', _interface );
        }
    }

    // 앱 이벤트 핸들러 등록
    function setAppEventHandler( event, callback )
    {
        if( APP_EVENT_HANDLER_LIST.event )
        {
            alert( '이미 같은 이름으로 등록된 앱이벤트 핸들러가 있습니다 : '+event );
            return;
        }

        APP_EVENT_HANDLER_LIST[event] = { callback : callback };
    }

    // 앱 이벤트 처리e
    function onEvent( event, data )
    {
        if( !APP_EVENT_HANDLER_LIST[event] )
        {
            alert( '등록된 앱이벤트 핸들러가 없습니다 : ' + event );
            return;
        }

        data = _convertJSON( data );
        var appEventHandler = APP_EVENT_HANDLER_LIST[event];
        appEventHandler.callback( data );
    }

    // 앱 이벤트 트리거[ 디버깅 & 개발용 ]
    function trigger( event )
    {
        console.log(__TEST_DATA__.APP_EVENT_DATA[event]);
        if( !__TEST_DATA__.APP_EVENT_DATA[event] )
            alert( event+'이벤트의 테스트 데이터가 정의되어 있지 않습니다' );

        if( event == 'CHECK-IN' || event == 'CHECK-UPDATE' )
            __TEST_DATA__.CHECKIN_INFO.CHECKED_IN = true;
        else if( event == 'CHECK-OUT' )
            __TEST_DATA__.CHECKIN_INFO.CHECKED_IN = false;

        onEvent( event, __TEST_DATA__.APP_EVENT_DATA[event] );
    }

    // 브릿지 외부 공개 API 정의
    function getUserInfo( callback ){ _interface.getUserInfo( callback ); }
    function getUserData( callback ){ _interface.getUserData( callback ); }
    function getUserOption( callback ){ _interface.getUserOption( callback ); }
    function setUserOption( userOptions ){ _interface.setUserOption( userOptions ); }
    function getUserLocation( callback ){ _interface.getUserLocation( callback ); }
    function userJoined( userInfo ){ _interface.userJoined( userInfo ); }
    function userLogined( userInfo ){ _interface.userLogined( userInfo ); }
    function userUnregistered(){ _interface.userUnregistered(); }
    function updateUserPoint( callback ){ _interface.updateUserPoint( callback ); }
    function findPayBeacon( callback ){ _interface.findPayBeacon( callback ); }
    function sendEmail( emailInfo ){ _interface.sendEmail( emailInfo ); }
    function shareToSNS( shareInfo ){ _interface.shareToSNS( shareInfo ); }
    function getAppVersion( callback ){ _interface.getAppVersion( callback ); }
    function toast( messageInfo ){ _interface.toast( messageInfo ); }
    function openAgreementPage(){ _interface.openAgreementPage(); }
    function appAlert( alertInfo ){ _interface.appAlert( alertInfo ); }
    function webIsReady( callback ){ _interface.webIsReady( callback ); }
    function getBluetoothState( callback ){ _interface.getBluetoothState( callback ); }
    function getCheckinState( callback ){ _interface.getCheckinState( callback ); }
    function getDeviceInfo( callback ){ _interface.getDeviceInfo( callback ); }

    _init(); // 초기화 & 브릿지 외부 객체 생성
    var _BRIDGE =
    {
        getDeviceType :getDeviceType,

        // 앱 이벤트
        setAppEventHandler : setAppEventHandler,
        onEvent : onEvent,

        // 브릿지 API 리스트
        getUserInfo : getUserInfo,
        getUserData : getUserData,
        getUserOption : getUserOption,
        setUserOption : setUserOption,
        getUserLocation : getUserLocation,
        userJoined : userJoined,
        userLogined : userLogined,
        userUnregistered : userUnregistered,
        updateUserPoint : updateUserPoint,
        findPayBeacon : findPayBeacon,
        sendEmail : sendEmail,
        shareToSNS : shareToSNS,
        getAppVersion : getAppVersion,
        toast : toast,
        openAgreementPage : openAgreementPage,
        appAlert : appAlert,
        webIsReady : webIsReady,
        getBluetoothState : getBluetoothState,
        getCheckinState : getCheckinState,
        getDeviceInfo : getDeviceInfo
    };

    // 브라우저 모드일 경우, trigger 메소드 추가
    if( _deviceType == 'UNKNOWN' )
        _BRIDGE.trigger = trigger;

    return _BRIDGE;
}));