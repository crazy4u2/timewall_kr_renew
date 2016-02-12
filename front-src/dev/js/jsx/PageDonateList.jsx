var PageDonateList = React.createClass(
{
    getInitialState : function()
    {
        var state = 
        {
            page : 1,
            orgList : []
        };
        return state;
    },
    
    contextTypes : 
    {
        viewSize : React.PropTypes.object  
    },
    
    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );  
    },
    
    onShowFirst : function()
    {
        var self = this;
        var params = 
        {
            page : 1  
        };
        
        MODEL.get( API.DONATION_ORG_LIST, params, function( ret )
        {
            if( ret.success )
            {
                var list = ret.data[0].ResultData;
                self.setState( { orgList:list } );
                console.log( '기부단체목록', ret.data[0].ResultData );
            } 
            
        });
    },
    
    onClickOrg : function( orgIdx )
    {
        console.log( '단체번호 : ',orgIdx );
        UI.slidePage( 'DONATE', orgIdx );
    },

    render : function()
    {
        var self = this;
        var donateListLayout = function()
        {
            return self.state.orgList.map( function( info, idx )    
            {
                return(
                   <li className="donate-org" key={idx}>
                       <a className="donate-logo" onClick={self.onClickOrg.bind(null,info.d_idx)} href="javascritp:void(0)" style={{backgroundImage:'url('+info.d_image_s+')'}}></a>
                      </li>
                   );
                });
            };
        
            return (
                <div className="page" style={this.context.viewSize}>
                    <PageHeader title="기부목록" type="BACK_MENU_LIST" />
                    <PageContents>
                        <div className="donate-intro">
                            <div className="btn-donate-view">
                                <a href="#/my-donate">나의 기부내역</a>
                            </div>
                            <div className="donate-intro-text">
                                기부해 주신 coin은 연말에 현금으로 기부됩니다. 또한 상세 기부내역은 기부자 사용내역과 공지사항을 통해 정확한 내용을 알려드립니다.
                            </div>
                        </div>
                        <div className="donate-place">
                            <ul className="fix">
                                {donateListLayout()}
                            </ul>
                        </div>
                    </PageContents>
                </div>
            );
        }
});