/*********************************************************************************
 * shoplist tab class
 * html template
 *********************************************************************************/
var ShopTab = React.createClass({
    componentWillMount:function() {
    },
    render : function () {
        var _contents = null;
            _contents = <ShopTab />;

        return (
            <div className="category">
                <ul className="category-inner fix">
                    <li><a className="all active" href="javascript:void(0);"><span className="icon"><i className="fa fa-check-circle"></i></span><span className="title">모두</span></a></li>
                    <li><a className="food" href="javascript:void(0);"><span className="icon"><i className="fa fa-cutlery"></i></span><span className="title">음식</span></a></li>
                    <li><a className="drink" href="javascript:void(0);"><span className="icon"><i className="fa fa-coffee"></i></span><span className="title">음료</span></a></li>
                    <li><a className="beauty" href="javascript:void(0);"><span className="icon"><i className="fa fa-scissors"></i></span><span className="title">뷰티</span></a></li>
                    <li><a className="life" href="javascript:void(0);"><span className="icon"><i className="fa fa-smile-o"></i></span><span className="title">생활</span></a></li>
                    <li><a className="delivery" href="javascript:void(0);"><span className="icon"><i className="fa fa-phone"></i></span><span className="title">주문</span></a></li>
                    <li><a className="edu-health" href="javascript:void(0);"><span className="icon"><i className="fa fa-stethoscope"></i></span><span className="title">교육/의료</span></a></li>
                </ul>
            </div>
        )
    }
});

/*********************************************************************************
 * shoplist sort class
 * html template
 *********************************************************************************/
