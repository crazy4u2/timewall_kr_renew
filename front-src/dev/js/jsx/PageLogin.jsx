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
    openCert : function() {
        var _phone=jQuery('.cert .phone').val(),
            _this = this;
        if(twMember.getValidPhone(_phone)) {
            var _data = {
                'auth_phone':_phone
            };
            MODEL.get(API.SEND_SMS_FOR_LOGIN, _data, function(ret) {
                var respData = ret.data[0];
                if(ret.success && respData.ResultCode == 1) {
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
                }
            });
        } else {
            UI.openPopup('POP_MODAL_INVALID');
        }
    },
    onShow : function() {

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
                                <div className="inp-type1"><input type="tel" pattern="[0-9]{10}" className="phone" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                                <a href="javascript:void(0);" onClick={this.openCert} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
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
                </PageContents>
            </div>
        );
    }
});