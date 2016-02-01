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
        UI.registerPage( this.props.pageName, this );

    },
    onShow : function () {

    },
    openCert : function () { // 인증번호 입력 모달 띄우기.
        var _phone=jQuery('.cert .phone-find-pw').val(),
            _this = this;
        console.log(_phone);
        if(twMember.getValidPhone(_phone)) {
            var _data = {
                'auth_phone': _phone
            };
            MODEL.get(API.SEND_SMS_FOR_CHANGE_PASSWORD, _data, function(ret) {
                var respData = ret.data[0];

                if(ret.success && respData.ResultCode == 1) { // 정상응답이 오면
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
    getTempPassword : function (){
        var _this = this;
        var _bSaveMember = twCommonUi.checkEnableJoinButton({
            'phone':jQuery('.cert .phone-find-pw').val(),
            'mail':jQuery('.e-mail').val(),
            'auth_num':_this.authNum
        },jQuery('.twMember_search_password .btn-start'), 'findPW');

        if(_bSaveMember.bResult) {
            var _phone = jQuery('.cert .phone-find-pw').val(),
                _mail = jQuery('.e-mail').val(),
                //_url = loc[2].api[0],
                _os_type = 0,
                _data = {};

            if (device.checkDeviceType() == 'android') {
                _os_type = 1;
            } else if (device.checkDeviceType() == 'ios') {
                _os_type = 2;
            } else {
                _os_type = 0;
            }

            _data = {
                'auth_phone': _phone,
                'auth_idx': _this.authIdx,
                'auth_num': jQuery('.header').data('authNum'),
                'userMail': _mail
            };

            MODEL.get(API.FIND_PASSWORD, _data, function(ret) { // 임시 비번 요청
                var respData = ret.data[0];

                if (ret.success && respData.ResultCode == 1) { // 정상응답.
                    UI.openPopup('POP_SEND_PASSWORD');
                }
            });
        }
    },
    render : function() {

        return (
            <div className="page page-search-password member" style={this.context.viewSize}>
                <PageHeader title="비밀번호 찾기" />
                <PageContents className="contents member-reg">
                    <div className="member-info">
                        <div className="member-title">
                            <h3>비밀번호 찾기</h3>
                        </div>
                        <div className="member-contents error-log">

                            <p className="comment">휴대폰인증을 하셔야 임시 비밀번호를 발급받을 수 있습니다.</p>
                            <div className="cert">
                                <div className="inp-type1"><input type="tel" className="phone-find-pw" placeholder="* 휴대폰 번호" /></div>
                                <a href="javascript:void(0);" onClick={this.openCert} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                            </div>

                            <p className="comment">입력하신 이메일로 임시비밀번호를 발송합니다.</p>
                            <div className="inp-type1">
                                <input type="text" className="e-mail" placeholder="* 이메일을 입력해주세요." />
                            </div>
                            <p className="comment notice"></p>

                        </div>
                    </div>

                    <div className="member-footer">
                        <a href="javascript:void(0);" onClick={this.getTempPassword} className="btn-start active"><span>임시비밀번호 받기</span></a>
                    </div>
                </PageContents>
            </div>
        )
    }
});