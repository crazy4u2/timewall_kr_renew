var PageLogin = React.createClass(
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
            <div className="page page-login" style={this.context.viewSize}>
                <PageHeader title="로그인" />
                <PageContents>
                    <div>로그인 페이지</div>
                </PageContents>
            </div>
        );
    }
});