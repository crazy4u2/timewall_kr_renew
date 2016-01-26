/*
DOM 대략 적인 구조
 <App />
    <Contents />
        <ShopSelector className="shop-selector" />
        <ShopSelctorHeader />
        <CategoryMenu />
        <ShopSelectorBody />
            <ShopListSelector />
            <ShopMapSelector />
        <PageNavigator className="page-navigator" />
            <PageHeader />
            <PageBody />
            <PageSlider />
        <CheckinStatusBar className="checkin-status-bar" />
    <SystemPopupContainer />
        <Alert />
        <Confirm />
 */

var App = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {

        };
        return state;
    },

    childContextTypes :
    {
        viewSize : React.PropTypes.object
    },

    getChildContext : function()
    {
        _viewSize = UI.getViewSize();
        return {
            viewSize : _viewSize
        };
    },

    componentDidMount : function()
    {

    },

    render : function()
    {
        //console.log( 'App::render()' );
        return (
            <div className="app" >
                <PageContainer />
                <div className="popup-background"></div>
                <PopupContainer />
            </div>
        );
    }
});