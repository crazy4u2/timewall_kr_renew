var SHOP_CATEGORY = ['all','음식', '음료', '뷰티', '생활', '주문', '교육' ];
var SHOP_TYPE = ['all', 'coin', 'coupon' ]; // 'all:전체, 'coin':코인교환가맹점, 'coupon':쿠폰사용가맹점
var PageShopList = React.createClass(
{
    loading : false,
    searchingLoc : { lati:0, longi:0 },

    getInitialState : function()
    {
        var state =
        {
            category : 0, // 선택된 카테고리 => 0:모두, 1:음식, 2:음료, 3:뷰티, 4:생활, 5:주문, 6:교육.의료
            sort : 1, // 정렬기준, 1:거리순, 2:인기순
            type : 0, // 필터, 0:모두, 1:코인, 2:쿠폰
            searchText : '',

            shopList : [], // 매장 리스트
            curPage : 1,
            totalPage : 1,

            region : '위치 확인중',
        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    getShopList : function( param, callback )
    {
        var self = this;
        self.loading = true;
        MODEL.get( API.SHOP_LIST, param, function( ret)
        {
            if( ret.success )
            {
                //console.log( 'list : ', ret.data[0].ResultData );
                if( ret.data[0].ResultCode == 1 )
                {
                    var list = ret.data[0].ResultData;
                    var page = ret.data[0].page;
                    var totalPage = ret.data[0].totalpage;

                    var result =
                    {
                        page : page,
                        totalPage : totalPage,
                        list : list
                    };
                    //console.log('PageShopList::getShopList:list:', result.list );

                    self.loading = false;
                    callback( result );
                }
                else // 데이터 오류
                {
                    alert( '매장정보 오류[ResultCode :'+ret.data[0].ResultCode+']' );
                    console.log( '매장정보를 가져오는중 오류[ResultCode :', ret.data[0].ResultCode,']' );
                    self.loading = false;
                    callback( null );
                }
            }
            else
            {
                // 네트워크 상황 or 서버 오류로 인해 데이터를 로딩하지 못했을 때 처리.
                self.loading = false;
                callback( null );
            }
        });
    },

    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );

        this.searchingLoc.lati = GPS.lati;
        this.searchingLoc.longi = GPS.longi;
    },

    onBtnLocation : function()
    {
        UI.openPopup( 'POP_SELECT_LOCATION', this.setSearcingLocation );
    },

    // 지역 설정 팝업으로 부터 호출됨.
    setSearcingLocation : function( regionName )
    {
        var self = this;
        this.setState({region:regionName});

        GPS.getLocationFromAddress( regionName, function( ret )
        {
            if( ret.success )
            {
                self.searchingLoc = ret.loc;
                var params =
                {
                    latitude : GPS.lati,
                    longitude : GPS.longi,
                    search_latitude : self.searchingLoc.lati,
                    search_longitude : self.searchingLoc.longi,
                    u_idx : USER.info.index,
                    page : 1, // 최초 페이지 1
                    shop_category : SHOP_CATEGORY[self.state.category],
                    searchText : '',
                    sort : self.state.sort,
                    shop_type : SHOP_TYPE[self.state.type]
                };

                self.getShopList( params, function( ret )
                {
                    var changingState =
                    {
                        page : ret.page,
                        totalPage : ret.totalPage,
                        shopList : ret.list
                    };
                    self.setState( changingState );
                });
            }
            else
                BRIDGE.appAlert( {TITLE:'안내', TEXT:'잘못된 주소입니다'} );
        });
    },

    onShowFirst : function()
    {
        var self = this;

        // 현재 위치명 표시
        GPS.getCurrentRegionName( function( ret )
        {
            self.setState( { region:ret.regionName} );
        });

        // 매장 리스트 표시
        var params =
        {
            latitude : GPS.lati,
            longitude : GPS.longi,
            search_latitude : this.searchingLoc.lati,
            search_longitude : this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            shop_category : SHOP_CATEGORY[this.state.category],
            searchText : '',
            sort : this.state.sort,
            shop_type : SHOP_TYPE[this.state.type]
        };

        this.getShopList( params, function( ret )
        {
            if( ret == null ) // 로딩 실패
                return;

            var changingState =
            {
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : ret.list
            };
            self.setState( changingState );
        });
    },

    onShow : function( param )
    {

    },

    // 카테고리 선택 시
    onChangeCategory : function( selectedCategory )
    {
        if( this.state.category == selectedCategory )
            return;

        this.setState({category:selectedCategory});

        var self = this;
        var params =
        {
            latitude : GPS.lati,
            longitude : GPS.longi,
            search_latitude : this.searchingLoc.lati,
            search_longitude : this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            shop_category : SHOP_CATEGORY[selectedCategory],
            searchText : '',
            sort : this.state.sort,
            shop_type : SHOP_TYPE[this.state.type]
        };

        console.log( '검색 param : ', params );
        this.getShopList( params, function( ret )
        {
            if( ret == null )
                return;

            var changingState =
            {
                category : selectedCategory,
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : ret.list
            };

            self.setState( changingState );
        });
    },

    onChangeFilter : function()
    {
        var filter = this.refs['filter-menu'];
        var sortOrder = filter.sortOrder;
        var filterType = filter.filterType;

        var self = this;
        var params =
        {
            latitude : GPS.lati,
            longitude : GPS.longi,
            search_latitude : this.searchingLoc.lati,
            search_longitude : this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : 1, // 최초 페이지 1
            shop_category : SHOP_CATEGORY[this.category],
            searchText : '',
            sort : sortOrder,
            shop_type : SHOP_TYPE[filterType]
        };

        this.getShopList( params, function( ret )
        {
            if( ret == null )
                return;

            var changingState =
            {
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : ret.list
            };

            self.setState( changingState );
        });
    },

    onBtnBookmark : function( shopIdx, bAdd )
    {
        var bookmarkIndex = 0;
        if( bAdd )
            bookmarkIndex = 100;

        var cnt = this.state.shopList.length;
        for( var i=0; i<cnt; i++)
        {
            var shopInfo = this.state.shopList[i];
            if( shopInfo.shop_idx == shopIdx )
            {
                var newList = this.state.shopList;
                newList[i].bookmark_idx = bookmarkIndex;
                if( bAdd )
                    newList[i].bookmarkcnt = newList[i].bookmarkcnt+1;
                else
                    newList[i].bookmarkcnt = newList[i].bookmarkcnt-1;

                this.setState( {shopList:newList});
            }
        }
    },

    onScrollEnd : function()
    {
        if( this.loading )
            return;

        if( this.state.page >= this.state.totalPage )
            return;

        var self = this;
        var params =
        {
            latitude : GPS.lati,
            longitude : GPS.longi,
            search_latitude : this.searchingLoc.lati,
            search_longitude : this.searchingLoc.longi,
            u_idx : USER.info.index,
            page : this.state.page + 1, // 최초 페이지 1
            shop_category : SHOP_CATEGORY[this.state.category],
            searchText : '',
            sort : this.state.sort,
            shop_type : SHOP_TYPE[this.state.type]
        };

        this.getShopList( params, function( ret )
        {
            if( ret == null )
                return;

            var changingState =
            {
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : self.state.shopList.concat( ret.list )
            };
            self.setState( changingState );
        });
    },

    render : function()
    {
        return (
            <div className="page page-shoplist" >
                <PageHeader title="매장리스트" type="MENU_LOC_SEARCH_MAP" ref="header" onBtnLocation={this.onBtnLocation} region={this.state.region}/>
                <PageContents className="shop-list-contents">
                    <ShopCategoryMenu onChangeCategory={this.onChangeCategory} category={this.state.category}/>
                    <ShopListFilter onChangeFilter={this.onChangeFilter} ref="filter-menu"/>
                    <ShopList list={this.state.shopList} onBtnBookmark={this.onBtnBookmark} onScrollEnd={this.onScrollEnd}/>
                </PageContents>
            </div>
        );
    }
});