var ShopSort = React.createClass({
    componentDidMount:function() {
        jQuery('.sort-sidebar').hide();

        setTimeout(function() {
            jQuery('.sort-sidebar').show();
        },1000);
    },
    render : function () {
        var _contents = null;
        _contents = <ShopSort />;

        return (
            <div className="sort-area">
                <div className="btn-sort">
                    <a href="javascript:void(0);">
                        <strong><em></em><span></span></strong>
                    </a>
                </div>
                <div className="sort-sidebar">
                    <div className="sort-group">
                        <strong className="sort-title">기본정렬</strong>
                        <div className="inputbox-group">
                            <div className="inp-radio active">
                                <input type="radio" name="basic" id="rdo1-1" checked="checked" value="1" /><label for="rdo1-1"><span className="text">거리순으로 정렬</span><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                            <div className="inp-radio">
                                <input type="radio" name="basic" id="rdo1-2" value="2" /><label for="rdo1-2"><span className="text">인기순으로 정렬</span><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                        </div>
                    </div>

                    <div className="sort-group">
                        <strong className="sort-title">가맹점 구분</strong>
                        <div className="inputbox-group">
                            <div className="inp-radio active">
                                <input type="radio" name="affiliate" id="rdo2-1" checked="checked" value="all" /><label for="rdo2-1"><span className="text">전체 가맹점 보기</span><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                            <div className="inp-radio">
                                <input type="radio" name="affiliate" id="rdo2-2"  value="coin" /><label for="rdo2-2"><span className="text">코인교환 가맹점</span><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                            <div className="inp-radio">
                                <input type="radio" name="affiliate" id="rdo2-3" value="coupon" /><label for="rdo2-3"><span className="text">쿠폰사용 가맹점</span><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                        </div>
                    </div>

                    <a className="btn-sort-enter" href="javascript:void(0);">확인</a>
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * shoplist list class
 * html template
 *********************************************************************************/
var ShopLists = React.createClass(
{
    url:loc[5].api[1],
    type:loc[5].type,
    method:'post',
    options:
    {
        'u_idx':(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
        'shop_category':'',
        'page':1,
        totalPage:1
    },
    newList:[],
    slickSpeed:100,

    getInitialState: function()
    {
        return {shop_category:'',page:1,list:[''],totalPage:1};
    },

    componentWillMount:function()
    {
        jQuery('.header-inner h1 .my-location').text('');

        //#/shop-map에서 선택한 카테고리, 위치 정보가 존재하는지 여부 판단

        // 선택한 카테고리, 위치정보가 없으면
        if(!jQuery('.header').data('shoplist'))
        {
            //shoplist data가 존재하지 않으면 데이터값 초기화 및 app 위치값을 가져와서 주소 정보를 저장한다.
            jQuery('.header').data('shoplist',{location:'',category:''});
            BRIDGE.getUserLocation( function( loc )
            {
                //_obj = { lat:loc.LATI, lng:log.LONGI };
                _obj={
                    lat:function() {
                        return loc.LATI;
                    },
                    lng:function() {
                        return loc.LONGI;
                    }

                };

                var geocoder = new google.maps.Geocoder();
                var latlng={lat:parseFloat(_obj.lat()),lng:parseFloat(_obj.lng())};

                geocoder.geocode( {'location':latlng}, function( results, status )
                {
                    // status
                    if( status == google.maps.GeocoderStatus.OK )
                    {
                        if ( results[1] )
                        {
                            jQuery('.header').data('shoplist',{location:results[0].address_components[1].short_name,category:''});
                            jQuery('.header-shop h1 .my-location').text(jQuery('.header').data('shoplist').location);
                        }
                    }
                });

            });
            this.prevData=true;
        }
        else // 카테고리 위치정보가 있으면...
        {
            this.prevData=false;
            //data값이 존재하면 데이터 값=shoplist의 주소 정보를 저장한다.
            jQuery('.header-shop h1 .my-location').text(jQuery('.header').data('shoplist').location);
        }
    },

    componentDidMount:function()
    {
        var _obj={};

        // search-list height
        jQuery('.search-list .slickSlide').css({
            'height':jQuery(window).height() - jQuery('.header').height() - jQuery('.category').height()
        });

        var _this = this,
            _react = React,
            _url = _this.url,
            _data = {},
            _txtCategory=null,
            _ele = this.getDOMNode(),
            _$category = jQuery('.category li a'),
            _reactAddons = React.addons,
            _maxCount = 0;

        _data = {
            u_idx:this.options.u_idx,
            latitude:'',
            longitude:'',
            search_latitude:'',
            search_longitude : '',
            shop_category:this.options.shop_category,
            page:_this.state.page,
            sort:this.options.sort,
            searchText:this.options.searchText,
            shop_type:this.options.shop_type
        };

        //location 주소 데이터가 존재하는지 확인
        if(jQuery('.header').data('shoplist').location.length<1) {
            //location 주소 데이터가 존재하지 않으면 임의로 '서초4동' 셋팅
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
            //location주소 데이터가 존재하고 category 데이터가 존재한다면 tab클래스의 활성화를 category에 맞춰 셋팅
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

        //페이지 로딩 시 app에서 가지고 있는 내 현재 위치를 이용하여 shoplist를 가져 온다.
        BRIDGE.getUserLocation(function (loc) {
            //loading and slide
            _data.latitude='';
            _data.longitude='';

            //location데이터가 존재하는지 여부 판단
            if(_this.prevData)
            {
                //location데이터가 존재하지 않는다면 app의 위치 정보를 셋팅
                _data.latitude=loc.LATI;
                _data.longitude=loc.LONGI;
            } else {
                //location데이터가 존재한다면 section.container에 저장된 위치 정보를 셋팅
                _data.latitude=jQuery('section.container').attr('data-lat');
                _data.longitude=jQuery('section.container').attr('data-lng');
            }


            //내 현재 위치 혹은 내가 선택한 위치에 대한 위치 정보를 section.container의 data속성에 저장
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

                    //setState excute react render
                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                        // gps 위치 얻기
                        _this.setState({
                            shop_category: _this.options.shop_category,
                            page: 1,
                            list: _newList.list[0].ResultData,
                            totalPage: _newList.list[0].totalpage
                        });

                    }

                    //tab slide
                    jQuery('.slickSlide').css({
                        'width': jQuery(window).width()
                    });
                    jQuery('.search-list')
                        .slick({
                            speed: _this.slickSpped,
                            touchThreshold: 5
                        })
                        .on('swipe', function (e, s, n) {
                            jQuery('.category a').removeClass('active')
                                .eq(s.currentSlide).addClass('active');

                            _txtCategory = jQuery('.category a').eq(s.currentSlide).text();
                            //현재 선택된 슬라이드의 텍스트를 api parameter에 맞게 converting
                            if (_txtCategory == '모두') {
                                _data.shop_category = '';
                            } else if (_txtCategory == '교육/의료') {
                                _data.shop_category = _txtCategory.split('/')[0];
                            } else {
                                _data.shop_category = _txtCategory;
                            }

                            _data.page=1;

                            jQuery('.container .search-list .slickSlide').css('overflow-y', 'hidden');

                            twCommonUi.getApiData(
                                {
                                    'url': _url,
                                    'type': _this.type,
                                    'method': _this.method,
                                    'data': _data
                                },
                                'html',
                                React.addons,
                                function (listType, resp, reactAddons) {
                                    var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                                    //setState excute react render
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        _this.setState({
                                            shop_category: _data.shop_category,
                                            page: 1,
                                            list: _newList.list[0].ResultData,
                                            totalPage: _newList.list[0].totalpage
                                        });
                                    }

                                    jQuery('.container .search-list .slickSlide').css('overflow-y', 'auto');

                                    //enable scroll to set data
                                    twCommonUi.scrollLoading = true;
                                }
                            );

                        });

                    //enable scroll to set data
                    twCommonUi.scrollLoading = true;
                }
            );
        });

        /**********************************
         * tab click
         *********************************/
        _$category.on('tap',function(e) {
            e.stopPropagation();
            /**********************************
             * param : target tag, tap
             *********************************/
            twCommonUi.tab(_$category,this,function(_txtName,$target) {
                jQuery('.search-list .slickSlide').scrollTop(0);
                //현재 선택된 슬라이드의 텍스트를 api parameter에 맞게 converting
                if (_txtName == '모두') {
                    _data.shop_category = '';
                } else if(_txtName == '교육/의료') {
                    _data.shop_category=_txtName.split('/')[0];
                } else {
                    _data.shop_category=_txtName;
                }

                _data.page=1;

                twCommonUi.getApiData(
                    {
                        'url':_url,
                        'type':_this.type,
                        'method':_this.method,
                        'data':_data
                    },
                    'html',
                    React.addons,
                    function(listType,resp,reactAddons) {
                        var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                            BRIDGE.getUserLocation(function (loc) {
                                _this.setState({
                                    shop_category: _data.shop_category,
                                    page: 1,
                                    list: _newList.list[0].ResultData,
                                    totalPage: _newList.list[0].totalpage
                                });

                            });
                        }

                        jQuery('.search-list')[0].slick.slickGoTo($target.closest('li').index());

                        //enable scroll to set data
                        twCommonUi.scrollLoading = true;
                    }
                );
            });
        });

        /**********************************
         * @param : scroll target
         **********************************/
        twCommonUi.listScrollLoading('.search-list .slickSlide',function() {
            //compare current page count to total page count
            if(_this.state.page>=_this.state.totalPage) {
                _data.page=1;
                twCommonUi.scrollLoading = false;
            } else {

                /**********************************
                 * @param : Shop_List parameters
                 **********************************/
                _data.page=_data.page+1;
                twCommonUi.getApiData(
                    {
                        'url':_url,
                        'type':_this.type,
                        'method':_this.method,
                        'data':_data
                    },
                    'append',
                    React.addons,
                    function(listType,resp,reactAddons) {

                        var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.

                            _this.setState({
                                shop_category: _newList.shop_category,
                                page: _this.state.page+1,
                                list: _newList.list,
                                totalPage: _newList.totalPage
                            });
                        }

                        //enable scroll to set data
                        twCommonUi.scrollLoading = true;
                    }
                );
            }
        });

        //정렬
        jQuery('.sort-sidebar .btn-sort-enter').on('tap',function(e) {
            e.stopImmediatePropagation();

            var _result_basic=null,
                _result_affiliate=null,
                _$select_category=jQuery('.category a.active'),
                _txt_category=_$select_category.text();

            _result_basic=jQuery('.inputbox-group input[name=basic]:checked').val();
            _result_affiliate=jQuery('.inputbox-group input[name=affiliate]:checked').val();

            _data.sort=_result_basic;
            _data.shop_type=_result_affiliate;

            if (_txt_category == '모두') {
                _data.shop_category = '';
            } else if(_txt_category == '교육/의료') {
                _data.shop_category=_txt_category.split('/')[0];
            } else {
                _data.shop_category=_txt_category;
            }

            var _$sort=jQuery('.sort-sidebar');

            _$sort.removeClass('active');
            if(jQuery('.innerShadow').size()>0) {
                _$shadow=jQuery('.innerShadow');
            } else {
                _$shadow=jQuery('.shadow');
            }

            _$shadow.css({
                'display':'none'
            });
            jQuery('.container').removeClass('overflowHidden');
            // TODO : 20151026 추가
            jQuery('.category').removeClass('disable');
            jQuery('.shadow-category').css('display','none');
            $(document).off('touchmove');

            twCommonUi.getApiData(
                {
                    'url':_url,
                    'type':_this.type,
                    'method':_this.method,
                    'data':_data
                },
                'html',
                React.addons,function(listType,resp,reactAddons) {
                    var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                    //setState excute react render
                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                        // gps 위치 얻기
                        BRIDGE.getUserLocation(function (loc) {
                            _this.setState({
                                shop_category: _data.shop_category,
                                page: 1,
                                list: _newList.list[0].ResultData,
                                totalPage: _newList.list[0].totalpage
                            });

                        });
                    }
                }
            );
        });

        /**********************************
         * 검색 히스토리
         *********************************/
        jQuery ('.header-shop .btn-search').on('tap',function(e) {
            e.stopPropagation();
            location.href='#/shop-search';
        });

        /**********************************
         * 지역설정
         *********************************/
        jQuery('.header-shop .title .my-location').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.showModal(jQuery('.modal.modal-location'));

            jQuery('.list-location a').off('tap');

            twCommonUi.commonAccordion('.list-location',function(_txt) {
                console.log(_txt);
                /*********************************************************************************
                 * 페이지 : 공통
                 * 위도,경도 값에 따라 주소를 가지고 옴
                 *********************************************************************************/
                var geocoder = null,
                    addr=null;

                geocoder=new google.maps.Geocoder();
                addr=jQuery(this).text();

                BRIDGE.getUserLocation(function (loc) {
                    _data.latitude = loc.LATI;
                    _data.longitude = loc.LONGI;

                    geocoder.geocode({'address': addr}, function (r, s) {
                        if (s == google.maps.GeocoderStatus.OK) {

                            _data.search_latitude = r[0].geometry.location.lat();
                            _data.search_longitude = r[0].geometry.location.lng();

                            jQuery('section.container').attr('data-lat', r[0].geometry.location.lat());
                            jQuery('section.container').attr('data-lng', r[0].geometry.location.lng());

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

                                    //setState excute react render
                                    console.log(_this.isMounted());
                                    if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                                        // gps 위치 얻기
                                        console.log(_newList.list[0].ResultData[0]);
                                        _this.setState({
                                            shop_category: _data.shop_category,
                                            page: 1,
                                            list: _newList.list[0].ResultData,
                                            totalPage: _newList.list[0].totalpage
                                        });

                                    }
                                }
                            );

                        }
                    });
                });
            });

        });

        //내위치 선택 및 리시트 갱신
        jQuery ('.header-shop .title .btn-title-location').on('tap',function(e) {

            BRIDGE.getUserLocation(function (loc) {
                console.log(loc);
                _data.latitude=loc.LATI;
                _data.longitude=loc.LONGI;
                _data.search_latitude=loc.LATI;
                _data.search_longitude=loc.LONGI;

                twCommonUi.getApiData(
                    {
                        'url':_url,
                        'type':_this.type,
                        'method':_this.method,
                        'data':_data
                    },
                    'html',
                    React.addons,
                    function(listType,resp,reactAddons) {
                        var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons);

                        //setState excute react render
                        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                            _this.setState({
                                shop_category: _data.shop_category,
                                page: 1,
                                list: _newList.list[0].ResultData,
                                totalPage: _newList.list[0].totalpage
                            });

                        }

                        var geocoder = new google.maps.Geocoder(),
                            latlng={lat:parseFloat(loc.LATI),lng:parseFloat(loc.LONGI)};

                        geocoder.geocode({'location':latlng},function(r,s) {
                            if (s == google.maps.GeocoderStatus.OK) {
                                if (r[1]) {
                                    jQuery('.header-shop h1 .my-location').text(r[0].address_components[1].short_name);
                                }
                            }
                        });

                        //enable scroll to set data
                        twCommonUi.scrollLoading = true;
                    }
                );
            });
        });

        /**********************************
         * connect beacon state modal
         * 위치검색 modal
         ********************************/
        twCommonUi.scriptLoadNext(
            [
                _domainJsx+'location.js'
            ]
            ,true
            ,function() {
                setTimeout(function() {
                    React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);
                },300)
            }
        );

        /**********************************
         * 지도페이지 이동
         *********************************/
        jQuery('.header-shop .btn-map').on('tap',function(e) {
            e.stopPropagation();

            //shoplist 선택 위치 정보와 카테고리 정보를 map data에 저장 shop-map에서 동일한 정보를 처리 할 수 있도록 저장
            jQuery('.header').data('map',{
                'location':jQuery('.header-shop .my-location').text(),
                'category':_data.shop_category,
                'latitude':jQuery('section.container').attr('data-lat'),
                'longitude':jQuery('section.container').attr('data-lng')
            });

            location.href='#/shop-map';
        });

        jQuery('.slick-cloned').empty();

        /**********************************
         * 리스트 선택 및 매장상세 이동
         *********************************/
        jQuery(document.body).on('tap','.item-list',function() {
            var _shopinfo={},
                _shopidx=jQuery(this).attr('data-shop-idx'),
                _datalat=jQuery(this).attr('data-lat'),
                _datalng=jQuery(this).attr('data-lng');

            _shopinfo={
                'shopidx':_shopidx,
                'lat':_datalat,
                'lng':_datalng
            };

            location.href='#/shop-detail/'+_shopidx+'?lat='+_datalat+'&lng='+_datalng;
        });

    },
    render : function () {

        var _this=this,
            _contents_all = null,
            _contents_food = null,
            _contents_drink = null,
            _contents_beauty = null,
            _contents_living = null,
            _contents_order = null,
            _contents_edu = null;
            createItem=function(shopList,idx) {
                var _backgroundImage={
                        'background-image':'url('+shopList.shop_logo_image+')'
                    },
                    _background_cafe={
                        'background-image':'url('+shopList.cafe_logo+')'
                    },
                    _coin_premium=null,
                    _floor=null,
                    _coupon_desc=null,
                    _coin_ratio=null,
                    _min_save=null,
                    _use_coupon=null,
                    _exchange_coin=null,
                    _remain=null,
                    _bookmark_class='',
                    _display_meter;

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

                if(shopList.cafe_idx>0) {
                    _remain=<li className="remain lazy" style={_background_cafe}>매장</li>;
                } else {
                    _remain=<li className="remain no lazy">매장</li>;
                }

                if(shopList.bookmark_idx>0) {
                    _bookmark_class=' active';
                }

                if( shopList.dis > 1000 )
                    _display_meter = ( shopList.dis / 1000 ).toFixed(1) + 'km';
                else
                    _display_meter = shopList.dis + 'm';

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
                            <div className={"bookmark"+_bookmark_class}>
                                <a href="javascript:void(0)"><i className="fa fa-heart-o"></i><span className="num">{shopList.bookmarkcnt}</span></a>
                            </div>
                            <div className="distance fix">
                                <div className="meter">{_display_meter}</div>
                                {_floor}
                            </div>
                        </div>
                    </div>
                );
            };

        if(this.state.list[0]!='') {
            if(this.state.list.length>0) {
                setContents(this, this.state.list.map(createItem));

            } else {
                setContents(this, <ShopListEmpty />);
            }
        }


        function setContents(_this,arg) {
            switch(_this.state.shop_category) {

                case '':
                    _contents_all = arg;
                    break;
                case '음식':
                    _contents_food = arg;
                    break;
                case '음료':
                    _contents_drink = arg;
                    break;
                case '뷰티':
                    _contents_beauty = arg;
                    break;
                case '생활':
                    _contents_living = arg;
                    break;
                case '주문':
                    _contents_order = arg;
                    break;
                case '교육':
                    _contents_edu = arg;
                    break;
            }
        }

        return (
            <div className="search-list">
                <div className="slickSlide">
                    {_contents_all}
                </div>
                <div className="slickSlide">
                    {_contents_food}
                </div>
                <div className="slickSlide">
                    {_contents_drink}
                </div>
                <div className="slickSlide">
                    {_contents_beauty}
                </div>
                <div className="slickSlide">
                    {_contents_living}
                </div>
                <div className="slickSlide">
                    {_contents_order}
                </div>
                <div className="slickSlide">
                    {_contents_edu}
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * shoplist main class
 * html template
 *********************************************************************************/
var ShopList = React.createClass({
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
                jQuery.localStorage.set('userIdx',userInfo.INDEX );
            });

        }
    },
    componentDidMount:function() {
        var _ele = this.getDOMNode();

        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();

    },
    render : function () {
        var _contentsTab = null,
            _contentsSort = null,
            _contentsShopLists=null,
            _contentsState=null,
            _styleTop={
                'top':0
            };

        _contentsTab = <ShopTab />;
        _contentsSort = <ShopSort />;
        _contentsShopLists = <ShopLists />;

        return (
            <div className={"page "+loc[5].pageName+" "+this.props.position}>
                {_contentsTab}
                <div className="shadow-category" style={_styleTop}></div>
                {_contentsSort}
                <div className="innerShadow"></div>
                {_contentsShopLists}

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
 * 위치선택
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
            <div className="slist">
                <ModalSetLocation {...props} />
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
                    <strong>죄송합니다!</strong>
                    <p>현재 주변에 이용가능한 매장이없습니다. <br />
                        더욱 더 열심히 하는 타임월렛이 되겠습니다.</p>
                </div>
            </div>
        )
    }
});

