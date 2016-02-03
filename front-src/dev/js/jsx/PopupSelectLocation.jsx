var PopupSelectLocation = React.createClass(
    {
        callback : null,
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
                console.log( 'citylist : ', cityList );
                self.setState( {cityList:cityList});

            });
        },

        onBtnOk : function() // 샘플코드
        {
            var pageJoin = UI.getPage( 'JOIN' );
            pageJoin.setLocation( '가원도' );

        },

        onShow : function( callback )
        {
            this.callback = callback;
        },

        onClose : function()
        {
            // 팝업이 닫힐때 열려있는 탭 닫기.
            var listContainer = ReactDOM.findDOMNode( this.refs['list-location'] );
            $(listContainer).find( '.siList').removeClass('active').find('ul').height(0);
        },

        onClickDistrict : function( city, district, event )
        {
            var cityName = this.state.cityList[city].si;
            var districtName = this.state.cityList[city].guList[district].gu;
            var region = cityName + ' ' + districtName;
            if( cityName == districtName )
                region = cityName;

            UI.closePopup( this );
            if( typeof this.callback == 'function' )
                this.callback( region );
        },

        onClickCity : function( city, event )
        {
            var $city = $( ReactDOM.findDOMNode( this.refs['city_'+city] ) );
            var $list = $( ReactDOM.findDOMNode( this.refs['list-location']) );

            if( !$city.attr('class').match('active') )
                $list.find('.active').find('ul').height(0).end().removeClass('active');

            $city.toggleClass( ' active' );

            var districtHeight = 0;
            if( $city.attr('class').match('active') ) // active 면 아래 '구' 부분을 보여준다.
                districtHeight = Math.round( this.state.cityList[city].guList.length / 2 ) * 40; // li 높이 40px;

            $city.find( 'ul ').height( districtHeight );
        },

        render : function()
        {
            var self = this;

            var guListLayout = function( cityIndex )
            {
                return self.state.cityList[cityIndex].guList.map( function( info, guIndex )
                {
                    return (
                        <li key={guIndex} onClick={self.onClickDistrict.bind( null, cityIndex, guIndex )}>
                            <a href="javascript:void(0);" className="state">{info.gu}</a>
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
                        <li className="siList" key={idx} ref={"city_"+idx}>
                            <div className="select" onClick={self.onClickCity.bind(null, idx)}>
                                <a href="javascript:void(0);" className="city" >{info.si}
                                    <i className="fa fa-caret-down"></i>
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