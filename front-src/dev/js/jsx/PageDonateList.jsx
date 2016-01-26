var PageDonateList = React.createClass(
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
            <div className="page page-donate-list" style={this.context.viewSize}>
                <PageHeader title="기부단체 목록" />
            </div>
        );
    }
});