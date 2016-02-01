var PageContainer = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {

        };
        return state;
    },

    componentDidMount : function()
    {

    },

    render : function()
    {
        return (
//            <div className="page-viewer" >
                <div className="page-container" style={{overflow:'hidden', position:'relative'}} >
                    <PageBookmark pageName="BOOKMARK" />
                    <PageBuyCoupon pageName="BUY_COUPON" />
                    <PageDonate pageName="DONATE" />
                    <PageDonateList pageName="DONATE_LIST" />
                    <PageHistory pageName="HISTORY" />
                    <PageMainMenu pageName="MAIN_MENU" />
                    <PageMyCoupon pageName="MY_COUPON" />
                    <PageMyWallet pageName="MY_WALLET" />
                    <PageNotice pageName="NOTICE" />
                    <PageSearchShopOnMap pageName="SEARCH_SHOP_ON_MAP" />
                    <PageSettings pageName="SETTINGS" />
                    <PageShopDetail pageName="SHOP_DETAIL" />
                    <PageShopList pageName="SHOP_LIST" />
                    <PageUseCoin pageName="USE_COIN" />
                    <PageExchangeCoin pageName="EXCHANGE_COIN" />
                    <PageLoginComplete pageName="LOGIN_COMPLETE" />
                    <PageJoin pageName="JOIN" />
                    <PageLogin pageName="LOGIN" />
                    <PageSearchPassword pageName="SEARCH_PASSWORD" />
                </div>
//            </div>
        );
    }
});

var Page = React.createClass(
{
     componentDidMount : function()
     {
         if( typeof this.props.pageName != 'undefined' )
            UI.registerPage(this.props.pageName, this );
     },
    render : function()
    {
        return {};
    }
});

var PageContents = React.createClass
({
    render : function()
    {
        return (
            <div className={"page-contents "+this.props.className}>{this.props.children}</div>
        )
    }
});