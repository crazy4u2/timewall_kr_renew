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
    checkCertNum : function() {
        var _this = this;
        _this.certData.auth_num = jQuery('.num-area input').val();
        MODEL.get(API.CHECK_SMS, _this.certData, function(ret) {
            var respData = ret.data[0];
            if(ret.success && respData.ResultCode == 1) { // 정상응답이 왔을 경우
                var returnData = _this.certData.auth_num;
                jQuery('.header').data('authNum',_this.certData.auth_num);
                twCommonUi.stopValidTime('.valid .time');

                UI.closePopup( this );
                setTimeout(function(){

                },300);
            }
        });
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
            <section className="modal modal-cert">
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