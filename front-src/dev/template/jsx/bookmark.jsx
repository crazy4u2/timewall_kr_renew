/**************************************************************
 * 즐겨찾기 class
 *
 *************************************************************/
var BookmarkListWrap = React.createClass({
    url : loc[17].api[0],
    type : loc[17].type,
    method : 'post',
    options : {
        'u_idx':(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
        'latitude':_webBridge.ge.lat,
        'longitude':_webBridge.ge.lng,
        'searchText':'',
        'sort':'',
        'page':1
    },
    newList:[],
    getInitialState : function() {
        return {
            latitude:'',
            longitude:'',
            page:1,sort:'',
            searchText:'',
            list:[''],
            totalPage:1
        }
    },
    componentWillMount : function() {
        //jQuery('.header-inner h1 .my-location').text('');

        if(!jQuery('.header').data('shoplist')) {
            jQuery('.header').data('shoplist',{location:'',category:''});
            BRIDGE.getUserLocation(function (loc) {

                _obj={
                    lat:function() {
                        return loc.LATI;
                    },
                    lng:function() {
                        return loc.LONGI;
                    }

                };

                var geocoder = new google.maps.Geocoder(),
                    latlng={lat:parseFloat(_obj.lat()),lng:parseFloat(_obj.lng())};

                geocoder.geocode({'location':latlng},function(r,s) {
                    if (s == google.maps.GeocoderStatus.OK) {
                        if (r[1]) {
                            jQuery('.header').data('shoplist',{location:r[0].address_components[1].short_name,category:''});
                            jQuery('.header-shop h1 .my-location').text(jQuery('.header').data('shoplist').location);
                        }
                    }
                });

            });
            this.prevData=true;
        } else {
            this.prevData=false;
            jQuery('.header-shop h1 .my-location').text(jQuery('.header').data('shoplist').location);
        }
    },
    componentDidMount : function() {
        var _obj={};

        var _this = this,
            //_react = React,
            _url = _this.url,
            _data = {};
        _txtCategory=null,
            _ele = this.getDOMNode(),
            _$category = jQuery('.category li a'),
            _reactAddons = React.addons,
            _maxCount = 0;

        _data = {
            u_idx:this.options.u_idx,
            latitude:'',
            longitude:'',
            page:_this.state.page,
            sort:this.options.sort,
            searchText:this.options.searchText
        };

        //임시 주소 저장
        if(jQuery('.header').data('shoplist').location.length<1) {
            jQuery('.header').data('shoplist',{location:'서초4동',category:''});

            BRIDGE.getUserLocation(function (loc) {

                _obj={
                    lat:function() {
                        return loc.LATI;
                    },
                    lng:function() {
                        return loc.LONGI;
                    }

                };

                twCommonUi.getAddress(_obj);
            });

        } else {

            if (jQuery('.header').data('shoplist').category.length > 0) {
                _$category.removeClass('active');
                _$category.each(function (idx) {
                    if (jQuery(this).text().match(jQuery('.header').data('shoplist').category)) {
                        jQuery(this).addClass('active');
                    }
                });
            } else {
                _$category.closest('li').eq(0).find('a').addClass('active');
            }

        }

        BRIDGE.getUserLocation(function (loc) {
            //loading and slide
            _data.latitude='';
            _data.longitude='';

            if(_this.prevData) {
                _data.latitude=loc.LATI;
                _data.longitude=loc.LONGI;
            } else {
                _data.latitude=jQuery('section.container').attr('data-lat');
                _data.longitude=jQuery('section.container').attr('data-lng');
            }

            jQuery('section.container').attr('data-lat',_data.latitude);
            jQuery('section.container').attr('data-lng',_data.longitude);

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
                    console.log(_newList);
                    //setState excute react render
                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                        // gps 위치 얻기
                        _this.setState({
                            latitude: _data.latitude,
                            longitude: _data.longitude,
                            shop_category: _this.options.shop_category,
                            page: 1,
                            sort: '',
                            searchText: '',
                            list: _newList.list[0].ResultData,
                            totalPage: _newList.list[0].totalpage,
                            shop_type: 'all'
                        });

                    }
                    //enable scroll to set data
                    twCommonUi.scrollLoading = true;
                }
            );
        });

        /**********************************
         * 리스트 선택 및 매장상세 이동
         *********************************/
        jQuery(document.body).on('tap','.item-list',function() {
            var _shopidx=jQuery(this).attr('data-shop-idx'),
                _datalat=jQuery(this).attr('data-lat'),
                _datalng=jQuery(this).attr('data-lng');

            _shopInfo={
                'shopidx':_shopidx,
                'lat':_datalat,
                'lng':_datalng
            };

            location.href='#/shop-detail/'+_shopidx+'?lat='+_datalat+'&lng='+_datalng;
        });
        //console.log(window.location.href);
    },
    render : function() {
        var _this = this;
        createItem = function(shopList,idx){
            var _backgroundImage={
                'background-image':'url('+shopList.shop_logo_image+')'
            },
            _coin_premium=null,
            _floor=null,
            _coupon_desc=null,
            _coin_ratio=null,
            _min_save=null,
            _use_coupon=null,
            _exchange_coin=null,
            _remain=null,
            _bookmark_class='';

            if(shopList.shop_coin_save_yn=='Y') {
                _coin_premium=<span className="coin-premium">{shopList.shop_name}</span>;
            }

            if(shopList.shop_flore!='') {
                _floor=<div className="floor">{shopList.shop_flore}F</div>;
            }

            if(shopList.coupon_master_name!='') {
                _coupon_desc=<div><strong>쿠폰</strong><p>{shopList.coupon_master_name}</p></div>;
            } else {
                _coupon_desc=<div className="use-no"><strong>쿠폰</strong><p>등록된 쿠폰이 없습니다.</p></div>;
            }
            if(shopList.shop_coin_use_yn!='N') {
                _coin_ratio=<div><strong>코인</strong><p>10min <em><i className="fa fa-caret-right"></i></em> {shopList.shop_coin_rate * 10}coin</p></div>;
            } else {
                _coin_ratio=<div className="use-no"><strong>코인</strong><p>코인 교환이 종료되었습니다.</p></div>;
            }

            if(shopList.shop_min_save_yn=='Y') {
                _min_save=<li className="min-save lazy">min 적립</li>;
            } else {
                _min_save=<li className="min-save no lazy">min 적립</li>;
            }

            if(shopList.coupon_yn=='Y') {
                _use_coupon=<li className="coupon lazy">쿠폰사용</li>;
            } else {
                _use_coupon=<li className="coupon no lazy">쿠폰사용</li>;
            }

            if(shopList.shop_coin_use_yn=='Y') {
                _exchange_coin=<li className="coin lazy">코인사용</li>;
            } else {
                _exchange_coin=<li className="coin no lazy">코인사용</li>;
            }

            if(shopList.shop_name.length>0) {
                _remain=<li className="remain lazy">매장</li>;
            } else {
                _remain=<li className="remain no lazy">매장</li>;
            }

            if(shopList.bookmark_idx>0) {
                _bookmark_class=' active';
            }

            return (
                <div className="item-list item-list-box fix"  key={idx} data-shop-idx={shopList.shop_idx} data-lat={shopList.shop_latitude} data-lng={shopList.shop_longitude}>
                    <div className="item">
                        {_coin_premium}
                        <div className="shop-logo lazy" style={_backgroundImage}></div>
                    </div>

                    <div className="balloons">
                        <strong className="shop-name">{shopList.shop_name}</strong>
                        <div className="item-use">
                            {_coupon_desc}
                            {_coin_ratio}
                        </div>
                        <ul className="item-icons fix">
                            {_min_save}
                            {_use_coupon}
                            {_exchange_coin}
                            {_remain}
                        </ul>
                        <div className={"bookmark"+_bookmark_class+" bookmark-page"}>
                            <a href="javascript:void(0)"><i className="fa fa-heart-o"></i><span className="num">{shopList.bookmark_count}</span></a>
                        </div>
                        <div className="distance fix">
                            <div className="meter">{shopList.dis}m</div>
                            {_floor}
                        </div>
                    </div>
                </div>
            );
        };

        if(this.state.list[0]!='') {
            if(this.state.list.length>0) {
                console.log(this.state.list);
                var _bookmarkList = this.state.list.map(createItem);
            } else {
                var _empty = <ShopListEmpty />;
            }
        }

        return (
            <div className="contentsScroll">
                {_bookmarkList}
                {_empty}
            </div>
        )
    }
});

