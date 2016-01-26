var PageBookmark = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            width : '100%',
            height : '100%'
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
        console.log( 'PageBookmark::onShow' );
    },

    handleClick : function()
    {
        UI.slidePage( 'SHOP_LIST' );
    },

    render : function()
    {
        //console.log( 'PageBookmark::render()' );
        var style =
        {
            width:this.context.viewSize.width,
            height:this.context.viewSize.height
            //backgroundColor : '#00F'
        };
        return (
            <div className="page page-bookmark" style={style}>
                <PageHeader title="북마크 페이지" />

            </div>
        );
    }
});