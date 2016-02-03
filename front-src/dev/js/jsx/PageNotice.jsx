var PageNotice = React.createClass({
    loading : false,
    url : API.NOTICE_LIST,
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        return { page:1, list:[''], 'searchText' : '' };
    },
    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
    },
    getNoticeList : function(_data) {
        var _this = this;

        MODEL.get(_this.url, _data, function(ret) {
            var respData = ret.data[0];
            if(ret.success && respData.ResultCode == 1) {
                var list = respData.ResultData,
                    totalPage = respData.totalpage;

                var result = {
                    list : list,
                    totalPage : totalPage
                };

                _this.loading = false;
                callback(result);
            }
        });
    },
    onShow : function() {
        var _this = this;

        jQuery('.twNotice .visibleList').css({
            'height':jQuery(window).height() - jQuery('.header').height()
        });

        _data = {
            page : _this.state.page,
            searchText : _this.state.searchText
        };

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

    render : function() {
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
            <div className="page page-notice" style={this.context.viewSize}>
                <PageHeader title="공지사항" />
                <PageContents className="contents notice-list twNotice">
                    <ul style={scrollEnableProps} className="visibleList">
                        {list}
                        {empty}
                    </ul>
                </PageContents>
            </div>
        );
    }
});

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