/*********************************************************************************
 * CoinUse class
 * html template
 *********************************************************************************/
var CoinUseSelect = React.createClass({
    getInitialState:function() {
        return ({step:1,totalcoin:''});
    },
    step:1,
    componentDidMount:function() {

        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        var self = _this = this,
            _errCount = 0; // 비콘 결제 횟수 제한 초기값.

        React.render(React.createElement(ModalAll, {coin:jQuery('header').data('coin')}), document.getElementsByClassName('modal-wrap')[0]);

        // 코인사용을 위한 함수
        function _setUseCoin(options,apiUrl,flag) {
            console.log( 'CoinUseSelect::componentDidMount::_setUseCoin : ', options, apiUrl, flag );
            reqwest({
                url: apiUrl,
                method: 'post',
                type: 'json',
                data: options
            })
            .then(function(resp) {
                console.log(resp[0]);
                /*************************
                 resp.ResultCode
                 '1'=success
                 '-1'=fail
                 *************************/
                if (resp[0].ResultCode == '1') {
                    if (_this.isMounted()) {
                        var payInfo = resp[0];
                        _this.setState({
                            totalcoin: resp[0].totalCoin
                        });
                        console.log(resp[0]);
                        jQuery('.modal.modal-beacon-password p.text-type4').text('');

                        twCommonUi.hideModal(jQuery('.modal'));
                        jQuery('.complete .shop-name').text(payInfo.shopName); //'스타벅스'=resp[0].shop-name으로 교체해야 함
                        jQuery('.use-complete em').text(options.setCoin);
                        jQuery('.bottombox em').text(resp[0].totalCoin);

                        twCommonUi.showModal(jQuery('.modal.modal-coin-complete'), 'noBg');

                        jQuery('.use-step-wrap .btnbox a').on('tap',function(e) {
                            e.stopPropagation();
                            location.href='#/shop-detail/'+resp[0].shop_idx;
                        });
                    }
                } else if (resp[0].ResultCode == '-70006'){
                    //실패, 코인사용 매장이 아님.
                    twCommonUi.showModal(jQuery('.modal.modal-no-coin-use'));
                } else if (resp[0].ResultCode == '-70007') {
                    // 실패, 매장 비밀번호 오류
                    console.log('비밀번호가 틀렸습니다.');
                    jQuery('.modal.modal-beacon-password .error-log .text-type4').text('비밀번호가 틀렸습니다.');
                }
            })
        }
        // 비콘사용을 위한 함수
        function _runBeaconPay() {
            BRIDGE.setAppEventHandler( 'PAY-BEACON-RESULT', function( result )
            {
                if( result.SUCCESS )
                {
                    // 비콘 찾았을 때
                    var _msg='';
                    var _u_idx=(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1;
                    var _coin=jQuery('header').data('coin');
                    var param =
                    {
                        u_idx:_u_idx,
                        setCoin : _coin,
                        beacon_uuid : result.BEACON_INFO.UUID,
                        beacon_major : result.BEACON_INFO.MAJOR,
                        beacon_minor : result.BEACON_INFO.MINOR
                    };

                    //
                    //_setUseCoin( param, loc[27].api[2],'beacon');//쿠폰 사용, 비콘
                    _setUseCoin( param, 'Coin/Set_Coin_Use_beacon','beacon');//쿠폰 사용, 비콘

                } else { //비콘 찾기 실패
                    if(_errCount<3) {
                        //결제 비콘 실패 모달 띄우기
                        twCommonUi.showModal(jQuery('.modal.modal-beacon-nosearch'));
                        _errCount++; //실패 카운트 증가
                        console.log(_errCount);

                    } else {
                        //3번 이상 실패로 판별 결제 비콘찾기 3회 실패 모달 띄우기
                        twCommonUi.showModal(jQuery('.modal.modal-nosearch-three'));
                    }
                }
            });
            BRIDGE.findPayBeacon(function(b) {});
        }

        // 코인사용조건 초기화 함수
        function _setDefaultPayStatus() {
            _this.setState({
                step:1
            });
            window.history.back();
            jQuery('.header .btn-prev').show();
            _errCount=0;
        }

        //비콘 검색 결제
        jQuery('.roundbox.step1 .btnbox a').off('tap').on('tap',function(e)
        {
            console.log( '여기' );
            e.stopPropagation();

            _this.setState({
                step:2
            });
            jQuery('.header .btn-prev').hide();
            _runBeaconPay();
        });

        // 비밀번호 결제
        jQuery('.modal.modal-beacon-password .btn-type1').on('tap',function() {
            //가맹점 및 비밀번호 양식이 맞지 않는 경우
            /*
             <!--<p class="text-type4 left">* 가맹점 번호가 일치하지 않습니다.</p>
             <p class="text-type4 left">* 번호형식이 맞지 않습니다.</p>-->
             */

            var _msg='',
                _u_idx=(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                _coin=jQuery('header').data('coin'),
                num_check=/[0-9]/g,
                _pwd=0,
                _shop_idx=jQuery('.modal.modal-beacon-password #shop-number'),
                _shop_pwd=jQuery('.modal.modal-beacon-password #shop-password');

            _pwd=_shop_pwd.val();

            if(!num_check.test(_shop_idx.val())) {
                _msg='* 가맹점 번호는 숫자만 입력되어야 합니다.';
                _shop_idx.val('');
                jQuery('.modal.modal-beacon-password p.text-type4').text(_msg);
                return false;
            }

            if(!num_check.test(_shop_pwd.val())) {
                _msg='* 가맹점 비밀번호는 숫자만 입력되어야 합니다.';
                _shop_pwd.val('');
                jQuery('.modal.modal-beacon-password p.text-type4').text(_msg);
                return false;
            }

            if(_shop_pwd.val().length<6) {
                _msg='* 가맹점 비밀번호는 6자리가 입력되어야 합니다.';
                _shop_pwd.val('');
                jQuery('.modal.modal-beacon-password p.text-type4').text(_msg);
                return false;
            }

            _data = {
                u_idx:_u_idx,
                shop_idx:_shop_idx.val(),
                pwd:_shop_pwd.val(),
                setCoin:_coin
            };
            _setUseCoin(_data,loc[27].api[1],'password'); // 코인사용, 패스워드
        });

        //비밀번호 결제로 전환
        jQuery('.password-change-key .active').off('tap').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.showModal(jQuery('.modal.modal-beacon-password'));
        });

        // 비밀번호 결제에서 취소 버튼 누를 경우 액션
        jQuery('.modal.modal-beacon-password .btn-type2').off('tap').on('tap',function() {
            twCommonUi.hideModal(jQuery('.modal.modal-beacon-password'));

            _shop_idx=jQuery('.modal.modal-beacon-password #shop-number');
            _shop_pwd=jQuery('.modal.modal-beacon-password #shop-password');
            _shop_idx.val('');
            _shop_pwd.val('');

            jQuery('.modal.modal-beacon-password p.text-type4').text('');

            _setDefaultPayStatus();
        });

        /* modal에서 취소 버튼 클릭시 */
        jQuery('.modal.modal-beacon-nosearch .btn-type2').off('tap').on('tap', function(e){
            e.stopPropagation();
            _setDefaultPayStatus();
        });

        /* 결제 비콘 검색 실패 시 모달에서 다시시도 누를 경우 */
        jQuery('.modal.modal-beacon-nosearch .btn-type1').off('tap').on('tap', function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-beacon-nosearch'));
            _runBeaconPay();
        });

        // 결제 비콘찾기 3회실패 모달에서 취소버튼 액션
        jQuery('.modal.modal-nosearch-three .btn-type2').off('tap').on('tap', function(e){
            e.stopPropagation();
            _setDefaultPayStatus();
        });

        // 결제 비콘찾기 3회실패 모달에서 확인버튼 액션 --> 비밀번호 결제로 전환
        jQuery('.modal.modal-nosearch-three .btn-type1').off('tap').on('tap', function(e){
            e.stopPropagation();
            twCommonUi.showModal(jQuery('.modal.modal-beacon-password'));
        });

        // 코인사용불가 (-70006 반환시) 모달에서 취소버튼 액션
        jQuery('.modal.modal-no-coin-use .btn-type2').off('tap').on('tap', function(e){
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-no-coin-use'));
            _setDefaultPayStatus();
        });

        // 코인사용불가 (-70006 반환시) 모달에서 확인버튼 액션
        jQuery('.modal.modal-no-coin-use .btn-type1').off('tap').on('tap', function(e){
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-no-coin-use'));
            _runBeaconPay();
        });

    },
    render : function () {
        var _bg={
                background:'#e5e5e5'
            },
            _contents=null;

        if(this.state.step==1) {
            _contents=<CoinUseStep1 />;
        } else {
            _contents=<CoinUseStep2 />;
        }

        return (
            <div className={"page "+loc[27].pageName+" "+this.props.position} style={_bg}>
                <div className="contentsScroll">
                    <div className="bg-use-step"></div>
                    <div className="use-step-wrap">
                        {_contents}
                    </div>
                </div>
            </div>
        )
    }
});

