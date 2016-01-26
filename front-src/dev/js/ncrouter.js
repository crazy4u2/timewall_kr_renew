/**
 * Created by nicecue on 16. 1. 19.
 */
var ROUTER = ( function()
{
    var _router;
    var _option;

    function _init()
    {
        _option = { ignorecase: true };
        _router = new Router( _option );

        // 홈페이지 : http://www.ramielcreations.com/projects/router-js/
        // 사용 : Router.addRoute( path, callback );
        // 콜백에 주어지는 2개의 파라미터 설명
        //  - req
        //      - href : url
        //      - params : 전달 인자
        //      - query : query string
        //      - splats : 라우터 표현을 정규 표현식으로 했을때 매칭되는 모든 그룹
        //      - hasNext : 다른 매칭되는 라우터가 있는지...
        //  - next
        //      - 매칭된 라우터가 2개 이상일 경우 next(); 형태로 실행하면 다음 라우터가 실행됨
        // '#/users/:username'
        // => '#/users/john?age=25
        //  - var username = req.get( 'username' ); 형태로 인자 가져오기( query string이든 전달 인자든 다 가져옴 )
        //  - var age = req.get( 'age', 18 ); age는 값이 있으므로 25가 됨, 없으면 디폴트값 18

        _router.add( '#/', function( req, next )
        {
            console.log( '라우터 "#/"' );
            UI.slidePage( 'SHOP_LIST' );
            //UI.setPage( 'SHOP_LIST' );
        });

        _router.add( '#/shop-list', function( req, next )
        {
            console.log( '라우터 "#/shop-list"' );
            UI.slidePage( 'SHOP_LIST' );
        });

        _router.add( '#/bookmark', function( req, next )
        {
            console.log( '라우터 "#/bookmark"' );
            UI.slidePage( 'BOOKMARK' );
        });

        _router.add( '#/shop-detail', function( req, next )
        {
            console.log( '라우터 "#/shop-detail"' );
            UI.slidePage( 'SHOP_DETAIL' );
        });

        console.log( '라우터 설정 : ', _router._routes );
    }

    function _getRouter()
    {
        return _router;
    }

    return {
        getRouter : _getRouter,
        init : _init

    }
}());