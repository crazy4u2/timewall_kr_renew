/**************************************************
 * 메뉴 메인 class
 *
 **************************************************/
var MenuMain = React.createClass({
    _memStatus : null,
    getInitialState:function() {
        return ({cls:[''],my_coin:'',my_min:'',auto_exchange:false});
    },
    componentDidMount : function() {

        // 로그인 여부 판단
        var _this=this,
            settingInfo = null,
            _data = {
            'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            //'u_idx' : 0 // 로그인 안된 회원용 테스트 값 or 테스트용 회원
        };


        console.log( 'userIndex : ', jQuery.localStorage.get('userIdx') );

        reqwest({
            url : loc[9].api[0],
            method : loc[9].method,
            type : loc[9].type,
            data : _data
        })
        .then(function(resp) {
            if(resp[0].ResultCode == 1) {
                console.log( 'MenuMain::componentDidMout resp :', resp[0] );
                var _cls='',
                    //minRaw = resp[0].ResultData[0].min,
                    //coinRaw = resp[0].ResultData[0].coin,
                    _my_min = twCommonUi.setComma(resp[0].ResultData[0].min),
                    _my_coin = twCommonUi.setComma(resp[0].ResultData[0].coin);
                _this._memStatus = resp[0].ResultData[0].u_status;
                //_this._memStatus = 0;

                // ajax 호출 후 응답이 왔을 때 자동코인교환 여부를 그림.
                BRIDGE.getUserOption(function(getInfo) {
                    settingInfo = getInfo;
                    _this.setState({
                        cls:_cls,
                        my_coin:_my_coin,
                        my_min:_my_min,
                        auto_exchange:getInfo.AUTO_EXCHANGE_COIN
                    });
                    jQuery('.onoffswitch-label').off('tap').on('tap', function() {
                        var checkSw = jQuery(this).attr('for');
                        if(checkSw == 'push2'){
                            if(getInfo.AUTO_EXCHANGE_COIN) {
                                BRIDGE.setUserOption({
                                    AUTO_EXCHANGE_COIN : false
                                });
                                /*BRIDGE.getUserOption(function(getInfo) {
                                    console.log(getInfo);
                                });*/
                            } else {
                                BRIDGE.setUserOption({
                                    AUTO_EXCHANGE_COIN : true
                                });
                                /*BRIDGE.getUserOption(function(getInfo) {
                                    console.log(getInfo);
                                });*/
                            }
                        }
                    });
                });
                console.log(_this._memStatus);
                if(_this._memStatus < 1) {
                    //alert('로그인 후에 쿠폰과 코인을 사용하실 수 있습니다.');
                    BRIDGE.appAlert({
                        TITLE : '',
                        TEXT : '로그인 후에 쿠폰과 코인을 사용하실 수 있습니다.'
                    });
                    _cls='not-member';
                } else {
                    _cls='';
                }
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });

        jQuery('.menu-link-box a').off('tap').on('tap', function(e) {
            e.stopPropagation();
            var thisId = this.id;
            if(_this._memStatus < 1) {
                if(thisId == 'my-wallet' || 'my-coupon' || 'bookmark' || 'used-list' || 'coin-donate') {
                    //alert('로그인 후 이용가능한 메뉴입니다');
                    BRIDGE.appAlert({
                        TITLE : '',
                        TEXT : '로그인 후 이용가능한 메뉴입니다'
                    });
                    return false;
                }
            }
        });

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });

        jQuery('.contents .page').css({
            'padding-left':10,
            'padding-right':10
        });

        twCommonUi.setContentsHeight();

    },
    render : function() {
        var _this=this,
            _contents=null,
            _createAfterLogin=function(item) {
                var _cls_check = null,
                    _cls_on = null;
                if(item.auto_exchange) {
                    _cls_check='checked';
                    _cls_on='on';
                }
                console.log(item);
                return (
                    <div className="menubox">
                        <div className="coin">
                            <div className="coin-button">
                                <a className="btn-coin-useful" href="#/coin-use">코인사용 가능</a>
                            </div>
                            <div className="show-number">
                                <p>나의 coin</p>
                                <strong className="my-coin">{item.my_coin}</strong>
                            </div>
                            <div className="onoffswitch-wrap">
                                <span className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className={"onoffswitch-checkbox "+_cls_on} checked={_cls_check} id="push2" />
                                    <label className="onoffswitch-label" htmlFor="push2">
                                        <span className="onoffswitch-inner"></span>
                                        <span className="onoffswitch-switch"></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>
                )
            },
            _createBeforeLogin=function(item) {
                return (
                    <div className="menubox">
                        <div className="need-login">
                            <a href="#/member-login">로그인</a>
                            <a href="#/member-join">회원가입</a>
                        </div>
                    </div>
                )
            },
            _createItem=function(item) {
                var _cls_check='',
                    _cls_on = '',
                    _contentsLogin='';

                //if( typeof _this._memStatus != 'undefined' ) {
                    if (_this._memStatus > 0) {
                        _contentsLogin = _createAfterLogin(item);
                        //console.log(_contentsLogin);
                    } else {
                        _contentsLogin = _createBeforeLogin(item);
                    }
                //}

                return (
                    <div>
                        <div className={"menu-min-coin fix "+item.cls}>
                            <div className="menubox">
                                <div className="min">
                                    <div className="show-number">
                                        <p>나의 min</p>
                                        <strong className="my-min">{item.my_min}</strong>
                                    </div>
                                    <a className="btn-coin-exchange" href="#/coin-exchange">
                                        <i className="fa fa-hourglass-end"></i>
                                    </a>
                                </div>
                            </div>

                            {_contentsLogin}
                        </div>

                        <div className="menu-link-box">
                            <ul className="fix">
                                <li><a id="active my-wallet" href="#/my-wallet">나의월렛</a></li>
                                <li><a id="my-coupon" href="#/my-coupon">나의쿠폰</a></li>
                                <li><a id="coupon-exchange" href="#/coupon-exchange">쿠폰교환</a></li>
                                <li><a id="bookmark" href="#/bookmark">즐겨찾기</a></li>
                                <li><a id="used-list" href="#/used-list">이용내역</a></li>
                                <li><a id="coin-donate" href="#/coin-donate">기부하기</a></li>
                                <li><a id="notice" href="#/notice">공지사항</a></li>
                                <li><a id="setting" href="#/setting">환경설정</a></li>
                            </ul>
                        </div>
                    </div>
                );
            };

        // 비회원일 경우 : menu-min-coin에 not-member 추가

        _contents=_createItem(this.state);

        return (
            <div className={"page "+loc[9].pageName+" "+this.props.position}>
                {_contents}
            </div>
        )
    }
});