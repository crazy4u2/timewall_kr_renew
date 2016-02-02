var PopupNoMemberInfo = React.createClass({
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
            <section className="modal modal-small modal-no-member-info" style={this.props.style}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <span className="text-type4">가입된 정보가 없습니다.</span>
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