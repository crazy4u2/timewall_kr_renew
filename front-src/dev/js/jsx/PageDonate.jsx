var PageDonate = React.createClass(
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
            <div className="page page-donate" style={this.context.viewSize}>
                <PageHeader title="기부하기" />
            </div>
        );
    }
});