var COUPON_CATEGORY = ['','음식', '음료', '뷰티', '생활', '주문', '교육' ];
var PageCouponExchange = React.createClass({
    loading : false,
    searchingLoc : { lati:0, longi:0 },
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        return {
            category : 0, // 선택된 카테고리 => 0:모두, 1:음식, 2:음료, 3:뷰티, 4:생활, 5:주문, 6:교육.의료
            couponList : [], // 쿠폰 리스트
            page : 1,
            region : '',
            sort : 1, // 1:모두, 2:인기순, 3:마감임박순, 4:min 낮은 순
            available : 'n',
            totalPage : 1
        };
    },
    getCouponList : function(param, callback) {
        var _this = this;
        _this.loading = true;
        MODEL.get(API.COUPON_LIST, param, function(ret){
            var respData = ret.data[0];
            if(ret.success && respData.ResultCode == 1) {

                var list = respData.ResultData;
                var totalPage = respData.totalpage;

                var result = {
                    list : list,
                    totalPage : totalPage
                };

                _this.loading = false;
                callback(result);
            } else {
                _this.loading = false;
                callback(null);
                alert( '오류[ResultCode :'+ret.data[0].ResultCode+']' );
                console.log( '오류[ResultCode :', ret.data[0].ResultCode,']' );
            }
        });
    },
    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );

        this.searchingLoc.lati = GPS.lati;
        this.searchingLoc.longi = GPS.longi;
    },
    onBtnLocationCoupon : function() {
        UI.openPopup( 'POP_SELECT_LOCATION', this.setSearcingLocationCoupon );
    },
    // 지역 설정 팝업으로 부터 호출됨.
    setSearcingLocationCoupon : function( regionName ) {
        var self = this;
        this.setState({region:regionName});

        GPS.getLocationFromAddress( regionName, function( ret ) {
            if( ret.success )
            {
                self.searchingLoc.lati = ret.loc.lati;
                self.searchingLoc.longi = ret.loc.longi;
                var params = {
                    //latitude : GPS.lati,
                    //longitude : GPS.longi,
                    latitude : self.searchingLoc.lati,
                    longitude : self.searchingLoc.longi,
                    u_idx : USER.info.index,
                    page : 1, // 최초 페이지 1
                    coupon_category : COUPON_CATEGORY[self.state.category],
                    available:'n',
                    sort : self.state.sort
                };

                self.getCouponList( params, function( ret )
                {
                    var changingState =
                    {
                        totalPage : ret.totalPage,
                        couponList : ret.list
                    };
                    self.setState( changingState );
                });
            }
            else
                BRIDGE.appAlert( {TITLE:'안내', TEXT:'잘못된 주소입니다'} );
        });
    },
    onShowFirst : function(){
        var _this = this;
        GPS.getCurrentRegionName( function( ret ) {
            _this.setState( { region:ret.regionName} );
        });
        console.log(_this.state.region);

        var _data= { // getCouponList를 호출하기 위한 파라미터들.
            'u_idx': USER.info.index,
            'latitude': _this.searchingLoc.lati,
            'longitude': _this.searchingLoc.longi,
            'coupon_category': COUPON_CATEGORY[this.state.category],
            'sort':1,
            'available':'n',
            'page':1
        };

        this.getCouponList(_data, function(ret) {
            if (ret == null) { // 실패
                return;
            }
            var changingList = {
                totalPage : ret.totalPage,
                couponList : ret.list
            };
            console.log(changingList);
            _this.setState( changingList );
        });
    },
    onShow : function(){

    },

    onChangeCategoryCoupon : function( selectedCategory ) {
        var _this = this;
        console.log(_this.state.category, selectedCategory);
        if( _this.state.category == selectedCategory )
            return;

        _this.setState({category:selectedCategory});

        var params = {
            latitude : _this.searchingLoc.lati,
            longitude : _this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            coupon_category : COUPON_CATEGORY[selectedCategory],
            'available':'n',
            sort : this.state.sort
        };

        console.log( '검색 param : ', params );
        this.getCouponList( params, function( ret ) {
            if( ret == null )
                return;

            var changingState = {
                category : selectedCategory,
                totalPage : ret.totalPage,
                couponList : ret.list
            };

            _this.setState( changingState );
        });
    },

    onChangeFilterCoupon : function() {
        var _this = this,
            filter = _this.refs['filter-menu-coupon'],
            filterType = filter.filterType;

        var _data = {
            latitude : _this.searchingLoc.lati,
            longitude : _this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            coupon_category : COUPON_CATEGORY[_this.state.category],
            available:'n',
            sort : filterType
        };

        console.log( '검색 param : ', _data );
        this.getCouponList( _data, function( ret ) {
            if( ret == null )
                return;

            var changingState = {
                totalPage : ret.totalPage,
                couponList : ret.list
            };

            _this.setState( changingState );
        });
    },

    onChangeAbleCoupon : function() {
        var _this = this,
            availableType = _this.refs['available'].available;

        var _data = {
            latitude : _this.searchingLoc.lati,
            longitude : _this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            coupon_category : COUPON_CATEGORY[_this.state.category],
            available: availableType,
            sort : _this.state.sort
        };

        console.log( '검색 param : ', _data );
        this.getCouponList( _data, function( ret ) {
            if( ret == null )
                return;

            var changingState = {
                totalPage : ret.totalPage,
                couponList : ret.list
            };

            _this.setState( changingState );
        });
    },

    onScrollEnd : function() {
        var _this = this;
        console.log('_this.state.page:::', _this.state.page);
        console.log('_this.state.totalPage::::', _this.state.totalPage);
        if (_this.loading) {
            return;
        }
        if (_this.state.page >= _this.state.totalPage) {
            return;
        }
        var _data = {
            latitude : _this.searchingLoc.lati,
            longitude : _this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : _this.state.page + 1, // 최초 페이지 1
            coupon_category : COUPON_CATEGORY[_this.state.category],
            available:'n',
            sort : this.state.sort
        };

        _this.getCouponList(_data, function(ret){
            if (ret == null) {
                return;
            }

            var changingState = {
                page : _this.state.page + 1,
                totalPage : ret.totalPage,
                couponList : _this.state.couponList.concat(ret.list)
            };

            _this.setState(changingState);
        });
    },

    render : function() {
        //<CouponList list={this.state.couponList} onScrollEnd={this.onScrollEnd} />
        return (
            <div className="page coupon" style={this.context.viewSize}>
                <PageHeader title="쿠폰교환" type="COUPON_EXCHANGE" />
                <PageContents className="twCoupon_exchange">
                    <CouponCategoryMenu onChangeCategoryCoupon={this.onChangeCategoryCoupon} category={this.state.category}/>
                    <CouponExchangePlace onChangeFilterCoupon={this.onChangeFilterCoupon} ref="filter-menu-coupon" onBtnLocationCoupon={this.onBtnLocationCoupon} region={this.state.region} />
                    <CouponList list={this.state.couponList} onScrollEnd={this.onScrollEnd} onChangeAbleCoupon={this.onChangeAbleCoupon} ref="available" />
                </PageContents>
            </div>
        );
    }
});

