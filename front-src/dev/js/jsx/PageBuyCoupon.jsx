var PageBuyCoupon = React.createClass(
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
            <div className="page page-buy-coupon" style={this.context.viewSize}>
                <PageHeader title="쿠폰 구매" />
            </div>
        );
    }
});