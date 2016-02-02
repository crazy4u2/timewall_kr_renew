var PopupPhoneCert = React.createClass({
    certData : {},
    getInitialState : function()
    {
        var state =
        {
            bOpend : false
        };
        return state;
    },

    componentDidMount : function()
    {
        UI.registerPopup( this.props.popName, this );
    },

    onBtnCancel : function()
    {
        UI.closePopup( this );
    },
    checkCertNum : function() { // 인증번호 입력 검증하는 프로세스
        var _this = this,
            _$certInput = jQuery('.modal.modal-cert .num-area input'),
            _authNum = _$certInput.val().toString();

        _this.certData.auth_num = jQuery('.num-area input').val();

        if (_authNum.length < 5) { //인증번호 5자리 입력 체크
            jQuery('.modal.modal-cert .time-area .text-type4').hide();
            jQuery('.modal.modal-cert .time-area .lack-length').show();
        } else { // 인증번호 5자리가 입력되면 인증번호 검증 프로세스 시작.
            MODEL.get(API.CHECK_SMS, _this.certData, function(ret) {
                var respData = ret.data[0];

                if(ret.success && respData.ResultCode == 1) { // 정상응답이 왔을 경우
                    var returnData = _this.certData.auth_num;

                    UI.getPage('LOGIN').setAuthNum(_this.certData.auth_num);
                    UI.getPage('JOIN').setAuthNum(_this.certData.auth_num);
                    UI.getPage('SEARCH_PASSWORD').setAuthNum(_this.certData.auth_num);

                    UI.getPage('LOGIN').setAuthIdx(_this.certData.auth_idx);
                    UI.getPage('JOIN').setAuthIdx(_this.certData.auth_idx);
                    UI.getPage('SEARCH_PASSWORD').setAuthIdx(_this.certData.auth_idx);
                    /* // 기존에 간단(?)하게 값을 넘기던 구문.
                    jQuery('.header').data('authNum',_this.certData.auth_num);
                    jQuery('.header').data('authIdx',_this.certData.auth_idx);
                    */
                    twCommonUi.stopValidTime('.valid .time');
                    UI.closePopup(_this);
                    setTimeout(function(){
                        UI.openPopup('POP_PHONE_CERT_COMPLETE');
                    },300);

                } else if (ret.success && respData.ResultCode == -30000) { //이전 sms 인증번호 입력 시
                    twCommonUi.stopValidTime('.valid .time');
                    jQuery('.modal.modal-cert .time-area .text-type4').hide();
                    jQuery('.modal.modal-cert .time-area .error-number').show();

                } else if (ret.success && respData.ResultCode == -50001) { //인증번호 5번 이상 실패시 코드 번호는?
                    twCommonUi.stopValidTime('.valid .time');
                    jQuery('.modal.modal-cert .time-area .text-type4').hide();
                    jQuery('.modal.modal-cert .time-area .wrong-typing').show();
                    jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity':0.5});

                } else if (ret.success && respData.ResultCode == -1) { // 그냥 실패, 통신 실패가 아닌 응답값이 실패
                    twCommonUi.stopValidTime('.valid .time');
                    jQuery('.modal.modal-cert .time-area .text-type4').hide();
                    jQuery('.modal.modal-cert .time-area .error-number').show();
                    jQuery('.modal.modal-cert .num-area input').val('');
                }
            });
        }
    },
    onShow : function( param ) {
        var _this = this;
        _this.certData = param;
    },
    render : function() {
        var _hide={
            display:'none'
        };
        return (
            <section className="modal modal-cert" style={this.props.style}>
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
                            <p className="lack-length text-type4" style={_hide}>인증번호 5자리를 다 입력해주세요.</p>
                            <p className="wrong-typing text-type4" style={_hide}>5회 이상 틀렸습니다. 인증번호를 새로 받아주세요.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2 btn-cancel" onClick={this.onBtnCancel} href="javascript:void(0);">취소</a>
                            <a className="btn-type3 btn-confirm" onClick={this.checkCertNum} href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

});