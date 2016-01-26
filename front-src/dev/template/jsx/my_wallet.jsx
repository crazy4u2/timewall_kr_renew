/****************************************************************************
 * 나의 월렛
 *
 ***************************************************************************/
var MyWallet = React.createClass({
    _memStatus : null,
    getInitialState:function() {
        return ({my_coin:'',my_min:'',reg_date:'',auto_exchange:false});
    },
    componentDidMount : function () {
        var _this = this,
            settingInfo = null,
            _data = {
            'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            //'u_idx' : 1 // 로그인 안된 회원용 테스트 값 or 테스트용 회원
        };

        reqwest({
            url : loc[14].api[3],
            method : loc[14].method,
            type : loc[14].type,
            data : _data
        })
        .then(function(resp) {
            if(resp[0].ResultCode == 1) {
                var _my_min = twCommonUi.setComma(resp[0].ResultData[0].min),
                _my_coin = twCommonUi.setComma(resp[0].ResultData[0].coin),
                _reg_date = resp[0].ResultData[0].regdate.substring(0,10);
                _this._memStatus = resp[0].ResultData[0].u_status;
                if(_this._memStatus < 1) {
                    //alert('로그인 후에 쿠폰과 코인을 사용하실 수 있습니다.');
                    BRIDGE.appAlert({title:"",msg:"로그인 후에 쿠폰과 코인을 사용하실 수 있습니다."});
                    return false;
                }

                // ajax 호출 후 응답이 왔을 때 자동코인교환 여부를 그림.
                BRIDGE.getUserOption(function(getInfo) {
                    settingInfo = getInfo;
                    _this.setState({
                        my_coin : _my_coin,
                        my_min : _my_min,
                        reg_date : _reg_date,
                        auto_exchange : getInfo.AUTO_EXCHANGE_COIN
                    });
                    jQuery('.onoffswitch-label').off('tap').on('tap', function() {
                        var checkSw = jQuery(this).attr('for');
                        if(checkSw == 'push2'){
                            if(getInfo.AUTO_EXCHANGE_COIN) {
                                BRIDGE.setUserOption({
                                    AUTO_EXCHANGE_COIN : false
                                });
                                /*BRIDGE.getUserOption(function(getInfo) {
                                    console.log(getInfo);
                                });*/
                            } else {
                                BRIDGE.setUserOption({
                                    AUTO_EXCHANGE_COIN : true
                                });
                                /*BRIDGE.getUserOption(function(getInfo) {
                                    console.log(getInfo);
                                });*/
                            }
                        }
                    });
                });
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });

        jQuery('.drop-out').on('tap', function(e) {
            e.stopImmediatePropagation();
            twCommonUi.showModal(jQuery('.modal.modal-member-drop'));
        });

        jQuery('.change-pw').off('tap');
        jQuery('.change-pw').on('tap', function(e) { // 비밀번호 변경 클릭.
            e.stopImmediatePropagation();
            setTimeout(function(){
                twCommonUi.showModal(jQuery('.modal.modal-change-password'), 'noKbd');
            }, 350);
        });

        jQuery('.change-info').on('tap', function(e) {
            e.stopImmediatePropagation();
            setTimeout(function(){
                twCommonUi.showModal(jQuery('.modal.modal-member-info-change'));
            }, 350);
        });

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });

        twCommonUi.setContentsHeight();

        jQuery('.shared').off('tap').on('tap', function(){
            BRIDGE.shareToSNS();
        });

        // 탈퇴 유의사항 알림 모달에서의 액션들

        // 회원 탈퇴 절차 모달에서 액션들.

        // 탈퇴 완료 모달에서의 액션들

        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);
    },
    render : function () {
        var _contents = null,
            _this = this;

            _createAfterLogin=function(item) {
                var _cls_check = null,
                    _cls_on = null;
                if(item.auto_exchange) {
                    _cls_check='checked';
                    _cls_on='on';
                }
                return (
                    <div className="menubox">
                        <div className="coin">
                            <div className="coin-button">
                                <a className="btn-coin-useful" href="#/coin-use">코인사용 가능</a>
                            </div>
                            <div className="show-number">
                                <p>나의 coin</p>
                                <strong className="my-coin">{item.my_coin}</strong>
                            </div>
                            <div className="onoffswitch-wrap">
                                <span className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className={"onoffswitch-checkbox "+_cls_on} checked={_cls_check} id="push2" />
                                    <label className="onoffswitch-label" htmlFor="push2">
                                        <span className="onoffswitch-inner"></span>
                                        <span className="onoffswitch-switch"></span>
                                    </label>
                                </span>
                            </div>
                        </div>
                    </div>
                )
            };
            _createBeforeLogin=function(item) {
                return (
                    <div className="menubox">
                        <div className="need-login">
                            <a href="#/member-login">로그인</a>
                            <a href="#/member-join">회원가입</a>
                        </div>
                    </div>
                )
            };
            _createItem=function(item) {
                var _cls_check='',
                    _cls_on = '',
                    _contentsLogin='';

                if( typeof _this._memStatus != 'undefined' ) {
                    if (_this._memStatus > -1) {
                        _contentsLogin = _createAfterLogin(item);
                        //console.log(_contentsLogin);
                    } else {
                        _contentsLogin = _createBeforeLogin(item);
                    }
                }

                return (
                    <div>
                        <div className={"menu-min-coin fix "+item.cls}>
                            <div className="menubox">
                                <div className="min">
                                    <div className="show-number">
                                        <p>나의 min</p>
                                        <strong className="my-min">{item.my_min}</strong>
                                    </div>
                                    <a className="btn-coin-exchange" href="#/coin-exchange">
                                        <i className="fa fa-hourglass-end"></i>
                                    </a>
                                </div>
                            </div>

                            {_contentsLogin}
                        </div>

                        <div className="my-menu">
                            <ul>
                                <li><a href="javascript:void(0)" className="shared">타임월렛 공유하기<i className="fa fa-angle-right"></i></a></li>
                                <li><a href="javascript:void(0)" className="change-pw">비밀번호 변경<i className="fa fa-angle-right"></i></a></li>
                                <li><a href="javascript:void(0)" className="change-info">회원정보 변경<i className="fa fa-angle-right"></i></a></li>
                                <li><a href="javascript:void(0)" className="drop-out">서비스탈퇴 신청<i className="fa fa-angle-right"></i></a></li>
                            </ul>
                            <div className="join-date">
                                <span>회원 가입일 : <strong>{item.reg_date}</strong></span>
                            </div>
                        </div>
                    </div>
                );
            };

        _contents=_createItem(this.state);

        return (
            <div className={"page "+loc[14].pageName+" "+this.props.position}>
                {_contents}

            </div>
        );
    }
});

