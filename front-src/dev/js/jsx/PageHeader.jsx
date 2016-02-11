
var PageHeader = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {

        };
        return state;
    },

    getDefaultProps : function()
    {
        return {
            // BACK // 회원가입, 로그인, 비밀번호 찾기
            // BACK_LIST : 메뉴페이지 대부분
            // BACK_MENU_LIST : 매장상세
            // MENU_LIST : 검색, 지도
            // MENU_LOC_SEARCH_MAP : 매장리스
            type : 'BACK_LIST',
            title : ''
        };
    },

    componentDidMount : function()
    {

    },

    onBtnPrev : function()
    {
        UI.slideBack();
    },

    onBtnMenu : function()
    {
        UI.slidePage( 'MAIN_MENU');
    },

    onBtnShoplist : function()
    {
        UI.slidePage( 'SHOP_LIST' );
    },

    onTitleClick : function()
    {
        console.log( 'title' );
    },

    onBtnLocation : function()
    {
        if( typeof this.props.onBtnLocation == 'function' )
            this.props.onBtnLocation();
    },

    onBtnSearch : function()
    {
        UI.slidePage( 'SHOP_SEARCH' );
    },

    onBtnMap : function()
    {
        console.log( '지도 버튼' );
        UI.slidePage( 'SEARCH_SHOP_ON_MAP' );
    },

    // BACK // 회원가입, 로그인, 비밀번호 찾기
    // BACK_LIST : 메뉴페이지 대부분
    // BACK_MENU_LIST : 매장상세
    // MENU_LIST : 검색, 지도
    // MENU_LOC_SEARCH_MAP : 매장리스트

    render : function()
    {
        var classSuffix;
        var bShowBackButton = false;
        var bShowMenuButton = false;
        var bShowLocationButton = false;
        var bShowListButton = false;
        var bShowSearchButton = false;
        var bShowMapButton = false;
        switch( this.props.type )
        {
            case 'BACK_MENU_LIST' :
                classSuffix = 'header-menu';
                bShowBackButton = true;
                bShowMenuButton = true;
                bShowListButton = true;
                break;
            case 'MENU_LOC_SEARCH_MAP' :
                classSuffix = 'header-shop';
                bShowMenuButton = true;
                bShowLocationButton = true;
                bShowSearchButton = true;
                bShowMapButton = true;
                break;
            case 'BACK' :
                classSuffix = 'header-member';
                bShowBackButton = true; break;
            case 'BACK_LIST' :
                classSuffix = 'header-other';
                bShowBackButton = true;
                bShowListButton = true;
                break;
            case 'MENU_LIST' :
                classSuffix = 'header-shopmap';
                bShowMenuButton = true;
                bShowListButton = true;
                break;
            case  'COUPON_EXCHANGE' || 'NO-BORDER' :
                classSuffix = 'header-no-border';
                bShowBackButton = true;
                bShowListButton = true;
                break;
        }
        var classFullName = 'header-inner ' + classSuffix;

        return (
            <div className="header">
                <div className={classFullName} >
                    { bShowBackButton && <PageHeaderPrevButton onClick={this.onBtnPrev} />}
                    { bShowMenuButton && <PageHeaderMenuButton onClick={this.onBtnMenu} />}
                    { !bShowLocationButton && <h1 className="title" onClick={this.onTitleClick}>{this.props.title}</h1>}
                    { bShowLocationButton && <PageHeaderLocationButton onClick={this.onBtnLocation} region={this.props.region}/>}
                    { bShowListButton && <PageHeaderButtonShopList onClick={this.onBtnShoplist} />}
                    { bShowSearchButton && <PageHeaderSearchButton onClick={this.onBtnSearch} />}
                    { bShowMapButton && <PageHeaderMapButton onClick={this.onBtnMap} />}
                </div>

            </div>
        );
    }
});

var PageHeaderPrevButton = React.createClass(
{
    render : function()
    {
        return (
            <a className="btn-prev" onClick={this.props.onClick} href="javascript:void(0);"></a>
        );
    }
});

var PageHeaderMenuButton = React.createClass(
{
    render : function()
    {
        return (
            <a className="btn-menu" onClick={this.props.onClick} href="javascript:void(0);"></a>
        );
    }
});

var PageHeaderButtonShopList = React.createClass(
{
    render : function()
    {
        return (
            <a className="btn-shop-list" onClick={this.props.onClick} href="javascript:void(0);"></a>
        );
    }
});

var PageHeaderLocationButton = React.createClass(
{
    render : function()
    {
        return (
            <h1 className="title" onClick={this.props.onClick} >
                <a className="btn-title-location" href="javascript:void(0);"></a>
                <a className="my-location" href="javascript:void(0)" >{this.props.region}</a>
            </h1>
        );
    }
});

var PageHeaderSearchButton = React.createClass(
{
    render : function()
    {
        return (
            <a className="btn-search" href="javascript:void(0);" onClick={this.props.onClick}>
                <i className="fa fa-search"></i>
            </a>
        );
    }
});

var PageHeaderMapButton = React.createClass(
{
    render : function()
    {
        return (
            <a className="btn-map" href="javascript:void(0);" onClick={this.props.onClick}></a>
        );
    }
});