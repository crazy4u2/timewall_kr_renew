/*********************************************************************************
 * CouponInfo class
 * html template
 *********************************************************************************/
var CouponInfo = React.createClass({
    getInitialState:function() {
        return ({list:['']});
    },
    componentDidMount:function()
    {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        var _this = this;
        var _data = { coupon_master_idx:parseInt(_this.props.coupon_master_idx) };

        twCommonUi.getApiData
        (
            {
                'url':loc[16].api[0],
                'type':'json',
                'method':'post',
                'data':_data
            },
            'html',
            React.addons,
            function(listType,resp,reactAddons)
            {
                var _newList = twCommonUi.getApiList( _this, listType, resp, reactAddons );
                console.log( 'CouponInfo::didMount AJAX : ', _newList );

                // ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                if( _this.isMounted() )
                {
                    _this.setState({ list: _newList.list[0].ResultData });

                    //교환하기 클릭
                    jQuery('.notice-agreebox .btn-type3').on('tap',function(e)
                    {
                        e.stopPropagation();

                        if(jQuery('.notice-agreebox .inp-check').hasClass('active')) {
                            console.log('dd');
                        }
                    });

                    //data-shop-name={coin.shop_name} data-lat={coin.shop_latitude} data-lng={coin.shop_longitude}
                    //매장 지도 보기
                    jQuery('.view-info .btn-shop-map').on('tap',function(e) {
                        e.stopPropagation();

                        jQuery('.modal.modal-map .map').css({
                            'width':'100%',
                            'height':jQuery(window).height() - jQuery('.modal.modal-map .content-header').height()
                        });

                        var _category=[{
                            shop_latitude: jQuery(this).attr('data-lat'),
                            shop_longitude: jQuery(this).attr('data-lng'),
                            shop_category: jQuery(this).attr('data-category'),
                            shop_name: jQuery(this).attr('data-shop-name')
                        }];

                        jQuery('.modal.modal-map .content-header h3').text(_category[0].shop_name);
                        twCommonUi.showModal(jQuery('.modal.modal-map'));

                        twCommonUi.initialGoogleMap(
                            {
                                lat: _category[0].shop_latitude,
                                lng: _category[0].shop_longitude
                            },
                            null,
                            [
                                {
                                    lat: 0,
                                    lng: 0,
                                    title: 'Lima',
                                    details: {
                                        database_id: 42,
                                        author: 'HPNeo'
                                    },
                                    title: 'Marker with InfoWindow',
                                    infoWindow: {
                                        content: '<p>' + jQuery('.shop-banner .txt').text() + '</p>'
                                    },
                                    click: function (e) {
                                        console.log('You clicked in this marker');
                                    }
                                }

                            ],
                            '.map',
                            'static'
                        );

                        twCommonUi.initMarker(_category, 'static');

                    });

                    //매장 상세 보기
                    jQuery('.view-info .btn-shop-detail').on('tap',function(e) {
                        e.stopPropagation();
                        location.href="#/shop-detail/"+_newList.list[0].ResultData[0].Shop_idx+"?lat="+_newList.list[0].ResultData[0].shop_latitude+"&lng="+_newList.list[0].ResultData[0].shop_longitude;
                    });

                    //교환하기
                    jQuery('.notice-agreebox .btn-type3').on('tap',function(e) {
                        e.stopPropagation();

                        if(jQuery('.notice-agreebox .inp-check').hasClass('active')) {

                            var _data_member={
                                    u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
                                },
                                _data_coupon={
                                    u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                    coupon_master_idx:_newList.list[0].ResultData[0].coupon_master_idx
                                };
                            //쿠폰 교환
                            reqwest({
                                url: loc[16].api[2], //회원 정보 조회
                                method: 'post',
                                type: 'json',
                                data: _data_member
                            })
                            .then(function (resp) {
                                /*************************
                                 resp.ResultCode
                                 '1'=success
                                 '-1'=fail
                                 *************************/
                                if (resp[0].ResultCode == '1') { //회원정보 조회 성공
                                    //0 : 임시회원 ,1: 정상회원, -1 : 탈퇴 요청, -2: 탈퇴 완료 (계정 삭제), -3: 블럭 , -4 : 임시회원 데이터이전 완료
                                    if(resp[0].ResultData[0].u_status>0) {
                                        //내가 가진 min보다 쿠폰 min이 더 크면 교환하지 않는다.
                                        if(resp[0].ResultData[0].min>=jQuery('.min-point em').text()) {
                                            jQuery('.message .coupon-detail').text(resp[0].ResultData[0].coupon_master_descriptionon);
                                            jQuery('.message .exchange-min span:first').text(_this.state.min);
                                            twCommonUi.showModal(jQuery('.modal.modal-coupon-exchange'));

                                            jQuery('.modal.modal-coupon-exchange .btn-type1').on('tap',function() {
                                                //쿠폰 교환
                                                reqwest({
                                                    url: loc[16].api[1], //쿠폰 교환
                                                    method: 'post',
                                                    type: 'json',
                                                    data: _data_coupon
                                                })
                                                .then(function (resp) {
                                                    /*************************
                                                     resp.ResultCode
                                                     '1'=success
                                                     '-1'=fail
                                                     *************************/
                                                    if (resp[0].ResultCode == '1') { //쿠폰 교환성공
                                                        twCommonUi.hideModal(jQuery('.modal.modal-coupon-exchange'));

                                                        setTimeout(function() {
                                                            twCommonUi.showModal(jQuery('.modal.modal-exchange-complete'));

                                                            jQuery('.modal.modal-exchange-complete .btn-type1').on('tap',function(e) {
                                                                e.stopPropagation();
                                                                location.href='#/my-coupon-use/'+resp[0].coupon_idx;
                                                            });
                                                        },300);
                                                    } else if(resp[0].ResultCode == '-70000') { //보유 민이 적으면 모달 창
                                                        twCommonUi.hideModal(jQuery('.modal'));
                                                        setTimeout(function() {
                                                            twCommonUi.showModal(jQuery('.modal.modal-not-enought'));
                                                        },300);
                                                    }
                                                })
                                                .fail(function (err, msg) {
                                                    console.log(err);
                                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                                });

                                            });
                                        } else {
                                            twCommonUi.showModal(jQuery('.modal.modal-not-enought'));
                                        }
                                    } else {
                                        twCommonUi.showModal(jQuery('.modal.modal-need-join'));
                                    }
                                } else {
                                }
                            })
                            .fail(function (err, msg) {
                                console.log(err);
                                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                            });

                        }
                    });

                    React.render(React.createElement(ModalAll, {couponInfo:_newList.list[0].ResultData[0]}), document.getElementsByClassName('modal-wrap')[0]);
                }

                //enable scroll to set data
                //twCommonUi.scrollLoading = true;
            }
        );

    },
    render : function ()
    {
        var _contents=null;
        var _contents_detail = function( coupon, idx )
        {
            var _coupon_kind =
            {
                cls:'',
                txt:''
            };
            var _coupon_background = { 'background-image':'url('+coupon.cafe_logo+')' };
            var _shop_background = { 'background-image':'url('+coupon.shop_logo_image+')' };
            var _coin_save_yn = null;
            var _width_70 = { 'width':'70px' };
            var _width_fluid = { 'width':'*' };
            var _coupon_note1 = null;
            var _coupon_note2 = null;
            var _coupon_note3 = null;
            var _coupon_note4 = null;
            var _coupon_note5 = null;
            var _coupon_note6 = null;
            var _coupon_useable_dayofweek1 = null;
            var _txt = null;
            var _hanareum = null;
            var _paybackCoin = coupon.coupon_use_coin_back + 'coin';

            if( coupon.shop_coin_save_yn == 'Y' )
            {
                //코인 적립 데이터가 없음
                _coin_save_yn = <div className="info-notice">구매한 쿠폰 사용시 <span>{_paybackCoin}</span>이 적립됩니다!</div>;
                _txt = <span className="useable-shop">사용가능매장</span>;
            }

            if( coupon.coupon_type == 1 ) //할인
            {
                _coupon_kind.cls = ' discount';
                _coupon_kind.txt = 'cupon 할인';
            }
            else if( coupon.coupon_type == 2 ) //증정
            {
                _coupon_kind.cls = ' freebies';
                _coupon_kind.txt = 'cupon 사은품';
            }
            else if( coupon.coupon_type == 3 ) //1+1
            {
                _coupon_kind.cls = ' plus';
                _coupon_kind.txt = 'cupon 플러스';
            }
            else //무료
            {
                _coupon_kind.cls = ' free';
                _coupon_kind.txt = 'cupon 무료';
            }

            if(coupon.note1 == 1) {
                _coupon_note1 = <li>타쿠폰 중복할인 불가능</li>;
            }
            if(coupon.note2 == 1) {
                _coupon_note2 = <li>타쿠폰 중복할인 가능</li>;
            }
            if(coupon.note3 == 1) {
                _coupon_note3 = <li>할인메뉴와 함께 사용불가능</li>;
            }
            if(coupon.note4 == 1) {
                _coupon_note4 = <li>세트메뉴와 함께 사용불가능</li>;
            }
            if(coupon.note5 == 1) {
                _coupon_note5 = <li>코인사용 시 사용불가능</li>;
            }
            if(coupon.note6 != null) {
                _coupon_note6 = <li>{coupon.note6}</li>;
            }
            if(coupon.coupon_useable_dayofweek1 == 1) {
                _coupon_useable_dayofweek1 = <li>매일</li>;
            }
            if(coupon.coupon_useable_dayofweek1 == 2) {
                _coupon_useable_dayofweek1 = <li>평일</li>;
            }
            if(coupon.coupon_useable_dayofweek1 == 3) {
                _coupon_useable_dayofweek1 = <li>주말 제외</li>;
            }
            if(coupon.coupon_useable_dayofweek1 == 4) {
                _coupon_useable_dayofweek1 = <li>주말 및 공휴일 제외</li>;
            }

            if(coupon.cafe_idx == 0){
                _hanareum = '';
            } else {
                _hanareum = <span class="hanareum" style={_coupon_background}>한아름 제휴</span>;
            }




            return (
                <div>
                    <div className="view-coupon">
                        <div className="coupon-imgbox">
                            <div className="imgarea">
                                <div className={"coupon-kind"+_coupon_kind.cls}>
                                    {_coupon_kind.txt}
                                    {_hanareum}
                                </div>
                            </div>

                            <div className="coupon-top-info">
                                <strong className="coupon-detail">{coupon.coupon_master_name}</strong>
                                <div className="info">
                                    <div className="coupon-until"><span>{coupon.coupon_startdate}</span>부터 <span>{coupon.coupon_enddate}</span>까지</div>
                                    <div className="txt">{coupon.coupon_masterdescription}</div>
                                </div>
                            </div>

                        </div>

                        {_coin_save_yn}
                    </div>

                    <div className="view-coupon-txt">
                        <p className="paper-min"><strong>1</strong>매 <span className="min-point"><em>{coupon.coupon_min_point}</em>min</span></p>
                        <div className="view-info">
                            <span className="shop-logo" style={_shop_background}></span>
                            {_txt}
                            <strong className="coupon-shop-name">{coupon.shop_name}</strong>
                            <div className="tb-shop-info">
                                <table>
                                    <caption>매장정보</caption>
                                    <colgroup>
                                        <col style={_width_70} />
                                        <col style={_width_fluid} />
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th scope="row">주소</th>
                                        <td>{coupon.shop_address}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">전화번호</th>
                                        <td><a href={"tel:"+coupon.shop_phone}>{coupon.shop_phone}</a></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">영업시간</th>
                                        <td>{coupon.shop_open_time}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">휴무일</th>
                                        <td>{coupon.shop_holiday}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">홈페이지</th>
                                        <td><a href={coupon.shop_url} target="_blank">{coupon.shop_url}</a></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <a className="btn-shop-map" data-shop-name={coupon.shop_name} data-lat={coupon.shop_latitude} data-lng={coupon.shop_longitude} data-category={coupon.coupon_category} href="javascript:void(0);">지도로 가기</a>
                                <a className="btn-shop-detail" href="javascript:void(0);">매장상세정보로가기</a>
                            </div>

                            <div className="notice">
                                <p className="notice-title">쿠폰 사용 시 주의사항</p>
                                <ul>
                                    {_coupon_note1}
                                    {_coupon_note2}
                                    {_coupon_note3}
                                    {_coupon_note4}
                                    {_coupon_note5}
                                    {_coupon_note6}
                                    {_coupon_useable_dayofweek1}
                                </ul>
                                <p className="notice-title">타임월렛 주의사항</p>
                                <ul>
                                    <li>- 본 매장 어디서든 사용가능 (단, 역사점은 불가능)</li>
                                    <li>- 타 쿠폰과 중복사용 불가</li>
                                    <li>- 예약 필수</li>
                                    <li>- 주말 및 공휴일 제외</li>
                                    <li>- 사용기간 : 발급일로부터 7일</li>
                                </ul>
                            </div>

                        </div>

                    </div>

                    <div className="notice-agreebox">
                        <div className="inp-check">
                            <input type="checkbox" id="check1" name="noticeAgree" />
                            <label for="check1">
                                <span className="box"><em className="box-dot"></em></span>
                                <span className="text">위 주의사항에 동의합니다.</span>
                            </label>
                        </div>
                        <div className="btn-wrap">
                            <a className="btn-type3" href="javascript:void(0);">교환하기</a>
                        </div>
                    </div>

                </div>
            );
        };

        console.log( '쿠폰정보 : ', this.state );
        if(this.state.list[0]!='')
        {
            if( this.state.list.length > 0 )
            {
                _contents=this.state.list.map(_contents_detail);
            }
        }

        return (
            <div className={"page "+loc[16].pageName+" "+this.props.position}>
                <div className="contentsScroll">
                    {_contents}
                </div>

            </div>
        )
    }
});

