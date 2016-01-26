/*********************************************************************
 * 나의 기부내역 껍데기
 *
 *********************************************************************/
var MyDonate = React.createClass({
    getInitialState : function () {
        return ({u_idx:''})
    },
    componentWillMount : function() {
    },
    componentDidMount : function() {

        var _data = {
            'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
        };

        reqwest({
            url : loc[29].api[0],
            method : loc[29].method,
            type : loc[29].type,
            data : _data
        })
        .then(function(resp) {
            if(resp[0].ResultCode == 1) {
                _coin_status = resp[0].SumCoin;
                jQuery('.donate-amount-inner strong').text(_coin_status);
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });

        twCommonUi.setContentsHeight();
        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });
    },
    render : function() {
        var _contents_list = null,
            _contents_list = <MyDonateList />;

        return (
            <div className={"page "+loc[29].pageName+" "+this.props.position}>
                <div className="donate-amount">
                    <div className="donate-amount-inner">
                        <strong></strong><span>coin</span>
                        <p>나의 총 기부 금액</p>
                    </div>
                </div>
                <div className="donate-my-history">
                    {_contents_list}
                </div>

            </div>
        )
    }
});

/**********************************************************************
 * 나의 기부내역 리스트
 *
 *********************************************************************/
var MyDonateList = React.createClass({
    getInitialState : function() {
        return ({list:[], page:1, totalPage:1});
    },
    componentDidMount : function() {

        var _this =this,
            u_idx = (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1;

        var _data = {
            'u_idx' : u_idx,
            'page' : 1
        };

        jQuery('.donate-list ul').css({
            'height' : jQuery(window).height() - jQuery('.header').height() - jQuery('donate-amount').height()
        });

        twCommonUi.getApiData(
            {
                'url':loc[29].api[0],
                'type':'json',
                'method':'post',
                'data':_data
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                console.log(_newList.list);
                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    // list중에 history_type이 맞는 것만 _type_history에 저장한다.
                    /*Lazy(_newList.list[0].ResultData).filter(function(list) {
                        return list.history_type==='1';
                    }).each(function(list) {
                        _type_list.push(list);
                    });*/

                    _this.setState({
                        list: _newList.list[0].ResultData,
                        totalPage: _newList.list[0].totalpage,
                        page: 1
                    });
                }
                twCommonUi.scrollLoading = true;
            }
        );

        twCommonUi.listScrollLoading('.donate-list ul', function(){
            if(_this.state.page >= _this.state.totalPage) {
                _data.page=1;
                twCommonUi.scrollLoading = false;

            } else {
                _data.page=_data.page+1;

                twCommonUi.getApiData(
                    {
                        'url': loc[29].api[0],
                        'type': 'json',
                        'method': 'post',
                        'data': _data
                    },
                    'append',
                    React.addons, function (listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                        if (_this.isMounted()) {
                            // list중에 history_type이 맞는 것만 _type_history에 저장한다.
                            /*console.log(_newList.list[0]);
                            Lazy(_newList.list[0].ResultData).filter(function(list) {
                                return list.history_type==='1';
                            }).each(function(list) {
                                _type_list.push(list);
                            });*/

                            _this.setState({
                                list: _newList.list[0].ResultData,
                                totalPage: _newList.list[0].totalPage,
                                page: _this.state.page+1
                            });
                        }
                        twCommonUi.scrollLoading = true;
                    }
                );
            }
        });
    },
    render : function() {
        var _contents_list = null;
        var _createItem = function(list, idx) {
            console.log(list);
            var _background = {
                'background-image' : 'url('+list.d_image_s+')'
            };
            _used_date = <p className="donate-date">기부일 : <span>{list.regdate.substring(0, 10)}</span></p>;
            _d_org_name = <span className="donate-place">{list.d_organization}</span>;
            _d_coin = <em>{list.coin}</em>;

            return (
                <li>
                    <div className="donate-logo" style={_background}></div>
                    <div className="balloons">
                        {_used_date}
                        <div className="report">
                            {_d_org_name}에 <br />
                            <span className="donate-coin">{_d_coin}coin</span>을 기부하셨습니다.
                        </div>
                    </div>
                </li>
            );
        };

        if(this.state.list[0]!='') {
            console.log(this.state.list.length);
            if (this.state.list.length > 0) {
                _contents_list = this.state.list.map(_createItem);
            } else {
                _contents_list = <NoDonationList />;
            }
        }

        return (
            <div className="donate-list">
                <ul>
                    {_contents_list}
                </ul>
            </div>
        );
    }
});

/***************************************************************
 * 기부내역 없음
 *
 ***************************************************************/
var NoDonationList = React.createClass({
    render : function() {
        return (
            <li className="no-donate-data">
                <div className="no-data">
                    <div className="no-data-ment type2">
                        <p className="text-type2">기부내역이 없습니다.</p>
                    </div>
                </div>
            </li>
        );
    }
});