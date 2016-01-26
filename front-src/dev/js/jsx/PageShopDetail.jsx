var PageShopDetail = React.createClass(
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

    handleClick : function()
    {
        UI.slidePage( 'BOOKMARK' );
    },

    onShowFirst : function()
    {
        console.log( 'PageShopDetail::onShowFirst' );
    },

    onShow : function( param )
    {
        console.log( 'PageShopDetail::onShow' );
    },

    render : function()
    {
        return (
            <div className="page page-shopdetail" >
                <PageHeader title="매장 상세정보" type="BACK_MENU_LIST" />
                <div className="page-contents" style={{background:'#0f0'}} >
                    <div onClick={this.handleClick}>즐겨찾기 페이지로 이동</div>
                </div>
            </div>
        );
    }
});