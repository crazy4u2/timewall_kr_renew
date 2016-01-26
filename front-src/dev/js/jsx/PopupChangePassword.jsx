var PopupChangePassword = React.createClass(
{
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
    onShow : function() {

    },
    render : function()
    {
        return (
            <div className="modal modal-change-password" style={this.props.style}>
                <div className="modal-inner">
                    <div className="modal-header icon-type7">
                        <p className="text">비밀번호 변경</p>
                    </div>

                    <div className="modal-content error-log">
                        <div className="modal-inputgroup">
                            <label htmlFor="origin-pw">현재비밀번호</label>
                            <div className="inp-type1">
                                <input type="password" className="password origin-pw" name="origin-pw" id="origin-pw" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                        <div className="modal-inputgroup">
                            <label htmlFor="new-pw">새로운 비빌번호</label>
                            <div className="inp-type1">
                                <input type="password" className="password new-pw" name="new-pw" id="new-pw" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                        <div className="modal-inputgroup">
                            <label htmlFor="new-pw-check">비빌번호 확인</label>
                            <div className="inp-type1">
                                <input type="password" className="password new-pw-check" name="new-pw-check" id="new-pw-check" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" onClick={this.onBtnCancel} href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});