var ShopListFilter = React.createClass(
{
    prevOrder : 1,
    prevType : 0,

    sortOrder : 1,
    filterType : 0,

    onBtnMenu : function(event)
    {
         var $btn = $( ReactDOM.findDOMNode( this.refs['btnSort'] ) );
         var $slide = $( ReactDOM.findDOMNode( this.refs['filterSlide'] ) );

         $btn.toggleClass( 'active' );
         if( $btn.attr('class').match('active') )
         {
             $('.shoplist-cover').css('display', 'block');
             $('.shoplist-cover').transition({opacity:0.5,duration:300});
             $slide.css('display','block');
             $slide.transition({right:'0%', easing:'snap', duration:300});
         }
         else
         {
             $('.shoplist-cover').transition({opacity:0, duration:300}).transition({display:'none'});
             $slide.transition({right:'-50%', easing:'snap', duration:300}).transition({display:'none'});
         }
    },

    onCheckSortOrder : function( order, event )
    {
        var $inputGroup = $(ReactDOM.findDOMNode( this.refs['inputbox-group_1'] ));
        var $checkbox = $(ReactDOM.findDOMNode( event.target ));

        $inputGroup.find('.inp-radio').removeClass('active');
        $inputGroup.find('input[type=radio]').prop('checked', false).attr('checked',false);
        $checkbox.closest('.inp-radio').addClass('active');
        $checkbox.prev('input[type=radio]').prop('checked',true).attr('checked',true);

        this.sortOrder = order;

    },

    onCheckFilterType : function( type, event )
    {
        var $inputGroup = $(ReactDOM.findDOMNode( this.refs['inputbox-group_2'] ));
        var $checkbox = $(ReactDOM.findDOMNode( event.target ));

        $inputGroup.find('.inp-radio').removeClass('active');
        $inputGroup.find('input[type=radio]').prop('checked', false).attr('checked',false);
        $checkbox.closest('.inp-radio').addClass('active');
        $checkbox.prev('input[type=radio]').prop('checked',true).attr('checked',true);

        this.filterType = type;
    },

    onBtnOk : function()
    {
        // 변경된 경우 만 호출.
        if( this.prevOrder != this.sortOrder || this.prevType != this.filterType )
        {
            this.prevOrder = this.sortOrder;
            this.prevType = this.filterType;

            this.props.onChangeFilter();
        }

        // 닫기
        $(ReactDOM.findDOMNode( this.refs['btnSort'] )).trigger('click');
    },

    render : function()
    {
        return (
            <div className="sort-area">
                <div className="btn-sort" onClick={this.onBtnMenu} ref="btnSort">
                    <a href="javascript:void(0);">
                     <strong><em></em><span></span></strong>
                    </a>
                </div>
                <div className="sort-sidebar contentsScroll" style={{display:'none'}} ref="filterSlide">
                    <div className="sort-group">
                        <strong className="sort-title">기본정렬</strong>
                        <div className="inputbox-group" ref="inputbox-group_1">
                            <div className="inp-radio active" ref="checksort_1">
                                <input type="radio" name="basic" id="rdo1-1" defaultChecked={true} value="1" />
                                <label htmlFor="rdo1-1" onClick={this.onCheckSortOrder.bind(this, 1)}>
                                    <span className="text">거리순으로 정렬</span>
                                    <span className="box"><em className="box-dot"></em></span>
                                </label>
                            </div>
                            <div className="inp-radio" ref="checksort_2">
                                <input type="radio" name="basic" id="rdo1-2" value="2" />
                                <label htmlFor="rdo1-2" onClick={this.onCheckSortOrder.bind(this, 2)}>
                                    <span className="text">인기순으로 정렬</span>
                                    <span className="box"><em className="box-dot"></em></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="sort-group">
                        <strong className="sort-title">가맹점 구분</strong>
                        <div className="inputbox-group" ref="inputbox-group_2">
                            <div className="inp-radio active" ref="checktype_1">
                                <input type="radio" name="affiliate" id="rdo2-1" defaultChecked={true} value="all" />
                                <label htmlFor="rdo2-1" onClick={this.onCheckFilterType.bind(this,0)}>
                                    <span className="text">전체 가맹점 보기</span>
                                    <span className="box"><em className="box-dot"></em></span>
                                </label>
                            </div>
                            <div className="inp-radio" ref="checktype_2">
                                <input type="radio" name="affiliate" id="rdo2-2"  value="coin" />
                                <label htmlFor="rdo2-2" onClick={this.onCheckFilterType.bind(this,1)}>
                                    <span className="text">코인교환 가맹점</span>
                                    <span className="box"><em className="box-dot"></em></span>
                                </label>
                            </div>
                            <div className="inp-radio" ref="checktype_3">
                                <input type="radio" name="affiliate" id="rdo2-3" value="coupon" />
                                <label htmlFor="rdo2-3" onClick={this.onCheckFilterType.bind(this,2)}>
                                    <span className="text">쿠폰사용 가맹점</span>
                                    <span className="box"><em className="box-dot"></em></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <a className="btn-sort-enter" href="javascript:void(0);" onClick={this.onBtnOk}>확인</a>
                </div>
            </div>
        );
    }
});

