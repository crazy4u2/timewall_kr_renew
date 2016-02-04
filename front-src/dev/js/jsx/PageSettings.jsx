var PageSettings = React.createClass({
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        var state = {

        };
        return state;
    },

    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
    },

    render : function() {
        return (
            <div className="page page-settings" style={this.context.viewSize}>
                <PageHeader title="환경설정" />
            </div>
        );
    }
});