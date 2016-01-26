/*********************************************************************************
 * CoinUse class
 * html template
 *********************************************************************************/
var MyCouponUseSelect = React.createClass({
    getInitialState:function() {
        return ({step:1,totalcoin:''});
    },
    step:1,
    componentDidMount:function() {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        var _this=this,
            _errCount=0; //비콘 찾기 결과 값 저장

        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);

        // 쿠폰사용을 위한 함수
        function _setUseCoupon(options,apiUrl,flag) {
            reqwest({
                url: apiUrl,
                method: 'post',
                type: 'json',
                data: options
            })
            .then(function (resp) {
                /*************************
                 resp.ResultCode
                 '1'=success
                 '-1'=fail
                 *************************/
                if (resp[0].ResultCode == '1') {
                    console.log(resp);
                    //setState excute react render
                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                        var coupon=resp[0].ResultData[0],
                            _coupon_kind={
                                cls:'',
                                txt:''
                            };

                        _this.setState({
                            totalcoin: resp[0].totalCoin
                        });

                        jQuery('.modal.modal-beacon-password p.text-type4').text('');

                        twCommonUi.hideModal(jQuery('.modal'));

                        if(coupon.coupon_type==1) { //할인
                            _coupon_kind.cls = ' discount';
                            _coupon_kind.txt = 'cupon 할인';
                        } else if(coupon.coupon_type==2) { //증정
                            _coupon_kind.cls = ' freebies';
                            _coupon_kind.txt = 'cupon 사은품';
                        } else if(coupon.coupon_type==3) { //1+1
                            _coupon_kind.cls = ' plus';
                            _coupon_kind.txt = 'cupon 플러스';
                        } else { //무료
                            _coupon_kind.cls = ' free';
                            _coupon_kind.txt = 'cupon 무료';
                        }

                        jQuery('.modal-coupon-complete .coupon-kind').attr('class','coupon-kind '+_coupon_kind.cls);
                        jQuery('.modal-coupon-complete .shop-name').text(coupon.shop_name); //'스타벅스'=resp[0].shop_name 으로 교체해야 함
                        jQuery('.modal-coupon-complete .coupon-use-number .coupon-num').text(coupon.coupon_code);
                        jQuery('.modal-coupon-complete .bottombox strong').text(coupon.coupon_master_name);
                        jQuery('.modal-coupon-complete .bottombox p').text(coupon.coupon_master_descriptionon);

                        var shop_idx = coupon.Shop_idx,
                            shop_longi = coupon.shop_longitude,
                            shop_lati = coupon.shop_latitude;

                        twCommonUi.showModal(jQuery('.modal.modal-coupon-complete'), 'noBg');

                        jQuery('.use-step-wrap .btnbox a').on('tap',function(e) {
                            e.stopPropagation();
                            location.href='#/shop-detail/'+shop_idx+'?lat='+shop_lati+'&lng='+shop_longi;
                        });

                    }
                } else if (resp[0].ResultCode == '-60001' || resp[0].ResultCode == '-70001') { //실패, 매장정보 불일치
                    twCommonUi.showModal(jQuery('.modal.modal-nomatch-store'));
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });

        }

        // 비콘사용을 위한 함수
        function _runBeaconPay(){
            BRIDGE.findPayBeacon(function(b) {
                //b.SUCCESS가 false인 경우는 블루투스가 꺼졌을 경우이다. 다른 상황이 발생할 수 있다. 이렇게 호출하면 앱에서 알아서 PAY-BEACON-RESULT 호출하신다고..
            });

            BRIDGE.setAppEventHandler( 'PAY-BEACON-RESULT', function(info){
                console.log('PAY-BEACON-RESULT :', info);
                if(info.SUCCESS) {
                    // 비콘 찾았을 때
                    var _msg='',
                        _u_idx=(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                        _coupon_idx=_this.props.coupon_idx,
                        _shop_idx=_this.props.shop_idx,
                        _data={
                            u_idx:_u_idx,
                            shop_idx:_shop_idx,
                            coupon_idx:_coupon_idx,
                            beacon_uuid : info.BEACON_INFO.UUID,
                            beacon_major : info.BEACON_INFO.MAJOR,
                            beacon_minor : info.BEACON_INFO.MINOR
                        };

                    _setUseCoupon(_data,loc[28].api[1],'beacon');//쿠폰 사용, 비콘

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
        }

        // 쿠폰사용조건 초기화 함수
        function _setDefaultPayStatus() {
            _this.setState({
                step:1
            });
            window.history.back();
            jQuery('.header .btn-prev').show();
            _errCount=0;
        }

        //비콘 검색 결제
        jQuery('.roundbox.step1 .btnbox a').off('tap').on('tap',function(e) {
            e.stopPropagation();

            _this.setState({
                step:2
            });
            jQuery('.header .btn-prev').hide();
            _runBeaconPay();
        });

        //비밀번호 결제
        jQuery('.modal.modal-beacon-password .btn-type1').off('tap').on('tap',function() {
            //가맹점 및 비밀번호 양식이 맞지 않는 경우
            /*
             <!--<p className="text-type4 left">* 가맹점 번호가 일치하지 않습니다.</p>
             <p className="text-type4 left">* 번호형식이 맞지 않습니다.</p>-->
             */

            var _msg='',
                _u_idx=(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                _coupon_idx=_this.props.coupon_idx,
                num_check=/[0-9]/g,
                _pwd=0,
                _shop_idx=jQuery('.modal.modal-beacon-password #shop-number'),
                _shop_pwd=jQuery('.modal.modal-beacon-password #shop-password'),
                _data={};

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

            _data={
                u_idx:_u_idx,
                shop_idx:_shop_idx.val(),
                pwd:_shop_pwd.val(),
                coupon_idx:_coupon_idx
            };
            _setUseCoupon(_data,loc[28].api[0],'password'); //쿠폰 사용 ,패스워드
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

        // 매장정보 불일치 (-60001 반환시) 모달에서 취소버튼 액션
        jQuery('.modal.modal-nomatch-store .btn-type2').off('tap').on('tap', function(e){
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-nomatch-store'));
            _setDefaultPayStatus();
        });

        // 매장정보 불일치 (-60001 반환시) 모달에서 확인버튼 액션
        jQuery('.modal.modal-nomatch-store .btn-type1').off('tap').on('tap', function(e){
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-nomatch-store'));
            _runBeaconPay();
        });

    },
    render : function () {
        var _bg={
                background:'#e5e5e5'
            },
            _contents=null;

        if(this.state.step==1) {
            _contents=<MyCouponUseStep1 />;
        } else {
            _contents=<MyCouponUseStep2 />;
        }

        return (
            <div className={"page "+loc[28].pageName+" "+this.props.position} style={_bg}>
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

var MyCouponUseStep1 = React.createClass({
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

var MyCouponUseStep2 = React.createClass({
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
            <ModalCouponUse dataStyle={props} />
        )
    }
});

var ModalCouponUse = React.createClass({
    componentDidMount:function() {

    },
    render: function () {

        return (
            <div>
                <section className="modal modal-small modal-nomatch-store" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type1"></div>

                        <div className="modal-content">
                            <div className="message">
                                <p className="text-type1">매장정보가 일치하지 않습니다.</p>
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

                        <div className="modal-content">
                            <div className="modal-inputgroup">
                                <label for="shop-number">가맹점 번호</label>
                                <div className="inp-type1">
                                    <input type="number" id="shop-number" placeholder="" />
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

                <section className="modal modal-full modal-coupon-complete" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-content">
                            <div className="content-header">
                                <h3>쿠폰사용</h3>
                            </div>
                            <div className="bg-use-step"></div>
                            <div className="use-step-wrap">
                                <div className="roundbox">
                                    <div className="top-text">
                                        <div className="coupon-kind plus"><span className="hanareum">한아름 제휴</span>coupon 플러스</div>
                                        <strong>사용완료!</strong>
                                        고객님께 확인을 부탁드립니다
                                    </div>
                                    <div className="complete">
                                        <div className="shop-name">스타벅스 강남2호점</div>
                                        <div className="coupon-use-number">쿠폰 NO : <span className="coupon-num">00000-00000-00000-00000</span></div>
                                    </div>
                                    <div className="bottombox">
                                        <div className="text">
                                            <strong>아메리카노50%할인</strong>
                                            <p>
                                                아메리카노를 여러분께 절반의 가격으로 마구마구 쏩니다!
                                                아늑한 분위기에서 더 저렴하고  더 편안하게 즐기세요!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="btnbox">
                                        <a href="javascript:void(0);" className="btn-confirm">확인</a>
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