var CouponCategoryMenu = React.createClass({
    onClickCategoryCoupon : function( idx ) {
        this.props.onChangeCategoryCoupon( idx );
    },

    render : function() {
        var classList = ['all', 'food', 'drink', 'beauty', 'life', 'delivery', 'edu-health'];
        classList[this.props.category] += ' active';

        return(
            <div className="category">
                <ul className="category-inner fix">
                    <li><a className={classList[0]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this,0)}><span className="icon"><i className="fa fa-check-circle"></i></span><span className="title">모두</span></a></li>
                    <li><a className={classList[1]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 1)}><span className="icon"><i className="fa fa-cutlery"></i></span><span className="title">음식</span></a></li>
                    <li><a className={classList[2]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 2)}><span className="icon"><i className="fa fa-coffee"></i></span><span className="title">음료</span></a></li>
                    <li><a className={classList[3]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 3)}><span className="icon"><i className="fa fa-scissors"></i></span><span className="title">뷰티</span></a></li>
                    <li><a className={classList[4]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 4)}><span className="icon"><i className="fa fa-smile-o"></i></span><span className="title">생활</span></a></li>
                    <li><a className={classList[5]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 5)}><span className="icon"><i className="fa fa-phone"></i></span><span className="title">주문</span></a></li>
                    <li><a className={classList[6]} href="javascript:void(0);" onClick={this.onClickCategoryCoupon.bind(this, 6)}><span className="icon"><i className="fa fa-stethoscope"></i></span><span className="title">교육/의료</span></a></li>
                </ul>
            </div>
        )
    }
});

