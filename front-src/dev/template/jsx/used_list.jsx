/*************************************************************
 * 이용내역
 * loc[20]
 *************************************************************/
var UsedListWrap = React.createClass({
    category : null,
    componentDidMount : function() {
        var _this = this;
        jQuery('.used-list ul').css({
            'height':jQuery(window).height() - jQuery('.header').height() - jQuery('.common-tab').height() - jQuery('.used-del').height()
        });
        jQuery('.header-inner').css({
            'border': '0 none'
        });
    },
    render : function() {
        var _contents_list=null;
        _contents_list=<UsedList />;

        return (
            <div className={"page "+loc[20].pageName+" "+this.props.position}>
                <div className="common-tab count-3 coin-donate-tab">
                    <ul className="fix">
                        <li><a className="min active" href="javascript:void(0);">min</a></li>
                        <li><a className="coin" href="javascript:void(0);">coin</a></li>
                        <li><a className="coupon" href="javascript:void(0);">쿠폰</a></li>
                    </ul>
                </div>

                <div className="used-del">
                    <a className="all-check" href="javascript:void(0);">전체선택</a>
                    <a className="all-del" href="javascript:void(0);">삭제</a>
                </div>

                <div className="common-tab-contents">
                    {_contents_list}
                </div>


            </div>
        )
    }
});

