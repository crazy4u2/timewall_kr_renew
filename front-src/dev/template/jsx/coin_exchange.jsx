/*********************************************************************************
 * coin exchange main class
 * html template
 *********************************************************************************/
var CoinExchange = React.createClass({
    getInitialState:function() {
        return ({tab:'coin'});
    },
    componentDidMount:function() {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();

        var _this=this;

        jQuery('.common-tab ul li a').on('tap',function(e) {
            var _$this=jQuery(this);
            jQuery('.common-tab a').removeClass('active');
            _$this.addClass('active');

            if(_$this.attr('class').match('enable-exchange')) {
                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        tab: 'coin'
                    });

                }

            } else {
                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        tab: 'min'
                    });

                }
            }

            e.stopPropagation();
        });


    },
    render : function () {
        var _contents_tab=null;

            if(this.state.tab=='coin') {
                _contents_tab=<CoinTab />;
            } else {
                _contents_tab=<MinTab />;
            }

        return (
            <div className={"page "+loc[10].pageName+" "+this.props.position}>
                <div className="common-tab count-2 coin-exchange-tab">
                    <ul className="fix">
                        <li><a className="enable-exchange active" href="javascript:void(0);">교환가능 min</a></li>
                        <li><a className="saving" href="javascript:void(0);">적립중 min</a></li>
                    </ul>
                </div>

                <div className="tabContents">
                    {_contents_tab}
                </div>



            </div>
        )
    }
});

/*********************************************************************************
 * CoinTab class
 * html template
 *********************************************************************************/