var ShopCategoryMenu = React.createClass(
{
    onClickCategory : function( idx )
    {
        this.props.onChangeCategory( idx );
    },

    render : function()
    {
        var classList = ['all', 'food', 'drink', 'beauty', 'life', 'delivery', 'edu-health'];
        classList[this.props.category] += ' active';

        return(
            <div className="category">
                <ul className="category-inner fix">
                    <li><a className={classList[0]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this,0)}><span className="icon"><i className="fa fa-check-circle"></i></span><span className="title">모두</span></a></li>
                    <li><a className={classList[1]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 1)}><span className="icon"><i className="fa fa-cutlery"></i></span><span className="title">음식</span></a></li>
                    <li><a className={classList[2]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 2)}><span className="icon"><i className="fa fa-coffee"></i></span><span className="title">음료</span></a></li>
                    <li><a className={classList[3]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 3)}><span className="icon"><i className="fa fa-scissors"></i></span><span className="title">뷰티</span></a></li>
                    <li><a className={classList[4]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 4)}><span className="icon"><i className="fa fa-smile-o"></i></span><span className="title">생활</span></a></li>
                    <li><a className={classList[5]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 5)}><span className="icon"><i className="fa fa-phone"></i></span><span className="title">주문</span></a></li>
                    <li><a className={classList[6]} href="javascript:void(0);" onClick={this.onClickCategory.bind(this, 6)}><span className="icon"><i className="fa fa-stethoscope"></i></span><span className="title">교육/의료</span></a></li>
                </ul>
            </div>
        )
    }
});

