/*********************************************************************************
 * notice list class
 * html template
 *********************************************************************************/
var NoticeList = React.createClass({
    url : loc[21].api[0],
    type : loc[21].type,
    method : 'post',
    options : {
        'page' : 1,
        'searchText' : ''
    },
    newList : [],
    getInitialState : function () {
        return { page:1, list:[''], 'searchText' : '' };
    },
    componentDidMount : function () {

        jQuery('.twNotice .visibleList').css({
            'height':jQuery(window).height() - jQuery('.header').height()
        });

        var _obj = {};

        var _this = this,
            _url = _this.url,
            _data = {};

        _data = {
            page : _this.state.page,
            searchText : _this.state.searchText
        };

        twCommonUi.getApiData(
            {
                'url': _url,
                'type': _this.type,
                'method': _this.method,
                'data': _data
            },
            'html',
            React.addons, function (listType, resp, reactAddons) {
                var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                if (_this.isMounted()) {
                    _this.setState({
                        list: _newList.list[0].ResultData,
                        totalPage: _newList.list[0].totalpage,
                        page: 1
                    });
                }
                twCommonUi.scrollLoading = true;
            }
        );

        twCommonUi.listScrollLoading('.twNotice .visibleList', function(){
            console.log('진입');
            if(_this.state.page >= _this.state.totalPage) {
                _data.page=1;
                twCommonUi.scrollLoading = false;

            } else {
                _data.page=_data.page+1;

                twCommonUi.getApiData(
                    {
                        'url': _url,
                        'type': _this.type,
                        'method': _this.method,
                        'data': _data
                    },
                    'append',
                    React.addons, function (listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                        if (_this.isMounted()) {
                            _this.setState({
                                list: _newList.list,
                                totalPage: _newList.totalPage,
                                page: _this.state.page+1
                            });
                        }
                        twCommonUi.scrollLoading = true;
                    }
                );
            }
        });

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });

        twCommonUi.setContentsHeight();

        jQuery(document.body).on('tap', '.accordion-title', function(e){
            var _$this=jQuery(this);
            var _$accordionInfoView = _$this.next('.info-view');
            var _$accordionHeight = _$accordionInfoView.children('.info-view-inner').height();

            if( _$accordionInfoView.height() == 0){
                jQuery('.notice-list ul li').removeClass('active');
                jQuery('.notice-list ul li .info-view').height(0);
                _$this.parent('li').addClass('active');
                _$accordionInfoView.css({
                    'height' : _$accordionHeight + 10
                });
            } else{
                _$this.parent('li').removeClass('active');
                _$accordionInfoView.css({
                    'height' : 0
                });
            }
            e.stopImmediatePropagation();
        });
    },
    render : function () {

        var _this=this;
        createItem = function (noticeList,idx) {
            console.log(noticeList);
            var _rownum = null,
                _board_title = null,
                _board_contents = null,
                _board_count = null,
                _board_regdate = null;

            _board_title = <span className="title">{noticeList.board_title}</span>;
            _board_contents = <div className="notice-text">{noticeList.board_contents}</div>;
            _board_regdate = <span className="date">{noticeList.board_regdate.substring(0,10)}</span>;

            return (
                <li>
                    <a href="javascript:void(0)" className="accordion-title">
                        {_board_title}
                        {_board_regdate}
                        <i className="fa fa-caret-down"></i>
                    </a>
                    <div className="info-view">
                        <div className="info-view-inner">
                            {_board_contents}
                        </div>
                    </div>
                </li>
            )
        };

        if(this.state.list[0]!='') {
            if(this.state.list.length>0) {
                var list = this.state.list.map(createItem);
            } else {
                var empty = <NoticeListEmpty />;
            }
        }

        var scrollEnableProps = {
            overflowY:'auto'
        };

        var _contents=null;
            _contents=<NoticeList />;

        return (
            <div className={"page "+loc[21].pageName+" "+this.props.position}>
                <ul style={scrollEnableProps} className="visibleList">
                    {list}
                    {empty}
                </ul>

            </div>
        );
    }
});

/***************************************
 * 공지사항 없음.
 *
 ***************************************/
var NoticeListEmpty = React.createClass({
    render : function () {
        var _contentsEmpty = null;
        _contentsEmpty = <NoticeListEmpty />;

        return (
            <li className="no-list">
                공지사항이 없습니다.
            </li>
        )
    }
});