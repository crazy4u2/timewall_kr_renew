var PopupReJoinCert = React.createClass({
    _phone : '',
    authIdx : '',
    authType : 4,
    getInitialState : function() {
        var state =
        {
            bOpend : false
        };
        return state;
    },
    componentDidMount : function() {
        UI.registerPopup( this.props.popName, this );
    },
    onBtnCancel : function() {
        UI.closePopup( this );
    },
    getCertNumber : function() {
        var _this = this,
            _data = {
                'auth_phone' : _this._phone
            };
        console.log(_data);
        MODEL.get(API.SEND_SMS_FOR_REJOIN, _data, function(ret) {
            var respData = ret.data[0];

            if (ret.success && respData.ResultCode == 1) { // 정상응답.
                UI.closePopup( _this );

                twCommonUi.setValidTime('.valid .time', 1, function () {
                    /* 입력 시간이 지난 후 콜백 실행 */
                    //console.log('입력시간이 초과되었습니다.');
                    twCommonUi.stopValidTime('.valid .time');
                    jQuery('.modal.modal-cert .time-area .text-type4').hide();
                    jQuery('.modal.modal-cert .overtime').show();
                    jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity': 0.5});
                });

                jQuery('.modal.modal-cert .time-area .text-type4').hide();

                jQuery('.modal.modal-cert .phone').text(_this._phone);
                _this.authIdx = ret.data[0].auth_idx; // certData에서 넘기기 위해
                //jQuery('.header').data('authIdx'.ret.data[0].auth_idx); // 가입처리 할 때 넘기기 위해
                var certData = {
                    'auth_idx': _this.authIdx,
                    'auth_phone': _this._phone,
                    'auth_type': _this.authType
                };
                setTimeout(function(){
                    UI.openPopup('POP_PHONE_CERT', certData);
                },300);
            } else if (ret.success && respData.ResultCode == -50004) { // 재가입 요청 sms인증 5회 광클로 인한 10분 블럭
                UI.openPopup('POP_AUTH_EXCEEDS');
            }
        });
    },
    onShow : function(param) {
        this._phone = param;
        return this._phone
    },
    render : function() {

        return (
            <section className="modal modal-small modal-phone-cert" style={this.props.style}>
                <div className="modal-inner">
                    <div className="modal-header icon-type2"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type1">휴대폰 인증</p>
                            <div className="cert">
                                <div className="inp-type1">

                                </div>
                                <a href="javascript:void(0);" onClick={this.getCertNumber} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                            </div>
                            <p className="text-type5 left">휴대폰 인증을 하셔야 재가입 할 수 있습니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type2" href="javascript:void(0);" onClick={this.onBtnCancel}>닫기</a>
                    </div>
                </div>
            </section>
        );
    }

});