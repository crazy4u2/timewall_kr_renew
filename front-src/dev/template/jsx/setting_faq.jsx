/*********************************************************************************
 * faq list class
 * html template
 *********************************************************************************/
var SettingFaq = React.createClass({
    url : loc[26].api[0],
    type : loc[26].type,
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

        jQuery('.twSetting_faq .visibleList').css({
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

        twCommonUi.listScrollLoading('.faq-list .visibleList', function(){
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
                jQuery('.faq-list ul li').removeClass('active');
                jQuery('.faq-list ul li .info-view').height(0);
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

        var _this=this,
            createItem = function (FaqList,idx) {
                //console.log(FaqList);
                var _faq_title = null,
                    _faq_contents = null;


                _faq_title = <span className="title">{FaqList.faq_title}</span>;
                _faq_contents = <div className="faq-text">{FaqList.faq_contents}</div>;

                return (
                    <li>
                        <a href="javascript:void(0)" className="accordion-title">
                        {_faq_title}
                        <i className="fa fa-caret-down"></i>
                        </a>
                        <div className="info-view">
                            <div className="info-view-inner">
                                {_faq_contents}
                            </div>
                        </div>
                    </li>
                )
            };

        if(this.state.list[0]!='') {
            if(this.state.list.length>0) {
                var list = this.state.list.map(createItem);
            } else {
                var empty = <FaqListEmpty />;
            }
        }

        var scrollEnableProps = {
            overflowY:'auto'
        };

        return (
            <div className={"page "+loc[26].pageName+" "+this.props.position}>
                <ul style={scrollEnableProps} className="visibleList">
                    {list}
                    {empty}
                </ul>

            </div>
        )
    }
});

/***************************************
 * FAQ 없음.
 *
 ***************************************/
var FaqListEmpty = React.createClass({
    render : function () {
        var _contentsEmpty = null;
        _contentsEmpty = <FaqListEmpty />;

        return (
            <li className="no-list">
                등록된 FAQ가 없습니다.
            </li>
        )
    }
});