var CoinUseStep1 = React.createClass({
    render:function() {
        return (
            <div className="roundbox step1">

                <div className="password-change-key">
                    <a className="active" href="javascript:void(0);"><span className="hide">비밀번호로 결제 변경</span></a>
                </div>

                <div className="top-text">
                    <strong>블루투스 활성화</strong>
                    블루투스 기능을 켜주시고 <br />단말기를 직원에게 제시해주세요.
                </div>
                <div className="bgbox"></div>
                <div className="btnbox">
                    <a href="javascript:void(0);">확인</a>
                </div>
            </div>

        );
    }
});

var CoinUseStep2 = React.createClass({
    render:function() {
        return (
            <div className="roundbox step2">
                <div className="top-text">
                    <strong>결제 진행중</strong>
                    현재 결제가 진행중입니다.
                </div>
                <div className="bgbox"></div>
                <div className="btnbox">
                    <a href="javascript:void(0);">확인</a>
                </div>
            </div>
        );
    }
});

/**********************************
 * 코인사용 모달
 ********************************/
var ModalAll = React.createClass({
    render: function () {

        var props = {
            display: 'none',
            position: 'absolute',
            top: '100px',
            width: '100%',
            zIndex: '200'
        };

        //<ModalCoinUse dataStyle={props} total={this.props.total} uidx={this.props.u_idx} />
        return (
            <ModalCoinUse dataStyle={props} />
        )
    }
});

