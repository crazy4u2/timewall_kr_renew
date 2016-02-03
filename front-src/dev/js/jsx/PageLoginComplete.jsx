var PageLoginComplete = React.createClass({
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    _userIdx : {},
    getInitialState : function() {
        var state = {

        };
        return state;
    },
    componentDidMount:function() {
        UI.registerPage( this.props.pageName, this );
    },
    onShow : function(u_idx) {
        var _this = this;
            _this._userIdx = u_idx;
        console.log(_this._userIdx);
        return _this._userIdx;
    },
    setUserIdx : function () {
        var _this = this;
        jQuery.localStorage.set('userIdx', _this._userIdx);
        BRIDGE.userLogined(_this._userIdx);
        /*setTimeout(function(){
            UI.slidePage('SHOP-LIST');
        },200);*/
    },
    render : function () {

        return (
            <div className="page MemberLoginComplete member">
                <PageHeader title="로그인" />
                <PageContents className="contents member-complete">
                    <div className="load-img"></div>
                    <p className="complete-ment">
                        회원님의 기록을 성공적으로 불러왔습니다.
                    </p>
                    <div className="complete-btn">
                        <a className="btn-type3 active" onClick={this.setUserIdx} href="javascript:void(0);">메인(리스트)페이지로 이동</a>
                    </div>
                </PageContents>
            </div>
        )
    }
});