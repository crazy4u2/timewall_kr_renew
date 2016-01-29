var PageSearchPassword = React.createClass({
    mail:'',
    phone:'',
    authNum:'',
    authIdx:'',
    authType:'5', //1 회원가입, 2 로그인, 3 회원탈퇴, 4 재가입, 5. 비밀번호 찾기
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        var state = {

        };
        return state;
    },
    componentDidMount : function () {
        var _this = this;

        // 전화번호 인증.
        jQuery('.cert .btn-modal-cert').on('tap',function(e) {
            e.stopPropagation();

            jQuery('.modal.modal-cert .num-area input').val('');
            var _phone=jQuery('.cert .phone').val();
            if(twMember.getValidPhone(_phone)) {
                //correct phone number next step(certification)
                console.log('correct phone number next step');

                //sms certification send
                reqwest({
                    url: loc[2].api[2], //SMS 회원 로그인용 인증번호 발송
                    method:loc[2].method,
                    type: loc[2].type,
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
                                        url: loc[2].api[1], //SMS 인증번호 확인
                                        method: loc[2].method,
                                        type: loc[2].type,
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
                        } else if (resp[0].ResultCode == '-1') { //실패
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

        // 임시비밀번호 받기 버튼 탭.
        jQuery('.twMember_search_password .btn-start').on('tap', function(e) {
            e.stopPropagation();

            var _bSaveMember = twCommonUi.checkEnableJoinButton({
                'phone':jQuery('.cert .phone').val(),
                'mail':jQuery('.e-mail').val(),
                'auth_num':_this.authNum
            },jQuery('.twMember_search_password .btn-start'), 'findPW');

            if(_bSaveMember.bResult) {
                var _phone = jQuery('.phone').val(),
                    _mail = jQuery('.e-mail').val(),
                    _url = loc[2].api[0],
                    _os_type = 0,
                    _data = {};

                if (device.checkDeviceType() == 'android') {
                    _os_type=1;
                } else if (device.checkDeviceType() == 'ios') {
                    _os_type=2;
                } else {
                    _os_type=0;
                }

                _data = {
                    'auth_phone': _phone,
                    'auth_idx' : _this.authIdx,
                    'auth_num' : _this.authNum,
                    'userMail' : _mail
                };

                reqwest({
                    url : _url,
                    method : loc[2].method,
                    type : loc[2].type,
                    data : _data
                })
                    .then(function (resp) {
                        console.log(resp);
                        /*************************
                         resp.ResultCode
                         '1'=success
                         '-1'=fail
                         *************************/
                        if(resp[0].ResultCode == '1') { // 성공했을 경우.
                            twCommonUi.showModal(jQuery('.modal.modal-send-password'));
                        }
                    })
                    .fail(function (err, msg) {
                        console.log(err);
                        jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
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

        // 다른 페이지에서 놀다가 회원가입, 로그인, 비밀번호 찾기로 진입할 경우 비콘스테이터스 강제 삭제.
        if(jQuery('.beaconState .state-bottombox') && jQuery('.modal-wrap-beacon div')) {
            jQuery('.beaconState .state-bottombox').remove();
            jQuery('.modal-wrap-beacon div').remove();
        }

        twCommonUi.setContentsHeight();
        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);
    },
    render : function() {
        var _contents = null,
            _contents = <MemberSearchPassword />;

        return (
            <div className="page page-search-password member" style={this.context.viewSize}>
                <div className="member-info">
                    <div className="member-title">
                        <h3>비밀번호 찾기</h3>
                    </div>
                    <div className="member-contents error-log">

                        <p className="comment">휴대폰인증을 하셔야 임시 비밀번호를 발급받을 수 있습니다.</p>
                        <div className="cert">
                            <div className="inp-type1"><input type="tel" className="phone" placeholder="* 휴대폰 번호" /></div>
                            <a href="javascript:void(0);" className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                        </div>

                        <p className="comment">입력하신 이메일로 임시비밀번호를 발송합니다.</p>
                        <div className="inp-type1">
                            <input type="text" className="e-mail" placeholder="* 이메일을 입력해주세요." />
                        </div>
                        <p className="comment notice"></p>

                    </div>
                </div>

                <div className="member-footer">
                    <a href="javascript:void(0);" className="btn-start active"><span>임시비밀번호 받기</span></a>
                </div>
            </div>
        )
    }
});