/**
 * Created by nicecue on 16. 1. 18.
 */

// API 리스트
var API =
{
    // 회원 관련
    JOIN : '/User/Set_Userinfo_Insert',
    JOIN_TEMPORARILY : '/User/Set_Userinfo_Tempuser_Insert',
    TEMP_USER_LOGIN : '/User/Set_Userinfo_Tempuser_Join',
    TEMO_USER_JOIN : '/User/Set_Userinfo_Tempuser_Transfer',
    USER_INFO : '/User/Get_Userinfo',
    LOGIN : '/User/Set_Userinfo_Login',
    REJOIN : '/User/Set_Userinfo_Hold',
    FIND_PASSWORD : '/User/Set_Userinfo_TempPassword_update',

    // SMS
    SEND_SMS_FOR_JOIN : '/User/send_sms_for_join',
    SEND_SMS_FOR_LOGIN : '/User/send_sms_for_login',
    SEND_SMS_FOR_UNREGISTER : '/User/send_sms_for_leave',
    SEND_SMS_FOR_REJOIN : '/User/send_sms_for_rejoin',
    SEND_SMS_FOR_CHANGE_PASSWORD :'/User/send_sms_for_password',
    CHECK_SMS : '/User/Set_Auth_CheckProcess',

    // 주소 검색
    SEARCH_ADDRESS_CITY : '/Post/ZipCode_Si_List',
    SEARCH_ADDRESS_GU : '/Post/ZipCode_GU_List',
    SEARCH_ADDRESS_ALL : '/Post/Get_ZipCode_List',

    // 매장 관련
    SHOP_LIST : '/shop/Get_Shopinfo_list',
    SHOP_DETAIL : '/shop/Get_Shopinfo_Detail',
    MY_BOOKMARK_LIST : '/Shop/Get_ShopBookmark_List',
    ADD_BOOKMARK : '/Shop/Set_ShopBookmark_Insert',
    DEL_BOOKMARK : '/Shop/Set_ShopBookmark_Delete',
    SHOP_REVIEW_LIST : '/Shop/Get_ShopReview_List',
    SHOP_REVIEW_AVAILABLE : '/Shop/Get_ShopReview_Check',
    SHOP_SIMPLE_INFO : '/Shop/Get_Shopinfo_View',
    WRITE_REVIEW : '/Shop/Set_ShopReview_Image_Insert',
    REPORT_REVIEW : '/Shop/Set_ShopReviewReport_Insert',
    DEL_REVIEW : '/Shop/Set_ShopReview_Delete',

    // 공지사항
    NOTICE_LIST : '/Board/NoticeList',
    FAQ_LIST : '/Board/FAQList',

    // 쿠폰 관련
    COUPON_LIST : '/Coupon/Get_Coupon_List',
    COUPON_DETAIL : '/Coupon/Get_Coupon_Detail',
    BUY_COUPON : '/Coupon/Set_Coupon_Exchange',
    MY_COUPON_LIST : '/Coupon/Get_MyCoupon_List',
    MY_COUPON_DETAIL : '/Coupon/Get_MyCoupon_Detail',
    DEL_COUPON : '/Coupon/Set_MyCoupon_Delete',
    USE_COUPON_WITH_PASSWORD : '/Coupon/Set_Coupon_Use_password',
    USE_COUPON_WITH_BEACON : '/Coupon/Set_Coupon_Use_Beacon',

    // 코인 관련
    EXCHANGEABLE_COIN_LIST : '/Coin/Get_ExchangeableCoin_List', // 교환 가능한 민을 쌓고 있는 매장(코인) 리스트
    EXCHANGEABLE_COIN_DETAIL : '/Coin/Get_ExchangeableCoin_History',
    NOT_EXCHANGEABLE_COIN_LIST : '/Coin/Get_NonExchangeableCoin_List', // 10민 이하라서 코인교환할 수없는 min을 쌓고 있는 매장(코인)리스트
    NOT_EXCHANGEABLE_COIN_DETAIL : '/Coin/Get_NonExchangeableCoin_History',
    EXCHANGE_COIN : '/Coin/Set_Coin_Exchange',
    USE_COIN_WITH_PASSWORD : '/Coin/Set_Coin_Use_password',
    USE_COIN_WITH_BEACON : '/Coin/Set_Coin_Use_beacon',

    // 기부관련
    DONATION_ORG_LIST : '/Donation/Get_Donation_list',
    DONATION_ORG_DETAIL : '/Donation/Get_Donation_detail',
    DONATION_HISTORY : '/Donation/Get_Donation_History',
    DONATION_USE_HISTORY : '/Donation/Get_Donation_Use_History',
    DONATE : '/Donation/Set_Donation_Use',

    // 설정
    CHANGE_PASSWORD : '/MyWallet/Set_Userinfo_Password_update',
    CHANGE_MY_INFO : '/MyWallet/Set_Userinfo_update',
    UNREGISTER : '/MyWallet/Set_User_Leave',
    SET_AUTO_EXCHANGE_COIN_ENABLE : '/MyWallet/Set_CoinAutoExchange_Update',

    // 이용내역
    MIN_USE_HISTORY : '/History/Get_History_min_List',
    COIN_USE_HISTORY : '/History/Get_History_coin_List',
    COUPON_USE_HISTORY : '/History/Get_History_Coupon_List',
    DEL_MIN_USE_HISTORY : '/History/Set_History_min_Delete',
    DEL_COIN_USE_HISTORY :'/History/Set_History_coin_Delete',
    DEL_COUPON_USE_HISTORY : '/History/Set_History_Coupon_Delete',
    HISTORY_EXCHANGEABLE_COIN_LIST : '/History/Get_ExchangeableCoin_List', // 코인 관련에 똑같은 내용 있음
    HISTORY_EXCHANGEABLE_COIN_DETAIL : '/History/Get_ExchangeableCoin_History',
    HISTORY_NOT_EXCHANGEABLE_COIN_LIST : '/History/Get_NonExchangeableCoin_List',
    HISTORY_DONATION_HISTORY :'/History/Get_History_donation_List'

};