/**************************************************
 * 탈퇴 완료
 * api에서 제대로 된 값이 왔을 경우 호출.
 **************************************************/
var ModalDropOutComplete = React.createClass({
    componentDidMount : function () {
        // 버튼 액션 시 bridge 호출
        jQuery('.modal-drop-complete .btn-type1').on('tap', function(e) {
            e.stopImmediatePropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-drop-complete'));
            //BRIDGE.openAgreementPage();
            BRIDGE.userUnregistered();
            BRIDGE.openAgreementPage();
        });
    },
    render : function() {
        return (
            <div className="modal modal-small modal-drop-complete" style={this.props}>
                <div className="modal-inner">
                    <div class="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type1">탈퇴되었습니다.<br />초기화면으로 돌아갑니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});


/***************************************************
 * 유의사항 알림 모달(임시)
 *
 **************************************************/
var ModalDropOutCaution = React.createClass({
    componentDidMount : function () {
        jQuery('.modal-member-drop .btn-type2').on('tap', function(e) {
            e.stopImmediatePropagation();
            console.log('btn-type2 클릭');
            twCommonUi.hideModal(jQuery('.modal.modal-member-drop'));
        });

        jQuery('.modal-member-drop .btn-type1').on('tap', function(e) {
            e.stopImmediatePropagation();
            console.log('btn-type1 클릭');
            twCommonUi.hideModal(jQuery('.modal.modal-member-drop'));

            setTimeout(function () {
                twCommonUi.showModal(jQuery('.modal.modal-password-alter'));
            }, 300);
        });
    },
    render : function () {
        return (
            <div className="modal modal-small modal-member-drop" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"><p class="text">탈퇴하기</p></div>
                    <div className="modal-content">
                        <div className="message">
                            <div className="drop-notice">
                                <p className="text-type1">
                                    서비스 탈퇴를 하시면 현재 보유하고 계신 <strong>min</strong>과 <strong>coin</strong> 및 <strong>쿠폰</strong>은 모두 소멸되며 재발행이 불가능합니다. <br />타임월렛 이용 기록은 모두 삭제되며 삭제된 데이터는 복구가 불가합니다.
                                </p>
                                <p className="really">정말로 탈퇴하시겠습니까?</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type1" href="javascript:void(0);">확인 및 탈퇴</a>
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

/***************************************************
 * 회원 탈퇴 (임시, 비밀번호 입력)
 *
 **************************************************/
var ModalDropOutCheck = React.createClass({
    componentDidMount : function() {
        jQuery('.modal-password-alter .btn-type2').on('tap', function(e) {
            e.stopImmediatePropagation();
            jQuery('.modal.modal-password-alter .password').val('');
            jQuery('.modal.modal-password-alter .comment').remove();
            twCommonUi.hideModal(jQuery('.modal.modal-password-alter'));
        });

        jQuery('.password').on('keyup', function(e) {
            e.stopImmediatePropagation();
            var _that = this;
            setTimeout(function() {
                if (jQuery(_that).val().length > 0) {
                    var result = twMember.getValidPassword(jQuery(_that).val());
                    jQuery(_that).closest('.error-log').find('p').remove();

                    if (result == '000') {
                        jQuery(_that).closest('.error-log').find('p').remove();
                    } else {
                        if (result == '001') {
                            jQuery(_that).closest('.error-log').find('p').remove();
                            jQuery(_that).closest('.error-log').append('<p class="comment notice">* 비밀번호 입력은 8~15자리로 입력하셔야 합니다.</p>');
                        } else {
                            jQuery(_that).closest('.error-log').find('p').remove();
                            jQuery(_that).closest('.error-log').append('<p class="comment notice">* 비밀번호는 숫자와 영문자를 혼용하셔야 합니다.</p>');
                        }
                    }
                } else {
                    jQuery(_that).closest('.error-log').find('p').remove();
                }
            }, 1);
        });

        jQuery('.modal-password-alter .btn-type1').on('tap', function(e) {
            e.stopImmediatePropagation();

            var _bSaveMember = twCommonUi.checkEnableJoinButton({
                'password' : jQuery('.password').val()
            }, jQuery('.modal-password-alter .btn-type1'), 'dropout');

            if (_bSaveMember.bResult) {
                var _password = jQuery('.password').val(),
                    _url = loc[14].api[0],
                    _data = {
                        'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                        'pwd' : _password
                    };

                if (device.checkDeviceType() == 'android') {
                    _os_type=1;
                } else if (device.checkDeviceType() == 'ios') {
                    _os_type=2;
                } else {
                    _os_type=0;
                }

                _webBridge.osType=_os_type;
                reqwest({
                    url : _url,
                    method : loc[14].method,
                    type : loc[14].type,
                    data : _data
                })
                .then(function (resp) {
                    console.log(resp);
                    if(resp[0].ResultCode == '1') { // 성공
                        twCommonUi.hideModal(jQuery('.modal.modal-password-alter'));
                        setTimeout(function () {
                            twCommonUi.showModal(jQuery('.modal.modal-drop-complete'));
                            //jQuery('.modal.modal-info-change-complete .modal-content').append(modalTitle);
                        }, 300);
                    } else if (resp[0].ResultCode == '-40008') { // 비밀번호 오류
                        // 에러메시지 출력.
                        jQuery('.error-log .comment').remove();
                        jQuery('.error-log').append('<p class="text-type4 left comment">* 비밀번호가 틀렸습니다.</p>');
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });
            }
        });
    },
    render : function() {
        return (
            <div className="modal modal-small modal-password-alter" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type7"></div>

                    <div className="modal-content error-log">
                        <div className="text-type1">본인확인</div>
                        <div className="modal-inputgroup">
                            <label htmlFor="present-password">비밀번호</label>
                            <div className="inp-type1">
                                <input type="password" id="present-password" className="password" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                        <div className="forget-password"><a href="#/member-search-pass">비밀번호를 잊으셨나요?</a> <i className="fa fa-unlock-alt"></i></div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">탈퇴하기</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

/***************************************************
 * 비밀번호 변경 모달.
 *
 **************************************************/
var ModalChangePassword = React.createClass({
    componentDidMount : function() {
        jQuery('.modal.modal-change-password .btn-type2').on('tap', function(e) {
            e.stopImmediatePropagation();
            jQuery('.modal.modal-change-password .password').val('');
            jQuery('.modal.modal-change-password .comment').remove();
            twCommonUi.hideModal(jQuery('.modal.modal-change-password'));
        });

        jQuery('.modal.modal-change-password .btn-type1').on('tap', function(e) {
            e.stopImmediatePropagation();
            var modalTitle = "비밀번호";

            var _bSaveMember = twCommonUi.checkEnableJoinButton({
                'pwd' : jQuery('.origin-pw').val(),
                'newPwd' : jQuery('.new-pw').val(),
                'newPwd2' : jQuery('.new-pw-check').val()
            }, jQuery('.modal.modal-change-password .btn-type1'), 'pw-change');

            if(_bSaveMember.bResult) {
                var _password = jQuery('.origin-pw').val(),
                    _new_pwd = jQuery('.new-pw').val(),
                    _new_pwd2 = jQuery('.new-pw-check').val(),
                    _url = loc[14].api[2],
                    _data = {
                        'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                        'pwd' : _password,
                        'newPwd' : _new_pwd,
                        'newPwd2' : _new_pwd2
                    };

                reqwest({
                    url: _url, // 비밀번호 변경 api 호출
                    method: loc[14].method,
                    type: loc[14].type,
                    data: _data
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp[0].ResultCode == '1') {
                        twCommonUi.hideModal(jQuery('.modal.modal-change-password'));
                        setTimeout(function(){
                            twCommonUi.showModal(jQuery('.modal.modal-info-change-complete'));
                            jQuery('.modal.modal-info-change-complete .modal-content .change-title').append(modalTitle);
                        },300);
                    } else if (resp[0].ResultCode == '-40008') {
                        jQuery('.error-log .comment').remove();
                        jQuery('.error-log').append('<p class="comment notice">* 비밀번호가 틀렸습니다.</p>');
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });
            }
        })
    },
    render : function() {
        return (
            <div className="modal modal-change-password" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type7">
                        <p className="text">비밀번호 변경</p>
                    </div>

                    <div className="modal-content error-log">
                        <div className="modal-inputgroup">
                            <label htmlFor="origin-pw">현재비밀번호</label>
                            <div className="inp-type1">
                                <input type="password" className="password origin-pw" name="origin-pw" id="origin-pw" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                        <div className="modal-inputgroup">
                            <label htmlFor="new-pw">새로운 비빌번호</label>
                            <div className="inp-type1">
                                <input type="password" className="password new-pw" name="new-pw" id="new-pw" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                        <div className="modal-inputgroup">
                            <label htmlFor="new-pw-check">비빌번호 확인</label>
                            <div className="inp-type1">
                                <input type="password" className="password new-pw-check" name="new-pw-check" id="new-pw-check" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

/***************************************************
 * 비밀번호 변경 알림 모달
 *
 **************************************************/
var ModalChangeOk = React.createClass({
    componentDidMount : function() {
        jQuery('.modal.modal-info-change-complete .btn-type2').on('tap', function(e) {
            e.stopImmediatePropagation();
            jQuery('.modal.modal-change-password .password').val('');
            jQuery('.modal.modal-change-password .comment').remove();
            twCommonUi.hideModal(jQuery('.modal.modal-info-change-complete'));
        });
    },
    render : function() {
        return (
            <div className="modal modal-small modal-info-change-complete" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <span className="text-type1"><strong className="change-title"></strong>가 성공적으로 변경되었습니다.</span>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">닫기</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

/***************************************************
 * 회원정보 변경
 *
 **************************************************/
var ModalChangeInfo = React.createClass({
    componentDidMount : function() {
        jQuery('.modal.modal-member-info-change .btn-type2').on('tap', function(e) {
            e.stopImmediatePropagation();
            twCommonUi.hideModal(jQuery('.modal.modal-member-info-change'));
        });
        var _this = this;
        jQuery('.inp-radio label').on('tap',function(e){
            e.stopPropagation();
            jQuery('.inp-radio').removeClass('active');
            jQuery('.inp-radio input[type=radio]').attr('checked',false);
            jQuery(this).closest('.inp-radio').addClass('active');
            jQuery(this).prev('input[type=radio]').attr('checked',true);
            _this.sex=jQuery('input[name=sex]:checked').val();
        });

        /***************
         * set year
         **************/
        twMember.setSelectYear(twMember.getCurrentDate().nowYear,jQuery('#sel1'));

        jQuery('#sel1').change(function(e) {
            e.stopPropagation();

            if(jQuery(this).val()) {
                /***************
                 * set month
                 **************/
                twMember.setSelectMonth(twMember.getCurrentDate().nowMonth,jQuery('#sel2'));
            } else {
                jQuery('#sel2').empty();
            }
        });

        /***************
         * after select month change, set day
         **************/
        jQuery('#sel2').change(function(e) {
            e.stopPropagation();
            if(jQuery(this).val()) {
                /***************
                 * set day
                 **************/
                twMember.setSelectDay(jQuery('#sel1 option:selected').val(), jQuery(this).val(), null, jQuery('#sel3'))
            } else {
                jQuery('#sel3').empty();
            }
        });

        //거주지역 설정
        jQuery('.region a').on('tap',function(e) {
            e.stopPropagation();

            twCommonUi.showModal(jQuery('.modal.modal-location'));
            jQuery('.list-location a').off('tap');
            twCommonUi.commonAccordion('.list-location',function(_txt){}, 'change-location');
        });

        // 변경요청 버튼 클릭
        jQuery('.modal.modal-member-info-change .btn-type1').on('tap', function(e) {
            e.stopPropagation();
            var modalTitle = "회원정보";

            var _bSaveMember = twCommonUi.checkEnableJoinButton({
                'sex':_this.sex,
                'year':jQuery('#sel1').val(),
                'month':jQuery('#sel2').val(),
                'day':jQuery('#sel3').val(),
                'area':jQuery('.region input').val()
            }, jQuery('.modal.modal-member-info-change .btn-type1'), 'change-info');

            if (_bSaveMember.bResult) {
                _year=jQuery('#sel1 option:selected').val(),
                _month=jQuery('#sel2 option:selected').val(),
                _day=jQuery('#sel3 option:selected').val(),
                _sex=_this.sex,
                _addr=jQuery('.region input').val(),
                _data = {
                    'u_idx' : (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                    'sex' : _sex,
                    'birth_Year' : _year,
                    'birth_Month' : _month,
                    'birth_Day' : _day,
                    'addr' : _addr
                };
            }
            reqwest({
                url : loc[14].api[1],
                method : loc[14].method,
                type : loc[14].type,
                data : _data
            })
            .then(function(resp){
                console.log(resp);
                if(resp[0].ResultCode == '1') {
                    twCommonUi.hideModal(jQuery('.modal.modal-member-info-change'));
                    setTimeout( function() {
                        twCommonUi.showModal(jQuery('.modal.modal-info-change-complete'));
                        jQuery('.modal.modal-info-change-complete .modal-content .change-title').append(modalTitle);
                    },300);
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });
        });
    },
    render : function() {
        return (
            <div className="modal modal-member-info-change" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type7">
                        <p className="text">회원정보 변경</p>
                    </div>

                    <div className="modal-content member-contents error-log">
                        <div className="inputbox-group fix">
                            <p className="input-title">성별</p>
                            <div className="inp-radio">
                                <input type="radio" id="rdo1" name="sex" value="m" /><label for="rdo1"><span className="box"><em className="box-dot"></em></span><span className="text">남자</span></label>
                            </div>
                            <div className="inp-radio">
                                <input type="radio" id="rdo2" name="sex" value="f" /><label for="rdo2"><span className="box"><em className="box-dot"></em></span><span className="text">여자</span></label>
                            </div>
                        </div>

                        <p className="input-title">생년월일</p>
                        <div className="selectbox-group fix">
                            <div className="select-type1 year">
                                <span className="select-title">* 생년월일</span>
                                <select id="sel1">
                                </select>
                                <label for="sel1" className="right">년</label>
                            </div>
                            <div className="select-type1 month">
                                <select id="sel2">
                                </select>
                                <label for="sel2" className="right">월</label>
                            </div>
                            <div className="select-type1 date">
                                <select id="sel3">
                                </select>
                                <label className="right">일</label>
                            </div>
                        </div>

                        <p className="input-title">거주지역</p>
                        <div className="inp-type1 region">
                            <a href="javascript:void(0);"><i className="fa fa-caret-right"></i></a>
                            <input type="text" placeholder="* 거주지역설정" value="" />
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

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

/***************************************************
 * 모달 전체 (임시)
 *
 **************************************************/
var ModalAll = React.createClass({
    render : function () {
        var props={
            display:'none',
            position:'absolute',
            top:'100px',
            width:'100%',
            zIndex:'200',
            border:'none'
        };

        return (
            <div>
                <ModalDropOutCaution {...props} />
                <ModalDropOutCheck {...props} />
                <ModalDropOutComplete {...props} />
                <ModalChangePassword {...props} />
                <ModalChangeOk {...props} />
                <ModalChangeInfo {...props} />
                <ModalSetLocation {...props} />
            </div>
        )
    }
});