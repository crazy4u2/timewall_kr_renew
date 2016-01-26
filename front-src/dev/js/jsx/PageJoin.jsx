var PageJoin = React.createClass(
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
            <div className="page page-join" style={this.context.viewSize}>
                <PageHeader title="회원가입" />
                <PageContents>
                    <div>회원가입 페이지</div>
                </PageContents>
            </div>
        );
    }
});