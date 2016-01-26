/*********************************************************************************
 * MemberReJoin class
 * html template
 *********************************************************************************/
var MemberLogin = React.createClass({
    reJoinDate:'',
    dropOutDate:'',
    blockEndDate:'',
    authIdx:'',
    phone:'',
    rePhone:'',
    authNum:'',
    authType:2, //1 회원가입, 2. 로그인, 3. 탈퇴
    componentDidMount : function() {
        var _this=this;
        /*
         valid phone number
         input class success : 'pass-ok'
         input class fail : 'pass-not'
         */
        jQuery('.cert .btn-modal-cert').on('tap',function(e) {
            e.stopPropagation();

            jQuery('.modal.modal-cert .num-area input').val('');
            var _phone=jQuery('.cert .phone').val();
            if(twMember.getValidPhone(_phone)) {
                //correct phone number next step(certification)
                console.log('correct phone number next step');

                //sms certification send
                reqwest({
                    url: loc[1].api[0], //SMS 회원 로그인용 인증번호 발송
                    method:loc[1].method,
                    type: loc[1].type,
                    data:{
                        'auth_phone':_phone
                    }
                })
                .then(function (resp) {
                    console.log(resp);
                    /*************************
                     resp.ResultCode
                     '1'=success
                     '-1'=fail
                     modal-auth-exceeds
                     *************************/
                    //인증하기 버튼 5번 이상 클릭 하면 대기시간 10분
                    if (resp[0].ResultCode == '1') {
                        /*
                         initialize modal-cert
                         1. setValidTime
                         2. modalShow
                         3. btn-confirm
                         */
                        /* set valid time*/
                        _this.authIdx=resp[0].auth_idx;

                        twCommonUi.setValidTime('.valid .time', 1, function () {
                            /* 입력 시간이 지난 후 콜백 실행 */
                            //console.log('입력시간이 초과되었습니다.');
                            twCommonUi.stopValidTime('.valid .time');
                            jQuery('.modal.modal-cert .time-area .text-type4').hide();
                            jQuery('.modal.modal-cert .overtime').show();
                            jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity': 0.5});
                        });

                        jQuery('.modal.modal-cert .time-area .text-type4').hide();

                        jQuery('.modal.modal-cert .phone').text(_phone);
                        twCommonUi.showModal(jQuery('.modal.modal-cert'));

                        // SMS 인증번호 확인
                        jQuery('.modal.modal-cert .btn-confirm').css({'opacity':1}).on('tap', function (e) {
                            e.stopPropagation();
                            var _$certInput = jQuery('.modal.modal-cert .num-area input'),
                            //_authNum = _$certInput.eq(0).val().toString() + _$certInput.eq(1).val().toString() + _$certInput.eq(2).val().toString() + _$certInput.eq(3).val().toString() + _$certInput.eq(4).val().toString();
                                _authNum = _$certInput.val().toString();

                            if (_authNum.length < 5) { //인증번호 5자리 입력 체크
                                jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                jQuery('.modal.modal-cert .time-area .lack-length').show();
                            } else {
                                //sms certification send
                                reqwest({
                                    url: loc[1].api[1], //SMS 인증번호 확인
                                    method: loc[1].method,
                                    type: loc[1].type,
                                    data: {
                                        'auth_idx': _this.authIdx,
                                        'auth_phone': _phone,
                                        'auth_num': _authNum,
                                        'auth_type': _this.authType
                                    }
                                })
                                .then(function (resp) {
                                    console.log(resp);
                                    /*************************
                                     resp.ResultCode
                                     '1'=success
                                     '-1'=fail
                                     *************************/
                                    if (resp[0].ResultCode == '1') {
                                        _this.authIdx = _this.authIdx;
                                        _this.authNum =_authNum;
                                        _this.phone = _phone;

                                        jQuery('.header').data('authNum',_this.authNum); // twCommonUi=>regionAccordion에서 쓰임

                                        twCommonUi.stopValidTime('.valid .time');

                                        twCommonUi.hideModal(jQuery('.modal.modal-cert'));
                                        setTimeout(function () {
                                            twCommonUi.showModal(jQuery('.modal.modal-cer-complete'));
                                        }, 300);

                                    } else if (resp[0].ResultCode == '-30000') { //이전 sms 인증번호 입력 시
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .error-number').show();

                                    } else if (resp[0].ResultCode == '-50001') { //인증번호 5번 이상 실패시 코드 번호는?
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .wrong-typing').show();
                                        jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity':0.5});
                                    } else if (resp[0].ResultCode == '-1') { //실패
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                        jQuery('.modal.modal-cert .num-area input').val('');
                                    }
                                })
                                .fail(function (err, msg) {
                                    console.log(err);
                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                });
                            }
                        });
                    } else if (resp[0].ResultCode == '-40005') { //이미 존재하는 유저
                        var _$modal=jQuery('.modal.modal-already-reg');
                        _$modal.find('.message .text-type2').text(_phone);

                        twCommonUi.showModal(_$modal);

                        _$modal.find('.btn-type1').on('tap',function(e){
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                            //재가입 가능한 api데이터?
                        });

                        _$modal.find('.btn-type2').on('tap',function(e){
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                            location.href='#/member-re-join';
                        });
                    } else if (resp[0].ResultCode == '-50001') { //인증하기 5번 클릭 시 10분 블럭
                        var _$modal=jQuery('.modal.modal-auth-exceeds');
                        twCommonUi.showModal(_$modal);

                        _$modal.find('.btn-type1').on('tap',function(e){
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                        });
                    } else if (resp[0].ResultCode == '-30000') { // sms 인증오류?
                        var _$modal = jQuery('.modal.modal-cert');
                        twCommonUi.showModal(_$modal);
                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                        jQuery('.modal.modal-cert .time-area .error-number').show();
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });

            } else {
                //invalid phone number show modal
                //console.log('invalid phone number show modal');
                twCommonUi.showModal(jQuery('.modal.modal-wrongform'));
            }
        });

        jQuery('.inp-type1 .password').on('keyup',function(e) {
            e.stopPropagation();
            var _that=this;

            setTimeout(function() {
                /*
                 * getValidPassword : return
                 * '000' : valid password
                 * '001' : invalid password(length)
                 * '002' : invalid password(mix number, string)
                 *
                 */
                if (jQuery(_that).val().length > 0) {
                    var result = twMember.getValidPassword(jQuery(_that).val());
                    jQuery(_that).closest('.inp-type1').next('p').remove();

                    if (result == '000') {
                        jQuery(_that).closest('.inp-type1').next('p').remove();
                        jQuery(_that).closest('.inp-type1').attr('class', 'inp-type1 pass-ok');
                    } else {
                        if (result == '001') {
                            jQuery(_that).closest('.inp-type1').after('<p class="comment notice">* 비밀번호 입력은 8~15자리로 입력하셔야 합니다.</p>');
                        } else {
                            jQuery(_that).closest('.inp-type1').after('<p class="comment notice">* 비밀번호는 숫자와 영문자를 혼용하셔야 합니다.</p>');
                        }
                        jQuery(_that).closest('.inp-type1').attr('class', 'inp-type1 pass-not');

                    }
                } else {
                    jQuery(_that).closest('.inp-type1').next('p').remove();
                    jQuery(_that).closest('.inp-type1').attr('class', 'inp-type1');
                }

            },1)
        });

        jQuery('.twMember_login .btn-start').on('tap', function(e){
            e.stopPropagation();
            //console.log('_this.authNum',_this.authNum);

            var _bSaveMember = twCommonUi.checkEnableJoinButton({
                'phone':jQuery('.cert .phone').val(),
                'rePhone':jQuery('.phone-check .re-phone').val(), // 기존 휴대폰번호 입력
                'auth_num':_this.authNum,
                'loginPassword':jQuery('.inp-type1 .password').val()
            },jQuery('.twMember_login .btn-start'),'login');

            if (_bSaveMember.bResult) {

                var _password = jQuery('.password').val(),
                    _phone = jQuery('.phone').val(),
                    _new_phone = jQuery('.re-phone').val(),
                    _os_type= 0,
                    _url='',
                    _data={};

                if (device.checkDeviceType() == 'android') {
                    _os_type=1;
                } else if (device.checkDeviceType() == 'ios') {
                    _os_type=2;
                } else {
                    _os_type=0;
                }

                _webBridge.osType=_os_type;

                BRIDGE.getUserInfo( function( userIndex ) {
                    BRIDGE.getDeviceInfo( function( deviceInfo) {
                        /*
                         * user.userState status value
                         * 0 : 임시회원 ,1: 정상회원, -1 : 탈퇴 요청, -2: 탈퇴 완료 (계정 삭제), -3: 블럭 , -4 : 임시회원 데이터이전 완료
                         */
                        var _data_idx={
                            u_idx:userIndex.INDEX
                        };
                        console.log(_data_idx);

                        reqwest({
                            url: loc[1].api[3], //유저정보
                            method: 'post',
                            type: 'json',
                            data: _data_idx
                        })
                        .then(function (resp) {
                            console.log(resp);
                            /*************************
                             resp.ResultCode
                             '1'=success
                             '-1'=fail
                             *************************/
                            if (resp[0].ResultCode == '1') {
                                var user = resp[0].ResultData.u_status;

                                _data = {
                                    'pwd': _password,
                                    'phone': _phone,
                                    'new_phone': _new_phone,
                                    'device_id': deviceInfo.DEVICE_ORG_ID,
                                    'app_id': deviceInfo.APP_ORG_ID,
                                    'os_type': _os_type,
                                    'auth_idx': _this.authIdx,
                                    'auth_num': _this.authNum
                                };

                                if (!user) { //없는 로그인
                                    _url = loc[1].api[2];

                                } else if (user.u_status == 0) { //임시 유저의 로그인
                                    _url = loc[1].api[4];
                                    _data["u_idx"] = userIndex;
                                } else { //기타(1,-1,-2,-3,-4) 유저의 로그인
                                    _url = loc[1].api[2];
                                }

                                reqwest({
                                    url: _url, //로그인 api
                                    method: loc[1].method,
                                    type: loc[1].type,
                                    data: _data
                                })
                                .then(function (resp) {
                                    console.log(resp);
                                    /*************************
                                     resp.ResultCode
                                     '1'=success
                                     '-1'=fail
                                     *************************/
                                    if (resp[0].ResultCode == '1') { // 성공

                                        //var setPhoneParam = "?phone=" + _phone + "&u_idx=" + resp[0].u_idx;
                                        window.location.href = loc[4].hash + "/" + resp[0].u_idx;

                                    } else if (resp[0].ResultCode == '-40000') { // 실패 : 가입정보 없음.

                                        setPhoneNum = _new_phone.replace(/^(\d{3})(\d{3,4})(\d{4}).*/, "$1-$2-$3");
                                        jQuery('.modal.modal-no-member-info .text-type2').text(setPhoneNum);

                                        twCommonUi.showModal(jQuery('.modal.modal-no-member-info'));

                                    } else if (resp[0].ResultCode == '-40008') { // 실패 : 비밀번호 오류.
                                        twCommonUi.showModal(jQuery('.modal.modal-wrong-password'));
                                    } else if (resp[0].ResultCode == '-10000') { // 파라미터오류인데 보통 인증번호를 입력하지 않을 경우 나타남.
                                        jQuery('.error-log').append('<p class="comment notice">* 인증번호를 입력하세요.</p>');
                                    }
                                })
                                .fail(function (err, msg) {
                                    console.log(err);
                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                });
                            }
                        })
                        .fail(function (err, msg) {
                            console.log(err);
                            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                        });
                    });
                });

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

        BRIDGE.webIsReady( function( initData )
        {

        });

        twCommonUi.setContentsHeight();

        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);
        // 다른 페이지에서 놀다가 회원가입, 로그인, 비밀번호 찾기로 진입할 경우 비콘스테이터스 강제 삭제.
        if(jQuery('.beaconState .state-bottombox') && jQuery('.modal-wrap-beacon div')) {
            jQuery('.beaconState .state-bottombox').remove();
            jQuery('.modal-wrap-beacon div').remove();
        }
    },
    render : function() {
        var _contents=null;
            _contents = <MemberLogin />;

        return (
            <div className={"page "+loc[1].pageName+" "+this.props.position}>
                <div className="member-info">
                    <div className="member-title">
                        <h3>회원가입정보</h3>
                        <p className="essential">*표시는 필수 입력사항 입니다.</p>
                    </div>

                    <div className="member-contents error-log">
                        <div className="cert">
                            <div className="inp-type1"><input type="tel" pattern="[0-9]{10}" className="phone" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                            <a href="javascript:void(0);" className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                        </div>

                        <div className="inp-type1 phone-check">
                            <input type="tel" className="re-phone" pattern="[0-9]{10}" maxLength="11" placeholder="* 기존 휴대폰 번호 입력" />
                        </div>
                        <p className="comment">휴대폰 번호가 변경되지 않은 고객께서는 동일한 번호를 입력해주세요.</p>

                        <div className="inp-type1">
                            <input type="password" className="password" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                        </div>
                        <div className="forget-password fix">
                            <a href="#/member-search-pass" className="fl" >비밀번호를 잊으셨나요? <i className="fa fa-unlock-alt"></i></a>
                            <a href="#/member-join" className="fr">회원가입하기</a>
                        </div>
                    </div>

                </div>
                <div className="member-footer">
                    <a href="javascript:void(0);" className="btn-start active"><span>로그인</span></a>
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * certification number modal
 *********************************************************************************/
var ModalCert = React.createClass({
    componentDidMount : function() {
        //인증 번호 자리 이동, 2015-10-20 : 인증번호 입력 필드 변경으로 인해 기존 내용 주석처리
        /* jQuery('.num-area input').on('keyup',function() {
            var _maxChars=1;
            if(jQuery(this).val().length>0) {
                $(this).val($(this).val().substr(0, _maxChars));
                if (jQuery(this).next().size() > 0) {
                    jQuery(this).next().focus();
                } else {
                    jQuery(this).next().focusout();
                }
            }
        }); */

        //취소 버튼 클릭
        jQuery('.modal.modal-cert .btn-cancel').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.stopValidTime();
            jQuery('.modal.modal-cert .overtime').hide();
            jQuery('.modal.modal-cert .error-number').hide();
            twCommonUi.hideModal(jQuery('.modal.modal-cert'));
        });
    },
    render : function(){
        var _hide={
            display:'none'
        };

        return(
            <section className="modal modal-cert" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type2"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2 phone">010-1234-4322</p>
                            <p className="text-type3">전송된 인증번호 5자리를 입력해주세요.</p>
                        </div>
                        <div className="num-area">
                            <input type="tel" maxLength="5" />
                        </div>
                        <div className="time-area">
                            <div className="valid">유효입력시간
                                <span className="time">00:59</span>
                            </div>
                            <p className="overtime text-type4" style={_hide}>입력 제한 시간 초과 다시 진행해 주세요.</p>
                            <p className="error-number text-type4" style={_hide}>잘못된 인증번호 입니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2 btn-cancel" href="javascript:void(0);">취소</a>
                            <a className="btn-type3 btn-confirm" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * Invalid message modal
 *********************************************************************************/
var ModalInvalid = React.createClass({
    componentDidMount:function(){
        //번호 입력 잘못됐을 시
        jQuery('.modal.modal-wrongform .btn-confirm').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-wrongform'));
            jQuery('.inp-type1 .phone').val('').focus();

        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-wrongform" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">번호형식이 올바르지 않습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1 btn-confirm" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 탈퇴대기 modal
 *********************************************************************************/
var ModalDropOut = React.createClass({
    render : function () {
        return (
            <section className="modal modal-drop" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <p className="text-type4"><span>2015. 6. 21 22:00:00</span><br />탈퇴 처리중입니다.</p>
                            <p className="text-type5">남은 탈퇴 대기시간 <span class="time"> 21:59 </span></p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">닫기</a>
                            <a className="btn-type1" href="javascript:void(0);">탈퇴취소</a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * certification complete modal
 *********************************************************************************/
var ModalCertComplete = React.createClass({
    componentDidMount : function () {
        jQuery('.modal.modal-cer-complete .btn-type1').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-cer-complete'));
        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-cer-complete" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">인증완료</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 비밀번호 틀렸습니다.
 *********************************************************************************/
var ModalWrongPassword = React.createClass({
    componentDidMount : function () {
        jQuery('.modal.modal-wrong-password .btn-type1').on('tap', function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-wrong-password'));
        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-wrong-password" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">비밀번호가 틀렸습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 탈퇴가 취소되었습니다. 모달
 *********************************************************************************/
var ModalDropCancel = React.createClass({
    render : function () {
        return (
            <section className="modal modal-small modal-drop-cancel" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">탈퇴가 취소되었습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 인증버튼 클릭제한횟수 초과 모달
 *********************************************************************************/
var ModalAuthExceeds = React.createClass({
    render : function () {
        return (
            <section className="modal modal-small modal-auth-exceeds" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">인증 제한 횟수 초과</span><br /><br />
                            <p className="text-type3">10분 후 재시도 부탁드립니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 가입된 전화번호 없음 모달.
 *********************************************************************************/
var ModalNoMemberInfo = React.createClass({
    componentDidMount : function () {
        jQuery('.modal-no-member-info .btn-type1').on('tap', function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-no-member-info'));
        });
    },
    render : function () {
        return (
            <section className="modal modal-small modal-no-member-info" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <span className="text-type4">가입된 정보가 없습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 모든 모달페이지 렌더링
 *********************************************************************************/
var ModalAll = React.createClass({
    render : function(){
        var props={
            display:'none',
            position:'absolute',
            top:'100px',
            width:'100%',
            zIndex:'200'
        };

        return (
            <div>
                <ModalInvalid {...props} />
                <ModalCert {...props} />
                <ModalDropOut {...props} />
                <ModalCertComplete {...props} />
                <ModalWrongPassword {...props} />
                <ModalDropCancel {...props} />
                <ModalAuthExceeds {...props} />
                <ModalNoMemberInfo {...props} />
            </div>
        )
    }
});