var CoinTab = React.createClass({
    eventHistory:function(_this) {
        //코인교환 히스토리
        jQuery('.accordion-title .btn-open-view').on('tap',function(e) {
            var _$this=jQuery(this);
            var _$accordionInfoView = _$this.closest('.coin-exchange-list').find('.accordion-info-view');
            var _$accordionHeight = 0;

            if( !_$this.attr('class').match('active')){
                _$this.addClass('active');
                console.log('코인열림');
                React.render(React.createElement(CoinTabSub, {shopIdx:_$this.closest('li').attr('data-shop-idx'),count:_$this.closest('li').index()}), document.getElementsByClassName('accordion-info-view')[_$this.closest('li').index()]);

                setTimeout(function() {
                    _$accordionHeight=_$accordionInfoView.find('.validity').height() * _$accordionInfoView.find('.validity').size();
                    _$accordionInfoView.css({
                        'height' : _$accordionHeight
                    });
                },700);
            } else{
                console.log('코인닫힘');
                _$this.closest('li').find('.accordion-info-view').empty();
                _$this.removeClass('active');
                _$accordionInfoView.css({
                    'height' : 0
                });
            }
            e.stopPropagation();
        });

        //코인 교환 팝업
        jQuery('.btn-coin-exchange-pop').on('tap',function(e) {
            e.stopPropagation();

            var _params={
                min:jQuery(this).closest('.coin-item').find('.enable-exchange').text(),
                coin:jQuery(this).closest('.coin-item').find('.exCoin').text(),
                u_idx:jQuery(this).closest('.coin-exchange-list').attr('data-shop-idx')
            };

            React.render(React.createElement(ModalAll, {total:_params}), document.getElementsByClassName('modal-wrap')[0]);
            twCommonUi.showModal(jQuery('.modal-coin-exchange'));

            //코인 교환
            jQuery('.modal.modal-coin-exchange .btn-exchange-modal').on('tap',function(e) {
                e.stopPropagation();
                console.log('코인교환 페이지에서 호출');
                reqwest({
                    url: loc[10].api[3], //코인교환
                    method: 'post',
                    type: 'json',
                    data: {
                        u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                        shop_idx:_params.u_idx,
                        setMin:_params.min
                    }
                })
                .then(function (resp) {
                    /*************************
                     resp.ResultCode
                     '1'=success
                     '-1'=fail
                     *************************/
                    if (resp[0].ResultCode == '1') {
                        var _data_coin_list={
                            u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                            page:1
                        };

                        twCommonUi.getApiData(
                            {
                                'url':loc[10].api[0],//코인 교환 가능한 min 매장 리스트
                                'type':'json',
                                'method':'post',
                                'data':_data_coin_list
                            },
                            'html',
                            React.addons,
                            function(listType,resp,reactAddons) {
                                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);
                                console.log('리스트 가공:::',_newList.list);
                                console.log('리스트 원본:::',_newList);
                                //setState excute react render
                                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                    _this.setState({
                                        list: _newList.list
                                    });

                                    _this.eventHistory(_this,_newList.list);

                                    /**********************************
                                     * @param : scroll target
                                     **********************************/
                                    twCommonUi.listScrollLoading('.enable-exchange-cont .coin-exchange-list-wrap',function() {
                                        //compare current page count to total page count
                                        if(_data_coin_list.page>=_newList.list[0].totalPage) {
                                            _data_coin_list.page=1;
                                            twCommonUi.scrollLoading = false;
                                        } else {

                                            /**********************************
                                             * @param : Shop_List parameters
                                             **********************************/
                                            _data_coin_list.page=_data_coin_list.page+1;
                                            twCommonUi.getApiData(
                                                {
                                                    'url':loc[10].api[0],
                                                    'type':'json',
                                                    'method':'post',
                                                    'data':_data_coin_list
                                                },
                                                'append',
                                                React.addons,
                                                function(listType,resp,reactAddons) {

                                                    var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                                                    //setState excute react render
                                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                                        _this.setState({
                                                            list: _newList.list
                                                        });

                                                        _this.eventHistory(_this,_newList.list);

                                                    }

                                                    //enable scroll to set data
                                                    twCommonUi.scrollLoading = true;
                                                }
                                            );
                                        }
                                    });
                                }
                                //enable scroll to set data
                                twCommonUi.scrollLoading = true;
                            }
                        );


                        twCommonUi.hideModal(jQuery('.modal.modal-coin-exchange'));

                    } else if (resp.ResultCode == '-1') { //실패
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });

            });

        });

    },
    getInitialState:function() {
        return {list:[''],history:['']}
    },
    componentDidMount:function() {
        var _this=this,
            _data_coin_list={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                page:1
            };
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height()-jQuery('.common-tab').height());

        twCommonUi.getApiData(
            {
                'url':loc[10].api[0],//코인 교환 가능한 min 매장 리스트
                'type':'json',
                'method':'post',
                'data':_data_coin_list
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        list: _newList.list
                    });

                    _this.eventHistory(_this,_newList.list);

                    /**********************************
                     * @param : scroll target
                     **********************************/
                    twCommonUi.listScrollLoading('.enable-exchange-cont .coin-exchange-list-wrap',function() {
                        //compare current page count to total page count
                        if(_data_coin_list.page>=_newList.list[0].totalPage) {
                            _data_coin_list.page=1;
                            twCommonUi.scrollLoading = false;
                        } else {

                            /**********************************
                             * @param : Shop_List parameters
                             **********************************/
                            _data_coin_list.page=_data_coin_list.page+1;
                            twCommonUi.getApiData(
                                {
                                    'url':loc[10].api[0],
                                    'type':'json',
                                    'method':'post',
                                    'data':_data_coin_list
                                },
                                'append',
                                React.addons,
                                function(listType,resp,reactAddons) {

                                    var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                                    //setState excute react render
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        _this.setState({
                                            list: _newList.list
                                        });

                                        _this.eventHistory(_this,_newList.list);

                                    }

                                    //enable scroll to set data
                                    twCommonUi.scrollLoading = true;
                                }
                            );
                        }
                    });
                }
                //enable scroll to set data
                twCommonUi.scrollLoading = true;
            }
        );

    },
    render: function () {
        var _show = {'display': 'block'},
            _contents_coin=null,
            _createCoin=function(coin,idx) {
                var _background={'background-image':'url('+coin.shop_logo_image+')'};

                return(
                    <li className="coin-exchange-list" data-shop-idx={coin.shop_idx}>
                        <div className="accordion-title">
                            <div className="coin-item fix">
                                <div className="item">
                                    <span className="shop-logo" style={_background}></span>
                                </div>
                                <div className="balloons">
                                    <strong className="shop-name">{coin.shop_name}</strong>
                                    <div className="item-use">
                                        <div><strong>코인</strong><p>10min <em><i className="fa fa-caret-right"></i></em> <span className="exCoin">{coin.exCoin}</span>coin</p></div>
                                    </div>
                                    <div className="min-state">
                                        <div>교환가능 min :<strong><em className="enable-exchange">{coin.exchangeable_min}</em>min</strong></div>
                                    </div>
                                </div>
                                <a className="btn-coin-exchange-pop" href="javascript:void(0);"><span className="hide">코인교환 팝업 열기</span></a>
                            </div>
                            <a className="btn-open-view" href="javascript:void(0);"><span className="hide">코인교환 히스토리 열기</span><i className="fa fa-caret-down"></i></a>
                        </div>

                        <div className="accordion-info-view">
                        </div>
                    </li>
                );
            }

        if(this.state.list[0]!='') {
            if(this.state.list[0].ResultData.length>0) {
                console.log(this.state.list[0].ResultData);
                _contents_coin = this.state.list[0].ResultData.map(_createCoin);
            } else {
                _contents_coin = <CoinEmpty />;
            }
        }

        return (
            <div className="common-tab-contents enable-exchange-cont" style={_show}>
                <div className="coin-exchange-notice">
                    coin교환가능 min은 10min단위로만 교환이 가능하며 적립한 날부터 30일 동안만 coin으로 교환 할 수 있습니다. 30일 이후에는 일반 min으로 전환됩니다.
                </div>

                <ul className="coin-exchange-list-wrap contentsScroll">
                    {_contents_coin}
                </ul>
            </div>
        )
    }
});