var ShopList = React.createClass(
{
    onBtnBookmark : function( shopIdx, bAdd )
    {
        this.props.onBtnBookmark( shopIdx, bAdd );
    },

    componentDidUpdate : function()
    {
        var self = this;
        var shoplistContainer = ReactDOM.findDOMNode( this.refs['shoplistContainer'] );

        $(shoplistContainer).unbind( 'scroll').bind( 'scroll', function()
        {
            $this = $(this);
            if( $this.scrollTop() + $this.innerHeight() >= $this[0].scrollHeight )
            {
                self.props.onScrollEnd();
            }
        });
    },

    onTouchStart : function( event )
    {
        event.nativeEvent.preventDefault();
    },

    render : function()
    {
        var self = this;
        var emptyLayout = function()
        {
            return (
                <div className="no-data">
                    <div className="no-data-ment">
                        <strong>죄송합니다!</strong>
                        <p>현재 주변에 이용가능한 매장이없습니다. <br />
                            더욱 더 열심히 하는 타임월렛이 되겠습니다.</p>
                    </div>
                </div>
            );
        };

        var listLayout = function()
        {
            return self.props.list.map( function( info, idx )
            {
                return (<ShopInfo info={info} key={info.shop_idx} onBtnBookmark={self.onBtnBookmark}/>);
            })
        };

        return (
            <div className="shoplist-shoplist-container" ref="shoplistContainer">
                { this.props.list.length == 0 && emptyLayout() }
                { this.props.list.length != 0 && listLayout() }
                <div className="shoplist-cover" ref="shoplist-cover" onTouchStart={self.onTouchStart} style={{display:'none'}}></div>
            </div>
        );
    }
});

