var PageMyCoupon = React.createClass(
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
            <div className="page page-my-coupon" style={this.context.viewSize}>
                <PageHeader title="보유쿠폰" />
            </div>
        );
    }
});