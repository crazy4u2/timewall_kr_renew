/*******************************************************************
 * 코인기부하기 상세
 *
 ******************************************************************/
var CoinDonateDetail = React.createClass({
    category : null,

    getInitialState : function () {
        return({category:'',totalAmount:[''],logoImage:'',d_idx:''})
    },
    componentDidMount : function () {

        twCommonUi.setContentsHeight();

        var _this = this,
            _data = {
                d_idx : _this.props.d_idx
            };

        reqwest({
            url : loc[13].api[0],
            method : 'post',
            type : loc[13].type,
            data : _data
        })
        .then(function(resp) {
            if(resp[0].ResultCode == 1) {
                _coin_amount = resp[0].ResultData[0].d_Coin;
                _d_org_image = resp[0].ResultData[0].d_image;
                if(_this.isMounted()) {
                    _this.setState({
                        totalAmount : resp[0].ResultData[0].d_Coin,
                        logoImage : resp[0].ResultData[0].d_image,
                        d_idx : _data.d_idx
                    });
                }
            }
        });

        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);
    },
    render : function () {
        // 세번째 탭 : <li><a className="use-history" href="javascript:void(0);">사용내역</a></li>
        var _contents = null;

        if(this.state.totalAmount[0]!='') {
            //console.log(this.state);
            _contents = <CoinDonateDetailInfo dataIdx={this.state.d_idx} />;
        }

        return (
            <div className={"page "+loc[13].pageName+" "+this.props.position}>
                <div className="donate-visual">
                    <div className="visual">
                        <img src={this.state.logoImage} />
                    </div>
                    <div className="total">총 모금액 : <span className="total-amount">{this.state.totalAmount}</span> coin</div>
                </div>

                <div className="common-tab count-2 coin-donate-tab">
                    <ul className="fix">
                        <li><a className="place-info active" href="javascript:void(0);">기부처 정보</a></li>
                        <li><a className="donor" href="javascript:void(0);">기부자 명단</a></li>
                    </ul>
                </div>

                {_contents}
            </div>
        );
    }
});

/********************************************************************
 * 코인기부하기 탭 이하 (기부처 정보, 기부자 리스트, 기부금 사용내역)
 *
 ********************************************************************/
var CoinDonateDetailInfo = React.createClass({
    category : null,
    getInitialState : function() {
        return({myCoin:'',category:'' ,donateList:[''],donateUse:[''], list:[''],d_idx:'',tabClass:'',totalAmount:'',totalPage:''});
    },
    componentDidMount : function() {
        console.log(this.props.dataIdx);

        var _this = this,
            _d_idx_data = {
                d_idx : this.props.dataIdx
            },
            _u_idx_data = {
                u_idx : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            },
            _history_data = {
                d_idx : this.props.dataIdx,
                page : 1
            };
        if(_this.category == null) {
            _this.category = 0;
        }
        twCommonUi.getApiData(
            {
                'url' : loc[13].api[4],
                'type' : 'json',
                'method' : 'post',
                'data' : _u_idx_data
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                twCommonUi.getApiData(
                    {
                        'url' : loc[13].api[0],
                        'type' : 'json',
                        'method' : 'post',
                        'data' : _d_idx_data
                    },
                    'html',
                    React.addons,
                    function(listType, resp, reactAddons) {
                        var _list = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                        if(_this.isMounted()) {
                            _this.setState({
                                myCoin : _newList.list[0].ResultData[0].coin,
                                list : _list.list[0].ResultData,
                                category : 0,
                                d_idx : _list.list[0].ResultData[0].d_idx
                            });
                        }
                    }
                );
            }
        );

        // 탭 전환
        var _$category = jQuery('.coin-donate-tab li a');
        _$category.off('tap').on('tap', function(e) {
            e.stopPropagation();
            var _className='';

            twCommonUi.tab(_$category, this, function(_txtName, $target) {
                if (_txtName == '기부처 정보') {
                    _this.category = 0;
                    _className='tab-cont-place';
                } else if (_txtName == '기부자 명단') {
                    _this.category = 1;
                    _className='tab-cont-donor';
                } else if (_txtName == '사용내역') {
                    _this.category = 2;
                    _className='tab-cont-use';
                }

                twCommonUi.getApiData(
                    {
                        'url': loc[13].api[_this.category],
                        'type': 'json',
                        'method': 'post',
                        'data': _history_data
                    },
                    'html',
                    React.addons,
                    function(listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                        if(_this.isMounted()) {
                            _this.setState({
                                list : _newList.list[0].ResultData,
                                totalPage : _newList.list[0].totalPage,
                                page : 1,
                                tabClass:_className
                            });
                        }
                        if(_this.category != 0) {
                            twCommonUi.scrollLoading = true;
                        }
                    }

                );
            });
        });

    },
    render : function() {
        var _contents_list = null,
            _this = this;

        if(this.state.list[0] != '') {
            if(this.state.list.length > 0) {
                console.log('list.length 진입', _this.category);
                if(_this.category == 0) {
					console.log('현재 카테고리 '+_this.category);
                    _contents_list = <DonateDetail {...this.state} />;
                } else if (_this.category == 1) {
                    console.log('현재 카테고리 '+_this.category);
                    _contents_list = <Donor {...this.state} />;
                } else if (_this.category == 2) {
					console.log('현재 카테고리 '+_this.category);
                    _contents_list = <DonateUse {...this.state}/>
                }
            } else {
                _contents_list = <NoData />
            }
        }
        return(
            <div className={"common-tab-contents "+this.state.tabClass}>
                {_contents_list}
            </div>
        );
    }
});