var UsedList = React.createClass({
    category:null,
    getInitialState:function() {
        return ({list:[''],page:1,totalpage:1,category:''});
    },
    componentDidMount : function() {
        twCommonUi.setContentsHeight();

        var _$category = jQuery('.common-tab li a');

        var _this=this,
            _data={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                category:1,
                page:1
            };

        twCommonUi.getApiData(
            {
                'url':loc[20].api[0],
                'type':'json',
                'method':'post',
                'data':_data
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);
                console.log(_newList.list[0]);
                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        list: _newList.list[0].ResultData,
                        totalPage: _newList.list[0].totalpage,
                        page: 1
                    });
                }
                twCommonUi.scrollLoading = true;
            }
        );

        // tab click
        _$category.off('tap').on('tap',function(e) {
            e.stopPropagation();

            twCommonUi.tab(_$category,this,function(_txtName,$target) {
                if (_txtName == 'min') { // min 탭 선택 시
                    _data.category = 0;
                } else if (_txtName == 'coin') { // 코인 탭 선택 시
                    _data.category = 1;
                } else if (_txtName == '쿠폰') { // 쿠폰 탭 선택 시
                    _data.category = 2;
                }
                _this.category = _data.category;
                _data.page = 1;

                twCommonUi.getApiData(
                    {
                        'url': loc[20].api[_data.category],
                        'type': 'json',
                        'method': 'post',
                        'data': _data
                    },
                    'html',
                    React.addons,
                    function (listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                        jQuery('.inp-check').removeClass('active').find('input').removeAttr('checked');
                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                            _this.setState({
                                list: _newList.list[0].ResultData,
                                totalPage: _newList.list[0].totalpage,
                                page: 1
                            });
                        }
                        twCommonUi.scrollLoading = true;
                    }
                );
            });
        });
        /*console.log(_this.state.page);*/
        twCommonUi.listScrollLoading('.used-list ul', function(){
            if(_this.state.page >= _this.state.totalPage) {
                _data.page=1;
                twCommonUi.scrollLoading = false;

            } else {
                _data.page=_data.page+1;

                twCommonUi.getApiData(
                    {
                        'url': loc[20].api[_data.category],
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
        jQuery('.used-del .all-check').off('tap').on('tap', function(e) {
            e.stopPropagation();
            var _$inp=jQuery('.inp-check');
            _$inp.each(function(idx) {
               if(!jQuery(this).find('input').attr('checked')) {
                   _$inp.addClass('active').find('input').attr('checked','checked');
                   return false;
               } else {
                   if((_$inp.length-1)==idx) {
                       _$inp.removeClass('active').find('input').removeAttr('checked');
                   }
               }
            });
        });

        jQuery('.used-del .all-del').off('tap').on('tap', function(e) {
            e.stopPropagation();
            console.log(_this.category);
            if (_this.category == undefined || _this.category == 0) {
                apiNum = 3;
            } else if (_this.category == 1) {
                apiNum = 4;
            } else if (_this.category == 2) {
                apiNum = 5;
            }
            var itemIdx = [];
            jQuery('.inp-check.active').find('input').each(function() {
                itemIdx.push($(this).attr('data-history'));
            });

            var _data = {
                u_idx : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                history_idx : itemIdx.toString()
            };

            reqwest({
                url : loc[20].api[apiNum],
                method : loc[20].method,
                type : loc[20].type,
                data : _data
            })
            .then(function(resp) {
                if (resp[0].ResultCode == 1) {
                    //jQuery('.inp-check.active').closest('.used-wrap').remove();
                    //location.reload();
                    twCommonUi.getApiData(
                        {
                            'url':loc[20].api[0],
                            'type':'json',
                            'method':'post',
                            'data':_data
                        },
                        'html',
                        React.addons,
                        function(listType,resp,reactAddons) {
                            var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);
                            console.log(_newList.list[0]);
                            //setState excute react render
                            if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                _this.setState({
                                    list: _newList.list[0].ResultData,
                                    totalPage: _newList.list[0].totalpage,
                                    page: 1
                                });
                                /*var _$inp=jQuery('.inp-check');
                                _$inp.each(function(idx) {
                                    if(!jQuery(this).find('input').attr('checked')) {
                                        _$inp.addClass('active').find('input').attr('checked','checked');
                                        return false;
                                    } else {
                                        if((_$inp.length-1)==idx) {
                                            _$inp.removeClass('active').find('input').removeAttr('checked');
                                        }
                                    }
                                });*/
                            }
                            twCommonUi.scrollLoading = true;
                        }
                    );

                } else if (resp[0].ResultCode < 1) {
                    //alert('이용내역 삭제에 실패했습니다.');
                    BRIDGE.appAlert({title:"",msg:"이용내역 삭제에 실패했습니다."});
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });
        });
    },
    render : function() {
        var _contents_list = null;

        var _createItem = function(list, idx) {
            console.log('min 진입');
            var _background={
                'background-image':'url('+list.shop_logo_image+')'
            };

            _history_type = null;
            _history_type = null;
            _action_info = null;
            _used_date = <span className="used-date">{list.regdate.substring(0, 10)}</span>;
            _history_idx = list.min_history_idx;
            _shop_logo = <span className="shop-logo" style={_background}></span>;
            _shop_name = <p className="shop-name">{list.shop_name}</p>;

            if (list.history_type == "1" || list.history_type == "1_1") { // min일 때 적립요건 일 때
                _history_type = <div className="tag save"><span>적립</span></div>;
                _action_info = <span><em>{list.min_save}min</em>을 적립했습니다.</span>;

            } else if (list.history_type == "2") { // min일 때 교환, min --> 쿠폰
                _history_type = <div className="tag ex"><span>교환</span></div>;
                _action_info = <span><em>{list.min_use}min</em>으로 <em>{list.coupon_master_name}</em>을 구매했습니다.</span>;

            } else if (list.history_type == "3") { // min일 때 사용, min --> coin
                _history_type = <div className="tag ex"><span>교환</span></div>;
                _action_info = <span><em>{list.min_use}min</em>을 <em>{list.excoin}coin</em>으로 교환했습니다.</span>;
            }

            return (
                <li className="used-wrap fix">
                    {_history_type}
                    {_shop_logo}
                    <div className="used-balloons">
                        {_used_date}
                        {_shop_name}
                        <div className="substance">
                            {_action_info}
                        </div>
                        <div className="inp-check">
                            <input type="checkbox" id={"check"+_history_idx} data-history={_history_idx} name="mycheck" /><label htmlFor={"check"+_history_idx}><span className="box"><em className="box-dot"></em></span></label>
                        </div>
                    </div>
                </li>
            )
        };

        var _createItem1 = function(list, idx) {
            var _background={
                'background-image':'url('+list.shop_logo_image+')'
            };

            _history_type = null;
            _history_type = null;
            _action_info = null;
            _used_date = <span className="used-date">{list.regdate.substring(0, 10)}</span>;
            _history_idx = list.coin_history_idx;
            _shop_logo = <span className="shop-logo" style={_background}></span>;
            _shop_name = <p className="shop-name">{list.shop_name}</p>;

            if (list.history_type == "1") {
                _history_type = <div className="tag save"><span>적립</span></div>;
                _action_info = <span><em>{list.min}min</em>을 <em>{list.coin}coin</em>으로 교환하였습니다.</span>;

            } else if (list.history_type == "2" || list.history_type == "3") {
                _history_type = <div className="tag use"><span>사용</span></div>;
                _action_info = <span><em>{list.coin}coin</em>을 사용하였습니다.</span>;
            }

            return (
                <li className="used-wrap fix">
                    {_history_type}
                    {_shop_logo}
                    <div className="used-balloons">
                        {_used_date}
                        {_shop_name}
                        <div className="substance">
                            {_action_info}
                        </div>
                        <div className="inp-check">
                            <input type="checkbox" id={"check"+_history_idx} data-history={_history_idx} name="mycheck" /><label htmlFor={"check"+_history_idx}><span className="box"><em className="box-dot"></em></span></label>
                        </div>
                    </div>
                </li>
            )
        };

        var _createItem2 = function(list, idx) {
            //console.log(list.coupon_use_yn);
            var _background={
                'background-image':'url('+list.shop_logo_image+')'
            };

            _history_type = null;
            _action_info = null;
            _coupon_reg_date = null;
            _coupon_min_point = null;
            _coupon_use_log = null;
            _coupon_use_end = null;
            _history_idx = list.coupon_idx;
            _used_date = <span className="used-date">{list.coupon_regdate.substring(0,10)}</span>;
            _shop_logo = <span className="shop-logo" style={_background}></span>;
            _shop_name = <p className="shop-name">{list.shop_name}</p>;

            if (list.coupon_use_yn == "Y") {
                console.log('쿠폰 사용');
                _history_type = <div className="tag use"><span>사용</span></div>;
                _action_info = <span><em>{list.coupon_master_name}</em>을 사용했습니다.</span>;
                _coupon_use_log = <span className="usage-date">{list.coupon_use_regdate.substring(0,10)}</span>;
                _coupon_use_end = <span className="usage-complete">쿠폰 사용완료</span>;

            } else if (list.coupon_use_yn == "N") {
                console.log('쿠폰 안사용');
                _history_type = <div className="tag ex"><span>교환</span></div>;
                _action_info = <span><em>{list.coupon_min_point}min</em>으로 <em>{list.coupon_master_name}</em>쿠폰을 구매했습니다.</span>;
            }

            return (
                <li className="used-wrap fix">
                    {_history_type}
                    {_shop_logo}
                    <div className="used-balloons">
                        {_used_date}
                        {_shop_name}
                        <div className="substance">
                            {_action_info}
                        </div>
                        <div className="inp-check">
                            <input type="checkbox" id={"check"+_history_idx} data-history={_history_idx} name="mycheck" /><label htmlFor={"check"+_history_idx}><span className="box"><em className="box-dot"></em></span></label>
                        </div>
                    </div>
                    <div className="usage">
                        {_coupon_use_log}
                        {_coupon_use_end}
                    </div>
                </li>
            )
        };


        if(this.state.list[0]!='') {
            if (this.state.list.length > 0) {

                if (this.category == 0 || this.category == undefined) {
                    _contents_list = this.state.list.map(_createItem);
                } else if (this.category == 1) {
                    _contents_list = this.state.list.map(_createItem1);
                } else if (this.category == 2) {
                    _contents_list = this.state.list.map(_createItem2);
                }
            } else {
                _contents_list = <UsedListEmpty />;
            }
        }
        return (
            <div className="used-list">
                <ul>
                    {_contents_list}
                </ul>
            </div>
        )
    }
});

/*****************************************************************************************
 * 사용내역 없음.
 *
 *****************************************************************************************/
var UsedListEmpty = React.createClass({
    render : function () {
        return (
            <li className="no-data">
                <div className="no-data-ment">
                    <p className="text-type2">이용 내역이 없습니다.</p>
                </div>
            </li>
        )
    }
});