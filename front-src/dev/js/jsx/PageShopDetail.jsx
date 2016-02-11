var PageShopDetail = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            shopinfoFromShoplist : null,
            shopInfo : null,
            couponInfo : [],
            reviewInfo : [],
            sameCategoryShopList : [],
            minInfo : null,
            imageInfo : [],
            avg : 1,
            totalCount : 1,
            totalPage : 1
        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
    },

    handleClick : function()
    {
        UI.slidePage( 'BOOKMARK' );
    },

    onShowFirst : function()
    {
        console.log( 'PageShopDetail::onShowFirst' );
    },

    onBeforeShow : function( param )
    {
        var self = this;

        self.setState(
        {
            shopinfoFromShoplist:param.shopInfo,
            shopInfo : null,
            couponInfo : [],
            reviewInfo : [],
            sameCategoryShopList : [],
            minInfo : null,
            imageInfo : [],
            avg : 0,
            reviewCount : 0,
            totalPage : 1
        });

        var params =
        {
            latitude : param.shopInfo.shop_latitude,
            longitude : param.shopInfo.shop_longitude,
            u_idx : USER.info.data.u_idx,
            shop_idx : param.shopInfo.shop_idx
        };

        MODEL.get( API.SHOP_DETAIL, params, function( ret )
        {
            if( ret.success )
            {
                console.log( '매장정보 : ', param.shopInfo );
                console.log( '매장상세정보 : ', ret.data[0] );
                var newState =
                {
                    shopInfo : ret.data[0].shop_info[0],
                    couponInfo : ret.data[0].shop_coupon,
                    reviewInfo : ret.data[0].shop_review,
                    sameCategoryShopList : ret.data[0].shop_category,
                    minInfo : ret.data[0].user_min[0],
                    imageInfo : ret.data[0].Shop_Image,
                    avg : ret.data[0].Avg,
                    reviewCount : ret.data[0].tcnt,
                    totalPage : ret.data[0].totalPage
                };
                self.setState( newState );

            }
        });
    },

    render : function()
    {
        var self = this;
        var title = '매장 상세정보';

        var score = 0;
        var reviewCount = 0;
        var totalPage= 0;

        if( self.state.avg )
            score = self.state.avg;

        if( self.state.reviewCount )
            reviewCount = self.state.reviewCount;

        if( self.state.totalPage )
            totalPage = self.state.totalPage;

        if( self.state.shopinfoFromShoplist != null )
            title = self.state.shopinfoFromShoplist.shop_name;

        var shopIndex = 0;
        if( this.state.shopinfoFromShoplist )
            shopIndex = self.state.shopinfoFromShoplist.shop_idx;
        return (
            <div className="page page-shopdetail" >
                <PageHeader title={title} type="BACK_MENU_LIST" />
                <div className="page-contents" >
                    <ShopDetailTopInfo shopinfoFromShoplist={self.state.shopinfoFromShoplist} shopInfo={self.state.shopInfo} minInfo={self.state.minInfo} counponInfo={self.state.couponInfo}/>
                    <div className="shop-tab">
                        <div className="shop-tab-inner fix">
                            <a className="tab-coupon active" href="javascript:void(0);">쿠폰</a>
                            <a className="tab-shop" href="javascript:void(0);">매장정보</a>
                            <a className="tab-review" href="javascript:void(0);">리뷰</a>
                        </div>
                    </div>
                    <ShopDetailPointInfo minInfo={self.state.minInfo} shopInfo={self.state.shopinfoFromShoplist}/>
                    <ShopDetailCouponInfo couponInfo={self.state.couponInfo} />
                    <ShopDetailShopInfo {...self.state.shopinfoFromShoplist}/>
                    <ShopDetailReview reviewInfo={self.state.reviewInfo} score={score} reviewCount={reviewCount} totalPage={totalPage} shopInfo={self.state.shopinfoFromShoplist}/>
                    <ShopDetailSimilarShop shopList={self.state.sameCategoryShopList} />
                </div>
            </div>
        );
    }
});

