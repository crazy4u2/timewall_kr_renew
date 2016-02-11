var PageShopSearch = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            searchWord : '',
            searchedList : [],
            listMode : 'shoplist' // shoplist, history
        };
        return state;
    },

    componentDidMount : function()
    {
        UI.registerPage( this.props.pageName, this );
    },

    onInputFocused : function()
    {
        this.setState( {listMode:'history'} );
    },

    onInputBlur : function()
    {
        //this.setState( {listMode:'shoplist'} );
    },

    onEnter : function( word )
    {
        var self = this;
        if( this.state.searchWord != word )
        {
            var historyComponent = this.refs['searchHistory'];
            historyComponent.addHistory( word );

            var params =
            {
                u_idx : USER.info.data.u_idx,
                latitude : '',
                longitude : '',
                shop_category : '',
                searchText : word,
                sort : 1,
                page : 1,
                shop_type : 'all'
            };
            MODEL.get( API.SHOP_LIST, params, function( ret )
            {
                 if( ret.success )
                 {
                     if( ret.data[0].ResultCode == 1 )
                     {
                         var list = ret.data[0].ResultData;
                         self.setState( {listMode : 'shoplist', searchedList : list} );
                     }
                 }
            });
        }
    },

    onHideHistory : function()
    {
        this.setState( {listMode:'shoplist'} );
    },

    onClickHistory : function( word )
    {
        var inputComponent = this.refs['shopSearchInput'];
        inputComponent.setInputValue( word );
    },

    render : function()
    {
        var self = this;
        var historyHide = 'block';
        if( this.state.listMode == 'shoplist')
            historyHide = 'none';


        return (
            <div className="page page-shop-search">
                <PageHeader title="매장검색" type="MENU_LIST" />
                <ShopSearchInput ref="shopSearchInput" onInputFocused={self.onInputFocused} onInputBlur={self.onInputBlur} onEnter={self.onEnter}/>
                { self.state.listMode == 'shoplist' && <ShopSearchList list={self.state.searchedList}/>}
                <ShopSearchHistory onHide={self.onHideHistory} onClickHistory={self.onClickHistory} ref="searchHistory" style={{display:historyHide}}/>
            </div>
        );
    }
});

var ShopSearchInput = React.createClass(
{
    handleKeyDown : function( e )
    {
        if( e.keyCode == 13 )
        {
            var input = ReactDOM.findDOMNode( e.target );
            var word = input.value;
            if( word.length > 0 )
            {
                this.props.onEnter( word );
                //input.value = '';
                $(input).blur();
            }
        }
    },

    onBtnSearch : function()
    {
        var input = ReactDOM.findDOMNode( this.refs['searchHistoryInput'] );
        var word = input.value;
        if( word.length > 0 )
        {
            this.props.onEnter( word );
            //input.value = '';
        }
    },

    setInputValue : function( word )
    {
        var input = ReactDOM.findDOMNode( this.refs['searchHistoryInput'] );
        input.value = word;
    },

    render : function()
    {
        var self = this;
        return (
            <div className="search-wordbox">
                <div className="search-wordbox-inner fix">
                    <a className="btn-shop-search" href="javascript:void(0);" onClick={self.onBtnSearch}><i className="fa fa-search"></i></a>
                    <span className="inp-type2">
                        <input type="search" placeholder="검색어를 입력하세요" ref="searchHistoryInput" onFocus={self.props.onInputFocused} onBlur={self.props.onInputBlur} onKeyDown={self.handleKeyDown}/>
                    </span>
                </div>
            </div>
        );
    }
});

var ShopSearchList = React.createClass(
{
    onBtnBookmark : function( idx )
    {

    },

    render : function()
    {
        var self = this;
        var emptyLayout = function()
        {
            return (
                <div className="no-data">
                    <div className="no-data-ment">
                        <p>검색된 매장이없습니다.</p>
                    </div>
                </div>
            );
        }

        var listLayout = function()
        {
            return self.props.list.map( function( info, idx )
            {
                return (<ShopInfo info={info} key={info.shop_idx} onBtnBookmark={self.onBtnBookmark.bind(self,idx)}/>);
            });
        }

        return (
            <div className="search-history-list">
                <div className="search-list-inner">
                    { this.props.list.length == 0 && emptyLayout()}
                    { this.props.list.length != 0 && listLayout()}
                </div>
            </div>
        );
    }
});

var ShopSearchHistory = React.createClass(
{
    getInitialState : function()
    {
        var list = this.getHistory();
        var state =
        {
            searchHistory : list
        };
        return state;
    },

    componentDidMount : function()
    {

    },

    getHistory : function()
    {
        var storage = $.localStorage;
        var list = storage.get('searchHistory');
        if( list == null )
            return [];
        return list;
    },

    addHistory : function( word )
    {
        var storage = $.localStorage;
        var list = this.getHistory();

        //  리스트에 없으면 추가.
        if( list.indexOf( word ) < 0 )
        {
            list.push( word );
            storage.set( 'searchHistory', list );
            this.setState( { searchHistory : list } );
        }
    },

    delHistory : function( word )
    {
        var storage = $.localStorage;
        var list = this.getHistory();

        //  리스트에 있으면 삭제.
        var index = list.indexOf( word );
        if( index >= 0 )
        {
            list.splice( index, 1 );
            storage.set( 'searchHistory', list );
            this.setState( { searchHistory : list } );
        }
    },

    delAll : function()
    {
        var storage = $.localStorage;
        var list = [];
        storage.set( 'searchHistory', list );
        this.setState( { searchHistory : list } );
    },

    onBtnDelHistory : function( word )
    {
        this.delHistory( word );
    },

    render : function()
    {
        var self = this;
        var historyList = function()
        {
            return self.state.searchHistory.map( function( history, idx )
            {
                return (
                    <li key={history}>
                        <a className="search-word" href="javascript:void(0);" onClick={self.props.onClickHistory.bind(null,history)}>{history}</a>
                        <a className="btn-del" href="javascript:void(0);" onClick={self.onBtnDelHistory.bind(self,history)}>삭제</a>
                    </li>
                );
            });
        };

        return(
            <div className="search-result" style={this.props.style}>
                <div className="delet-all">
                    <a className="btn-history-hidden" href="javascript:void(0);" onClick={this.props.onHide}><span>숨김</span></a>
                    <a className="btn-search-clear" href="javascript:void(0);" onClick={this.delAll}><span>모두</span></a>
                </div>
                <div className="search-history">
                    <ul>
                    {historyList()}
                    </ul>
                </div>
            </div>
        );
    }
});

