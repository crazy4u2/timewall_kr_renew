var PageLogin = React.createClass({
    reJoinDate:'',
    dropOutDate:'',
    blockEndDate:'',
    authIdx:'',
    phone:'',
    rePhone:'',
    authNum:'',
    authType:2, //1 회원가입, 2. 로그인, 3. 탈퇴
    getInitialState : function()
    {
        var state = {

        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
    },
    openCert : function() { // 인증번호 입력 모달을 띄우는 곳
        var _phone=jQuery('.cert .phone-login').val(),
            _this = this;
        if(twMember.getValidPhone(_phone)) {
            var _data = {
                'auth_phone':_phone
            };
            MODEL.get(API.SEND_SMS_FOR_LOGIN, _data, function(ret) {
                var respData = ret.data[0];
                if (ret.success && respData.ResultCode == 1) { // 정상응답.
                    console.log(ret);
                    twCommonUi.setValidTime('.valid .time', 1, function () {
                        /* 입력 시간이 지난 후 콜백 실행 */
                        //console.log('입력시간이 초과되었습니다.');
                        twCommonUi.stopValidTime('.valid .time');
                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                        jQuery('.modal.modal-cert .overtime').show();
                        jQuery('.modal.modal-cert .btn-confirm').off('click').css({'opacity': 0.5});
                    });

                    jQuery('.modal.modal-cert .time-area .text-type4').hide();

                    jQuery('.modal.modal-cert .phone').text(_phone);
                    _this.authIdx = ret.data[0].auth_idx;
                    var certData = {
                        'auth_idx': _this.authIdx,
                        'auth_phone': _phone,
                        'auth_type': _this.authType
                    };

                    UI.openPopup('POP_PHONE_CERT', certData);
                } else if (ret.success && respData.ResultCode == -50001) { // 인증하기 5번 클릭 시 10분 블럭
                    UI.openPopup('POP_AUTH_EXCEEDS');
                }
            });
        } else {
            UI.openPopup('POP_MODAL_INVALID');
        }
    },
    goLogin : function () { // 로그인 버튼 클릭 시 로그인 실행.
        var _this = this;
        var _bSaveMember = twCommonUi.checkEnableJoinButton({
            'phone':jQuery('.cert .phone-login').val(),
            'rePhone':jQuery('.phone-check .re-phone').val(), // 기존 휴대폰번호 입력
            'auth_num':jQuery('.header').data('authNum'),
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

            //_webBridge.osType=_os_type;

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

                    MODEL.get(API.USER_INFO, _data_idx, function(ret){ // 회원정보 조회.
                        var respData = ret.data[0];
                        if(ret.success && respData.ResultCode == 1) { // 정상응답.
                            var user = respData.ResultData.u_status;

                            _data = {
                                'pwd': _password,
                                'phone': _phone,
                                'new_phone': _new_phone,
                                'device_id': deviceInfo.DEVICE_ORG_ID,
                                'app_id': deviceInfo.APP_ORG_ID,
                                'os_type': _os_type,
                                'auth_idx': _this.authIdx,
                                'auth_num': jQuery('.header').data('authNum')
                            };

                            // 유저 상황에 맞는 호출 api 설정
                            if (!user) { // 없는 로그인
                                _url = API.LOGIN;
                            } else if (user.u_status == 0) { //임시 유저의 로그인
                                _url = API.TEMP_USER_JOIN;
                                _data["u_idx"] = userIndex;
                            } else { //기타(1,-1,-2,-3,-4) 유저의 로그인
                                _url = API.LOGIN;
                            }

                            MODEL.get(_url, _data, function(ret) {
                                var respData = ret.data[0];
                                console.log(respData);
                                console.log(ret);
                                if(ret.success && respData.ResultCode == 1) { // 정상응답. 로그인 성공
                                    var u_idx = respData.u_idx;
                                    UI.slidePage('LOGIN_COMPLETE', u_idx);

                                } else if (ret.success && respData.ResultCode == -40000) { // 가입정보 없음.
                                    var setPhoneNum = _new_phone.replace(/^(\d{3})(\d{3,4})(\d{4}).*/, "$1-$2-$3");
                                    jQuery('.modal.modal-no-member-info .text-type2').text(setPhoneNum);

                                    UI.openPopup('POP_NO_MEMBER_INFO');

                                } else if (ret.success && respData.ResultCode == -40008) { // 비밀번호 틀림.
                                    UI.openPopup('POP_WRONG_PASSWORD');

                                } else if (ret.success && respData.ResultCode == -10000) { // 파라미터오류인데 보통 인증번호를 입력하지 않을 경우 나타남.
                                    jQuery('.error-log').append('<p class="comment notice">* 인증번호를 입력하세요.</p>');
                                }
                            });
                        }
                    });
                });
            });

        }
    },
    passwordValidation : function(e) { // 비밀번호 입력시 검증.
        e.stopPropagation();
        var _that=jQuery('.inp-type1 .password');

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

        },1);
    },
    onShow : function() {
        jQuery('.contents').css({
            'padding-left':10,
            'padding-right':10
        });
    },
    render : function()
    {
        return (
            <div className="page page-login member" style={this.context.viewSize}>
                <PageHeader title="로그인" />
                <PageContents className="contents member-reg">
                    <div className="member-info">
                        <div className="member-title">
                            <h3>회원가입정보</h3>
                            <p className="essential">*표시는 필수 입력사항 입니다.</p>
                        </div>

                        <div className="member-contents error-log">
                            <div className="cert">
                                <div className="inp-type1"><input type="tel" pattern="[0-9]{10}" className="phone-login" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                                <a href="javascript:void(0);" onClick={this.openCert} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                            </div>

                            <div className="inp-type1 phone-check">
                                <input type="tel" className="re-phone" pattern="[0-9]{10}" maxLength="11" placeholder="* 기존 휴대폰 번호 입력" />
                            </div>
                            <p className="comment">휴대폰 번호가 변경되지 않은 고객께서는 동일한 번호를 입력해주세요.</p>

                            <div className="inp-type1">
                                <input type="password" onKeyUp={this.passwordValidation} className="password" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                            <div className="forget-password fix">
                                <a href="javascript:void(0);" className="fl" onClick={UI.slidePage.bind(this, 'SEARCH_PASSWORD')} >비밀번호를 잊으셨나요? <i className="fa fa-unlock-alt"></i></a>
                                <a href="javascript:void(0);" className="fr" onClick={UI.slidePage.bind(this, 'JOIN')}>회원가입하기</a>
                            </div>
                        </div>

                    </div>
                    <div className="member-footer">
                        <a href="javascript:void(0);" onClick={this.goLogin} className="btn-start active"><span>로그인</span></a>
                    </div>
                </PageContents>
            </div>
        );
    }
});