/*********************************************************************************
 * CoinTabSub class
 * html template
 *********************************************************************************/
var CoinTabSub = React.createClass({
    getInitialState:function() {
        return {history:['']}
    },
    componentDidMount:function() {
        var _this=this,
            _data_history={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                shop_idx:this.props.shopIdx,
                page:1
            };

        twCommonUi.getApiData(
            {
                'url':loc[10].api[2],//코인 교환 가능한 min 매장 리스트
                'type':'json',
                'method':'post',
                'data':_data_history
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        history: _newList.list
                    });

                    /**********************************
                     * @param : scroll target
                     * ***totalpage가 없음 추후에 히스토리 내역 스크롤링이 필요하다면 totalpage가 있어야함
                     *********************************
                    twCommonUi.listScrollLoading('.accordion-info-view',function() {
                        //compare current page count to total page count
                        console.log(_newList);
                        if(_data_history.page>=_newList.history[0].totalPage) {
                            _data_history.page=1;
                            twCommonUi.scrollLoading = false;
                        } else {

                            /**********************************
                             * @param : Shop_List parameters
                             *********************************
                            _data_coin_list.page=_data_coin_list.page+1;
                            twCommonUi.getApiData(
                                {
                                    'url':loc[10].api[2],
                                    'type':'json',
                                    'method':'post',
                                    'data':_data_history
                                },
                                'append',
                                React.addons,
                                function(listType,resp,reactAddons) {

                                    var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);
console.log(_newList);
                                    //setState excute react render
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        _this.setState({
                                            history: _newList.list
                                        });
                                    }

                                    //enable scroll to set data
                                    twCommonUi.scrollLoading = true;
                                }
                            );

                        }
                    },_this.props.count);
                    */
                }
                //enable scroll to set data
                twCommonUi.scrollLoading = true;
            }
        );

    },
    render: function () {
        var _create_history=function(item,idx) {
                var _ex_date=item.coin_expire_date,
                    _regdate=item.regdate;

                _ex_date=_ex_date.replace('T',' ').substring(0,16);
                _regdate=_regdate.replace('T',' ').substring(0,16);

                return(
                    <div className="validity">
                        <p className="min">{item.saved_min}min</p>
                        <div className="detail">
                            <p><span>{_regdate}</span><strong>적립완료</strong></p>
                            <p><span>{_ex_date}</span><strong>소멸예정</strong></p>
                        </div>
                    </div>
                );
            },
            _contents_history=null;

        if(this.state.history[0]!='') {
            if(this.state.history.length>0) {
                _contents_history=this.state.history[0].ResultData.map(_create_history);

            }
        }

        return (
            <div className="validity_wrap">
                {_contents_history}
            </div>
        )
    }
});

/*********************************************************************************
 * minTab class
 * html template
 *********************************************************************************/
