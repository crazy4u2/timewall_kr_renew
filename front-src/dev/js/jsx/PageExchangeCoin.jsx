var PageExchangeCoin = React.createClass(
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
            <div className="page page-exchange-coin" style={this.context.viewSize}>
                <PageHeader title="코인 교환" />
                <PageContents>
                    <div>코인 교환 페이지</div>
                </PageContents>
            </div>
        );
    }
});