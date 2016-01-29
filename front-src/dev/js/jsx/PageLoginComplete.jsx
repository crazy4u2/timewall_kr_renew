var PageLoginComplete = React.createClass({
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        var state = {

        };
        return state;
    },
    componentDidMount:function() {

    },
    onShow : function(u_idx) {
        var _this = this,
            _userIdx = u_idx;
        console.log(_userIdx);
        //높이 설정 공통 부분
        //twCommonUi.setContentsHeight();

        //var getPhoneParam = _this.props.user.phone.replace(/^(\d{3})(\d{3,4})(\d{4}).*/,"$1-$2-$3");
        //jQuery('.complete-ment .phone').text(getPhoneParam);

        jQuery('.btn-type3').on('tap',function() {
            jQuery.localStorage.set('userIdx',_userIdx);
            BRIDGE.userLogined(_userIdx);

        });

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });

        jQuery('.contents .page').css({
            'padding-left':10,
            'padding-right':10
        });

        // 다른 페이지에서 놀다가 회원가입, 로그인, 비밀번호 찾기로 진입할 경우 비콘스테이터스 강제 삭제.
        /*if(jQuery('.beaconState .state-bottombox') && jQuery('.modal-wrap-beacon div')) {
            jQuery('.beaconState .state-bottombox').remove();
            jQuery('.modal-wrap-beacon div').remove();
        }*/
    },
    render : function () {
        var _contents = null,
            _contents = <PageLoginComplete />;

        return (
            <div className="page MemberLoginComplete member">
                <div className="load-img"></div>
                <p className="complete-ment">
                    회원님의 기록을 성공적으로 불러왔습니다.
                </p>
                <div className="complete-btn">
                    <a className="btn-type3 active" href="javascript:void(0);">메인(리스트)페이지로 이동</a>
                </div>
            </div>
        )
    }
});