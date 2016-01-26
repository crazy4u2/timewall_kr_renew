/*********************************************************************************
 * MyCouponUse class
 * html template
 *********************************************************************************/
var MyCouponUse = React.createClass({
    getInitialState:function() {
        return ({list:['']});
    },
    componentDidMount:function() {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        var _this=this,
            _data={
                coupon_idx:parseInt(_this.props.coupon_idx)
            };

        twCommonUi.getApiData(
            {
                'url':loc[19].api[0],
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
                        list: _newList.list[0].ResultData[0]
                    });
                }

                //enable scroll to set data
                twCommonUi.scrollLoading = true;
            }
        );

    },
    render : function () {
        var _this=this,
            _contents=null,
            _bg={
                background:'#e5e5e5'
            },
            _createItem=function(coupon) {

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

                return (
                    <div>
                        <div className="use-top-wrap coupon">
                            <div className="use-top-wrap-inner fix">
                                <div className={"coupon-kind"+_coupon_kind.cls}><span className="hanareum" style={_coupon_background}>한아름 제휴</span>{_coupon_kind.txt}</div>

                                <div className="text">
                                    <strong>{coupon.coupon_master_name}</strong>
                                    <p><strong>{coupon.startDate}</strong>부터 <strong>{coupon.endDate}</strong>까지</p>
                                </div>
                            </div>
                        </div>

                        <div className="payment-wrap">
                            <div className="roundbox">
                                <div className="roundbox-inner">
                                    <div className="coupon-explain">
                                        <p>{coupon.coupon_master_descriptionon}</p>
                                        <div className="message fix">
                                            <span className="shop-name">{coupon.shop_name}</span><span className="min">1매 <em>{coupon.coupon_min_point}min</em></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="roundbox">
                                <div className="roundbox-inner">
                                    <div className="use-button">
                                        <span className="title">사용하기</span>
                                        <p>자세한 사용방법은 아래를 확인하세요.</p>
                                        <div className="btn-use">
                                            <a href={"#/coupon-use-select/"+coupon.coupon_idx+"?shop_idx="+coupon.Shop_idx}>사용하기</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="roundbox">
                                <div className="roundbox-inner">
                                    <div className="use-way">
                                        <span className="title">사용방법</span>
                                        <div className="img-explain">
                                            <ol className="fix">
                                                <li>블루투스 ON</li>
                                                <li>단말기 제시</li>
                                                <li>비콘태그</li>
                                            </ol>
                                        </div>
                                        <ol className="text-explain">
                                            <li>1) 단말기의 블루투스 기능을 켜주세요.</li>
                                            <li>2) 점원의 안내에 따라 단말기를 제시하세요.</li>
                                            <li>3) 비콘과 단말기가 통신 후 결제가 완료됩니다.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            };

        if(this.state.list[0]!='') {
            _contents=_createItem(this.state.list);
        }

        return (
            <div className={"page "+loc[19].pageName+" "+this.props.position} style={_bg}>
                <div className="contentsScroll">

                    {_contents}

                </div>
            </div>
        )
    }
});



