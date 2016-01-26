/*********************************************************************************
 * shopstate state class
 * html template
 *********************************************************************************/
var ShopState = React.createClass(
{
    getInitialState : function()
    {
        console.log( 'ShopState::getInitailState' );
        var state =
        {
            isBluetoothOn : true,
            checkinState : 0, // 0: normal, 1:checkin, 2:checkout
            isCheckedIn : false,
            isCoinMinSavingEnd : false,
            checkinInfo : null,
            updateInfo : null,
            checkoutInfo : null
        };
        return state;
    },
    componentDidMount : function()
    {
        console.log( 'ShopState::componentDidMount' );
        var self = _this = that = this;

        BRIDGE.getCheckinState( function( isCheckedIn )
        {
            BRIDGE.getBluetoothState( function( isBluetoothOn )
            {
                var state =
                {
                    isBluetoothOn : isBluetoothOn,
                    checkinState : 0, // 0: normal, 1:checkin, 2:checkout
                    isCheckedIn : isCheckedIn,
                    isCoinMinSavingEnd : false,
                    checkinInfo : null,
                    updateInfo : null,
                    checkoutInfo : null
                };
                self.setState( state );
            });
        });

        // 최초 10민 적립시 처리
        function onShowCoinExchangePopup( info )
        {
            BRIDGE.getUserInfo( function( userInfo )
            {
                // 최초 10민 적립 팝업 열기
                twCommonUi.showModal(jQuery('.modal.modal-10min-member'));
                var takingCoinWith10min = 10 * info.EXCHANGE_RATE; // 10민으로 교환가능한 코인

                // userInfo.STATE => 0:임시회원, 1:정상회원, -1:탈퇴요청, -2:탈퇴완료, -3:블럭, -4:임시회원이전완료
                if( userInfo.STATE == 0 ) // 임시회원
                {
                    jQuery('.modal-10min-stranger .text-type5').text( info.SHOP_NAME );
                    jQuery('.modal-10min-stranger .text-type3 em').eq(0).text( '10min' );
                    jQuery('.modal-10min-stranger .text-type3 em').eq(1).text( takingCoinWith10min+'coin' );

                    jQuery('.modal-10min-stranger .btn-type1').on('tap',function() {
                        twCommonUi.hideModal(jQuery('.modal.modal-10min-stranger'));
                    });
                }
                else // 정상회원, 탈퇴요청한 회원 ( 탈퇴완료, 블럭회원은 있을 수 없는 경우라 제외 )
                {
                    jQuery('.modal-10min-member .text-type5').text( info.SHOP_NAME );
                    jQuery('.modal-10min-member .text-type3 em').eq(0).text( '10min' );
                    jQuery('.modal-10min-member .text-type3 em').eq(1).text( takingCoinWith10min+'coin' );

                    // 취소 버튼 클릭
                    jQuery('.modal-10min-member .btn-type2').on('tap',function() {
                    //jQuery(document.body).on('tap', '.modal-10min-member .btn-type2', function() {
                        console.log('최초 10min 교환 취소');
                        twCommonUi.hideModal(jQuery('.modal.modal-10min-member'));
                    });

                    // 교환 버튼 클릭
                    jQuery('.modal-10min-member .btn-type1').on('tap',function() {
                        console.log('최초 10min 교환');
                        twCommonUi.hideModal(jQuery('.modal.modal-10min-member'));

                        // 코인 교환 창 오픈
                        setTimeout(function() { twCommonUi.showModal(jQuery('.modal.modal-coin-exchange-shop-state')); },400);

                        // 코인 교환 창 세팅
                        jQuery('.modal.modal-coin-exchange-shop-state .numberbox.min input').val( 10 );
                        jQuery('.modal.modal-coin-exchange-shop-state .numberbox.coin input').val( takingCoinWith10min );

                        jQuery('.modal.modal-coin-exchange-shop-state .btn-modal-close').on('tap',function(e) {
                            e.stopPropagation();
                            twCommonUi.hideModal(jQuery('.modal.modal-coin-exchange-shop-state'));
                        });

                        jQuery('.modal.modal-coin-exchange-shop-state .btn-exchange-modal').on('tap',function(e)
                        {
                            e.stopPropagation();
                            console.log('최초10min모달에서 코인교환 호출');
                            //코인교환
                            reqwest({
                                url: loc[10].api[3], //코인교환
                                method: 'post',
                                type: 'json',
                                data: {
                                    u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                    shop_idx:info.SHOP_INDEX,
                                    setMin:10
                                }
                            })
                            .then(function (resp)
                            {
                                if (resp[0].ResultCode == '1') {

                                    alert('코인 교환이 완료 되었습니다.');
                                    twCommonUi.hideModal(jQuery('.modal.modal-coin-exchange-shop-state'));

                                } else if (resp.ResultCode == '-1') { //실패
                                }
                            })
                            .fail(function (err, msg)
                            {
                                console.log(err);
                                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                            });
                        });
                    });
                }
            });
        }

        // 블루투스 앱이벤트 핸들러 등록
        BRIDGE.setAppEventHandler( 'BLUETOOTH-CHANGED', function( bBluetoothOn )
        {
            self.setState(
            {
                isBluetoothOn : bBluetoothOn
            });
        });

        // 체크인 앱이벤트 핸들러 등록
        BRIDGE.setAppEventHandler( 'CHECK-IN', function( checkinInfo )
        {
            console.log('CHECK-IN : ', checkinInfo );
            self.setState(
            {
                isCheckedIn : true,
                checkinState : 1, // 0:normal, 1:checkin, 2:checkout
                checkinInfo : checkinInfo
            });

            var _this=this,
                _data={
                    u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                    shop_idx:checkinInfo.SHOP_INDEX,
                    latitude:'',
                    longitude:''
                };
            twCommonUi.mapCheckStatus.enable=true;
            reqwest({
                url : loc[5].api[5],
                type : 'json',
                method : 'POST',
                data : _data
            })
            .then(function (resp) {
                console.log(resp);
                if(resp[0].ResultCode == 1) {
                    _shop_latitude = resp[0].ResultData[0].shop_latitude;
                    _shop_longitude = resp[0].ResultData[0].shop_longitude;
                    //체크인 맵 변수 활성화
                    twCommonUi.mapCheckStatus.enable=true;
                    twCommonUi.mapCheckStatus.data={
                        shop_latitude:_shop_latitude,
                        shop_longitude:_shop_longitude,
                        shop_name:checkinInfo.SHOP_NAME,
                        shop_idx:checkinInfo.SHOP_INDEX
                    };
                    twCommonUi.checkInMarker(twCommonUi.mapCheckStatus.data);
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });
        });

        // 체크업데이트 앱이벤트 핸들러 등록.
        BRIDGE.setAppEventHandler('CHECK-UPDATE', function( updateInfo )
        {
            console.log( 'CHECK-UPDATE : ', updateInfo );

            if( updateInfo.SHOW_COIN_EXCHANGE_POPUP )
                onShowCoinExchangePopup( updateInfo );

            twCommonUi.mapCheckStatus.enable=true;
            self.setState(
            {
                checkinState : 1,
                updateInfo : updateInfo
            });
        });

        // 체크아웃 앱이벤트 핸들러 등록.
        BRIDGE.setAppEventHandler( 'CHECK-OUT', function( checkoutInfo )
        {
            console.log( 'CHECK-OUT : ', checkoutInfo );
            if( checkoutInfo.SHOW_COIN_EXCHANGE_POPUP )
                onShowCoinExchangePopup(checkoutInfo);

            self.setState(
            {
                isCheckedIn : false,
                checkinState : 2,
                checkoutInfo : checkoutInfo
            });

            // 체크아웃 정보에서 shop_idx를 기반으로 좌표를 얻기위한 통신...
            var _this=this,
                _data={
                    u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                    shop_idx:checkoutInfo.SHOP_INDEX,
                    latitude:'',
                    longitude:''
                };

            reqwest({
                url : loc[5].api[5],
                type : 'json',
                method : 'POST',
                data : _data
            })
            .then(function (resp) {
                console.log(resp);
                if(resp[0].ResultCode == 1) {
                    _shop_latitude = resp[0].ResultData[0].shop_latitude;
                    _shop_longitude = resp[0].ResultData[0].shop_longitude;
                    //체크인 되었던 맵 마커 비활성화
                    twCommonUi.mapCheckStatus.enable=false;
                    twCommonUi.mapCheckStatus.data={
                        shop_latitude:_shop_latitude,
                        shop_longitude:_shop_longitude,
                        shop_name:checkoutInfo.SHOP_NAME,
                        shop_idx:checkoutInfo.SHOP_INDEX
                    };
                    twCommonUi.checkOutMarker(twCommonUi.mapCheckStatus.data);
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });

            // 체크아웃 후 2초뒤 노말 상태로 바꿈
            // TODO : 기존 로직에는 2초 안에 체크인이 다시되면 체크인되어있는데 노말상태가 되는 문제가 생긴다. 반드시 고쳐야됨. 일단 기존 로직 그대로 유지.
            setTimeout( function()
            {
                self.setState(
                {
                    checkinState : 0,
                    updateInfo : null,
                    isCheckedIn : false
                });
            }, 4000 );

        });

        BRIDGE.webIsReady( function( initData )
        {
            console.log( 'ShopState::onComponentMount => BRIDGE.webIsReady()' );
        });
        React.render(React.createElement(ModalAddMinAll, null), document.getElementsByClassName('modal-wrap-beacon')[0]);
    },
    render : function()
    {
        console.log( 'ShopState::render()' );
        var _contents = null,
            _contentsList = null,
            _class = '';

        // 이건 아마 맵에서 체크인상태바 그릴때 달라지는 부분이 있어서 타입을 나눈듯하다.
        if( this.props.type == 'type2' )
        {
            if( this.props.data )
                _contentsList=<ShopStateList {...this.props} />;
            else
                _contentsList=<ShopStateListEmpty />;
        }
        else
            _contentsList=null;

        // 블루 투스 off 상태
        if( !this.state.isBluetoothOn )
        {
            if( this.state.checkinState == 2 ) // 체크아웃일 경우
            {
                _contents = <ShopStateBeaconCheckout { ...this.state.checkoutInfo } />;
                _class = 'check-out';
            }
            else // 아니면 블루투스 off
            {
                _contents = <ShopStateBtNoConnect />;
                _class = 'bluetooth-no-connect';
            }
        }
        else
        {
            var bUpdated = false;
            if( this.state.updateInfo != null )
                bUpdated = true;

            switch( this.state.checkinState )
            {
                case 0 : // 노말
                    _contents = <ShopStateBeaconNoConnect />;
                    _class = 'beacon-no-connect';
                    break;
                case 1 : // 체크인
                    _contents = <ShopStateCheckin {...this.state.checkinInfo } updated={bUpdated} updateInfo={this.state.updateInfo}/>;
                    _class = 'check-in';
                    break;
                case 2 : // 체크아웃
                    _contents = <ShopStateBeaconCheckout { ...this.state.checkoutInfo } />;
                    _class = 'check-out';
                    break;
            }
        }
        /* // 상태바 On/Off 상태 기억
        var $tap = jQuery('.state-area .btn-state-view img').closest('.state-area');
        var addClass = '';
        if( $tap.length )
        {
            if( $tap.attr('class').match('active') )
                addClass = ' active';
        }
        */
        addClass = ' active';
        _class = _class + addClass;

        return (
            <div className={"state-bottombox "+this.props.type}>
                <div className="state-bottombox-inner">
                    <div className={"state-area "+ _class }>
                        {_contents}
                    </div>
                    {_contentsList}
                </div>
            </div>
        );
    }

});

/*********************************************************************************
 * ShopStateBeaconNoConnect state class
 * html template
 *********************************************************************************/
var ShopStateBeaconNoConnect = React.createClass(
{
    render:function() {
        var _img_w100={
            'width':'100%'
        };
        var _this=this;

        return (
            <div>
                <div className="state-bar">
                    <a className="btn-state-view" href="javascript:void(0);"><img src="/front-src/release/images/bg_blank.png" alt="" /></a>
                    <img src="/front-src/release/images/shop_beacon_connect.svg" alt="" width="100%" />
                </div>
                <div className="state-cont">
                    <div className="message-type1">
                        <p>가까운 타임월렛 매장을 방문해보세요!</p>
                    </div>
                </div>
            </div>
        );
    }
});

/*********************************************************************************
 * ShopStateBeaconNoConnect state class
 * html template
 *********************************************************************************/
var ShopStateBeaconCheckout = React.createClass({
    getInitialState : function() {
        return {
            info:'',
            logo:'',
            shop_name:''
        };
    },
    componentDidMount:function() {
        //console.log(this.props);
        var _this=this,
            _data={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                shop_idx:this.props.SHOP_INDEX,
                latitude:'',
                longitude:''
            };

        reqwest({
            url : loc[5].api[5],
            type : 'json',
            method : 'POST',
            data : _data
        })
        .then(function (resp) {
            console.log(resp);
            if(resp[0].ResultCode == 1) {
                _this.setState({
                    info:_this.props,
                    logo:resp[0].shop_logo_image,
                    shop_name:resp[0].shop_name
                });
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });
    },
    render:function()
    {
        console.log( 'ShopStateBeaconCheckout::render() : ', this.props );
        var _img_w100={
            'width':'100%'
        };
        var _this=this;
        //{this.state.info.MIN}
        return (
            <div>
                <div className="state-bar">
                    <a className="btn-state-view" href="javascript:void(0);"><img src="/front-src/release/images/bg_blank.png" alt="" /></a>
                    <img src="/front-src/release/images/shop_check_in.svg" alt="" style={_img_w100} />
                </div>
                <div className="state-cont">
                    <div className="message-type2">
                        <p className="font-green"><span><strong className="saved-min">{this.props.SAVED_MIN}</strong>min 적립성공</span></p>
                        <div><span>{this.props.shop_name} {this.props.CHECKOUT_TIME} 체크아웃하셨습니다</span></div>
                    </div>
                </div>
            </div>
        );
    }
});

/*********************************************************************************
 * shopstate checkin state class
 * html template
 *********************************************************************************/
var ShopStateCheckin = React.createClass(
{
    getInitialState : function()
    {
        return {
            info:'',
            logo:'',
            shop_longitude:'',
            shop_latitude:''
        };
    },
    componentDidMount:function() {
        var _this=this,
            _data={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                shop_idx:this.props.SHOP_INDEX,
                latitude:'',
                longitude:''
            };
        reqwest({
            url : loc[5].api[5],
            type : 'json',
            method : 'POST',
            data : _data
        })
        .then(function (resp) {
            console.log(resp);
            if(resp[0].ResultCode == 1) {
                _this.setState({
                    info:_this.props,
                    //logo:resp[0].ResultData[0].shop_logo_image,
                    shop_longitude:resp[0].ResultData[0].shop_longitude, //api 업데이트 되면 키값 입력해야함.
                    shop_latitude:resp[0].ResultData[0].shop_latitude
                });
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });

        //var ShopDetail = _domainJsx+'shop_detail.js';

        jQuery('.state-cont .shop-name').on('tap', function(e) {
            e.stopImmediatePropagation();
            var currentUrl = location.hash;
            _shopInfo.shop_idx=_this.props.SHOP_INDEX;
            _shopInfo.lat=_this.state.shop_latitude;
            _shopInfo.lng=_this.state.shop_longitude;
            if(currentUrl.match('#/shop-detail')){
                console.log(currentUrl);
                jQuery('.couponbox').trigger('pageMove'); // url 변경 안하고 바로 날려버림.
                //React.render(React.createElement(ShopDetail, null), document.getElementsByClassName('contentsScroll')[0]); // 렌더시키는 엘리먼트의 부모가 정적이어야 하는데 여긴 죄다 동적...
                console.log('리액트 랜더 했음');
            } else {
                location.href = '#/shop-detail/'+_shopInfo.shop_idx+'?lat='+_shopInfo.lat+'&lng='+_shopInfo.lng;
                console.log(location.href+' 로 이동');
            }
        });
    },
    render:function()
    {
        var msg = 'Welcome to';//this.props.CHECKIN_TIME + ' 체크인되었습니다';
        if( this.props.updated )
            msg = '<strong>' + this.props.updateInfo.SAVING_MIN + '</strong>min';

        console.log( 'ShopStateCheckin::props :', this.props );
        var _img_w100={
            'width':'100%'
        };
        var _this=this;
        return (
            <div>
                <div className="state-bar">
                    <a className="btn-state-view" href="javascript:void(0);"><img src="/front-src/release/images/bg_blank.png" alt="" /></a>
                    <img src="/front-src/release/images/shop_check_in.svg" alt="" style={_img_w100} />
                </div>
                <div className="state-cont">
                    <div className="message-type2">
                        <p className="font-green">{msg}</p>
                        <span><a className="shop-name" href="javascript:void(0);">{this.state.info.SHOP_NAME}</a></span>
                    </div>
                </div>
            </div>
        );
    },
    componentDidUpdate : function()
    {
        if( this.props.updated )
        {
            var html = '<strong>' + this.props.updateInfo.SAVING_MIN + '</strong>min';
            if( this.props.updateInfo.SHOW_EXCHANGEABLE_MIN_SAVING_COMPLETED )
                html = '<em>다 모았다!</em>';

            jQuery('.check-in .font-green').html( html );
        }
    }
});

/*********************************************************************************
 * shopstate bluetooth-no-connect state class
 * html template
 *********************************************************************************/
var ShopStateBtNoConnect = React.createClass({
    render:function() {
        var _img_w100={
            'width':'100%'
        };
        var _this=this;

        return (
            <div>
                <div className="state-bar">
                    <a className="btn-state-view" href="javascript:void(0);"><img src="/front-src/release/images/bg_blank.png" /></a>
                    <img src="/front-src/release/images/shop_bluetooth_no_connect.svg" alt="" style={_img_w100} />
                </div>
                <div className="state-cont">
                    <div className="message-type1">
                        <p>블루투스 연결을 확인해주세요!</p>
                    </div>
                </div>
            </div>
        );
    }
});

/*********************************************************************************
 * shopstate bluetooth-no-connect2 state class
 * html template
 *********************************************************************************/
var ShopStateBtNoConnect2 = React.createClass({
    getInitialState : function() {
        return {
            info:'',
            logo:'',
            shop_name:''
        };
    },
    componentDidMount:function() {
        //console.log(this.props);
        var _this=this,
            _data={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                shop_idx:this.props.SHOP_INDEX,
                latitude:'',
                longitude:''
            };

        reqwest({
            url : loc[5].api[5],
            type : 'json',
            method : 'POST',
            data : _data
        })
        .then(function (resp) {
            console.log(resp);
            if(resp[0].ResultCode == 1) {
                _this.setState({
                    info:_this.props,
                    logo:resp[0].shop_logo_image,
                    shop_name:resp[0].shop_name
                });
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });
    },
    render:function() {
        var _img_w100={
            'width':'100%'
        };
        var _this=this;

        return (
            <div>
                <div class="state-bar">
                    <a className="btn-state-view" href="javascript:void(0);"><img src={this.state.logo} /></a>
                    <img src="/front-src/release/images/shop_check_in.svg" alt="" style={_img_w100} />
                </div>
                <div class="state-cont">
                    <div class="message-type2">
                        <p>블루투스 연결이 끊어졌습니다.</p>
                        <span>{this.state.info.SHOP_NAME}</span>
                    </div>
                </div>
            </div>
        );
    }
});

/*********************************************************************************
 * shopstatelist state class
 * html template
 *********************************************************************************/
var ShopStateList = React.createClass({
    componentDidMount:function() {
        var _this=this;
        /**********************************
         * 리스트 선택 및 매장상세 이동
         *********************************/
        jQuery(document.body).on('tap','.item-list',function() {
            var _shopinfo={},
                _shopidx=jQuery(this).attr('data-shop-idx'),
                _datalat=jQuery(this).attr('data-lat'),
                _datalng=jQuery(this).attr('data-lng');

            _shopinfo={
                'shopidx':_shopidx,
                'lat':_datalat,
                'lng':_datalng
            };

            location.href='#/shop-detail/'+_shopidx+'?lat='+_datalat+'&lng='+_datalng;
        });

    },
    render:function() {
        var shopList=this.props.data,
            _backgroundImage={
                'background-image':'url('+shopList.shop_logo_image+')'
            },
            _background_cafe={
                'background-image':'url('+shopList.cafe_logo+')'
            },
            _coin_premium=null,
            _floor=null,
            _coupon_desc=null,
            _coin_ratio=null,
            _min_save=null,
            _use_coupon=null,
            _exchange_coin=null,
            _remain=null,
            _bookmark_className='';
        console.log(shopList);
        if (shopList.shop_coin_save_yn == 'Y') {
            _coin_premium = <span className="coin-premium">{shopList.shop_name}</span>;
        }

        if (shopList.shop_flore != '') {
            _floor = <div className="floor">{shopList.shop_flore}F</div>;
        }

        if (shopList.coupon_name != '') {
            _coupon_desc = <div><strong>쿠폰</strong>

                <p>{shopList.coupon_name}</p></div>;
        } else {
            _coupon_desc = <div className="use-no"><strong>쿠폰</strong>

                <p>등록된 쿠폰이 없습니다.</p></div>;
        }

        if (shopList.coupon_use_yn != 'N') {
            _coin_ratio = <div><strong>코인</strong>

                <p>{shopList.shop_coin_rate}min <em><i className="fa fa-caret-right"></i></em> {shopList.shop_coin_exchange_min}coin</p></div>;
        } else {
            _coin_ratio = <div className="use-no"><strong>코인</strong>

                <p>코인 교환이 종료되었습니다.</p></div>;
        }

        if (shopList.shop_min_save_yn == 'Y') {
            _min_save = <li className="min-save">min 적립</li>;
        } else {
            _min_save = <li className="min-save no">min 적립</li>;
        }

        if (shopList.coupon_yn == 'Y') {
            _use_coupon = <li className="coupon">쿠폰사용</li>;
        } else {
            _use_coupon = <li className="coupon no">쿠폰사용</li>;
        }

        if (shopList.shop_coin_use_yn == 'Y') {
            _exchange_coin = <li className="coin">코인사용</li>;
        } else {
            _exchange_coin = <li className="coin no">코인사용</li>;
        }

        if(shopList.cafe_idx>0) {
            _remain=<li className="remain lazy" style={_background_cafe}>매장</li>;
        } else {
            _remain=<li className="remain no lazy">매장</li>;
        }

        if (shopList.bookmark_idx > 0) {
            _bookmark_className = ' active';
        }


        return (
            <div className="bottombox-item">
                <div className="item-list fix" ref="item" data-shop-idx={shopList.shop_idx} data-lat={shopList.shop_latitude} data-lng={shopList.shop_longitude}>
                    <div className="item">
                        {_coin_premium}
                        <span className="shop-logo" style={_backgroundImage}></span>
                    </div>

                    <div className="balloons">
                        <strong className="shop-name">{shopList.shop_name}</strong>

                        <div className="item-use">
                            {_coupon_desc}
                            {_coin_ratio}
                        </div>
                        <ul className="item-icons fix">
                            {_min_save}
                            {_use_coupon}
                            {_exchange_coin}
                            {_remain}
                        </ul>
                        <div className={"bookmark"+_bookmark_className}>
                            <a href="javascript:void(0)"><i className="fa fa-heart-o"></i><span className="num">{shopList.bookmarkcnt}</span></a>
                        </div>
                        <div className="distance fix">
                            <div className="meter">{shopList.dis}m</div>
                            {_floor}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * shopstatelist state class
 * html template
 *********************************************************************************/
var ShopStateListEmpty = React.createClass({
    render : function () {
        var _this=this;
        var _contentsEmpty = null,
            _background={
                background:'#fff'
            };

        _contentsEmpty = <ShopStateListEmpty />;

        return (
            <div className="bottombox-item" style={_background}>
                <div className="no-data">
                    <p>현재 주변에 이용가능한 매장이 없습니다.</p>
                </div>
            </div>
        )
    }
});