var MinTab = React.createClass({
    eventHistory:function() {
        //코인교환 히스토리
        jQuery('.accordion-title .btn-open-view').on('tap',function(e) {
            var _$this=jQuery(this);
            var _$accordionInfoView = _$this.closest('.coin-exchange-list').find('.accordion-info-view');
            var _$accordionHeight = 0;

            if( !_$this.attr('class').match('active')){
                _$this.addClass('active');

                React.render(React.createElement(MinTabSub, {shopIdx:_$this.closest('li').attr('data-shop-idx'),count:_$this.closest('li').index()}), document.getElementsByClassName('accordion-info-view')[_$this.closest('li').index()]);
                console.log('min열림');
                setTimeout(function() {
                    _$accordionHeight=_$accordionInfoView.find('.validity').height() * _$accordionInfoView.find('.validity').size();
                    _$accordionInfoView.css({
                        'height' : _$accordionHeight
                    });
                },700);
            } else{
                console.log('min닫힘');
                _$this.closest('li').find('.accordion-info-view').empty();
                _$this.removeClass('active');
                _$accordionInfoView.css({
                    'height' : 0
                });
            }
            e.stopPropagation();
        });

    },
    getInitialState:function() {
        return {list:[''],history:['']}
    },
    componentDidMount:function() {
        var _this=this,
            _data_coin_list={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                page:1
            };
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height()-jQuery('.common-tab').height());

        twCommonUi.getApiData(
            {
                'url':loc[10].api[1],//코인 교환 가능한 min 매장 리스트
                'type':'json',
                'method':'post',
                'data':_data_coin_list
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        list: _newList.list
                    });

                    _this.eventHistory();

                    /**********************************
                     * @param : scroll target
                     **********************************/
                    twCommonUi.listScrollLoading('.saving-min .coin-exchange-list-wrap',function() {
                        //compare current page count to total page count
                        if(_data_coin_list.page>=_newList.list[0].totalPage) {
                            _data_coin_list.page=1;
                            twCommonUi.scrollLoading = false;
                        } else {

                            /**********************************
                             * @param : Shop_List parameters
                             **********************************/
                            _data_coin_list.page=_data_coin_list.page+1;
                            twCommonUi.getApiData(
                                {
                                    'url':loc[10].api[1],
                                    'type':'json',
                                    'method':'post',
                                    'data':_data_coin_list
                                },
                                'append',
                                React.addons,
                                function(listType,resp,reactAddons) {

                                    var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                                    //setState excute react render
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        _this.setState({
                                            list: _newList.list
                                        });

                                        _this.eventHistory();

                                    }

                                    //enable scroll to set data
                                    twCommonUi.scrollLoading = true;
                                }
                            );
                        }
                    });
                }
                //enable scroll to set data
                twCommonUi.scrollLoading = true;
            }
        );

    },
    render: function () {
        var _show = {'display': 'block'},
            _contents_coin=null,
            _createCoin=function(coin,idx) {
                console.log(coin);
                var _background={'background-image':'url('+coin.shop_logo_image+')'};

                return(
                    <li className="coin-exchange-list" data-shop-idx={coin.shop_idx}>
                        <div className="accordion-title">
                            <div className="coin-item fix">
                                <div className="item">
                                    <span className="shop-logo" style={_background}></span>
                                </div>
                                <div className="balloons">
                                    <strong className="shop-name">{coin.shop_name}</strong>
                                    <div className="item-use">
                                        <div><strong>코인</strong><p>10min <em><i className="fa fa-caret-right"></i></em> <span>{coin.exCoin}</span>coin</p></div>
                                    </div>
                                    <div className="min-state">
                                        <div>현재적립 min :<strong><em>{coin.saved_min}</em>min</strong></div>
                                        <div>교환가능 min :<strong><em className="enable-exchange">{coin.exchangeable_min}</em>min</strong></div>
                                    </div>
                                </div>
                                <a className="btn-coin-exchange-pop disable" href="javascript:void(0);"><span className="hide">코인교환 팝업 열기</span></a>
                            </div>
                            <a className="btn-open-view" href="javascript:void(0);"><span className="hide">코인교환 히스토리 열기</span><i className="fa fa-caret-down"></i></a>
                        </div>

                        <div className="accordion-info-view">
                        </div>
                    </li>
                );
            };

        if(this.state.list[0]!='') {
            if(this.state.list[0].ResultData.length>0) {
                _contents_coin = this.state.list[0].ResultData.map(_createCoin);
            } else {
                _contents_coin = <MinEmpty />;
            }
        }

        return (
            <div className="common-tab-contents saving-min" style={_show}>
                <div className="coin-exchange-notice">
                    적립 중인 coin 교환 가능 min 리스트입니다. coin 교환 가능 min은 최소 10min부터 coin으로 교환이 가능합니다. 10min 이상 적립시 교환 가능 min으로 이동됩니다.
                </div>

                <ul className="coin-exchange-list-wrap contentsScroll">
                    {_contents_coin}
                </ul>
            </div>
        )
    }
});

/*********************************************************************************
 * minTabSub class
 * html template
 *********************************************************************************/
