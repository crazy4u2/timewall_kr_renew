/**
 * Created by nicecue on 16. 1. 19.
 */


var UI = (function()
{
    var DOM = ReactDOM;
    var R = React;

    var _frame = { left:0, top:0, right:0, bottom:0 };
    var _size = { width:0, height:0 };

    var _pageComponentList = {};
    var _popupComponentList = {};
    var _history = [];

    var _pageContainer;
    var _app;

    var _defaultPage = 'SHOP_LIST';
    var _firstShowFlagList = {};



    var _curPage;
    var _prevPage;
    var _nextPage;

    function _setViewSize()
    {
        _size.width = $(window).width();
        _size.height = $(window).height();
        console.log( '화면 크기 : ', _size );
    }

    function _getViewSize()
    {
        return _size;
    }

    function _onResize()
    {
        console.log( 'UI::onResize' );
        _setViewSize();

        //_app.context.viewSize = _size;
        _app.forceUpdate();
    }

    // 일단 팝업도 _pageComponentList 에 보관한다.
    function _registerPopup( key, component )
    {
        _popupComponentList[key] = component;
    }

    function _registerPage( key, component )
    {
        _pageComponentList[key] = component;
        _firstShowFlagList[key] = false;
    }

    function _getPage( key )
    {
        return _pageComponentList[key];
    }

    // 모든 페이지 랜더 및 설정
    function _init( className )
    {
        _setViewSize();
        _renderAllComponents( className );
        _hideAllPage();
        _setPage( _defaultPage );

        //$('.page-use-coin').css('-webkit-transform', 'translate(0px,100px)');

        window.addEventListener( 'resize', _onResize );
    }

    function _renderAllComponents( className )
    {
        var klass = className || 'app-container';
        var container = container || document.getElementsByClassName(klass)[0];
        _app = DOM.render( R.createElement( App, {viewSize:{width:_size.width, height:_size.height}} ), container );
    }

    function _movePageTo( component, x, y )
    {
        var el = DOM.findDOMNode( component );
        $el = $(el);
        //console.log( 'movePage[',component.props.pageName,'] =>',x,',',y );

        $el.transition({x:x, y:y, duration:0} );
    }

    function _animatePageTo( component, x, y )
    {
        var el = DOM.findDOMNode( component );
        var $el = $(el);
        //console.log( 'animatePage[',component.props.pageName,'] => ',x,',',y );
        $el.transition({x:x, y:y }, 300, 'snap' );
        setTimeout( function(){ $el.transition({x:x,y:y},0);} );

    }

    function _slidePage( pageName, param )
    {
        if( pageName == _curPage.props.pageName )
            return;

        var nextPage = _pageComponentList[pageName];
        var viewSize = UI.getViewSize();

        // 처음 보여질 경우 onShowFirst 함수 호출해줌.
        if( !_firstShowFlagList[pageName] )
        {
            _firstShowFlagList[pageName] = true;
            if( typeof nextPage.onShowFirst == 'function' )
                nextPage.onShowFirst();
        }

        // onShow 가 정의 되어 있으면 페이지가 보여질때 호출해 준다.
        if( typeof nextPage.onShow == 'function' )
            nextPage.onShow( param );

        //console.log( 'slidePage[ ', _curPage.props.pageName,' =>', nextPage.props.pageName ,']' );

        _movePageTo( nextPage, 0+viewSize.width, 0 );
        _animatePageTo( nextPage, 0, 0 );

        _animatePageTo( _curPage, 0-viewSize.width, 0 );

        _addHistory( pageName, param );
        _curPage = nextPage;
    }

    function _slideBack()
    {
        if( _history.length < 2 )
        {
            console.log('최초 페이지' );
            return false;
        }

        var prevPageName = _history[_history.length-2].pageName;
        var prevPage = _pageComponentList[prevPageName];

        var history = _history.pop();

        // onShow 가 정의 되어 있으면 페이지가 보여질때 호출해 준다.
        if( typeof prevPage.onShow == 'function' )
            prevPage.onShow( history.param );

        //console.log( 'slideBack[ ', _curPage.props.pageName,' =>', prevPage.props.pageName ,']' );

        var viewSize = UI.getViewSize();

        var _prevx = 0-viewSize.width;
        _movePageTo( prevPage, _prevx, 0 );
        _animatePageTo( prevPage, 0, 0 );
        _animatePageTo( _curPage, 0+viewSize.width, 0 );

        _curPage = prevPage;

        return true;
    }

    function _setPage( pageName, param )
    {
        if( _curPage )
            _hidePage( _curPage );

        var component = _pageComponentList[pageName];

        // 처음 보여질 경우 onShowFirst 함수 호출해줌.
        if( !_firstShowFlagList[pageName] )
        {
            _firstShowFlagList[pageName] = true;
            if( typeof component.onShowFirst == 'function' )
                component.onShowFirst();
        }

        // onShow 가 정의 되어 있으면 페이지가 보여질때 호출해 준다.
        if( typeof component.onShow == 'function' )
            component.onShow( param );

        _movePageTo( component, 0, 0 );
        _addHistory( pageName, param );

        _curPage = component;
    }

    function _addHistory( pageName, param )
    {
        var history = { pageName:pageName, param:param };
        _history.push( history );
    }

    function _setPageVisibility( component, visibility )
    {
        var el = DOM.findDOMNode( component );
        var displayValue = 'none';
        if( visibility )
            displayValue = 'block';
        $(el).css( 'display', displayValue )
    }

    function _hidePage( component )
    {
        _movePageTo( component, 0, -1000 );
    }

    function _hideAllPage()
    {
        for( var index in _pageComponentList )
        {
            if( _pageComponentList.hasOwnProperty(index) )
            {
                var component = _pageComponentList[index];
                _hidePage( component );
            }
        }
    }

    function _notice( msg, callback )
    {
        // TODO : 추후에 UI 적용 예정
        alert( msg );
        callback();
    }

    function _ask( msg, callback )
    {
        // TODO : 추후에 UI 적용 예정
        confirm( msg, callback );
    }

    function _openPopup( key )
    {
        var popComponent;
        if( typeof key == 'string' )
            popComponent = _popupComponentList[key];
        else if( typeof key == 'object' )
            popComponent = key;


        var $popContainer = $('.popup-container-wrapper');
        var $popBackground = $('.popup-background');

        $popBackground.css( 'display', 'block' );
        $popContainer.css( 'display', 'block' );

        $popBackground.transition({ opacity:0.5}, 200, 'snap' );

        var el = ReactDOM.findDOMNode( popComponent );
        var $el = $(el);
        $el.css( 'display', 'block' );

        $el.transition({scale:0.7, opacity:0.5},0).transition({ scale:1, y:'-50%', opacity:1}, 200, 'snap' );
    }

    function _closePopup( key )
    {
        var popComponent;
        if( typeof key == 'string' )
            popComponent = _popupComponentList[key];
        else if( typeof key == 'object' )
            popComponent = key;

        var $popBackground = $('.popup-background' );
        var $popContainer = $('.popup-container-wrapper');

        var el = ReactDOM.findDOMNode( popComponent );
        var $el = $(el);

        $el.transition({scale:1},0).transition({scale:0.7, y:'-50%', opacity:0.0}, 200, 'snap' );

        $popBackground.animate(
        {
            opacity : 0
        }, 300, function()
        {
            $popBackground.css('display', 'none' );
            $popContainer.css( 'display', 'none');
            $el.css( 'display', 'none' );
        });
    }

    return {

        firstShowFlag : _firstShowFlagList,

        pageList : _pageComponentList,
        popupList : _popupComponentList,
        history : _history,
        init : _init,
        hideAll : _hideAllPage,
        hidePage : _hidePage,

        setPage : _setPage,
        slidePage : _slidePage,
        slideBack : _slideBack,

        registerPage : _registerPage,
        getPage : _getPage,

        registerPopup : _registerPopup,
        openPopup : _openPopup,
        closePopup : _closePopup,

        getViewSize : _getViewSize,
        notice : _notice,
        ask : _ask
    };
}());