// 데이터 통신, 데이터 가공 관리.
var MODEL = (function()
{
    function _get( url, param, callback, errCnt )
    {
        if( typeof errCnt == 'undefined' )
        {
            errCnt = 0;
        }

        $.ajax(
        {
            type : 'POST',
            url : url,
            data : param,
            dataType : 'json',
            success : function( data )
            {
                if( typeof callback == 'function' )
                {
                    var ret = {
                        success : true,
                        error : 0,
                        data : data
                    };
                    callback( ret );
                }

            },
            error : function( xhr, status, error )
            {
                if( xhr.status == 500 )
                {
                    var ret = {
                        success : false,
                        error : xhr.status,
                        data : null
                    };
                    if( typeof callback == 'function' )
                        callback( ret );

                    alert( '서버통신 오류[500] 콘솔 확인: ' + url );
                    console.log( '==================================================' );
                    console.log( '[서버통신 500 오류]' );
                    console.log( '      URL : ', url );
                    console.log( '      파라미터 : ', param );
                    console.log( '==================================================' );
                    return;
                }
                else if( xhr.status == 404 )
                {
                    var ret = {
                        success : false,
                        error : xhr.status,
                        data : null
                    };
                    if( typeof callback == 'function' )
                        callback( ret );

                    alert( '서버통신 오류[404] 콘솔확인 : ' + url );
                    console.log( '==================================================' );
                    console.log( '[서버통신 404 오류] ' );
                    console.log( '      URL :', url );
                    console.log( '==================================================' );
                    return;
                }
                else if( xhr.status == 400 )
                {
                    var ret = {
                        success : false,
                        error : xhr.status,
                        data : null
                    };
                    if( typeof callback == 'function' )
                        callback( ret );

                    alert( '서버통신 오류[400] 콘솔확인 : ' + url );
                    console.log( '==================================================' );
                    console.log( '[서버통신 400 오류] ' );
                    console.log( '      URL :', url );
                    console.log( '      파라미터 : ', param );
                    console.log( '==================================================' );
                    return;
                }

                // 그 외의 오류는 네트워크 문제라 판단하고 재시도 3회 후 얼럿 출력.
                errCnt++;
                if( errCnt >= 3 )
                {
                    console.log( '[서버통신 오류 3회] url:', url );
                    console.log( '      => param :', param, 'status :', status, 'error :', error );
                    console.log( 'xhr : ', xhr );
                    alert( '서버로 부터 데이터를 받아오지 못했습니다. 네트워크 상태를 확인 후 다시 시도해 주세요\n'+url );
                    errCnt = 0;
                }
                _get( url, param, callback, errCnt );
            },
            timeout : 5000 // 통신 시간초과 설정.
        });
    }

    return {
        get : _get
    }
}());

// 유저정보 관리
var USER = (function()
{
    var _info = { index:-1, data:{} };

    function _init( callback )
    {
        _setUserInfo( callback );
    }

    function _setUserInfo( callback )
    {
        BRIDGE.getUserInfo( function( userInfo )
        {
            console.log( '앱 유저번호 : ', userInfo.INDEX );
            _setUserIndex( userInfo.INDEX );

            if( userInfo.INDEX == -1 )
            {
                callback();
            }
            else
            {
                var param = { u_idx : _info.index };
                MODEL.get( API.USER_INFO, param, function( ret )
                {
                    if( ret.success )
                    {
                        if( ret.data[0].ResultCode == 1 )
                            _setUserData( ret.data[0].ResultData[0] );
                        else
                            alert( '[잘못된 유저정보] : ResultCode : '+ret.data.ResultCode );

                        callback();
                    }

                });
            }
        }.bind( this ));
    }

    function _setUserIndex( index )
    {
        _info.index = index;
    }

    function _setUserData( data )
    {
        _info.data = data;
        console.log( '유저정보 : ', _info.data );
    }

    function _getUserInfo(){ return UserInfo; }

    function _changeUserInfo( userInfo )
    {
        // TODO :
    }

    function _refresh( callback )
    {
        if( _info.index == -1 )
        {
            if( typeof callback == 'function' )
                callback();
        }
        else
        {
            var param = { u_idx : _info.index };
            MODEL.get( API.USER_INFO, param, function( ret )
            {
                if( ret.success )
                {
                    if( ret.data[0].ResultCode == 1 )
                        _setUserData( ret.data[0].ResultData[0] );
                    else
                        alert( '[잘못된 유저정보] : ResultCode : '+ret.data.ResultCode );

                    if( typeof callback == 'function' )
                        callback();
                }
            });
        }
    }

    return {
        init : _init,
        info : _info,
        getUserInfo : _getUserInfo,
        changeUserInfo : _changeUserInfo, // 회원가입과 같이 유저정보가 바뀌는 경우 호출해주어야됨.
        refresh : _refresh
    };
}());

// 체크인 정보 관리
var CHECKIN_INFO = (function()
{
    function _init()
    {

    }

    return {
        init : _init
    }
}());