/*********************************************************************************
 * shoplist main class
 * html template
 *********************************************************************************/
var BookmarkList = React.createClass({
    componentWillMount:function() {

        var _os_type=0,
            _userIndex=-1;

        if (device.checkDeviceType() == 'android') {
            _os_type=1;
        } else if (device.checkDeviceType() == 'ios') {
            _os_type=2;
        } else {
            _os_type=0;
        }

        if(_os_type!=0) {
            BRIDGE.getUserInfo( function( userInfo ) {
                jQuery.localStorage.set('userIdx',userInfo.INDEX);
            });

        }
    },
    componentDidMount:function() {
        var _ele = this.getDOMNode();

        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        var h=jQuery(window).height()-jQuery('.header-shop').height()-jQuery('.category').height();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        if(h<jQuery('.sort-sidebar').height()) {
            jQuery('.sort-sidebar').height(h);
        }

    },
    render : function () {
        var _contentsShopLists=null;
        _contentsShopLists = <BookmarkListWrap />;

        return (
            <div className={"page "+loc[17].pageName+" "+this.props.position}>
                <div className="innerShadow"></div>
                {_contentsShopLists}
            </div>
        )
    }
});

/*********************************************************************************
 * shoplist main class
 * html template
 *********************************************************************************/
var ShopListEmpty = React.createClass({
    componentDidMount:function() {
    },
    render : function () {
        var _contentsEmpty = null;

        _contentsEmpty = <ShopListEmpty />;

        return (
            <div className="no-data">
                <div className="no-data-ment">
                    <p>즐겨찾기 목록이 없습니다.</p>
                </div>
            </div>
        )
    }
});