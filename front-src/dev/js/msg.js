/***
 * @preserve msg.js
 * @version 0.0.1
 * @author: DH
 */

/*
 *  @set gloabl variable
 */
var  _domain = "",
    _domainJsx = _domain + "/front-src/release/template/",
    _apiDomain ="/",
    _preLoad = [],
    loc=[],
    _menu=[],
    _webBridge={};

//use tutorial image
_preLoads=['img1.jpg','img2.jpg','img3.jpg'];
/*
 *  @set bridge data
 */
_webBridge={
    userIdx:0,
    userId:'',
    userInfo:{},
    userState:"",
    state:'',
    getDeviceInfo:{},
    currentUserStatus:{},
    OS:0, //1 ios, 2 android, other
    ge:{ //app location
        lat:function() {
            return '37.498019';
        },
        lng:function() {
            return '127.024659';
        }
    },
    dragGe:{ //app location
        lat:null,
        lng:null
    },
    curGe:{ //current my location
        lat:'37.498019',
        lng:'127.024659'
    }
};

//샵 정보
_shopInfo={
    shop_name: null,
    shop_idx: null,
    shop_latitude:null,
    shop_longitude:null
};

//사용자 정보 URL
/*
_user={
    userInfoUrl:""
};
*/

/*
 *  @define url
 */
