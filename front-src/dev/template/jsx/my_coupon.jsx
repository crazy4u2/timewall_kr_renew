/*********************************************************************************
 * MyCouponUse class
 * html template
 *********************************************************************************/
var MyCoupon = React.createClass({
    componentDidMount:function() {
    },
    render : function () {
        var _contents_list=null;

             _contents_list=<MyCouponList />;

        return (
            <div className={"page "+loc[18].pageName+" "+this.props.position}>
                <div className="common-tab count-3 coin-donate-tab">
                    <ul className="fix">
                        <li><a className="all-coupon active" href="javascript:void(0);">전체쿠폰</a></li>
                        <li><a className="no-use-coupon" href="javascript:void(0);">미사용</a></li>
                        <li><a className="use-coupon" href="javascript:void(0);">사용완료</a></li>
                    </ul>
                </div>

                <div className="my-coupon-del">
                    <a className="" href="javascript:void(0);">사용완료•만료 쿠폰삭제</a>
                </div>

                {_contents_list}


            </div>
        )
    }
});

var MyCouponList = React.createClass({
    getInitialState:function() {
        return ({list:[''],page:1,totalpage:1});
    },
    componentDidMount:function() {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.coupon-list').height(jQuery(window).height()-jQuery('.header').height()-jQuery('.common-tab').height()-jQuery('.my-coupon-del').height());

        var _$category = jQuery('.common-tab li a');

        var _this=this,
            _data={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                category:1,
                page:1
            };

        twCommonUi.getApiData(
            {
                'url':loc[18].api[0],
                'type':'json',
                'method':'post',
                'data':_data
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);
                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.

                    _this.setState({
                        list: _newList.list[0].ResultData,
                        totalpage: _newList.list[0].totalpage
                    });

                    //쿠폰 상세보기
                    jQuery('.coupon-list .couponbox li').on('tap',function(e) {
                        e.stopPropagation();
                        location.href='#/coupon-use-info/'+jQuery(this).attr('data-coupon-idx');
                    });
                }

                //enable scroll to set data
                twCommonUi.scrollLoading = true;

            }
        );

        /**********************************
         * @param : scroll target
         **********************************/
        twCommonUi.listScrollLoading('.coupon-list',function() {
            //compare current page count to total page count
            if(_data.page>=_this.state.totalpage) {
                _data.page=1;
                twCommonUi.scrollLoading = false;
            } else {

                /**********************************
                 * @param : Shop_List parameters
                 **********************************/
                _data.page=_data.page+1;
                twCommonUi.getApiData(
                    {
                        'url':loc[18].api[0],
                        'type':'json',
                        'method':'post',
                        'data':_data
                    },
                    'append',
                    React.addons,
                    function(listType,resp,reactAddons) {

                        var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                        console.log(_newList);
                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                            _this.setState({
                                list: _newList.list,
                                totalPage: _newList.totalpage
                            });

                            //쿠폰 상세보기
                            jQuery('.coupon-list .couponbox li').on('tap',function(e) {
                                e.stopPropagation();
                                location.href='#/coupon-use-info/'+jQuery(this).attr('data-coupon-idx');
                            });
                        }

                        //enable scroll to set data
                        twCommonUi.scrollLoading = true;
                    }
                );
            }
        });

        /**********************************
         * tab click
         *********************************/
        _$category.off('tap').on('tap',function(e) {
            e.stopPropagation();
            /**********************************
             * param : target tag, tap
             *********************************/
            twCommonUi.tab(_$category,this,function(_txtName,$target) {
                if (_txtName == '전체쿠폰') {
                    _data.category = 1;
                } else if (_txtName == '미사용') {
                    _data.category = 2;
                } else {
                    _data.category = 3;
                }

                _data.page = 1;


                twCommonUi.getApiData(
                    {
                        'url': loc[18].api[0],
                        'type': 'json',
                        'method': 'post',
                        'data': _data
                    },
                    'html',
                    React.addons,
                    function (listType, resp, reactAddons) {
                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                            _this.setState({
                                list: _newList.list[0].ResultData,
                                totalPage: _newList.list[0].totalpage
                            });

                            //쿠폰 상세보기
                            jQuery('.coupon-list .couponbox li').on('tap',function(e) {
                                e.stopPropagation();
                                location.href='#/coupon-use-info/'+jQuery(this).attr('data-coupon-idx');
                            });
                        }
                    }
                );
            });
        });

        jQuery('.my-coupon-del a').off('tap').on('tap',function(e) {
            e.stopPropagation();
            var _data_delete={
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            };

            //쿠폰 교환
            reqwest({
                url: loc[18].api[1], //쿠폰 삭제
                method: 'post',
                type: 'json',
                data: _data_delete
            })
            .then(function (resp) {
                /*************************
                 resp.ResultCode
                 '1'=success
                 '-1'=fail
                 *************************/
                if (resp[0].ResultCode == '1') { //쿠폰삭제
                    var _txtName=jQuery('.commob-tab li a.active').text();

                    BRIDGE.appAlert({title:"",msg:"사용(기한 만료된) 쿠폰이 삭제되었습니다."});

                    if (_txtName == '전체쿠폰') {
                        _data.category = 1;
                    } else if (_txtName == '미사용') {
                        _data.category = 2;
                    } else {
                        _data.category = 3;
                    }

                    _data.page = 1;

                    twCommonUi.getApiData(
                        {
                            'url': loc[18].api[0],
                            'type': 'json',
                            'method': 'post',
                            'data': _data
                        },
                        'html',
                        React.addons,
                        function (listType, resp, reactAddons) {
                            var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                            //setState excute react render
                            if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                _this.setState({
                                    list: _newList.list[0].ResultData,
                                    totalPage: _newList.list[0].totalpage
                                });

                                //쿠폰 상세보기
                                jQuery('.coupon-list .couponbox li').on('tap',function(e) {
                                    e.stopPropagation();
                                    location.href='#/coupon-use-info/'+jQuery(this).attr('data-coupon-idx');
                                });
                            }
                        }
                    );

                } else {
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });

        });


    },
    render : function () {
        var _contents_list=null,
            _link='javascript:void(0);',
            _createItem=function(coupon,idx) {
                var _coupon_kind={
                        cls:'',
                        txt:''
                    },
                    _coupon_background={
                        'background-image':'url('+coupon.cafe_logo+')'
                    };

                if(coupon.coupon_type==1) { //할인
                    _coupon_kind.cls = ' discount';
                    _coupon_kind.txt = 'cupon 할인';
                } else if(coupon.coupon_type==2) { //증정
                    _coupon_kind.cls = ' freebies';
                    _coupon_kind.txt = 'cupon 사은품';
                } else if(coupon.coupon_type==3) { //1+1
                    _coupon_kind.cls = ' plus';
                    _coupon_kind.txt = 'cupon 플러스';
                } else { //무료
                    _coupon_kind.cls = ' free';
                    _coupon_kind.txt = 'cupon 무료';
                }

                var _background={
                        'background-image':'url('+coupon.coupon_image_s+')'
                    },
                    _able='able-use';

                if(coupon.coupon_use_yn!='N') {
                    _able='disable-use';
                } else {
                    _link="#/my-coupon-use/"+coupon.coupon_idx;
                }

                return (
                    <li data-coupon-idx={coupon.coupon_idx} data-coupon-master-idx={coupon.coupon_master_idx}>
                        <div className="coupon-wrap fix">
                            <div className={"coupon-kind"+_coupon_kind.cls}><span className="hanareum" style={_coupon_background}>한아름 제휴</span>{_coupon_kind.txt}</div>
                            <div className="coupon-balloons">
                                <span className="coupon-shop-name">{coupon.shop_name}</span>
                                <p className="coupon-detail">{coupon.coupon_master_name}</p>
                                <span className="coupon-until">{coupon.coupon_enddate}까지</span>
                            </div>
                            <div className="coupon-use-ox">
                                <a className={_able} href={_link}>사용하기</a>
                            </div>
                        </div>
                    </li>
                );
            };

        if(this.state.list[0]!='') {
            if (this.state.list.length > 0) {
                _contents_list = this.state.list.map(_createItem);
            } else {
                _contents_list = <MyCouponEmpty />;
            }
        }

        return (
            <div className="coupon-list">
                <ul className="couponbox">
                    {_contents_list}

                </ul>
            </div>
        )
    }
});

/*********************************************************************************
 * MyCouponEmpty class
 * html template
 *********************************************************************************/
var MyCouponEmpty = React.createClass({
    render : function () {
        var _border={
                border:0
            },
            _p={
                padding:0,
                background:'none'
            };

        return (
            <li style={_border}>
                <div className="no-data">
                    <div className="no-data-ment">
                        <p style={_p} className="text-type2">교환가능한 쿠폰이 없습니다.</p>
                    </div>
                </div>
            </li>
        )
    }
});



