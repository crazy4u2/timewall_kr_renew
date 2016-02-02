var PopupSelectLocation = React.createClass(
    {
        getInitialState: function ()
        {
            var state =
            {
                bOpened: false,
                cityList : []
            };
            return state;
        },

        componentDidMount: function ()
        {
            UI.registerPopup(this.props.popName, this);
        },

        onShowFirst : function()
        {
            var self = this;
            var cityList = [];

            MODEL.getJson( '/front-src/release/js/mock/zipcode.json', function( ret )
            {
                var cnt = ret.data[0].ResultData.length;
                var list = ret.data[0].ResultData;

                for( var i=0; i<cnt; i++ )
                {
                    var bExistCity = false;
                    var loopCnt = cityList.length;
                    for( var c=0; c<loopCnt; c++ )
                    {
                        if( cityList[c].si == list[i].si )
                        {
                            bExistCity = true;
                            break;
                        }
                    }

                    if( bExistCity )
                    {
                        cityList[c].guList.push( {gu:list[i].gu, idx:list[i].idx, addr:list[i].addr});
                    }
                    else
                    {
                        cityList.push({si:list[i].si, guList:[{gu:list[i].gu, idx:list[i].idx, addr:list[i].addr}]});
                    }
                }
                self.setState( {cityList:cityList});

            });
        },

        onBtnOk : function() // 샘플코드
        {
            var pageJoin = UI.getPage( 'JOIN' );
            pageJoin.setLocation( '가원도' );

        },

        onShow : function()
        {

        },

        onBtnCity : function( event )
        {
            var cityTag = ReactDOM.findDOMNode( event.target );
            var $cityTag = $(cityTag);

            if( $cityTag.parents('li').find('.sub li').size() > 0 )
            {
                if( !$cityTag.attr('class')  )
                    $cityTag = $cityTag.closest('a');

                if( !$cityTag.attr('class').match('state') )
                {
                    if( $cityTag.closest('li').attr('class').match('active') ) // 아코디언 열려있을 경우
                    {
                        $cityTag.closest('li').removeClass('active').find('ul').height(0);
                    }
                    else // 닫혀 있을경우
                    {
                        // 기존 열려있던 탭 닫기
                        $('.list-location').find('.active').find('ul').height(0).end().removeClass('active');

                        var cntLi = $cityTag.closest('li').find('li').size();
                        if( cntLi % 2 == 0 )
                            cntLi = cntLi / 2;
                        else
                            cntLi = Math.floor( cntLi / 2 ) + 1;

                        $cityTag.closest('li').find('ul').height( ( $cityTag.closest('li').find('li').outerHeight()) * cntLi );
                        $cityTag.closest('li').addClass('active');
                    }
                }
                else
                {

                }

            }
        },

        onClose : function()
        {
            // 팝업이 닫힐때 열려있는 탭 닫기.
            var listContainer = ReactDOM.findDOMNode( this.refs['list-location'] );
            $(listContainer).find( '.siList').removeClass('active').find('ul').height(0);
        },

        render : function()
        {
            var self = this;

            var guListLayout = function( idx )
            {
                return self.state.cityList[idx].guList.map( function( info, idx )
                {
                    return (
                        <li key={idx}>
                            { (info.gu.length > 1 ) && <a href="javascript:void(0);" className="state">{info.gu}</a>}
                        </li>
                    );
                });
            };

            var cityListLayout = function()
            {
                return self.state.cityList.map( function( info, idx )
                {
                    var bGuListExist = (typeof info.guList != 'undefined')?true:false;
                    return(
                        <li className="siList" key={idx} >
                            <div className="select" >
                                <a href="javascript:void(0);" className="city" onClick={self.onBtnCity}>{info.si}
                                    { (info.guList.length >1 )&& <i className="fa fa-caret-down"></i>}
                                </a>
                            </div>
                            <ul className="sub">
                                { bGuListExist && guListLayout( idx )}
                            </ul>
                        </li>
                    );
                })
            };


            return (
                <div className="modal modal-location" style={this.props.style}>
                    <div className="modal-inner">
                        <div className="modal-contents">
                            <div className="location-header">
                                <h3>지역설정</h3>
                                <a className="btn-location-close" href="javascript:void(0);" onClick={UI.closePopup.bind(self, self)}>닫기</a>
                            </div>
                            <div className="list-location" ref="list-location">
                                <ul>
                                    { self.state.cityList.length != 0 && cityListLayout()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });