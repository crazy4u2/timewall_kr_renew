var PageSettingTutorial = React.createClass({
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
        jQuery(document).ready(function(){
            jQuery('.tutorial-wrap .tutorial-cont').height(
                jQuery(window).height() - 45
            );
            if(jQuery('.tutorial-wrap').size()>0) {
                jQuery('.tutorial-slick').slick({
                    dots: true
                });
            }
        });
    },
    render : function() {
        var colWidth30 = {
            width : '30%'
        };
        var colWidth20 = {
            width : '20%'
        };
        return (
            <div className="page page-settings" style={this.context.viewSize}>
                <PageHeader title="튜토리얼" />
                <PageContents className="setting-tutorial">
                    <div className="tutorial-wrap">
                        <div className="tutorial-slick">
                            <div className="tutorial-cont tutorial-step-1">
                                <div className="hide">
                                    <strong>위치기반, 쉬운 검색!</strong>
                                    <p>지도를 보고 가장 가까운 가맹점을 찾아가 보세요!</p>
                                </div>
                            </div>
                            <div className="tutorial-cont tutorial-step-2">
                                <div className="hide">
                                    <strong>자동 체크인과 쉬운 적립!</strong>
                                    <p>가맹점에 들어서면 자동으로 시간이 적립됩니다</p>
                                </div>
                            </div>
                            <div className="tutorial-cont tutorial-step-3">
                                <div className="hide">
                                    <strong>적립된 시간을 현금처럼!</strong>
                                    <p>이렇게 모인 시간을 현금처럼 사용 가능한 코인으로 바꾸세요!</p>
                                </div>
                            </div>
                            <div className="tutorial-cont tutorial-step-4">
                                <div className="hide">
                                    <strong>그리고 다양한 혜택을!</strong>
                                    <p>원하는 가맹점을 찾아가 코인을 현금 대신 사용하세요!</p>
                                </div>
                            </div>
                            <div className="tutorial-cont tutorial-step-5">
                                <div className="hide">
                                    <strong>그리고 다양한 혜택을!</strong>
                                    <p>또한 적립된 시간을 이용해 마음에 드는 쿠폰으로 교환하세요!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContents>
            </div>
        );
    }
});