var MinTabSub = React.createClass({
    getInitialState:function() {
        return {history:['']}
    },
    componentDidMount:function() {
        var _this=this,
            _data_history_min={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                shop_idx:this.props.shopIdx,
                page:1
            };

        twCommonUi.getApiData(
            {
                'url':loc[10].api[4],//코인 교환 가능한 10 min 이하 매장 상세
                'type':'json',
                'method':'post',
                'data':_data_history_min
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        history: _newList.list
                    });

                    /**********************************
                     * @param : scroll target
                     *********************************
                    twCommonUi.listScrollLoading('.accordion-info-view',function() {
                        //compare current page count to total page count
                        if(_data_history.page>=_newList.history[0].totalPage) {
                            _data_history.page=1;
                            twCommonUi.scrollLoading = false;
                        } else {

                            /**********************************
                             * @param : Shop_List parameters
                             *********************************
                            _data_coin_list.page=_data_coin_list.page+1;
                            twCommonUi.getApiData(
                                {
                                    'url':loc[10].api[2],
                                    'type':'json',
                                    'method':'post',
                                    'data':_data_history
                                },
                                'append',
                                React.addons,
                                function(listType,resp,reactAddons) {

                                    var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                                    //setState excute react render
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        _this.setState({
                                            history: _newList.list
                                        });
                                    }

                                    //enable scroll to set data
                                    twCommonUi.scrollLoading = true;
                                }
                            );
                        }
                    },_this.props.count);
                    */
                }
                //enable scroll to set data
                twCommonUi.scrollLoading = true;
            }
        );

    },
    render: function () {
        var _create_history=function(item,idx) {
                var _ex_date=item.coin_expire_date,
                    _regdate=item.regdate;

                _regdate=_regdate.replace('T',' ').substring(0,16);

                return(
                    <div className="validity">
                        <p className="min">{item.saved_min}min</p>
                        <div className="detail">
                            <p><span>{_regdate}</span><strong>적립</strong></p>
                        </div>
                    </div>
                );
            },
            _contents_history=null;

        if(this.state.history[0]!='') {
            if(this.state.history.length>0) {
                _contents_history=this.state.history[0].ResultData.map(_create_history);

            }
        }

        return (
            <div className="validity_wrap">
                {_contents_history}
            </div>
        )
    }
});

/*********************************************************************************
 * Coinempty class
 * html template
 *********************************************************************************/
var CoinEmpty = React.createClass({
    render: function () {
        return (
            <div className="no-data">
                <div className="no-data-ment">
                    <p className="text-type2">교환 가능한 매장이 없습니다.</p>
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * minempty class
 * html template
 *********************************************************************************/
var MinEmpty = React.createClass({
    render: function () {
        return (
            <div className="no-data">
                <div className="no-data-ment">
                    <p className="text-type2">적립중 min이 없습니다.</p>
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * mix and render all modal
 *********************************************************************************/

/**********************************
 * 코인교환
 ********************************/
var ModalAll = React.createClass({
    render: function () {

        var props = {
            display: 'none',
            position: 'absolute',
            top: '100px',
            width: '100%',
            zIndex: '200'
        };

        return (
            <ModalCoinExchange dataStyle={props} total={this.props.total} uidx={this.props.u_idx} />
        )
    }
});

/**********************************
 * 코인교환
 ********************************/
var ModalCoinExchange = React.createClass({
    componentDidMount:function() {
        jQuery('.modal.modal-coin-exchange .btn-modal-close').on('tap',function(e) {
            e.stopPropagation();
           twCommonUi.hideModal(jQuery('.modal-coin-exchange'));
        });

    },
    render: function () {
        var _min=this.props.total.min,
            _total=((this.props.total.min/this.props.total.coin)*10)*this.props.total.coin,
            _background={
                'background':'#fff'
            };

        return (
            <section className="modal modal-small modal-coin-exchange" data-shop-idx={this.props.uidx} style={this.props.dataStyle}>
                <div className="modal-inner">
                    <div className="modal-header icon-type6">
                        코인교환
                        <a className="btn-modal-close" href="javascript:void(0);"><span className="팝업 창 닫기"></span></a>
                    </div>

                    <div className="modal-content">
                        <div className="numberbox min">
                            <div className="numberbox-inner">
                                <input type="tel" className="write-number write-min" readOnly value={_min} style={_background} />
                                <span className="unit">min</span>
                            </div>
                        </div>
                        <div className="numberbox coin">
                            <div className="numberbox-inner">
                                <input type="tel" className="write-number write-coin" readOnly value={_total} style={_background} />
                                <span className="unit">coin</span>
                            </div>
                        </div>
                        <p className="text-type3">코인으로 교환하시겠습니까?</p>
                    </div>
                    <a className="btn-exchange-modal" href="javascript:void(0);"><span className="교환버튼"></span></a>
                </div>
            </section>
        )
    }
});