/**********************************
 * 리뷰관련 모달
 ********************************/
var ModalAll = React.createClass({
    render: function () {

        var props = {
            display: 'none',
            position: 'absolute',
            top: '100px',
            width: '100%',
            zIndex: '200'
        };

        return (
            <div>
                <ModalMap dataStyle={props} />
                <ModalCoupon dataStyle={props} couponInfo={this.props.couponInfo} />
            </div>
        )
    }
});

/*********************************************************************************
 * modalmap class
 * html template
 *********************************************************************************/
var ModalMap = React.createClass({
    componentDidMount:function() {

        jQuery('.modal.modal-map .btn-close').on('tap',function() {
            twCommonUi.hideModal(jQuery('.modal.modal-map'));
            jQuery('.modal.modal-map .map').empty();
        });
    },
    render : function () {
        return (
            <section className="modal modal-map" style={this.props.dataStyle}>
                <div className="modal-inner">
                    <div className="modal-content">
                        <div className="content-header">
                            <h3></h3>
                            <a className="btn-close" href="javascript:void(0);">닫기</a>
                        </div>
                        <div className="map">
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modalcoupon class
 * html template
 *********************************************************************************/
var ModalCoupon = React.createClass({
    componentDidMount:function() {
        //로그인 버튼
        jQuery('.modal.modal-need-join .btn-type2').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal'));
            location.href="#/member-login";
        });

        //회원가입 버튼
        jQuery('.modal.modal-need-join .btn-type1').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal'));
            location.href="#/member-join";
        });

        //min 부족 확인 버튼
        jQuery('.modal.modal-not-enought .btn-type1').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-not-enought'));
        });

        //쿠폰 교환 취소 버튼
        jQuery('.modal.modal-coupon-exchange .btn-type2').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-coupon-exchange'));
        });

        //쿠폰 교환 완료 닫기 버튼
        jQuery('.modal.modal-exchange-complete .btn-type2').on('tap',function(e) {
            e.stopPropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-exchange-complete'));
        });


    },
    render : function () {
        var _coupon=this.props.couponInfo,
            _coupon_kind={
                cls:'',
                txt:''
            },
            _coupon_background={
                'background-image':'url('+_coupon.cafe_logo+')'
            },
            _hanareum = null;
        console.log(_coupon);
        if(_coupon.coupon_type==1) { //할인
            _coupon_kind.cls = ' discount';
            _coupon_kind.txt = 'cupon 할인';
        } else if(_coupon.coupon_type==2) { //증정
            _coupon_kind.cls = ' freebies';
            _coupon_kind.txt = 'cupon 사은품';
        } else if(_coupon.coupon_type==3) { //1+1
            _coupon_kind.cls = ' plus';
            _coupon_kind.txt = 'cupon 플러스';
        } else { //무료
            _coupon_kind.cls = ' free';
            _coupon_kind.txt = 'cupon 무료';
        }

        if(_coupon.cafe_idx == 0){
            _hanareum = '';
        } else {
            _hanareum = <span class="hanareum" style={_coupon_background}>한아름 제휴</span>;
        }

        return (
            <div>
                <section className="modal modal-small modal-need-join" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type3"></div>

                        <div className="modal-content">
                            <div className="message">
                                <span className="text-type1">쿠폰을 사용하기 위해서는 <br />로그인이 필요합니다.</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">로그인</a>
                                <a className="btn-type1" href="javascript:void(0);">회원가입</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="modal modal-small modal-not-enought" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type3"></div>

                        <div className="modal-content">
                            <div className="message">
                                <span className="text-type1">min이 부족합니다.</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </section>

                <section className="modal modal-coupon-exchange" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className={"coupon-kind"+_coupon_kind.cls}>
                                {_hanareum}
                                {_coupon_kind.txt}
                            </div>
                        </div>

                        <div className="modal-content">
                            <div className="message">
                                <p className="coupon-detail">{_coupon.coupon_use_description}</p>
                                <p className="exchange-min"><strong><span>{_coupon.coupon_min_point}</span>min</strong></p>
                                <p className="text-type1">교환하시겠습니까?</p>
                                <p className="text-type5">교환된 쿠폰은 나의쿠폰에서 확인가능합니다.</p>
                            </div>
                        </div>

                        <div className="modal-footer fix">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">취소</a>
                                <a className="btn-type1" href="javascript:void(0);">확인</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="modal modal-small modal-exchange-complete" style={this.props.dataStyle}>
                    <div className="modal-inner">
                        <div className="modal-header icon-type4"></div>

                        <div className="modal-content">
                            <div className="message">
                                <span className="text-type1">교환이 완료되었습니다.</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="btnbox">
                                <a className="btn-type2" href="javascript:void(0);">닫기</a>
                                <a className="btn-type1" href="javascript:void(0);">바로사용</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
});


