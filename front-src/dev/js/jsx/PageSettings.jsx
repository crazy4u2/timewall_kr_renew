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
    onShow : function() {

    },
    render : function() {
        return (
            <div className="page page-settings" style={this.context.viewSize}>
                <PageHeader title="환경설정" />
                <PageContents className="setting-list">
                    <ul>
                        <li><a href="javascript:void(0)" onClick={UI.slidePage.bind(this,'SETTING_APP')}>앱 설정<i className="fa fa-angle-right"></i></a></li>
                        <li><a href="javascript:void(0)" onClick={UI.slidePage.bind(this,'SETTING_VERSION')}>버전 정보<i className="fa fa-angle-right"></i></a></li>
                        <li><a href="javascript:void(0)" onClick={UI.slidePage.bind(this,'SETTING_TUTORIAL')}>튜토리얼 보기<i className="fa fa-angle-right"></i></a></li>
                        <li><a href="javascript:void(0)" onClick={UI.slidePage.bind(this,'SETTING_FAQ')}>FAQ<i className="fa fa-angle-right"></i></a></li>
                    </ul>
                </PageContents>
            </div>
        );
    }
});