/*****************************************************************
 * 기부처 정보 클래스
 *
 *****************************************************************/
var DonateDetail = React.createClass({
    getInitialState:function() {
        return ({list:[''], myCoin:''});
    },
    componentWillMount:function() {
        this.setState({
            list : this.props.list,
            myCoin : this.props.myCoin
        });
    },
	componentDidMount : function() {
        jQuery('.amount .message').hide();
        var _this = this,
            number_check = /^[0-9]*$/,
            _d_idx_data = {
                d_idx : this.props.dataIdx
            },
            _u_idx_data = {
                u_idx : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            };

        jQuery('.btn-donate a').on('tap', function(e) {

            e.stopPropagation();
            var $donate_form = jQuery('.money-inner input'),
                donate_value = $donate_form.val(),
                $error_log = jQuery('.amount .message');
            if (!donate_value) {
                $error_log.show().text('* 기부할 금액을 입력해주세요.');
                $donate_form.focus();
                return false;
            } else {
                if(number_check.test(donate_value)) {
                    $error_log.hide().text('');
                    console.log(donate_value.search(/[0]/g));
                    if(donate_value.search(/[0]/g)) {
                        var result = donate_value % 100;
                        if(result != 0) {
                            $error_log.show().text('* 코인은 100단위로만 사용가능합니다.');
                            $donate_form.focus();
                            return false;
                        } else {
                            if (donate_value > _this.state.myCoin) {
                                $error_log.show().text('* 보유 coin을 초과한 금액입니다.');
                                $donate_form.focus();
                                return false;
                            } else {
                                runDonate(donate_value);
                            }
                        }
                    } else {
                        $error_log.show().text('* 금액을 확인해주세요.');
                        $donate_form.focus();
                        return false;
                    }
                } else {
                    $error_log.show().text('* 숫자만 입력해주세요.');
                    $donate_form.focus();
                    return false;
                }
            }
        });

        var runDonate = function(coin) {
            var $modal_content = jQuery('.modal.modal-donate');
            $modal_content.find('.d-org-name').text(_this.props.list[0].d_organization.toUpperCase());
            $modal_content.find('.donate-value').text(coin);

            twCommonUi.showModal(jQuery('.modal.modal-donate'));

            jQuery('.modal.modal-donate .btn-type1').on('tap', function(e) {
                e.stopPropagation();

                var _data = {
                    coin : coin,
                    d_idx : _this.props.list[0].d_idx,
                    u_idx : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
                };

                reqwest({
                    url : loc[13].api[3],
                    type : loc[13].type,
                    method : 'POST',
                    data : _data
                })
                .then(function (resp) {
                    console.log(resp);
                    if(resp[0].ResultCode == 1) {
                        twCommonUi.hideModal(jQuery('.modal.modal-donate'));
                        setTimeout(function() {
                            twCommonUi.showModal(jQuery('.modal.modal-donate-complete'));
                        }, 300);
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });
            });
            jQuery('.modal-donate-complete .btn-type1').on('tap',function(e) {
                e.stopPropagation();
                twCommonUi.hideModal(jQuery('.modal.modal-donate-complete'));
                setTimeout(function() {

                    var _d_idx_data = {
                        d_idx : _this.props.list[0].d_idx
                    };
                    if(_this.category == null) {
                        _this.category = 0;
                    }
                    twCommonUi.getApiData(
                        {
                            'url' : loc[13].api[4],
                            'type' : 'json',
                            'method' : 'post',
                            'data' : _u_idx_data
                        },
                        'html',
                        React.addons,
                        function(listType,resp,reactAddons) {
                            var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                            twCommonUi.getApiData(
                                {
                                    'url' : loc[13].api[0],
                                    'type' : 'json',
                                    'method' : 'post',
                                    'data' : _d_idx_data
                                },
                                'html',
                                React.addons,
                                function(listType, resp, reactAddons) {
                                    var _list = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                                    if(_this.isMounted()) {
                                        _this.setState({
                                            totalAmount : _list.list[0].ResultData[0].d_Coin,
                                            myCoin : _newList.list[0].ResultData[0].coin,
                                            list : _list.list[0].ResultData,
                                            category : 0,
                                            d_idx : _list.list[0].ResultData[0].d_idx
                                        });
                                    }
                                    jQuery('.total-amount').text(_this.state.totalAmount)
                                }
                            );
                        }
                    );
                }, 50);
            });
        };


        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.donate-visual').height()-jQuery('.common-tab').height());

    },
    render:function() {
        //console.log(this.props);

        var styles = {
            'width':'60px'
        },
            _this = this,
        _contents = null;
        _createItem0 = function(list, idx) {
            var orgData = _this.state.list[0],
            _my_coin = _this.state.myCoin,
            _d_org_add = orgData.d_addr,
            _d_org_phone = orgData.d_phone,
            _d_org_homepage = orgData.d_url,
            _d_org_name = orgData.d_organization,
            _d_org_info = orgData.d_info;

            return (
                <div className="common-tab-contents tab-cont-place contentsScroll">
                    <div className="donate-amount">
                        <div className="donate-amount-inner">
                            <strong>{_my_coin}</strong><span>coin</span>
                            <p>나의 현재 코인</p>
                        </div>
                    </div>
                    <div className="roundbox first">
                        <div className="roundbox-inner">
                            <div className="amount">
                                <label htmlFor="will">기부할 금액을 입력해주세요</label>
                                <div className="money">
                                    <div className="money-inner">
                                        <input type="tel" id="will" placeholder="" />
                                    </div>
                                </div>
                                <div className="message"></div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-donate">
                        <a href="javascript:void(0);">기부하기</a>
                    </div>
                    <div className="roundbox">
                        <div className="roundbox-inner">
                            <p className="title">기부처 정보</p>
                            <div className="tb-donate-info">
                                <table>
                                    <colgroup>
                                        <col style={styles} />
                                        <col />
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th scope="row">주소</th>
                                        <td>{_d_org_add}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">전화번호</th>
                                        <td>{_d_org_phone}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">홈페이지</th>
                                        <td><a href={"http://"+_d_org_homepage} target="_blank">{_d_org_homepage}</a></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <a className="btn-phone" href={"tel:"+_d_org_phone}>전화하기</a>
                            </div>
                        </div>
                    </div>

                    <div className="roundbox">
                        <div className="roundbox-inner">
                            <p className="title">{_d_org_name}</p>
                            <div className="text">
                                {_d_org_info}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        _contents=this.state.list.map(_createItem0);

        return (
          <div>
			  {_contents}
		  </div>
        );
    }
});

/***************************************************
 * 해당 기부처에 기부한 사람들 리스트 클래스
 *
 **************************************************/
var Donor = React.createClass({
	getInitialState : function() {
		return ({list:[''],d_idx:'',totalPage:'', page:''});
	},
    componentWillMount:function() {
        this.setState({
            list:this.props.list,
            d_idx:this.props.d_idx,
            page : this.props.page,
            totalPage : this.props.totalPage
        });
    },
    componentDidMount : function() {
        console.log(this.state);
        var _this = this,
            _history_data = {
                d_idx : this.props.d_idx,
                page : 1
            };

        jQuery('.donate-list ul').css({
            'height':jQuery(window).height() - jQuery('.header').height() - jQuery('.donate-visual').height() - jQuery('.common-tab').height(),
            'overflow-y':'scroll'
        });
        twCommonUi.listScrollLoading('.donate-list ul', function(){
            if(_this.state.page >= _this.state.totalPage) {
                _history_data.page=1;
                twCommonUi.scrollLoading = false;

            } else {
                _history_data.page=_history_data.page+1;

                twCommonUi.getApiData(
                    {
                        'url': loc[13].api[1],
                        'type': loc[13].type,
                        'method': 'post',
                        'data': _history_data
                    },
                    'append',
                    React.addons, function (listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                        console.log(_newList);
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
    },
	render : function () {
        var _this = this,
            _contents = null,
            _createItem1 = function(list,idx) {
                var orgData = list;
                    _d_org_date = orgData.regdate.substring(0,10),
                    _d_org_image = {
                        'background-image' : 'url('+orgData.d_image_s+')'
                    },
                    _d_org_coin = orgData.coin,
                    _d_org_total_coin = orgData.d_Coin,
                    _d_org_name = orgData.d_organization,
                    _d_org_user = orgData.phone.substring(orgData.phone.length-4); // 전화번호 뒤 4자리만 추려서 앞 두자리는 **처리 가공 필요

                return (
                    <li>
                        <div className="donate-logo" style={_d_org_image}></div>
                        <div className="balloons">
                            <p className="donate-date">{_d_org_date}</p>
                            <div className="report">
                                <span className="donate-place">{_d_org_name}</span>에 <br />
                                <span className="donate-coin"><em>{_d_org_coin}</em>coin</span>을 기부하셨습니다.
                            </div>
                            <div className="donor-num">기부자 : <span>{_d_org_user.replace(/[0-9]{2}/,'**')}</span>님</div>
                        </div>
                    </li>
                );
            };
        _contents = this.state.list.map(_createItem1);
        return (
            <div className="donor-history">
                <div className="donate-list">
                    <ul>
                        {_contents}
                    </ul>
                </div>
            </div>
        );
	}
});

/********************************************************************
 * 기부금 사용내역
 *
 *******************************************************************/
var DonateUse = React.createClass({
    getInitialState : function() {
        return ({list:[''],d_idx:'',page:''});
    },
    componentWillMount:function() {
        this.setState({
            list : this.props.list,
            d_idx : this.props.d_idx,
            page : this.props.page
        });
    },
    componentDidMount : function() {

    },
    render : function() {
        var _this = this,
            _contents = null,
            _createItem2 = function(list,idx) {
                var orgData = _this.state.list[0],
                    _background = {
                        'background-image':'url'+orgData.d_image_s+')'
                    },
                    _d_org_date = orgData.regdate.substring(0,10),
                    _d_org_desc = orgData.use_description,
                    _d_org_name = orgData.d_organization,
                    _d_org_donate_coin = orgData.coin;
                d_org_totalcoin = orgData.d_Coin;
                return (
                    <li>
                        <div className="donate-logo" style={_background}></div>
                        <div className="balloons">
                            <p className="donate-date">{_d_org_date}</p>
                            <div className="report">
                                <span className="donate-place">{_d_org_name}</span>에 <br />
                                <span className="donate-coin"><em>{_d_org_donate_coin}</em>coin</span>을 전달하였습니다.
                            </div>
                        </div>
                    </li>
                );
            };

        _contents = this.state.list.map(_createItem2);

        return (
            <div>
                <div className="current-gather">
                    <div className="current-gather-inner">
                        <p>현재 잔여 모금액 : <span><em>{d_org_totalcoin}</em>coin</span></p>
                    </div>
                </div>
                <div className="use-history">
                    <div className="donate-list">
                        <ul>
                            {_contents}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

/************************************************************************
 * 데이터 없음.
 *
 ************************************************************************/
var NoData = React.createClass({
    render : function() {
        return (
            <div className="no-data">
                <div className="no-data-ment type2">
                    <p className="text-type2">데이터가 없습니다.</p>
                </div>
            </div>
        );
    }
});

/*************************************************************************
 * 확인 모달
 *
 *************************************************************************/
var ModalConfirm = React.createClass({
    componentDidMount : function() {
        jQuery('.modal .btn-type2').on('tap', function(e) {
            twCommonUi.hideModal(jQuery('.modal.modal-donate'));
        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-donate" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header">
                        <div className="modal-donate-coin"><strong className="donate-value"></strong>coin</div>
                    </div>

                    <div className="modal-content">
                        <div className="message">
                            <div className="modal-donate-org"><strong className="d-org-name"></strong></div>
                            <span className="text-type1">기부하시겠습니까?</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});

/**************************************************************************
 * 완료 모달
 *
 **************************************************************************/
var ModalDonateComplete = React.createClass({
    componentDidMount : function() {
    },
    render : function() {
        return (
            <section className="modal modal-small modal-donate-complete" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">Coin 기부가 성공적으로 처리되었습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        );
    }
});

/**************************************************************************
 * 모든 모달 로딩
 *
 **************************************************************************/
var ModalAll = React.createClass({
    render : function() {
        var props={
            display:'none',
            position:'absolute',
            top:'100px',
            width:'100%',
            zIndex:'200'
        };

        return (
            <div>
                <ModalConfirm {...props} />
                <ModalDonateComplete {...props} />
            </div>
        );
    }
});