var ShopInfo = React.createClass(
{
    // 매장 정보 클릭시
    onClickShopInfo : function( event )
    {
        var param = { shopInfo : this.props.info };
        UI.slidePage( 'SHOP_DETAIL', param );
    },

    // 매장정보의 북마크 버튼 클릭시.
    onBtnBookmark : function( event )
    {
        var self = this;

        event.stopPropagation();
        var bAdd = true;
        var apiUrl = API.ADD_BOOKMARK;
        if( this.props.info.bookmark_idx > 0 )
        {
            bAdd = false;
            apiUrl = API.DEL_BOOKMARK;
        }

        var params =
        {
            u_idx : USER.info.data.u_idx,
            shop_idx : this.props.info.shop_idx
        };

        MODEL.get( apiUrl, params, function( ret )
        {
            if( ret.success )
                self.props.onBtnBookmark( self.props.info.shop_idx, bAdd );
            else // 네트워크 오류
                BRIDGE.appAlert( {TITLE:'안내', TEXT:'네트워크 오류 : 북마크정보 갱신실패'} );
        });
    },

    render : function()
    {
        var bookmarkClass = ( this.props.info.bookmark_idx > 0 )?' active':'';
        var distance = '';
        if( this.props.info.dis > 1000 )
            distance = ( this.props.info.dis / 1000 ).toFixed(1) + 'km';
        else
            distance = this.props.info.dis + 'm';
        return (
            <div className="item-list item-list-box fix" onClick={this.onClickShopInfo}>
                <div className="item">
                    { (this.props.info.shop_coin_save_yn == 'Y') && <span className="coin-premium"></span> }
                    <div className="shop-logo lazy" style={{'backgroundImage':'url('+this.props.info.shop_logo_image+')'}}></div>
                </div>
                <div className="balloons">
                    <strong className="shop-name">{this.props.info.shop_name}</strong>
                    <div className="item-use">
                        { this.props.info.coupon_master_name =='' && <div className="use-no"><strong>쿠폰</strong><p>등록된 쿠폰이 없습니다.</p></div>}
                        { this.props.info.coupon_master_name !='' && <div><strong>쿠폰</strong><p>{this.props.info.coupon_master_name}</p></div>}
                        { this.props.info.coin_use_yn == 'N' && <div className="use-no"><strong>코인</strong><p>코인 교환이 종료되었습니다.</p></div>}
                        { this.props.info.coin_use_yn != 'N' && <div><strong>코인</strong><p>10min <em><i className="fa fa-caret-right"></i></em> {this.props.info.shop_coin_rate * 10}coin</p></div>}
                    </div>
                    <ul className="item-icons fix">
                        { this.props.info.shop_min_save_yn !='Y' && <li className="min-save no lazy">min 적립</li>}
                        { this.props.info.shop_min_save_yn =='Y' && <li className="min-save lazy">min 적립</li>}
                        { this.props.info.coupon_yn !='Y' && <li className="coupon no lazy">쿠폰사용</li>}
                        { this.props.info.coupon_yn =='Y' && <li className="coupon lazy">쿠폰사용</li>}
                        { this.props.info.shop_coin_use_yn !='Y' && <li className="coin no lazy">코인사용</li>}
                        { this.props.info.shop_coin_use_yn =='Y' && <li className="coin lazy">코인사용</li>}
                        { this.props.info.cafe_idx > 0 && <li className="remain lazy" style={{'backgroundImage':'url('+this.props.info.cafe_logo+')'}}>매장</li>}
                        { this.props.info.cafe_idx <= 0 && <li className="remain no lazy">매장</li>}
                    </ul>
                    <div className={'bookmark'+bookmarkClass} onClick={this.onBtnBookmark}>
                        <a href="javascript:void(0)"><i className="fa fa-heart-o"></i><span className="num">{this.props.info.bookmarkcnt}</span></a>
                    </div>
                    <div className="distance fix">
                        <div className="meter">{distance}</div>
                        { this.props.info.shop_flore != '' && <div className="floor">{this.props.info.shop_flore}F</div>}
                    </div>
                </div>
            </div>
        );
    }
});