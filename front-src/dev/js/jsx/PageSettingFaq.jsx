var PageSettingFaq = React.createClass({
    loading : false,
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        return { page:1, list:[''], 'searchText' : '', totalPage:1 };
    },
    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
    },
    getNoticeList : function(_data, callback) {
        var _this = this;

        MODEL.get(API.FAQ_LIST, _data, function(ret) {
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
            } else { // 오료
                alert( '오류[ResultCode :'+ret.data[0].ResultCode+']' );
                console.log( '오류[ResultCode :', ret.data[0].ResultCode,']' );
                _this.loading = false;
                callback( null );
            }
        });
    },
    onScrollEnd : function() {
        var _this = this;

        if(_this.loading) {
            return;
        }

        if (_this.state.page >= _this.state.totalPage) {
            return;
        }
        _data = {
            page : _this.state.page + 1,
            searchText : _this.state.searchText
        };
        this.getNoticeList( _data, function( ret ) {
            if( ret == null ) // 로딩 실패
                return;

            var changingState = {
                totalPage : ret.totalPage,
                list : _this.state.list.concat(ret.list),
                page : _this.state.page + 1
            };
            _this.setState( changingState );
        });
    },
    onShow : function() {
        var _this = this;
        _data = {
            page : _this.state.page,
            searchText : _this.state.searchText
        };
        this.getNoticeList( _data, function( ret ) {
            if( ret == null ) // 로딩 실패
                return;

            var changingState = {
                totalPage : ret.totalPage,
                list : ret.list
            };
            _this.setState( changingState );
        });

        jQuery('.twSetting_faq .visibleList').css({
            'height':jQuery(window).height() - jQuery('.header').height()
        });

        jQuery(document.body).on('click', '.accordion-title', function(e){
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
    componentDidUpdate : function () {
        var _this = this;
        var faqListContainer = ReactDOM.findDOMNode(this.refs['faqListContainer']);
        jQuery(faqListContainer).unbind( 'scroll').bind( 'scroll', function() {

            var _$this = jQuery(this);
            if( _$this.scrollTop() + _$this.innerHeight() >= _$this[0].scrollHeight ) {
                console.log('스크롤 진입');
                _this.onScrollEnd();
            }
        });
    },
    render : function() {
        var _this=this,
        createItem = function (faqList,idx) {
            console.log(faqList);
            var _rownum = null,
                _board_title = null,
                _board_contents = null,
                _board_count = null,
                _board_regdate = null;

            _board_title = <span className="title">{faqList.faq_title}</span>;
            _board_contents = <div className="notice-text">{faqList.faq_contents}</div>;

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
        _contents=<PageNotice />;

        return (
            <div className="page page-notice" style={this.context.viewSize}>
                <PageHeader title="FAQ" />
                <PageContents className="contents notice-list twSetting_faq" onScrollEnd={this.onScrollEnd} >
                    <ul style={scrollEnableProps} className="visibleList" ref="faqListContainer">
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
            <li className="no-data">
                <div className="no-data-ment">
                내용이 없습니다.
                </div>
            </li>
        )
    }
});