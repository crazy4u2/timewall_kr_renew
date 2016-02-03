var PageJoinComplete = React.createClass({
    _userIdx : '',
    minStatus:'',
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        /*var state = {
            min:10
        };
        return state;*/
        return {min:10}
    },
    componentDidMount:function() {
        UI.registerPage( this.props.pageName, this );
    },
    onShow : function(u_idx) {
        var _this = this;
            _this._userIdx = u_idx;
        console.log(_this._userIdx);
        //return _this._userIdx;
        var _data = {
            'u_idx' : _this._userIdx
        };

        MODEL.get(API.USER_INFO, _data, function(ret) {
            var respData = ret.data[0];

            if (ret.success && respData.ResultCode == 1) { // 정상응답.
                var _min= twCommonUi.setComma(respData.ResultData[0].min);

                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        min: _min
                    });
                }
            }
        });
    },
    setUserIdx : function () {
        var _this = this;
        jQuery.localStorage.set('userIdx',_this._userIdx);
        BRIDGE.userLogined(_this._userIdx);
        /*setTimeout(function(){
            UI.slidePage('SHOP-LIST');
        },200);*/
    },
    render : function () {
        var _min=this.state.min;
        return (
            <div className="page MemberJoinComplete member">
                <PageHeader title="회원가입" />
                <PageContents className="contents member-complete">
                    <div className={"complete-img min"+_min}>{_min}min</div>

                    <p className="complete-ment">
                        <strong>회원가입 완료</strong>
                        <span>{_min}min</span>을 선물로 드렸습니다.
                    </p>
                    <div className="complete-btn">
                        <a className="btn-type3 active" onClick={this.setUserIdx} href="javascript:void(0);">메인(리스트)페이지로 이동</a>
                    </div>
                </PageContents>
            </div>
        )
    }
});