var ShopDetailTopInfo = React.createClass(
{
    render : function()
    {
        var self = this;

        var shopIndex = 0;
        var minSaveClass = ' no';
        var couponClass = ' no';
        var coinExchangeClass = ' no';
        var coinUseClass = ' no';
        var bookmarkClass = '';
        var cafeStyle = null;

        var shopLogo = '/front-src/release/images/shop_logo_empty.png';
        var shopMainImage = '/front-src/release/images/default_shop_main_image.png';

        // 북마크 및 상단 아이콘 리스트, 로고 설정
        if( self.props.shopinfoFromShoplist != null )
        {
            shopIndex = self.props.shopinfoFromShoplist.shop_idx;
            if( self.props.shopinfoFromShoplist.shop_min_save_yn == 'Y' )
                minSaveClass = '';
            if( self.props.shopinfoFromShoplist.shop_coin_use_yn == 'Y' )
                coinExchangeClass = '';
            if( self.props.shopinfoFromShoplist.bookmark_idx > 0 )
                bookmarkClass = ' active';
            shopLogo =  self.props.shopinfoFromShoplist.shop_logo_image;
        }

        if( self.props.couponInfo != null )
        {
            if( self.props.couponInfo.length > 0 )
                couponClass = '';
        }

        // 매장 메인 이미지 설정
        if( self.props.shopInfo )
        {
            shopMainImage = self.props.shopInfo.shop_main_image;
        }

        // 카페정보가 있으면 상단 아이콘 리스트에 카페 아이콘 추가
        if( self.props.minInfo )
        {
            if( self.props.minInfo.cafe_idx > 0 )
            {
                cafeStyle =
                {
                    'backgroundImage' : 'url('+self.props.minInfo.cafe_logo+')',
                    'backgroundPosition' : '0 0',
                    'backgroundSize' : '20px 20px'
                };
            }
        }

        return (
            <div id="shop-detail">
                <div className="shop-imgbox item-list-box" >
                    <div className="big-img">
                        <img src={shopMainImage} alt="" />
                    </div>

                    <div className="detail-logo">
                        <div className="logo"><img src={shopLogo} alt="" /></div>
                        <div className="logo-bar"><img src="/front-src/release/images/shop_detail_bar.svg" alt="" width="100%" /></div>
                    </div>

                    <ul className="item-icons fix">
                        <li className={"min-save"+minSaveClass}><span>min 적립</span></li>
                        <li className={"coupon"+couponClass}><span>쿠폰사용</span></li>
                        <li className={"coin"+coinExchangeClass}><span>코인교환</span></li>
                        { cafeStyle != null && <li className="remain"><span style={cafeStyle}>코인교환</span></li> }
                    </ul>

                    <div className={"bookmark"+bookmarkClass}><a href="javascript:void(0)"><i className="fa fa-heart-o"></i></a></div>
                    <div className="shop-gallery" ><a href="javascript:void(0);"><strong><em></em><span></span></strong></a></div>
                </div>


            </div>
        );
    }
});