loc=[
    { // 0
        hash:"#/member-join",
        hashCallback:"MemberJoin",
        api:[
            _apiDomain+'User/send_sms_for_join', //SMS 회원 가입용 인증번호 발송
            _apiDomain+'User/Set_Auth_CheckProcess', //SMS 인증번호 확인
            _apiDomain+'User/Set_Userinfo_Insert', //회원 가입
            _apiDomain+'front-src/release/js/mock/zipcode.json', //전국 주소
            _apiDomain+'User/Get_Userinfo', //회원 정보 조회
            _apiDomain+'User/send_sms_for_rejoin', //SMS 재가입용 인증번호 발송
            _apiDomain+'User/Set_Userinfo_Tempuser_Join', //임시회원 가입 요청
            _apiDomain+'User/Set_Userinfo_Hold' // 재가입요청

        ],
        method:'post',
        type:"json",
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"member_join.js",
        className:"MemberJoin", // reactClass name
        pageName:"twMember_join", // reactClass Page name
        containerClass:"member", //html section="container" add some class
        contentsClass:"member-reg", //html section="contents" add some class
        pageTitle:"회원가입"
    },
    {// 1
        hash:"#/member-login",
        hashCallback:"MemberLogin",
        api:[
            _apiDomain+'User/send_sms_for_login', // SMS, 회원 로그인용 인증번호 발송
            _apiDomain+'User/Set_Auth_CheckProcess', // SMS 인증번호 확인
            _apiDomain+'User/Set_Userinfo_Login', // 로그인
            _apiDomain+'User/Get_Userinfo', //회원 정보 조회
            _apiDomain+'User/Set_Userinfo_Tempuser_Transfer' // 임시유저 로그인
        ],
        method:'post',
        type:"json",
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"member_login.js",
        className:"MemberLogin", // usually as the hashCallback.
        pageName:"twMember_login",
        containerClass:"member", //html section="container" add some class
        contentsClass:"member-reg", //html section="contents" add some class
        pageTitle:"로그인"
    },
    {// 2
        hash:"#/member-search-pass",
        hashCallback:"MemberSearchPassword",
        api:[
            _apiDomain+'User/Set_Userinfo_TempPassword_update', // 비밀번호 바꾸는 api
            _apiDomain+'User/Set_Auth_CheckProcess', //SMS 인증번호 확인
            _apiDomain+'User/send_sms_for_password', // 비밀번호 변경용 sms 발송 api
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"member_search_password.js",
        className:"MemberSearchPassword", // usually as the hashCallback.
        pageName:"twMember_search_password",
        containerClass:"member", //html section="container" add some class
        contentsClass:"member-reg", //html section="contents" add some class
        pageTitle:"비밀번호 찾기"
    },
    {// 3
        hash:"#/member-join-complete",
        hashCallback:"MemberJoinComplete",
        api:[
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"member_join_complete.js",
        className:"MemberJoinComplete", // usually as the hashCallback.
        pageName:"twMember_join_complete",
        containerClass:"member", //html section="container" add some class
        contentsClass:"member-complete", //html section="contents" add some class
        pageTitle:"회원가입" // 회원가입 완료페이지
    },
    {// 4
        hash:"#/member-login-complete",
        hashCallback:"MemberLoginComplete",
        api:[
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"member_login_complete.js",
        className:"MemberLoginComplete", // usually as the hashCallback.
        pageName:"twMember_login_complete",
        containerClass:"member", //html section="container" add some class
        contentsClass:"member-complete", //html section="contents" add some class
        pageTitle:"로그인" // 로그인 성공페이지
    },
    {// 5
        hash:"#/shop-list",
        hashCallback:"ShopList",
        api:[
            _apiDomain+'User/Get_Userinfo', //회원 정보 조회
            _apiDomain+'shop/Get_Shopinfo_list', //shop list
            _apiDomain+'Shop/Set_ShopBookmark_Insert', //북마크 등록
            _apiDomain+'Shop/Set_ShopBookmark_Delete', //북마크 삭제
            _apiDomain+'front-src/release/js/mock/zipcode.json', //전국 주소
            _apiDomain+'Shop/Get_Shopinfo_View' //shop list

        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"shop_list.js",
        className:"ShopList", // usually as the hashCallback.
        pageName:"twShop_list",
        containerClass:"shop-list", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"" // 값이 유동적으로 변하는 곳은 비워둠.
    },
    {// 6
        hash:"#/shop-detail",
        hashCallback:"ShopDetail",
        api:[
            _apiDomain+'shop/Get_Shopinfo_Detail', //매장 상세
            _apiDomain+'shop/Get_ShopReview_List', //리뷰리스트
            _apiDomain+'shop/Get_ShopReview_Check', //리뷰 작성 가능 여부 / ( 쿠폰 교환 또는 10민 이상 적립 )
            _apiDomain+'Shop/Set_ShopReview_Image_Insert', //매장 리뷰 등록
            _apiDomain+'Shop/Set_ShopReview_Delete', //매장 리뷰 삭제
            _apiDomain+'Shop/Get_Shopinfo_list', //매장 리스트
            _apiDomain+'Shop/Set_ShopReviewReport_Insert' // 리뷰 신고 api
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"shop_detail.js",
        className:"ShopDetail", // usually as the hashCallback.
        pageName:"twShop_detail",
        containerClass:"shop-detail", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"" // 값이 유동적으로 변하는 곳은 비워둠.
    },
    {//7
        hash:"#/shop-search",
        hashCallback:"ShopSearch",
        api:[
            _apiDomain+'shop/Get_Shopinfo_list' //shop list
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"shop_search.js",
        className:"ShopSearch", // usually as the hashCallback.
        pageName:"twShop_search",
        containerClass:"shop-list", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"검색"
    },
    {//8
        hash:"#/shop-map",
        hashCallback:"shopMap",
        api:[
            _apiDomain+'shop/Get_Shopinfo_list' //shop list
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"shop_map.js",
        className:"ShopMap", // usually as the hashCallback.
        pageName:"twShop_map",
        containerClass:"shop-list", //html section="container" add some class
        contentsClass:"shop-list-map", //html section="contents" add some class
        pageTitle:"" // 값이 유동적으로 변하는 곳은 비워둠.
    },
    {//9
        hash:"#/menu-main",
        hashCallback:"menuMain",
        api:[
            _apiDomain+'User/Get_Userinfo', //회원 정보 조회, 비 로그인 상태로 메뉴 페이지 진입 시 보유 min 출력해줌.
            _apiDomain+'MyWallet/Set_CoinAutoExchange_Update' // 코인 자동교환용 api
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"menu_main.js",
        className:"MenuMain", // usually as the hashCallback.
        pageName:"twMenu_main",
        containerClass:"menu", //html section="container" add some class
        contentsClass:"menu", //html section="contents" add some class
        pageTitle:"메뉴"
    },
    {//10
        hash:"#/coin-exchange",
        hashCallback:"CoinExchange",
        api:[
            _apiDomain+'Coin/Get_ExchangeableCoin_List', //코인 교환 가능한 min 매장 리스트
            _apiDomain+'Coin/Get_NonExchangeableCoin_List', //코인 교환 가능한 10 min 이하 매장 리스트
            _apiDomain+'Coin/Get_ExchangeableCoin_History', //코인 교환 가능한 min 매장 적립 상세
            _apiDomain+'Coin/Set_Coin_Exchange', //코인 교환
            _apiDomain+'Coin/Get_NonExchangeableCoin_History' // 코인 교환 가능한 10 min 이하 매장 상세
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coin_exchange.js",
        className:"CoinExchange", // usually as the hashCallback.
        pageName:"twCoin_exchange",
        containerClass:"coin", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"코인교환"
    },
    {//11
        hash:"#/coin-use",
        hashCallback:"CoinUse",
        api:[
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coin_use.js",
        className:"CoinUse", // usually as the hashCallback.
        pageName:"twCoin_use",
        containerClass:"coin gray-wrap", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"코인사용"
    },
    {//12
        hash:"#/coin-donate",
        hashCallback:"coinDonate",
        api:[
            _apiDomain+'Donation/Get_Donation_list', // 기부단체 목록
            _apiDomain+'Donation/Get_Donation_detail', // 기부단체 상세. 2015년 11월 24일 : api-xhr-test 통과.
            _apiDomain+'Donation/Get_Donation_History', // 기부자 목록
            _apiDomain+'Donation/Get_Donation_Use_History', // 기부금 이용내역
            _apiDomain+'Donation/Set_Donation_Use', // 기부하기
            //_apiDomain+'front-src/release/js/mock/donate-list.json' // 임시 기부단체 목록. ㅆㅂ
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coin_donate.js",
        className:"CoinDonate", // usually as the hashCallback.
        pageName:"twCoin_donate",
        containerClass:"coin", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"코인기부"
    },
    {//13
        hash:"#/coin-donate-detail",
        hashCallback:"coinDonateDetail",
        api:[
            _apiDomain+'Donation/Get_Donation_detail', // 기부단체 상세, 2015년 11월 24일 17시 33분에 ok.
            _apiDomain+'Donation/Get_Donation_History', // 기부자 목록
            _apiDomain+'Donation/Get_Donation_Use_History', // 기부금 이용내역
            _apiDomain+'Donation/Set_Donation_Use', // 기부하기
            _apiDomain+'User/Get_Userinfo' // 회원정보 조회.
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coin_donate_detail.js",
        className:"CoinDonateDetail", // usually as the hashCallback.
        pageName:"twCoin_donate_detail",
        containerClass:"coin gray-wrap", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"코인기부" // 값이 유동적으로 변하는 곳은 비워둠.
    },
    {//14
        hash:"#/my-wallet",
        hashCallback:"myWallet",
        api:[
            _apiDomain+'MyWallet/Set_User_Leave', // 회원탈퇴 요청
            _apiDomain+'MyWallet/Set_Userinfo_update', // 회원정보 변경
            _apiDomain+'MyWallet/Set_Userinfo_Password_update', // 비밀번호 변경
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회, 비 로그인 상태로 메뉴 페이지 진입 시 보유 min 출력해줌.
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"my_wallet.js",
        className:"MyWallet", // react Class
        pageName:"twMy_wallet",
        containerClass:"my-wallet", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"나의 월렛"
    },
    {//15
        hash:"#/coupon-exchange",
        hashCallback:"couponExchange",
        api:[
            _apiDomain+'Coupon/Get_Coupon_List' // 쿠폰 리스트
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coupon_exchange.js",
        className:"CouponExchange", // usually as the hashCallback.
        pageName:"twCoupon_exchange",
        containerClass:"coupon", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"쿠폰교환"
    },
    {//16
        hash:"#/coupon-exchange-info",
        hashCallback:"CouponInfo",
        api:[
            _apiDomain+'Coupon/Get_Coupon_Detail', // 쿠폰상세 api
            _apiDomain+'Coupon/Set_Coupon_Exchange', // 쿠폰교환
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회, 비 로그인 상태로 메뉴 페이지 진입 시 보유 min 출력해줌.

        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coupon_exchange_info.js",
        className:"CouponInfo", // usually as the hashCallback.
        pageName:"twCoupon_info",
        containerClass:"coupon", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"쿠폰정보"
    },
    {//17
        hash:"#/bookmark",
        hashCallback:"BookmarkList",
        api:[
            _apiDomain+'Shop/Get_ShopBookmark_List' // 북마크 리스트
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"bookmark.js",
        className:"BookmarkList", // ReactClass
        pageName:"twBookmark",
        containerClass:"bookmark", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"즐겨찾기"
    },
    {//18
        hash:"#/my-coupon",
        hashCallback:"myCoupon",
        api:[
            _apiDomain+'Coupon/Get_MyCoupon_List', // 내 쿠폰 리스트
            _apiDomain+'Coupon/Set_MyCoupon_Delete' // 내 쿠폰 삭제
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"my_coupon.js",
        className:"MyCoupon", // usually as the hashCallback.
        pageName:"twMy_coupon",
        containerClass:"coupon", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"나의쿠폰"
    },
    {//19
        hash:"#/my-coupon-use",
        hashCallback:"myCouponUse",
        api:[
            _apiDomain+'Coupon/Get_MyCoupon_Detail' // 쿠폰상세
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"my_coupon_use.js",
        className:"MyCouponUse", // usually as the hashCallback.
        pageName:"twMy_coupon_use",
        containerClass:"coupon", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"쿠폰사용"
    },
    {//20
        hash:"#/used-list",
        hashCallback:"usedList",
        api:[
            _apiDomain+'History/Get_History_min_List', //min 이용내역 조회
            _apiDomain+'History/Get_History_coin_List', //코인 이용내역 조회
            _apiDomain+'History/Get_History_Coupon_List', // 쿠폰 이용내역 조회
            _apiDomain+'History/Set_History_min_Delete', // min 이용내역 삭제
            _apiDomain+'History/Set_History_coin_Delete', // 코인 이용내역 삭제
            _apiDomain+'History/Set_History_Coupon_Delete' // 쿠폰 이용내역 삭제
        ],
        type:"json",
        method:"post",
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"used_list.js",
        className:"UsedListWrap", // usually as the hashCallback.
        pageName:"twUsed_list",
        containerClass:"used-list-wrap", //html section="container" add some class
        contentsClass:"used-list-wrap", //html section="contents" add some class
        pageTitle:"이용내역"
    },
    {//21
        hash:"#/notice",
        hashCallback:"notice",
        api:[
            _apiDomain+'Board/NoticeList' // 공지사항 불러오는 api
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"notice.js",
        className:"NoticeList", // React Class Name
        pageName:"twNotice",
        containerClass:"notice", //html section="container" add some class
        contentsClass:"notice-list", //html section="contents" add some class
        pageTitle:"공지사항"
    },
    {//22
        hash:"#/setting",
        hashCallback:"setting",
        api:[], // TODO : not yet
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"setting.js",
        className:"Setting", // usually as the hashCallback.
        pageName:"twSetting",
        containerClass:"setting", //html section="container" add some class
        contentsClass:"setting-list", //html section="contents" add some class
        pageTitle:"환경설정"
    },
    {//23
        hash:"#/setting-app",
        hashCallback:"settingApp",
        api:[],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"setting_app.js",
        className:"SettingApp", // usually as the hashCallback.
        pageName:"twSetting_app",
        containerClass:"setting", //html section="container" add some class
        contentsClass:"setting-app", //html section="contents" add some class
        pageTitle:"앱 설정"
    },
    {//24
        hash:"#/setting-version",
        hashCallback:"settingVersion",
        api:[],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"setting_version.js",
        className:"SettingVersion", // usually as the hashCallback.
        pageName:"twSetting_version",
        containerClass:"setting", //html section="container" add some class
        contentsClass:"setting-version", //html section="contents" add some class
        pageTitle:"버전 정보"
    },
    {//25
        hash:"#/setting-tutorial",
        hashCallback:"settingTutorial",
        api:[],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"setting_tutorial.js",
        className:"SettingTutorial", // usually as the hashCallback.
        pageName:"twSetting_tutorial",
        containerClass:"setting", //html section="container" add some class
        contentsClass:"setting-tutorial", //html section="contents" add some class
        pageTitle:"튜토리얼"
    },
    {//26
        hash:"#/setting-faq",
        hashCallback:"settingFaq",
        api:[
            _apiDomain+'Board/FAQList' // FAQ 불러오는 api
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"setting_faq.js",
        className:"SettingFaq", // React Class Name. 시작은 대문자로
        pageName:"twSetting_faq",
        containerClass:"setting-faq", //html section="container" add some class
        contentsClass:"faq-list", //html section="contents" add some class
        pageTitle:"FAQ"
    },
    {//27
        hash:"#/coin-use-select",
        hashCallback:"CoinUse",
        api:[
            _apiDomain+'User/Get_Userinfo', //회원 정보 조회
            _apiDomain+'Coin/Set_Coin_Use_password', //코인 사용 ,패스워드
            _apiDomain+'Coin/Set_Coin_Use_beacon' //코인 사용 , 비콘
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coin_use_select.js",
        className:"CoinUseSelect", // usually as the hashCallback.
        pageName:"twCoin_use_select",
        containerClass:"coin gray-wrap", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"코인사용"
    },
    {//28
        hash:"#/coupon-use-select",
        hashCallback:"MyCouponUseSelect",
        api:[
            _apiDomain+'Coupon/Set_Coupon_Use_password', //쿠폰 사용 ,패스워드
            _apiDomain+'Coupon/Set_Coupon_Use_beacon' //쿠폰 사용 , 비콘
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"my_coupon_use_select.js",
        className:"MyCouponUseSelect", // usually as the hashCallback.
        pageName:"twCoupon_use_select",
        containerClass:"coupon gray-wrap", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"쿠폰사용"
    },
    {//29
        hash:"#/my-donate",
        hashCallback:"MyDonate",
        api:[
            _apiDomain+'History/Get_History_donation_List', // 기부내역 조회.
            _apiDomain+'History/Get_History_coin_List', // coin 이용 내역 중 history_type==3 으로 기부내역 조회를 위함. 위 api와 조합할 지, 위 api만 쓸지 정해지지 않았음.
            _apiDomain+'User/Get_Userinfo' // 나의 coin확인을 위한 회원정보 조회 api
        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"my_donate.js",
        className:"MyDonate", // usually as the hashCallback.
        pageName:"twMy_donate",
        containerClass:"coin gray-wrap", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"나의 기부내역"
    },
    {//30
        hash:"#/api-xhr-test",
        hashCallback:"MyDonate",
        api:[
            // TEST API HERE
            _apiDomain+'Donation/Get_Donation_detail',
            _apiDomain+'Donation/Get_Donation_list'
        ],
        type:"json",
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"api_xhr_test.js",
        className:"ApiXhrTest", // usually as the hashCallback.
        pageName:"twMy_donate",
        method : 'POST',
        containerClass:"", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"API XHR(POST, GET) TEST"
    },
    {//31
        hash:"#/coupon-use-info",
        hashCallback:"CouponInfo",
        api:[
            _apiDomain+'Coupon/Get_MyCoupon_Detail', // 쿠폰상세 api
            _apiDomain+'Coupon/Set_Coupon_Exchange', // 쿠폰교환
            _apiDomain+'User/Get_Userinfo' //회원 정보 조회, 비 로그인 상태로 메뉴 페이지 진입 시 보유 min 출력해줌.

        ],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"coupon_use_info.js",
        className:"CouponInfo", // usually as the hashCallback.
        pageName:"twCoupon_info",
        containerClass:"coupon", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"쿠폰정보"
    },
    {//31
        hash:"#/blank",
        hashCallback:"blank",
        api:[],
        type:"json",
        method:'post',
        apiCallback:'callback=?', // json이고 callback이 필요한 경우 여기다 콜백 작성
        template:_domainJsx+"blank.js",
        className:"blank", // usually as the hashCallback.
        pageName:"twBlank",
        containerClass:"blank", //html section="container" add some class
        contentsClass:"", //html section="contents" add some class
        pageTitle:"페이지 이동중"
    }
];

/*
 *  @define menu
switch(_appLang) {
    case 'ko':
        _menu=[
            {'menu': '메뉴'}
        ]
        break;
    case 'us':
        _menu=[
            {'menu':'menu'}
        ]
        break;
}
 */

