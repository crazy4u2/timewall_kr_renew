/****************************************************************
 * 코인 기부 껍데기
 *
 ***************************************************************/
var CoinDonate = React.createClass({
    componentDidMount : function() {

        twCommonUi.setContentsHeight();

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });
    },
    render : function () {
        var _content_list = null;
        _content_list = <CoinDonateList />;

        return (
            <div className={"page "+loc[12].pageName+" "+this.props.position}>
                <div className="donate-intro">
                    <div className="btn-donate-view">
                        <a href="#/my-donate">나의 기부내역</a>
                    </div>
                    <div className="donate-intro-text">
                        기부해 주신 coin은 연말에 현금으로 기부됩니다. 또한 상세 기부내역은 기부자 사용내역과 공지사항을 통해 정확한 내용을 알려드립니다.
                    </div>
                </div>
                {_content_list}
            </div>
        )
    }
});

/****************************************************************
 * 코인 기부 리스트 받아서 그리기
 *
 ***************************************************************/

var CoinDonateList = React.createClass({
    getInitialState : function() {
        return { list:[''],page:1};
    },
    componentDidMount : function() {
        var _this = this,
            _data = {
                page : 1
            };

        twCommonUi.getApiData(
            {
                'url' : loc[12].api[0],
                'type' : loc[12].type,
                'method' : 'post',
                'data' : _data
            },
            'html',
            React.addons, function(listType, resp, reactAddons) {
                var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                console.log(_newList);
                if (_this.isMounted()) {
                    _this.setState({
                        list : _newList.list[0].ResultData,
                        //totalPage : _newList.list[0].totalPage,
                        page : 1
                    });
                }
            }
        );

    },
    render : function() {
        var _this = this;
        var _contents_list = null;

        _createItem = function(list, idx) {
            var _background = {
                'background-image' : 'url('+list.d_image_s+')'
            };
            _donateOrgLink = list.d_idx;
            _donateOrgName = list.d_organization;

            return (
                <li className="donate-org">
                    <a className="donate-logo" href={"#/coin-donate-detail/"+_donateOrgLink} style={_background}></a>
                </li>
            )
        };

        if(this.state.list[0]!='') {
            if (this.state.list.length > 0) {
                _contents_list = this.state.list.map(_createItem);
            } else {
                _contents_list = <NoList />;
            }
        }

        return (
            <div className="donate-place">
                <ul className="fix">
                    {_contents_list}
                </ul>
            </div>
        )
    }
});

/**************************************************************
 * 기부 가능한 곳이 없음.
 *
 *************************************************************/
var NoList = React.createClass({
    render : function () {
        return (
            <li>
                <div className="no-data">
                    <div className="no-data-ment">
                        <p className="text-type2">기부가능한 목록이 없습니다.</p>
                    </div>
                </div>
            </li>
        )
    }
});