/**
 * Created by nicecue on 16. 1. 17.
 */

var UTIL = ( function()
{
    var _sequenceList = [];


    var _filelist = null;
    var _callback = null;

    function _checkAllLoaded( )
    {
        var sequence = _sequenceList[0];
        var _checkFlag = true;
        sequence.list.map( function( _check, i )
        {
            _checkFlag = _checkFlag && _check.loaded;
        });
        return _checkFlag;
    }

    function _load( i )
    {
        var fileurl = _sequenceList[0].list[i].fileurl;
        var parsing = fileurl.split('.');
        var ext = parsing[parsing.length-1].substring( 0, 3 );

        var script = null;
        if( ext == 'js' )
        {
            script = document.createElement( 'script' );
            script.setAttribute( 'type', 'text/javascript' );
            script.setAttribute( 'src', _sequenceList[0].list[i].fileurl );
        }
        else if( ext == 'css' )
        {
            script = document.createElement( 'link' );
            script.setAttribute( 'rel', 'stylesheet' );
            script.setAttribute( 'type', 'text/css' );
            script.setAttribute( 'href', _sequenceList[0].list[i].fileurl );
        }
        else
        {
            console.log( '알수없는 파일형식 이라 js로 로딩: ', fileurl );
            ext = 'js';
            script = document.createElement( 'script' );
            script.setAttribute( 'type', 'text/javascript' );
            script.setAttribute( 'src', _sequenceList[0].list[i].fileurl );
        }

        // 성공시 처리 : 현재 로딩목록에서 로딩완료 체크 후 리스트 전체 파일이 로딩이 완료되었으면 로딩목록을 삭제하고 콜백함수를 호출
        script.onload = function( e )
        {
            //if( typeof script.src != 'undefined' )
            //    console.log( 'js loaded['+i+'] : ', _sequenceList[0].list[i].fileurl );
            //else
            //    console.log( 'css loaded['+i+'] : ', _sequenceList[0].list[i].fileurl );

            _sequenceList[0].list[i].loaded = true;
            if( typeof script.src != 'undefined' )
                document.getElementsByTagName('head')[0].removeChild( script );

            if( _checkAllLoaded() )
            {
                _sequenceList[0].callback.call(this);
                _sequenceList.shift();
                if( _sequenceList.length > 0 )
                    _load( 0 );
            }
            else
            {
                i++;
                _load( i );
            }

        };

        // 오류시 처리 : onerror 이벤트는 html5 를 지원하는 최신 브라우저에서만 지원한다.
        script.onerror = function( msg, url, linenumber )
        {
            console.log( 'load error : ', msg, url, linenumber );
            alert( 'UI 데이터 로딩 실패\n['+ _sequenceList[0].list[i].fileurl +']\n\n네트워크 상태를 확인 후 다시 시도해 주세요' );
            _sequenceList[0].list[i].failcount = _sequenceList[0].list[i].failcount+1;
            console.log( '실패횟수 : ', _sequenceList[0].list[i].failcount );
            if( _sequenceList[0].list[i].failcount > 5 )
            {
                console.log( '페이지 재 로딩해야됨 ' );
            }
            else
                _load( i );
        };

        document.getElementsByTagName('head')[0].appendChild( script );
    }

    function _loadScript( filelist, callback )
    {
        var checkList = [];
        filelist.map( function( file, i)
        {
            var _check =
            {
                fileurl : file,
                loaded : false,
                failcount : 0
            };
            checkList.push( _check );
        });

        var sequence =
        {
            list : checkList,
            callback : callback
        };

        //console.log( '로딩 목록 : ', sequence );

        _sequenceList.push( sequence );

        if( _sequenceList.length > 1 ) // 현재 로딩중인 시퀀스가 있으면 리턴.
            return;

        _load(0);
    }

    return {
        loadScript : _loadScript,
    };


}());