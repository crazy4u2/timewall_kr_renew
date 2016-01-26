var PageMyWallet = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            bLogined : false,
            coin : 0,
            min : 0,
            bAutoExchange : false,
            joinDay : ''
        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
    },

    onShow : function()
    {
        var self = this;
        BRIDGE.getUserOption( function( option )
        {
            // 정상회원, 탈퇴요청한 회원 일 경우만 로그인 판정
            var _bLogined = ( USER.info.data.u_status == 1 || USER.info.data.u_status == -2 );
            var _bAutoExchange = option.AUTO_EXCHANGE_COIN;
            var _coin = USER.info.data.coin;
            var _min = USER.info.data.min;
            var _joinDay = USER.info.data.regdate.substring(0,10);

            var state =
            {
                bLogined : _bLogined,
                coin : _coin,
                min : _min,
                bAutoExchange : _bAutoExchange,
                joinDay : _joinDay
            };
            //console.log( '마이월렛 state:', state );
            self.setState( state );

            // 로그인이 안되어 있으면 로그인 이후 사용가능 얼럿 출력.
            if( !_bLogined )
                BRIDGE.appAlert({ TITLE:'안내', TEXT:'로그인 후에 쿠폰과 코인을 사용하실 수 있습니다' });
        });
    },

    onBtnExchangeCoin : function( event )
    {
        // 원하는 앨리먼트 참조 예, ref 값을 주고, ReactDOM 으로 참조.
        var elWatch = ReactDOM.findDOMNode( this.refs.watchIcon );

        // 이벤트 타겟을 ReactDOM 으로 참조.
        var elHourglass = ReactDOM.findDOMNode( event.target );

        // 간단한 클래스 변환은 이렇게 state를 쓰지 않고 그냥 하자.
        $(elWatch).toggleClass( 'active' );
        setTimeout( function()
        {
            $(elWatch).toggleClass( 'active' );
            UI.slidePage( 'EXCHANGE_COIN' );
        }, 500 );
    },

    onBtnAutoExchange : function( event )
    {
        var elCheckButton = ReactDOM.findDOMNode( this.refs['chkAutoExchange1'] );
        $el = $(elCheckButton);
        $el.toggleClass( 'on' );
        $el.prop('checked', !$el.prop('checked') );

        BRIDGE.setUserOption( {AUTO_EXCHANGE_COIN:$el.prop('checked')} );
        this.setState( {bAutoExchange:$el.prop('checked')});
    },

    onBtnUseCoin : function()
    {
        UI.slidePage( 'USE_COIN' );
    },

    onBtnJoin : function()
    {
        UI.slidePage( 'JOIN');
    },

    onBtnLogin : function()
    {
        UI.slidePage( 'LOGIN' );
    },

    onBtnSnsShare : function()
    {
        BRIDGE.shareToSNS();
    },

    onBtnChangePassword : function()
    {
        UI.openPopup( 'POP_CHANGE_PASSWORD' );
    },

    onBtnChangeUserInfo : function()
    {

    },

    onBtnUnregister : function()
    {

    },

    render : function()
    {
        var self = this;
        var checkButtonCheckedSuffix = '';
        var checkButtonOnSuffix = '';
        if( self.state.bAutoExchange )
        {
            checkButtonCheckedSuffix = 'checked';
            checkButtonOnSuffix = 'on';
        }

        var NotLoginedInfoLayout = function()
        {
            return (
                <div className="menubox">
                    <div className="need-login">
                        <a onClick={self.onBtnLogin} href="javascript:void(0);">로그인</a>
                        <a onClick={self.onBtnJoin} href="javascript:void(0);">회원가입</a>
                    </div>
                </div>
            );
        };
        var LoginedInfoLayout = function()
        {
            return (
                <div className="menubox">
                    <div className="coin">
                        <div className="coin-button">
                            <a className="btn-coin-useful" href="javascript:void(0);" onClick={self.onBtnUseCoin}>코인사용 가능</a>
                        </div>
                        <div className="show-number">
                            <p>나의 coin</p>
                            <strong className="my-coin">{self.state.coin}</strong>
                        </div>
                        <div className="onoffswitch-wrap">
                            <span className="onoffswitch">
                                <input type="checkbox" ref="chkAutoExchange1" name="onoffswitch" className={"onoffswitch-checkbox "+checkButtonOnSuffix} checked={self.state.bAutoExchange} id="push2" />
                                <label className="onoffswitch-label" onClick={self.onBtnAutoExchange} thtmlFor="push2">
                                    <span className="onoffswitch-inner"></span>
                                    <span className="onoffswitch-switch"></span>
                                </label>
                            </span>
                        </div>
                    </div>
                </div>
            );
        };

        var _userInfoLayout;
        if( this.state.bLogined )
            _userInfoLayout = LoginedInfoLayout();
        else
            _userInfoLayout = NotLoginedInfoLayout();


        return (
            <div className="page page-my-wallet" style={this.context.viewSize}>
                <PageHeader title="나의월렛" />
                <PageContents>
                    <div className={"menu-min-coin fix "+checkButtonOnSuffix}>
                        <div className="menubox">
                            <div className="min" ref="watchIcon">
                                <div className="show-number">
                                    <p>나의 min</p>
                                    <strong className="my-min">{this.state.min}</strong>
                                </div>
                                <a className="btn-coin-exchange" onClick={self.onBtnExchangeCoin} href="javascript:void(0);">
                                    <i className="fa fa-hourglass-end"></i>
                                </a>
                            </div>
                        </div>
                        {_userInfoLayout}
                    </div>
                    <div className="my-menu">
                        <ul>
                            <li onClick={self.onBtnSnsShare}><a href="javascript:void(0)" className="shared">타임월렛 공유하기<i className="fa fa-angle-right"></i></a></li>
                            <li onClick={self.onBtnChangePassword}><a href="javascript:void(0)" className="change-pw">비밀번호 변경<i className="fa fa-angle-right"></i></a></li>
                            <li onClick={self.onBtnChangeUserInfo}><a href="javascript:void(0)" className="change-info">회원정보 변경<i className="fa fa-angle-right"></i></a></li>
                            <li onClick={self.onBtnUnregister}><a href="javascript:void(0)" className="drop-out">서비스탈퇴 신청<i className="fa fa-angle-right"></i></a></li>
                        </ul>
                        <div className="join-date">
                            <span>회원 가입일 : <strong>{this.state.joinDay}</strong></span>
                        </div>
                    </div>
                </PageContents>
            </div>
        );
    }
});