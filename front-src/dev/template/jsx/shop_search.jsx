/**
 * Created by 남동훈 on 2015-10-27.
 */
/*********************************************************************************
 * 검색 class
 * html template
 *********************************************************************************/
var ShopSearch = React.createClass({

    contentsList:null,
    contentsHistoryList:null,
    componentDidMount:function() {
        var _this=this,
            _$j=jQuery('.search-history'),
            _data={};

        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();

        // TODO : search-history height
        _$j.height(
            jQuery(window).height() - jQuery('.header').height() - jQuery('.search-wordbox').height()  - jQuery('.delet-all').height()
        );

        /**********************************
         * 리스트페이지 이동
         *********************************/
        jQuery('.header-shopmap .btn-shop-list').on('tap',function(e) {
            e.stopPropagation();
            location.href='#/shop-list';
        });

        twSearch.initList(
            jQuery('.search-history'),[],function(_data) {

                _$j.append('<ul></ul>');
                Lazy(_data).each(function(i,k) {
                    _$j.find('ul').append(
                        '<li><a class="search-word" href="javascript:void(0);">'+i.search+'</a><a class="btn-del" href="javascript:void(0);">삭제</a></li>'
                    );
                });
            }
        )
        .searchEnter(jQuery('.search-wordbox'),function(iTxt) {
            //callback

            var _data={
                'u_idx': (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                'latitude': '',
                'longitude': '',
                'shop_category': '',
                'searchText': '',
                'sort': 1,
                'page': 1,
                'shop_type': 'all'
            };
            jQuery('.search-result').hide();

            _data.searchText=iTxt;

            twCommonUi.getApiData(
                {
                    url:loc[7].api[0],
                    type:loc[7].type,
                    method:'post',
                    data:_data
                },
                'html',
                React.addons,
                function(listType,resp,reactAddons) {
                    var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);

                    React.render(React.createElement(ShopSearchList, {data:_newList.list[0].ResultData}), document.getElementsByClassName('search-history-list')[0]);
                }
            );


            // TODO : search-history height
            _$j.height(
                jQuery(window).height() - jQuery('.header').height() - jQuery('.search-wordbox').height()  - jQuery('.delet-all').height()
            );

        })
        .selectItem('.search-result .search-word',function(iTxt) {
            //callback
            jQuery('.search-wordbox input').val(iTxt);
        })
        .eachDel('.search-result .btn-del',function(iTxt) {
            //callback
        })
        .clear(jQuery('.search-result .btn-search-clear'),function() {
            //callback
        });
    },
    render : function () {
        var _this=this,
            _contents = null,
            _contentsHistory=null;

            _contents = <ShopSearch />;
            _contentsHistory = <ShopSearchHistory />;

        return (
            <div className={"page "+loc[7].pageName+" "+this.props.position}>
                <div className="search-wordbox">
                    <div className="search-wordbox-inner fix">
                        <a className="btn-shop-search" href="javascript:void(0);"><i className="fa fa-search"></i></a>
                        <span className="inp-type2"><input type="search" placeholder="검색어를 입력하세요" /></span>
                    </div>
                </div>
                {_contentsHistory }

                <div className="search-history-list">
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * 검색 history class
 * html template
 *********************************************************************************/
var ShopSearchHistory = React.createClass({
    componentDidMount: function () {
        jQuery('.btn-history-hidden').on('tap',function() {
           jQuery('.search-result').hide();
            React.render(React.createElement(ShopSearchList, {data:[]}), document.getElementsByClassName('search-history-list')[0]);
        });
    },
    render: function () {
        return(
            <div className="search-result">
                <div className="delet-all">
                    <a className="btn-history-hidden" href="javascript:void(0);"><span>숨김</span></a>
                    <a className="btn-search-clear" href="javascript:void(0);"><span>모두</span></a>
                </div>
                <div className="search-history">
                </div>
            </div>
        )
    }
});

/*********************************************************************************
 * shopsearchlist state class
 * html template
 *********************************************************************************/
var ShopSearchList = React.createClass({
    componentDidMount:function() {
        //setTimeout(function() {
            jQuery('.twShop_search .search-history-list').css('height',jQuery(window).height()-jQuery('.search-wordbox').height()-jQuery('.header').height());
        //},300);

        /**********************************
         * @param : scroll target
         *********************************/

    },
    render:function() {
        var _contents=null,
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
                    _bookmark_class='';

                if(shopList.shop_coin_save_yn=='Y') {
                    _coin_premium=<span className="coin-premium">shopList.shop_name</span>;
                }

                if(shopList.shop_flore!='') {
                    _floor=<div className="floor">{shopList.shop_flore}F</div>;
                }

                if(shopList.coupon_master_name!='') {
                    _coupon_desc=<div><strong>쿠폰</strong><p>shopList.coupon_master_name</p></div>;
                } else {
                    _coupon_desc=<div className="use-no"><strong>쿠폰</strong><p>등록된 쿠폰이 없습니다.</p></div>;
                }

                if(shopList.coupon_use_yn!='N') {
                    _coin_ratio=<div><strong>코인</strong><p>{shopList.shop_coin_rate}min = {shopList.shop_coin_exchange_min}coin</p></div>;
                } else {
                    _coin_ratio=<div className="use-no"><strong>코인</strong><p>코인 교환이 종료되었습니다.</p></div>;
                }

                if(shopList.shop_min_save_yn=='Y') {
                    _min_save=<li className="min-save">min 적립</li>;
                } else {
                    _min_save=<li className="min-save no">min 적립</li>;
                }

                if(shopList.coupon_yn=='Y') {
                    _use_coupon=<li className="coupon">쿠폰사용</li>;
                } else {
                    _use_coupon=<li className="coupon no">쿠폰사용</li>;
                }

                if(shopList.shop_coin_use_yn=='Y') {
                    _exchange_coin=<li className="coin">코인사용</li>;
                } else {
                    _exchange_coin=<li className="coin no">코인사용</li>;
                }

                if(shopList.cafe_idx>0) {
                    _remain=<li className="remain lazy" style={_background_cafe}>매장</li>;
                } else {
                    _remain=<li className="remain no lazy">매장</li>;
                }

                if(shopList.bookmark_idx>0) {
                    _bookmark_class=' active';
                }

                return (
                    <div className="item-list fix" ref="item" data-shop-idx={shopList.shop_idx}>
                        <div className="item">
                            {_coin_premium}
                            <span className="shop-logo" style={_backgroundImage}></span>
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
                                <div className="meter">{shopList.dis}m</div>
                                {_floor}
                            </div>
                        </div>
                    </div>
                );
            };

        if(this.props.data) {
            if (this.props.data.length > 0) {
                    _contents = this.props.data.map(createItem);
            } else {
                _contents = <ShopSearchHistoryEmpty />
            }
        } else {
            _contents = <ShopSearchHistoryEmpty />
        }

        return (
            <div className="search-list-inner">
                {_contents}
            </div>
        )
    }
});

/*********************************************************************************
 * 검색 history empty class
 * html template
 *********************************************************************************/
var ShopSearchHistoryEmpty = React.createClass({
    componentDidMount: function () {
        //높이 설정 공통 부분
        //twCommonUi.setContentsHeight();
    },
    render: function () {
        return (
            <div className="no-data">
                <div className="no-data-ment">
                    <p>검색된 매장이없습니다.</p>
                </div>
            </div>
        )
    }
});