var ShopDetailPointInfo = React.createClass(
{
    render : function()
    {
        var self = this;

        var status = 8;
        var exchangeStatus = 'exchangeStatus1';
        var minStatus = 'min-exchange disable';
        var buttonStatus = 'coin-button';
        var refreshCycle = 0;
        var coinRate = 0;
        var type = 1;
        var exchangeableMin = 0;

        if( self.props.shopInfo != null )
            coinRate = parseInt( self.props.shopInfo.shop_coin_rate ) * 10;

        if( self.props.minInfo != null )
        {
            status = self.props.minInfo.ExchangeStatus;
            exchangeableMin = self.props.minInfo.ExchangeableMin;

            console.log( 'minInfo : ', self.props.minInfo );
            // 상태
            exchangeStatus = 'exchangeStatus'+self.props.minInfo.ExchangeStatus;

            //
            if( self.props.minInfo.ExchangeStatus == 7 || self.props.minInfo.ExchangeStatus == 2 )
                minStatus = 'min-exchange active';
            if( self.props.minInfo.ExchangeStatus == 1 )
                minStatus = 'min-exchange';

            //
            if( self.props.minInfo.ExchangeStatus == 7 || self.props.minInfo.ExchangeStatus == 6 || self.props.minInfo.ExchangeStatus == 5)
                buttonStatus = 'coin-button disable';

            if( self.props.minInfo.ExchangeStatus == 4 )
                type = 2;
        }

        var premiumLayout = function()
        {
            return (
                <div className="coin-day-state">
                    <strong className="d-day">{refreshCycle}</strong>
                    <span className="day">day</span>
                </div>
            );
        }

        return (
            <div className={"premium-shop-state type"+type}>
                <div className="premium-top">
                    { status != 8 && <span className="coin-premium">프리미엄 코인 매장</span> }
                    <p>본 매장은 <span>10 min</span> 마다 <span>{coinRate} coin</span> 적립이 가능합니다!</p>
                    <a className="coin-state-guide" href="javascript:void(0);">코인 관련 안내 모달 오픈</a>
                </div>
                <div className="coin-state">
                    <div className="coin-state-inner">
                        <div className={exchangeStatus}>
                            <div className={minStatus}>
                                <div className="min-state" onClick={UI.slidePage.bind(null,'EXCHANGE_COIN')}>
                                    <strong>{ exchangeableMin }</strong>
                                    <span>min</span>
                                </div>
                                <a className="btn-exchange-able" href="javascript:void(0);">코인 교환 가능</a>
                                <a className="btn-exchange-disable">코인 교환 불가능</a>
                            </div>
                            <div className="coin-day">
                                { status != 8 && premiumLayout() }
                            </div>
                            <div className={buttonStatus}>
                                <a className="btn-coin-useful" href="javascript:void(0);" onClick={UI.slidePage.bind(null,'USE_COIN')}>코인사용 가능</a>
                                <a className="btn-coin-useless">코인사용 불가능</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var ShopDetailCouponInfo = React.createClass(
{
    render : function()
    {
        var self = this;
        var couponListLayout = function()
        {
            return self.props.couponInfo.map( function( info, idx )
            {
                console.log( '쿠폰정보 : ', info );
                var couponType, couponText;
                var type = parseInt( info.coupon_type );
                switch( type )
                {
                    case 1 :
                        couponType = 'coupon-kind discount';
                        couponText = 'coupon 할인';
                        break;
                    case 2 :
                        couponType = 'coupon-kind freebies';
                        couponText = 'coupon 사은품';
                        break;
                    case 3 :
                        couponType = 'coupon-kind plus';
                        couponText = 'coupon 플러스';
                        break;
                    case 4 :
                        couponType = 'coupon-kind free';
                        couponText = 'coupon 무료';
                        break;
                }

                return (
                    <li data-coupon-master-idx={info.coupon_master_idx} key={info.coupon_master_idx}>
                        <div className="coupon-wrap fix">
                            <div className={couponType}>{couponText}</div>
                            <div className="coupon-balloons">
                                <span className="coupon-shop-name">{info.coupon_master_name}</span>
                                <p className="coupon-detail">{info.coupon_master_description}</p>
                                <span className="coupon-until">{info.coupon_enddate}까지</span>
                            </div>
                            <div className="coupon-min">
                                <div className="minbox">
                                    <span className="min">{info.coupon_min_point}</span>
                                    <span className="unit">min</span>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            });
        };

        var couponEmptyLayout = function()
        {
            return (
                <li className="no-coupon-data">
                    <div className="no-data">
                        <p>현재 쿠폰이 없습니다.</p>
                    </div>
                </li>
            );
        };

        return (
            <div className="coupon-info tab-contents">
                <h2 className="tab-title">쿠폰</h2>
                <ul className="couponbox">
                    {self.props.couponInfo.length == 0 && couponEmptyLayout()}
                    {self.props.couponInfo.length != 0 && couponListLayout()}
                </ul>
            </div>
        )
    }
});

var ShopDetailShopInfo = React.createClass(
{
    render : function()
    {
        return (
            <div className="shop-info tab-contents">
                <h2 className="tab-title">매장정보</h2>
                <div className="tb-shop-info">
                    <table>
                        <caption>매장정보</caption>
                        <tbody>
                        <tr>
                            <th scope="row">주소</th>
                            <td>{this.props.shop_address_detail}</td>
                        </tr>
                        <tr>
                            <th scope="row">전화번호</th>
                            <td>{this.props.shop_phone}</td>
                        </tr>
                        <tr>
                            <th scope="row">영업시간</th>
                            <td>{this.props.shop_open_time}</td>
                        </tr>
                        <tr>
                            <th scope="row">휴무일</th>
                            <td>{this.props.shop_holiday}</td>
                        </tr>
                        <tr>
                            <th scope="row">홈페이지</th>
                            <td className="shop-url"><a href="javascript:void(0);" target="_blank">{this.props.shop_url}</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <a className="btn-shop-map" href="javascript:void(0);">지도로 가기</a>
                    <a className="btn-phone" href={"tel:"+this.props.shop_phone}>전화하기</a>
                </div>
                <div className="intro">
                    {this.props.shop_description}
                </div>
            </div>
        );
    }
});

var ShopDetailReview = React.createClass(
{
    render : function()
    {
        var self = this;

        var fillScoreRate = self.props.score*20+'%';
        var averageScore = self.props.score;
        var reviewCount = self.props.reviewCount;
        var totalPage = self.props.totalPage;

        var adminReplyLayout = function( info, idx )
        {
            if( info.admin_review_contents != null )
            {
                var regDate = info.admin_review_date.substring( 0, 10 );
                return (
                    <div className="reply fix" >
                        <div className="thumbbox">
                            <i className="fa fa-level-up fa-3"></i>
                            <span className="thumb" style={{backgroundImage:'url('+self.props.shopInfo.shop_logo_image+')'}}></span>
                        </div>
                        <div className="desc-wrap">
                            <div className="desc">
                                {info.admin_review_contents}
                            </div>
                            <div className="writer-info fix">
                                <span>{regDate}</span>
                            </div>
                        </div>
                    </div>
                );
            }
            else
                return;
        };

        var reviewListLayout = function()
        {
            return self.props.reviewInfo.map( function( info, idx )
            {
                var reviewScoreFillRate = info.grade*20+'%';
                var regDate = info.review_date.substring( 0, 10 );
                var replyLayout = adminReplyLayout( info, idx );

                return (
                    <div key={info.review_idx}>
                        <div className="comment fix" >
                            <div className="thumbbox">
                                <span className="thumb" style={{backgroundImage:'url('+info.review_image+')'}}></span>
                            </div>
                            <div className="desc-wrap">
                                <div className="star-score">
                                    <span className="star"><strong className="rate" style={{width:reviewScoreFillRate}}></strong></span>
                                </div>
                                <div className="desc">
                                    {info.review_contents}
                                </div>
                                <div className="writer-info fix">
                                    <span>{regDate}</span>
                                    <span className="item-user">{info.usr}</span>
                                    { info.u_idx != USER.info.data.u_idx && <span><a href="javascript:void(0);" className="btn-report">신고하기</a></span> }
                                </div>
                                <div className="alter-del">
                                    { info.u_idx == USER.info.data.u_idx && <a href="javascript:void(0);" className="btn-del">삭제</a> }
                                </div>
                            </div>
                        </div>
                        {replyLayout}
                    </div>
                );
            });
        };

        return(
            <div className="review-info tab-contents">
                <h2 className="tab-title">리뷰</h2>
                <div className="review-total">
                    <div className="star-score">
						<span className="star">
							<strong className="rate" style={{width:fillScoreRate}}></strong><span className="score-number"><em>{averageScore}</em><span> / 5</span></span>
						</span>
                    </div>
                    <div className="score-info">
                        <span>{reviewCount}</span>개의 리뷰가 등록되어 있습니다.
                    </div>
                    <a className="btn-review" href="javascript:void(0);">리뷰작성하기</a>
                </div>
                <div>
                    <div className="review">
                        <div className="review-list">
                            { self.props.reviewInfo != null && reviewListLayout()}
                        </div>
                    </div>
                    <div className="paging">
                    </div>
                </div>
            </div>
        );
    }
});

var ShopDetailSimilarShop = React.createClass(
{
    render : function()
    {
        var self = this;
        console.log( '유사매장 : ', self.props.shopList );
        var thumbListLayout = function()
        {
            return self.props.shopList.map( function( info, idx )
            {
                var dist = info.dis;
                if( dist > 1000 )
                    dist = ( info.dis / 1000 ).toFixed(1) + 'km';
                else
                    dist = info.dis + 'm';

                return (
                    <div className="thumb" key={info.shop_idx}>
                        <a href="javascript:void(0);">
                            <span className="other-shop-logo" style={{backgroundImage:'url('+info.shop_logo_image+')'}}></span>
                            <span className="txt"><em>{dist}</em><strong>{info.shop_name}</strong></span>
                        </a>
                    </div>
                );

            });
        };

        return (
            <div className="other-shop">
                <div className="slider slider-other-shop">
                    <div className="other-shop-container">
                        { thumbListLayout() }
                    </div>
                </div>
            </div>
        );
    }
});