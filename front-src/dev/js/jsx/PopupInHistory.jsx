var PopupInHistory = React.createClass({
    _phone : '',
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
    goReJoin : function() {
        UI.closePopup( this );
        var _this = this;
        var _$modal = jQuery('.modal.modal-phone-cert');

        _$modal.find('.message .text-type2').text(this._phone);
        _$modal.find('.inp-type1').text(this._phone);
        setTimeout(function(){
            UI.openPopup('POP_REJOIN_CERT', _this._phone);
        },300);
    },
    goLogin : function() {
        UI.closePopup( this );
        UI.slidePage('LOGIN');
    },
    onShow : function(param) {
        this._phone = param;
        return this._phone
    },
    render : function() {

        return (
            <section className="modal modal-already-reg" style={this.props.style}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <p className="text-type4"><span className="date">2015. 6. 21</span> 가입내역이 있습니다.</p>
                            <p className="text-type5">재가입시 기존정보는 모두 삭제됩니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" onClick={this.goLogin} href="javascript:void(0);">로그인</a>
                            <a className="btn-type1" onClick={this.goReJoin} href="javascript:void(0);">재가입</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

});