var CouponExchangePlace = React.createClass({
    baseFilterType : 0,
    filterType : 0,
    onBtnSort : function(e) {
        var $cover = jQuery('.coupon .contentsScroll .modal-cover');
        console.log($cover);
        var $btnTarget = jQuery(ReactDOM.findDOMNode(this.refs['btn']));

        $btnTarget.toggleClass('active');
        if ($btnTarget.attr('class').match('active')) {
            $cover.css('display','block').transition({opacity:0.5,duration:300});
        } else {
            $cover.transition({opacity:0, duration:300}).transition({display:'none'});
        }
    },

    onBtnOkSort : function(idx) {
        var _this = this,
            $setTxtArea = jQuery('.order .list span.title'),
            setTxt = '';

        _this.onBtnSort();
        _this.filterType = idx;
        switch (idx) {
            case 0 :
                setTxt = '거리순';
                break;
            case 1 :
                setTxt = '인기순';
                break;
            case 2 :
                setTxt = '마감임박순';
                break;
            case 3 :
                setTxt = 'min 낮은순';
                break;
        }

        if (_this.baseFilterType != _this.filterType) {
            _this.baseFilterType = _this.filterType;
            $setTxtArea.text(setTxt);
            _this.props.onChangeFilterCoupon();
        }

    },
    onShowFirst : function() {

    },
    onShow : function() {

    },
    render : function () {
        return (
            <div className="place">
                <div className="place-inner fix">
                    <div className="order" ref="btn">
                        <div className="list">
                            <a href="javascript:void(0);" onClick={this.onBtnSort}>
                                <div className="btn-sort">
                                    <p>
                                        <strong><em></em><span></span></strong>
                                    </p>
                                </div>
                                <span className="title">거리순</span>
                                <i className="fa fa-caret-down"></i>
                            </a>
                        </div>
                        <ul className="key-list">
                            <li><a href="javascript:void(0);" onClick={this.onBtnOkSort.bind(this, 0)}>거리순</a></li>
                            <li><a href="javascript:void(0);" onClick={this.onBtnOkSort.bind(this, 1)}>인기순</a></li>
                            <li><a href="javascript:void(0);" onClick={this.onBtnOkSort.bind(this, 2)}>마감임박순</a></li>
                            <li><a href="javascript:void(0);" onClick={this.onBtnOkSort.bind(this, 3)}>min 낮은순</a></li>
                        </ul>
                    </div>
                    <div className="location">
                        <a className="btn-title-location" href="javascript:void(0);">내위치</a>
                        <a className="btn-location" onClick={this.props.onBtnLocationCoupon} href="javascript:void(0);">{this.props.region}</a>
                    </div>
                </div>
            </div>
        )
    }
});

