var PopupPhoneCertComplete = React.createClass({
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
    onShow : function() {

    },
    render : function() {

        return (
            <section className="modal modal-small modal-cer-complete" style={this.props.style}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">인증완료</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" onClick={this.onBtnCancel} href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        );
    }

});