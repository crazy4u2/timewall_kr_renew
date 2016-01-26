(function(loc) {

    /**********************************
     * connect beacon state modal
     * 위치검색 modal
     ********************************/
    twCommonUi.scriptLoadNext(
        [
            _domainJsx+'shop_state.js',
            _domainJsx+'shop_state_modal.js'
        ]
        ,true
        ,function() {
            setTimeout(function() {
                React.render(React.createElement(ModalAddMinAll, null), document.getElementsByClassName('modal-wrap-beacon')[0]);
            },100)
        }
    );

    /*
     *  @excute router
     */
    var options = {ignorecase: true},
        router = new Router(options),
        App=null;

    App = React.createClass({
        mixins: [PageSlider],
        componentDidMount: function () {
            var _this=this;

            router.addRoute(loc[0].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                var l=loc[0];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-member').show();
                    jQuery('.header-member .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[0].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[0].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[1].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                var l=loc[1];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-member').show();
                    jQuery('.header-member .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class', 'container ' + loc[1].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[1].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[2].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                var l=loc[2];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-member').show();
                    jQuery('.header-member .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class', 'container ' + loc[2].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[2].contentsClass);
                    }, 100);
                });
            })
             .addRoute(loc[3].hash+"/:u_idx", function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                var l=loc[3];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-member').show().addClass('complete');
                    jQuery('.header-member .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,userIdx:req.params.u_idx}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[3].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[3].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[4].hash+"/:u_idx", function (req) {
                    console.log()
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                var l=loc[4];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-member').show().addClass('complete');
                    jQuery('.header-member .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,userIdx:req.params.u_idx}));

                    jQuery('.container').attr('class', 'container ' + loc[4].containerClass);
                    jQuery('.container .contents').attr('class', 'contents ' + loc[4].contentsClass);
                });
            })
            .addRoute(loc[5].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                    state();
                var l=loc[5];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-shop').show();

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[5].containerClass);

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[5].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[5].contentsClass);
                    }, 100);

                });
            })
            .addRoute(loc[6].hash+'/:sidx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[6];

                _shopInfo.shop_idx=req.params.sidx;
                if(req.query) {
                    _shopInfo.lat=req.query.lat;
                    _shopInfo.lng=req.query.lng;
                }

                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[6].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[6].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[7].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[7];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-shopmap').show();
                    jQuery('.header-shopmap .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[7].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[7].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[8].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                    state();
                var l = loc[8];
                twCommonUi.scriptLoadNext([l.template],true, function () {
                    jQuery('.header-inner').hide();
                    jQuery('.header-shopmap').show();

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[8].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[8].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[8].contentsClass);
                    }, 100);
                })
            })
            .addRoute(loc[9].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[9];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show().find('.title').text(l.pageTitle);
                    //jQuery('.container').hide();
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[9].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[9].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[9].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[10].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[10];
                twCommonUi.scriptLoadNext([l.template],true, function () {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[10].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[10].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[10].contentsClass);
                    }, 100);
                })
            })
            .addRoute(loc[11].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[11];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[11].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[11].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[11].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[12].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[12];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[12].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[12].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[13].hash+'/:d_idx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[13];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName, d_idx:req.params.d_idx}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[13].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[13].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[14].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[14];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[14].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[14].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[15].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[15];

                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[15].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[15].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[16].hash+'/:coupon_master_idx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[16];

                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,coupon_master_idx:req.params.coupon_master_idx}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[16].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[16].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[17].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[17];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[16].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[16].contentsClass);
                    },100);
                });
            })
            .addRoute(loc[18].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[18];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[18].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[18].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[19].hash+'/:coupon_idx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[19];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,coupon_idx:req.params.coupon_idx}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[19].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[19].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[20].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[20];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[20].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[20].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[21].hash, function (req) { // 공지사항.
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[21];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[21].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[21].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[22].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[22];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[22].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[22].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[23].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[23];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[23].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[23].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[24].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[24];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[24].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[24].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[25].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[25];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[25].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[25].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[26].hash, function (req) { // FAQ
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[26];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);
                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[26].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[26].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[27].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                    state();
                var l=loc[27];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-coin-coupon').show();
                    jQuery('.header-coin-coupon .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[27].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[27].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[27].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[28].hash+'/:coupon_idx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                state();
                var l=loc[28];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-coin-coupon').show();
                    jQuery('.header-coin-coupon .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,coupon_idx:req.params.coupon_idx,shop_idx:req.query.shop_idx}));

                    jQuery('body').attr('class', loc[28].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[28].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[28].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[29].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                state();
                var l=loc[29];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[29].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[29].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[29].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[30].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                state();
                var l=loc[30];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[30].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[30].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[30].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[31].hash+'/:coupon_idx', function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                state();
                var l=loc[31];

                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-other').show();
                    jQuery('.header-other .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName,coupon_idx:req.params.coupon_idx}));

                    setTimeout(function() {
                        jQuery('.container').attr('class','container '+loc[31].containerClass);
                        jQuery('.container .contents').attr('class','contents '+loc[31].contentsClass);
                    }, 100);
                });
            })
            .addRoute(loc[32].hash, function (req) {
                jQuery('.modal').hide();
                jQuery('.shadow, .innerShadow').hide();
                jQuery('.header').data('map',null);
                jQuery('.header').data('shoplist',null);
                state();
                var l=loc[32];
                twCommonUi.scriptLoadNext([l.template],true,function() {
                    jQuery('.header-inner').hide();
                    jQuery('.header-menu').show();
                    jQuery('.header-menu .title').text(l.pageTitle);

                    _this.slidePage(React.createElement(window[l.className], {key: l.pageName}));

                    jQuery('body').attr('class', loc[32].contentsClass);
                    setTimeout(function () {
                        jQuery('.container').attr('class', 'container ' + loc[32].containerClass);
                        jQuery('.container .contents').attr('class', 'contents ' + loc[32].contentsClass);
                    }, 100);
                });
            })

        }
    });

    React.render(React.createElement(App, null), document.getElementsByClassName('contents')[0]);

    function state() {
        setTimeout(function() {
                if (!location.href.match('shop-map')) {
                    /*
                     jQuery('.state-bottombox').removeClass('type2').addClass('type1');
                     jQuery('.bottombox-item .item-list').hide();
                     */
                    React.render(React.createElement(ShopState, {type:'type1',data:null}), document.getElementsByClassName('beaconState')[0]);

                    jQuery('.state-bottombox').removeClass('type2').addClass('type1');
                } else {
                    jQuery('.state-bottombox').removeClass('type1').addClass('type2');
                    /*
                     jQuery('.state-bottombox').removeClass('type1').addClass('type2');
                     jQuery('.bottombox-item .item-list').show();
                     */
                    //React.render(React.createElement(ShopState, {type:'type2'}), document.getElementsByClassName('beaconState')[0]);
                    //React.render(React.createElement(ShopState, {type:'type2',data:null}), document.getElementsByClassName('beaconState')[0]);
                }
        },200);

    }
}(loc));