var CouponList = React.createClass({
    available : 'n',
    componentDidUpdate : function() {
        var _this = this;
        var couponListContainer = ReactDOM.findDOMNode( this.refs['couponListContainer'] );

        $(couponListContainer).unbind( 'scroll').bind( 'scroll', function() {
            $this = $(this);
            if( $this.scrollTop() + $this.innerHeight() >= $this[0].scrollHeight ) {
                _this.props.onScrollEnd();
            }
        });
    },

    onTouchStart : function( event ) {
        event.nativeEvent.preventDefault();
    },

    showAbleCoupon : function() {
        var $targetBtn = jQuery('.sort-coupon .btn-coupon-view'),
            _this = this;

        $targetBtn.toggleClass('active');
        if ($targetBtn.attr('class').match('active')) {
            $targetBtn.text('모든 쿠폰 보기');
            _this.available = 'y';
        } else {
            $targetBtn.text('교환가능 쿠폰만 보기');
            _this.available = 'n';
        }

        _this.props.onChangeAbleCoupon();
    },

    render : function() {
        var _this =this,
            emptyLayout = function() {
                return (
                    <div className="no-data">
                        <div className="no-data-ment">
                            <p className="text-type2">교환가능한 쿠폰이 없습니다.</p>
                        </div>
                    </div>
                );
            },

            listLayout = function() {
                return _this.props.list.map(function(info, idx) {
                    return (<CouponInfo info={info} key={info.coupon_master_idx} />)
                })
            };

        return(
            <div className="contentsScroll" ref="couponListContainer">
                <div className="sort-coupon">
                    <a className="btn-coupon-view" onClick={this.showAbleCoupon} href="javascript:void(0);">교환가능 쿠폰만 보기</a>
                </div>
                <div className="coupon-list">
                    <ul className="couponbox">
                        { this.props.list.length == 0 && emptyLayout() }
                        { this.props.list.length != 0 && listLayout() }
                    </ul>
                </div>
                <div className="modal-cover" ref="couponlist-cover" onTouchStart={self.onTouchStart} style={{display:'none'}}></div>
            </div>
        );
    }
});

var CouponInfo = React.createClass({
    goCouponInfo : function() {

    },
    render : function() {
        var _this = this,
            _contents_coupon=null,
            _coupon_kind = {cls:'',txt:''},
            _cafe_icon = {cls:'',txt:'',bg:''},
            coupon = _this.props.info;

        if(coupon.coupon_type==1) { //할인
            _coupon_kind.cls = ' discount';
            _coupon_kind.txt = 'coupon 할인';
        } else if(coupon.coupon_type==2) { //증정
            _coupon_kind.cls = ' freebies';
            _coupon_kind.txt = 'coupon 사은품';
        } else if(coupon.coupon_type==3) { //1+1
            _coupon_kind.cls = ' plus';
            _coupon_kind.txt = 'coupon 플러스';
        } else { //무료
            _coupon_kind.cls = ' free';
            _coupon_kind.txt = 'coupon 무료';
        }

        var _background={
                'background-image':'url('+coupon.coupon_image_s+')'
            },
            _cafe_background={
                'background-image':'url('+coupon.cafe_logo+')'
            };

        // cafe_idx에 값이 있으면 망할 한아름 로고 추가. 나중에 작업할 것.
        if(coupon.cafe_idx > "0") {
            //_cafe_icon = <span className="hanareum" style={_cafe_background}>한아름 제휴</span>;
            _cafe_icon.cls = 'hanareum';
            _cafe_icon.txt = '한아름 제휴';
            _cafe_icon.bg = _cafe_background;
            //<span className={_cafe_icon.cls} style={_cafe_icon.bg}>{_cafe_icon.txt}</span>
        }

        return (
            <li data-coupon-idx={_this.props.info.coupon_master_idx}>
                <div className="coupon-wrap fix">
                    <div className={"coupon-kind"+_coupon_kind.cls}>{_coupon_kind.txt}</div>
                    <div className="coupon-balloons">
                        <span className="coupon-shop-name">{coupon.shop_name}</span>
                        <p className="coupon-detail">{coupon.coupon_master_name}</p>
                        <span className="coupon-until">{coupon.coupon_enddate}</span>
                    </div>
                    <div className="coupon-min">
                        <div className="minbox">
                            <span className="min">{coupon.coupon_min_point}</span>
                            <span className="unit">min</span>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
});