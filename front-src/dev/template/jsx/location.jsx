/*********************************************************************************
 * modal class
 * html template
 * set location modal
 *********************************************************************************/
var ModalSetLocation = React.createClass({
    componentDidMount:function(){

        jQuery('.list-location').height(jQuery(window).height()-45);
        jQuery('.btn-location-close').off('tap').on('tap',function(e) {
            e.stopImmediatePropagation();
            twCommonUi.closeRegionAccordion();
        })

    },
    render : function() {
        var _contents=null;
        _contents=<ModalSetLocationSi />;

        return (
            <section className="modal modal-location" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-contents">
                        <div className="location-header">
                            <h3>지역설정</h3>
                            <a className="btn-location-close" href="javascript:void(0);">닫기</a>
                        </div>
                        <div className="list-location">
                            {_contents}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

var ModalSetLocationSi = React.createClass({
    props:null,
    getInitialState:function() {
        return {list:['']}
    },
    componentDidMount:function(){
        var _this=this,
            props=null;

        twCommonUi.getApiData(
            {
                'url':loc[0].api[3],
                'type':'json'
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons) {
                var _newList=twCommonUi.getApiList(_this, listType,resp,reactAddons).list[0].ResultData,
                    _addrs=[],
                    _infos=[];

                Lazy(twCommonUi.getApiList(_this, listType,resp,reactAddons).list[0].ResultData).each(function(d,k) {

                    if(_addrs.length>0) {
                        if (_addrs[_addrs.length-1].si != d.si) {
                            _infos=[];

                            _addrs.push(
                                {
                                    'si': d.si,
                                    'data_gu':_infos
                                }
                            );

                        }
                    } else {
                        _addrs.push(
                            {
                                'si': d.si,
                                'data_gu':_infos
                            }
                        );
                    }

                    _infos.push(
                        {
                            "gu": d.gu,
                            "idx": d.idx,
                            "addr": d.addr
                        }
                    );

                });

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        list: _addrs
                    });

                }
            }
        );

    },
    render: function () {
        var _siItem=null,
            _guItem=[],
            _createItem=function(data,index) {
                var _contents=<ModalSetLocationGu items={data.data_gu} />;
                return (
                    <li className="siList" key={index}>
                        <div className="select"><a href="javascript:void(0);" className="city">{data.si}<i className="fa fa-caret-down"></i></a></div>
                        {_contents}
                    </li>
                )
            };

        if(this.state.list[0]!='') {
            if (this.state.list.length > 0) {
                _siItem=this.state.list.map(_createItem);
            }
        }

        return (
            <ul>
                {_siItem}
            </ul>
        )
    }
});

var ModalSetLocationGu = React.createClass({
    getInitialState:function() {
        return {list:['']}
    },
    componentDidMount:function(){
        var _this=this;

        //setState excute react render
        if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
            _this.setState({
                list: this.props.items
            });

        }

    },
    render: function () {
        var _createItem=function(data,index) {

                var _contents=null;

                if(data.gu.length>1) {
                    _contents = <a href="javascript:void(0);" className="state">{data.gu}</a>;
                }

                return (
                    <li key={index}>
                        {_contents}
                    </li>
                )
            },
            _guItem=null;

        if(this.state.list[0]!='') {
            if (this.state.list.length > 0) {
                _guItem=this.state.list.map(_createItem);
            }
        }
        return (
            <ul className="sub">
                {_guItem}
            </ul>
        )
    }
});

