var PageBookmark = React.createClass({
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    searchingLoc : { lati:0, longi:0 },
    getInitialState : function() {
        return {
            latitude:'',
            longitude:'',
            page:1,
            sort:'',
            searchText:'',
            shopList:[],
            totalPage:1
        }
    },
    getBookmarkList : function( param, callback ) {
        var _this = this;
        _this.loading = true;
        MODEL.get( API.MY_BOOKMARK_LIST, param, function(ret) {
            var respData = ret.data[0];
            if( ret.success ) {
                console.log( 'list : ', respData.ResultData );
                if( respData.ResultCode == 1 ) {
                    var list = ret.data[0].ResultData;
                    var page = ret.data[0].page;
                    var totalPage = ret.data[0].totalpage;

                    var result = {
                        page : page,
                        totalPage : totalPage,
                        list : list
                    };
                    //console.log('PageBookmarkList::getBookmarkList:list:', result.list );

                    _this.loading = false;
                    callback( result );
                } else {
                    alert( '매장정보 오류[ResultCode :'+ret.data[0].ResultCode+']' );
                    console.log( '매장정보를 가져오는중 오류[ResultCode :', ret.data[0].ResultCode,']' );
                    _this.loading = false;
                    callback( null );
                }
            } else {
                // 네트워크 상황 or 서버 오류로 인해 데이터를 로딩하지 못했을 때 처리.
                _this.loading = false;
                callback( null );
            }
        });
    },

    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
        this.searchingLoc.lati = GPS.lati;
        this.searchingLoc.longi = GPS.longi;
    },

    onShow : function() {
        console.log( 'PageBookmark::onShow' );
    },

    onShowFirst : function() {
        var _this = this;
        var params = {
            latitude : GPS.lati,
            longitude : GPS.longi,
            u_idx : USER.info.index,
            page : this.state.page, // 최초 페이지 1
            searchText : '',
            sort : this.state.sort
        };
        this.getBookmarkList( params, function( ret ) {
            if( ret == null ) // 로딩 실패
                return;

            var changingState = {
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : ret.list
            };
            _this.setState( changingState );
        });
    },

    onBtnBookmark : function( shopIdx, bAdd ) {
        var bookmarkIndex = 0;
        if( bAdd ) {
            bookmarkIndex = 100;
        }
        var cnt = this.state.shopList.length;
        for( var i=0; i<cnt; i++) {
            var shopInfo = this.state.shopList[i];
            if( shopInfo.shop_idx == shopIdx ) {
                var newList = this.state.shopList;
                newList[i].bookmark_idx = bookmarkIndex;
                if( bAdd )
                    newList[i].bookmark_count = newList[i].bookmark_count+1;
                else
                    newList[i].bookmark_count = newList[i].bookmark_count-1;

                this.setState( {shopList:newList});
            }
        }
    },

    onScrollEnd : function() {
        var _this = this;
        if( this.loading ) {
            return;
        }

        if( this.state.page >= this.state.totalPage ) {
            return;
        }
        var _data = {
            latitude : GPS.lati,
            longitude : GPS.longi,
            u_idx : USER.info.index,
            page : this.state.page + 1, // 최초 페이지 1
            searchText : '',
            sort : this.state.sort
        };

        this.getBookmarkList( _data, function( ret ) {
            if( ret == null ) {
                return;
            }

            var changingState = {
                page : ret.page,
                totalPage : ret.totalPage,
                shopList : _this.state.shopList.concat( ret.list )
            };
            _this.setState( changingState );
        });
    },

    handleClick : function() {
        UI.slidePage( 'SHOP_LIST' );
    },

    render : function() {

        return (
            <div className="page page-bookmark" style={this.context.viewSize}>
                <PageHeader title="즐겨찾기" ref="header" />
                <PageContents className="twBookmark contentsScroll">
                    <BookmarkList list={this.state.shopList} onBtnBookmark={this.onBtnBookmark} onScrollEnd={this.onScrollEnd}/>
                </PageContents>
            </div>
        );
    }
});

var BookmarkList = React.createClass({
    onBtnBookmark : function( shopIdx, bAdd ) {
        this.props.onBtnBookmark( shopIdx, bAdd );
    },

    componentDidUpdate : function() {
        var _this = this;
        var shoplistContainer = ReactDOM.findDOMNode( this.refs['shoplistContainer'] );

        $(shoplistContainer).unbind( 'scroll').bind( 'scroll', function() {
            $this = $(this);
            if( $this.scrollTop() + $this.innerHeight() >= $this[0].scrollHeight ) {
                _this.props.onScrollEnd();
            }
        });
    },

    onTouchStart : function( event ) {
        event.nativeEvent.preventDefault();
    },

    render : function() {
        var _this = this;
        var emptyLayout = function() {
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

        var listLayout = function() {
            return _this.props.list.map( function( info, idx ) {
                return (<BookmarkShopInfo info={info} key={info.shop_idx} onBtnBookmark={_this.onBtnBookmark}/>);
            })
        };

        return (
            <div className="shoplist-shoplist-container" ref="shoplistContainer">
                { this.props.list.length == 0 && emptyLayout() }
                { this.props.list.length != 0 && listLayout() }
                <div className="shoplist-cover" ref="shoplist-cover" onTouchStart={_this.onTouchStart} style={{display:'none'}}></div>
            </div>
        );
    }
});

var BookmarkShopInfo = React.createClass({
    // 매장 정보 클릭시
    onClickShopInfo : function( event ) {
        var param = { shopInfo : this.props.info };
        UI.slidePage( 'SHOP_DETAIL', param );
    },

    // 매장정보의 북마크 버튼 클릭시.
    onBtnBookmark : function( event ) {
        var self = this;

        event.stopPropagation();
        var bAdd = true;
        var apiUrl = API.ADD_BOOKMARK;
        if( this.props.info.bookmark_idx > 0 ) {
            bAdd = false;
            apiUrl = API.DEL_BOOKMARK;
        }
        var params = {
            u_idx : USER.info.data.u_idx,
            shop_idx : this.props.info.shop_idx
        };

        MODEL.get( apiUrl, params, function( ret ) {
            if( ret.success )
                self.props.onBtnBookmark( self.props.info.shop_idx, bAdd );
            else // 네트워크 오류
                BRIDGE.appAlert( {TITLE:'안내', TEXT:'네트워크 오류 : 북마크정보 갱신실패'} );
        });
    },
    render : function() {
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
                        <a href="javascript:void(0)"><i className="fa fa-heart-o"></i><span className="num">{this.props.info.bookmark_count}</span></a>
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