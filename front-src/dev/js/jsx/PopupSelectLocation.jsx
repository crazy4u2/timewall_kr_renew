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

        onBtnOk : function()
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
            if( $(cityTag).parents('li').find('.sub li').size() > 0 )
            {

            }
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
                            <div className="select" onClick={self.onBtnCity}>
                                <a href="javascript:void(0);" className="city">{info.si}
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
                            <div className="list-location">
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