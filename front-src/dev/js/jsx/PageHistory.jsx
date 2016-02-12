var PageHistory = React.createClass(
{
    loading : false,
    
    getInitialState : function()
    {
        var state =
        {
            menu_type   : 1,
            u_idx       : USER.info.index,
            page        : 1,
            historyList : []
        };
        return state;
    },

    contextTypes :
    {
        viewSize : React.PropTypes.object
    },

    // 이용내역 목록
    getUseList : function(param, menuType, callback)
    {
        var self = this;
        self.loading = true;
        var URL  = API.MIN_USE_HISTORY;
        
        if(menuType == 2)
        {
            URL = API.COIN_USE_HISTORY;
        }
        else if(menuType == 3)
        {
            URL = API.COUPON_USE_HISTORY;
        }
        MODEL.get(URL, param, function(ret)
        {
            if(ret.success)
            {
                if(ret.data[0].ResultCode == 1)
                {
                    self.loading = false;
                    callback(ret);
                }
                else
                {
                    alert( '이용내역 오류[ResultCode :'+ret.data[0].ResultCode+']' );
                    console.log( '이용내역을 가져오는중 오류[ResultCode :', ret.data[0].ResultCode,']' );
                    self.loading = false;
                    callback( null );
                }
            }
            else
            {
                self.loading = false;
                callback( null );
            }
        }) ;
    },
    
    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
    },
    
    onShowFirst:function()
    {
        var self = this;
        var params = 
        {
            u_idx : USER.info.index,
            page  : 1
        } ;
        console.log('min history', params);
        
        MODEL.get(API.MIN_USE_HISTORY, params, function(ret){
            var list = ret.data[0].ResultData;
            self.setState({historyList:list});
        }) ;
    },

    // min, coin, 쿠폰 메뉴 선택 이벤트
    onClickMenu: function(menuType)
    {
        var self = this;
        var params = 
        {
            u_idx : USER.info.index,
            page  : 1
        } ;
        self.getUseList(params, menuType, function(ret)
        {
            console.log(ret.data[0].ResultData);
            self.setState({historyList:ret.data[0].ResultData, menu_type : menuType});    
        });
    },
    
    onCheckBoxSelected: function(idx)
    {
        console.log(idx)  
    },
    
    
    onScrollEnd : function()
    {
        if(this.loading) return;
        if(this.state.page >= this.state.totalPage) return;
        
        var self = this;
        console.log('add');
    },
    
    render : function()
    {
        var self = this;
        
        var minListLayout = function()
        {
            return self.state.historyList.map(function(info, idx)
            {
                var menuType   = self.state.menu_type;
                var historyIdx = 0;
                var type       = null;
                var msg        = null;
                if(menuType == 1)
                {
                    historyIdx = info.min_history_idx;
                    type = <div className="tag save"><span>적립</span></div>;
                    msg = <span><em>{info.min_save}min</em>을 적립했습니다.</span>;
                }
                else if(menuType == 2)
                {
                    historyIdx = info.coin_history_idx;
                    type = <div className="tag ex"><span>교환</span></div>;
                    msg = <span><em>{info.min}min</em>을 <em>{info.coin}coin</em>으로 교환했습니다.</span>;
                }
                else if(menuType == 3)
                {
                    historyIdx = info.coupon_idx;
                    type = <div className="tag ex"><span>교환</span></div>;
                    msg = <span><em>{info.coupon_min_point}min</em>으로 <em>{info.coupon_master_name}</em>을 구매했습니다.</span>;
                }
                
                return(
                    
                    <li className="used-wrap fix" key={idx}>
                        {type}
                        <span className="shop-logo" style={{backgroundImage:'url('+info.shop_logo_image+')'}}></span>
                        <div className="used-balloons">
                            <span className="used-date">{info.regdate.substring(0, 10)}</span>
                            <p className="shop-name">{info.shop_name}</p>
                            <div className="substance">
                                {msg}
                            </div>
                            <div className="inp-check">
                                <input type="checkbox" onClick={self.onCheckBoxSelected(historyIdx)} id={"check"+historyIdx} data-history={historyIdx} name="mycheck" /><label htmlFor={"check"+historyIdx}><span className="box"><em className="box-dot"></em></span></label>
                            </div>
                        </div>
                    </li>              
                );
            });
        };
        return (
            <div className="page" style={this.context.viewSize}>
                <PageHeader title="이용내역" type="BACK_MENU_LIST" />
                <div className="common-tab count-3 coin-donate-tab">
                    <ul className="fix">
                        <li><a className="min active" onClick={self.onClickMenu.bind(null, 1)} href="javascript:void(0);">min</a></li>
                        <li><a className="coin"       onClick={self.onClickMenu.bind(null, 2)} href="javascript:void(0);">coin</a></li>
                        <li><a className="coupon"     onClick={self.onClickMenu.bind(null, 3)} href="javascript:void(0);">쿠폰</a></li>
                    </ul>
                </div>
                <div className="used-del">
                    <a className="all-check" href="javascript:void(0);">전체선택</a>
                    <a className="all-del" href="javascript:void(0);">삭제</a>
                </div>
                <PageContents>
                    <div className="used-list">
                        <ul  onScrollEnd={this.onScrollEnd}>
                            {minListLayout()}
                        </ul>
                    </div>
                </PageContents>
            </div>
        );
    }
});