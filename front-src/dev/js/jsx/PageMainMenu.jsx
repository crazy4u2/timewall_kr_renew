var PageMainMenu = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            bLogined : false,
            coin : 0,
            min :0,
            bAutoExchange : false
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

            var state =
            {
                bLogined : _bLogined,
                coin : _coin,
                min : _min,
                bAutoExchange : _bAutoExchange
            };
            //console.log( '메뉴 state : ', state );

            self.setState( state );

            // 로그인이 안되어 있으면 로그인 이후 사용가능 얼럿 출력.
            if( !_bLogined )
                BRIDGE.appAlert({ TITLE:'안내', TEXT:'로그인 후에 쿠폰과 코인을 사용하실 수 있습니다' });
        });
    },

    // 코인 사용 버튼
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

    onClickLink : function( idx )
    {
        switch( idx )
        {
            case 1 : UI.slidePage( 'MY_WALLET'); break;
            case 2 : UI.slidePage( 'MY_COUPON'); break;
            case 3 : UI.slidePage( 'BUY_COUPON'); break;
            case 4 : UI.slidePage( 'BOOKMARK'); break;
            case 5 : UI.slidePage( 'HISTORY'); break;
            case 6 : UI.slidePage( 'DONATE_LIST'); break;
            case 7 : UI.slidePage( 'NOTICE'); break;
            case 8 : UI.slidePage( 'SETTINGS'); break;
        }
    },

    onBtnAutoExchange : function( event )
    {
        var elCheckButton = ReactDOM.findDOMNode( this.refs['chkAutoExchange'] );
        $el = $(elCheckButton);
        $el.toggleClass( 'on' );
        $el.prop('checked', !$el.prop('checked') );

        BRIDGE.setUserOption( {AUTO_EXCHANGE_COIN:$el.prop('checked')} );
        this.setState( {bAutoExchange:$el.prop('checked')});
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
                                <input type="checkbox" ref="chkAutoExchange" name="onoffswitch" className={"onoffswitch-checkbox "+checkButtonOnSuffix} checked={self.state.bAutoExchange} id="push2" />
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
            <div className="page page-mainmenu" style={this.context.viewSize}>
                <PageHeader title="메뉴" type="BACK_LIST"/>
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
                    <div className="menu-link-box">
                        <ul className="fix">
                            <li><a id="active my-wallet" onClick={self.onClickLink.bind(this,1)} href="javascript:void(0);">나의월렛</a></li>
                            <li><a id="my-coupon" onClick={self.onClickLink.bind(this,2)} href="javascript:void(0);">나의쿠폰</a></li>
                            <li><a id="coupon-exchange" onClick={self.onClickLink.bind(this,3)} href="javascript:void(0);">쿠폰교환</a></li>
                            <li><a id="bookmark" onClick={self.onClickLink.bind(this,4)} href="javascript:void(0);">즐겨찾기</a></li>
                            <li><a id="used-list" onClick={self.onClickLink.bind(this,5)} href="javascript:void(0);">이용내역</a></li>
                            <li><a id="coin-donate" onClick={self.onClickLink.bind(this,6)} href="javascript:void(0);">기부하기</a></li>
                            <li><a id="notice" onClick={self.onClickLink.bind(this,7)} href="javascript:void(0);">공지사항</a></li>
                            <li><a id="setting" onClick={self.onClickLink.bind(this,8)} href="javascript:void(0);">환경설정</a></li>
                        </ul>
                    </div>
                </PageContents>
            </div>
        );
    }
});