var ModalCoinUse = React.createClass({
    componentDidMount:function() {
        jQuery('.modal.modal-beacon-password .btn-type2').on('tap',function() {
            twCommonUi.hideModal(jQuery('.modal.modal-beacon-password'));

            _shop_idx=jQuery('.modal.modal-beacon-password #shop-number'),
            _shop_pwd=jQuery('.modal.modal-beacon-password #shop-password');
            _shop_idx.val('');
            _shop_pwd.val('');

            jQuery('.modal.modal-beacon-password p.text-type4').text('');

        });
    },
    render: function () {

        return (
            <div>
                <section className="modal modal-small modal-no-coin-use" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type1"></div>
    
                        <div className="modal-content">
                            <div className="message">
                                <p className="text-type1">코인사용이 불가능한 매장입니다.</p>
                            </div>
                        </div>
    
                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">취소</a>
                                <a className="btn-type1" href="javascript:void(0);">다시시도</a>
                            </div>
                        </div>
                    </div>
                </section>
    
                <section className="modal modal-small modal-beacon-nosearch" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type3"></div>
    
                        <div className="modal-content">
                            <div className="message">
                                <p className="text-type1">결제 비콘찾기 실패 <br />다시 시도하시겠습니까?</p>
                            </div>
                        </div>
    
                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">취소</a>
                                <a className="btn-type1" href="javascript:void(0);">다시시도</a>
                            </div>
                        </div>
                    </div>
                </section>
    
                <section className="modal modal-small modal-nosearch-three" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type3"></div>
    
                        <div className="modal-content">
                            <div className="message">
                                <p className="text-type1">결제 비콘찾기 3회 실패</p><br /><br />
                                <p className="text-type5">비밀번호 입려방식으로 변경하시겠습니까?</p>
                            </div>
                        </div>
    
                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">취소</a>
                                <a className="btn-type1" href="javascript:void(0);">확인</a>
                            </div>
                        </div>
                    </div>
                </section>
    
                <section className="modal modal-beacon-password" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type7"><p className="text">가맹점 정보를 입력하세요</p></div>
    
                        <div className="modal-content error-log">
                            <div className="modal-inputgroup">
                                <label for="shop-number">가맹점 번호</label>
                                <div className="inp-type1">
                                    <input type="tel" id="shop-number" placeholder="" />
                                </div>
                            </div>
                            <div className="modal-inputgroup">
                                <label for="shop-passowrd">가맹점 비밀 번호</label>
                                <div className="inp-type1">
                                    <input type="password" id="shop-password" placeholder="" />
                                </div>
                            </div>
                            <p className="text-type4 left"></p>
    
                        </div>
    
                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">취소</a>
                                <a className="btn-type1" href="javascript:void(0);">확인</a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="modal modal-full modal-coin-complete" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-content">
                            <div className="content-header">
                                <h3>코인사용</h3>
                            </div>
                            <div className="bg-use-step"></div>
                            <div className="use-step-wrap">
                                <div className="roundbox">
                                    <div className="top-text">
                                        <strong>결제 완료</strong>
                                        고객님께 확인을 부탁드립니다
                                    </div>
                                    <div className="complete">
                                        <div className="shop-name">스타벅스 강남2호점스타벅스 강남2호점스타벅스 강남2호점스타벅스 강남2호점스타벅스 강남2호점</div>
                                        <div className="use-complete"><span><em>5,000</em>coin</span> 사용완료</div>
                                    </div>
                                    <div className="bottombox">
                                        <div className="remain">사용 후 잔액 : <span><em>3,700</em>coin</span></div>
                                    </div>
                                    <div className="btnbox">
                                        <a href="javascript:void(0);">확인</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
                    
        )
    }
});


