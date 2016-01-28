/**
 * Created by nicecue on 16. 1. 18.
 */
var APP = ( function()
{
    function _start()
    {
        GPS.init();
        USER.init( function() // 유저정보 설정.( 앱으로 부터 index 를 얻어서 서버로 부터 유저 상세정보 설정 )
        {
            // 콜백 형태로 실행하는 것은 유저정보가 모두 설정된 다음에 다음 프로세스를 진행하기 위함.
            // USER.index , USER.data 로 참조 해서 사용.

            ROUTER.init(); // 라우터 설정.( 기존 라우트 url 사용을 위해서 설정 )

            UI.init( 'container' ); // React를 사용해서 .container 안에 모든 UI 를 랜더링한다.
            console.log( '페이지 목록 : ', UI.pageList ); // 현재 구성된 페이지 및 팝업 목록.
        });
    }

    return {
        start : _start
    };
}());