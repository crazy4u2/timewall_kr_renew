var PageSearchShopOnMap = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {

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

    render : function()
    {
        return (
            <div className="page page-search-shop-on-map">
                <PageHeader title="지도 검색" type="MENU_LIST"/>
                <PageContents >
                    지도검색
                </PageContents>
            </div>
        );
    }
});