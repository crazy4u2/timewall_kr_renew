

var PageShopList = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            category : 0, // 선택된 카테고리 : 0 ~ 6
            sort : 1, // 정렬기준, 1:거리순, 2:인기순
            filter : 'all', // 필터, 'all:전체, 'coin':코인교환가맹점, 'coupon':쿠폰사용가맹점

            shopList : [] // 매장 리스트
        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    _setLocationFromGPS : function()
    {
        BRIDGE.getUserLocation( function( loc )
        {

        });
    },



    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
        this._setLocationFromGPS();

        var params =
        {
            latitude : 0, longitude : 0, // 현재 내위치 인듯.
            search_latitude : 0, search_longitude : 0, // 검색지역인듯.. 왜 둘을 분리했을까?
            u_idx : USER.info.index,
            page : 1, // 페이지 번호?
            shop_category : this.state.category,
            searchText : '',
            sort : this.state.sort,
            shop_type : this.state.filter
        };

        // latitude	string	좌표
        // longitude	string	좌표
        // search_latitude	string	검색지역 좌표
        // search_longitude	string	검색지역 좌표
        // u_idx	int	유저번호
        // page	int	페이지
        // shop_category	string	카테고리 : 음식 음료 뷰티…
        // searchText	string	검색어
        // sort	string	정렬 방법 1 거리순, 2 인기순
        // shop_type	string	all : 전체 가맹점, coupon : coupon 제공 가맹점 , coin: coin 가맹점

        MODEL.get( API.SHOP_LIST, params, function( ret )
        {
            if( ret.success )
            {
                if( ret.data[0].ResultCode == 1 )
                {
                    var data = ret.data[0].ResultData[0];
                    var page = ret.data[0].page;
                    var totalPage = ret.data[0].totalpage;
                    console.log( 'PageShopList::componentDidMount::매장리스트::[ 현재페이지 :', page,', 전체페이지 :', totalPage, '] 리스트 : ', data );
                }
                else // 데이터 오류
                {

                }
            }
            else
            {
                // 네트워크 상황 or 서버 오류로 인해 데이터를 로딩하지 못했을 때 처리.
            }
        });

    },



    onShowFirst : function()
    {
        console.log( 'PageShopList::onShowFirst' );
    },

    onShow : function( param )
    {
        console.log( 'PageShopList::onShow' );
    },

    handleClick : function()
    {
        UI.slidePage('SHOP_DETAIL');
    },

    render : function()
    {
        return (
            <div className="page page-shoplist" >
                <PageHeader title="매장리스트" type="MENU_LOC_SEARCH_MAP"/>
                <PageContents >
                    <div onClick={this.handleClick}>매장상세 페이지로</div>
                    <div>유저번호 : {USER.info.index}</div>
                </PageContents>
            </div>
        );
    }
});

