/**
 * Created by 남동훈 on 2015-10-13.
 */
/*********************************************************************************
 * MemberJoin class
 * html template
 *********************************************************************************/
var MemberJoin = React.createClass({
    reJoinDate:'',
    dropOutDate:'',
    blockEndDate:'',
    authIdx:'',
    phone:'',
    authNum:'',
    sex:'',
    authType:1, //1 회원가입, 2. 로그인, 3. 탈퇴,
    authCount:'',
    componentDidMount : function() {
        var _this = this;

        /*
         valid phone number
         input class success : 'pass-ok'
         input class fail : 'pass-not'
         */

        jQuery('.member-contents .cert .btn-modal-cert').on('tap',function(e) {
            e.stopPropagation();

            jQuery('.modal.modal-cert .num-area input').val('');
            var _phone=jQuery('.cert .phone').val();
            if(twMember.getValidPhone(_phone) && _this.authCount < 5) {
                console.log(_this.authCount);
                console.log('correct phone number next step');

                //sms certification send
                reqwest({
                    url: loc[0].api[0], //SMS 회원 가입용 인증번호 발송
                    method:loc[0].method,
                    type: loc[0].type,
                    data:{
                        'auth_phone':_phone
                    }
                })
                .then(function (resp) {
                    console.log(resp);
                    /*************************
                     resp.ResultCode
                     '1'=success
                     '-1'=fail
                     modal-auth-exceeds
                     *************************/
                    //인증하기 버튼 5번 이상 클릭 하면 대기시간 10분분
                    if (resp[0].ResultCode == '1') {
                        /*
                         initialize modal-cert
                         1. setValidTime
                         2. modalShow
                         3. btn-confirm
                         */
                        /*
                        *
                        *  set valid time
                        *  check cert number
                        *
                        */

                        _this.authIdx=resp[0].auth_idx;

                        twCommonUi.setValidTime('.valid .time', 1, function () {
                            /* 입력 시간이 지난 후 콜백 실행 */
                            //console.log('입력시간이 초과되었습니다.');
                            twCommonUi.stopValidTime('.valid .time');
                            jQuery('.modal.modal-cert .time-area .text-type4').hide();
                            jQuery('.modal.modal-cert .overtime').show();
                            jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity': 0.5});
                        });

                        jQuery('.modal.modal-cert .time-area .text-type4').hide();

                        jQuery('.modal.modal-cert .phone').text(_phone);
                        twCommonUi.showModal(jQuery('.modal.modal-cert'));

                        // SMS 인증번호 확인
                        jQuery('.modal.modal-cert .btn-confirm').css({'opacity':1}).on('tap', function (e) {
                            e.stopPropagation();

                            var _$certInput = jQuery('.modal.modal-cert .num-area input'),
                                //_authNum = _$certInput.eq(0).val().toString() + _$certInput.eq(1).val().toString() + _$certInput.eq(2).val().toString() + _$certInput.eq(3).val().toString() + _$certInput.eq(4).val().toString();
                                _authNum = _$certInput.val().toString();

                            if (_authNum.length < 5) { //인증번호 5자리 입력 체크
                                jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                jQuery('.modal.modal-cert .time-area .lack-length').show();
                            } else {
                                //sms certification send
                                reqwest({
                                    url: loc[0].api[1], //SMS 인증번호 확인
                                    method: loc[0].method,
                                    type: loc[0].type,
                                    data: {
                                        'auth_idx': _this.authIdx,
                                        'auth_phone': _phone,
                                        'auth_num': _authNum,
                                        'auth_type': _this.authType
                                    }
                                })
                                .then(function (resp) {
                                    console.log(resp);
                                    /*************************
                                     resp.ResultCode
                                     '1'=success
                                     '-1'=fail
                                     *************************/
                                    if (resp[0].ResultCode == '1') {
                                        _this.authIdx = _this.authIdx;
                                        _this.authNum =_authNum;
                                        _this.phone = _phone;

                                        jQuery('.header').data('authNum',_this.authNum); // twCommonUi=>regionAccordion에서 쓰임

                                        twCommonUi.stopValidTime('.valid .time');

                                        twCommonUi.hideModal(jQuery('.modal.modal-cert'));
                                        setTimeout(function () {
                                            twCommonUi.showModal(jQuery('.modal.modal-cer-complete'));
                                        }, 300);

                                    } else if (resp[0].ResultCode == '-30000') { //이전 sms 인증번호 입력 시
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                        _this.authCount = resp[0].ResultData.auth_count;
                                        console.log(_this.authCount);

                                    } else if (resp[0].ResultCode == '-50001') { //인증번호 5번 이상 실패시 코드 번호는?
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .wrong-typing').show();
                                        jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity':0.5});
                                        _this.authCount = resp[0].ResultData.auth_count;

                                    } else if (resp[0].ResultCode == '-1') { //실패
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                        jQuery('.modal.modal-cert .num-area input').val('');
                                    }
                                })
                                .fail(function (err, msg) {
                                    console.log(err);
                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                });
                            }
                        });
                    } else if (resp[0].ResultCode == '-40005') { //이미 존재하는 유저
                        var regdate=resp[0].ResultData[0].regdate,
                            year=regdate.substring(0,4)+'.',
                            month=regdate.substring(5,7)+'.',
                            day=regdate.substring(8,10),
                            hour=regdate.substring(11,13)+':',
                            minute=regdate.substring(14,16)+':',
                            second=regdate.substring(17,19);

                        jQuery('.modal.modal-already-reg .text-type2').text(_phone);
                        jQuery('.modal.modal-already-reg .date').text(year+month+day);
                        twCommonUi.showModal(jQuery('.modal.modal-already-reg'));

                        jQuery('.modal.modal-already-reg .btn-type1').on('tap',function(e) {
                            // 재가입 요청 (hold)
                            e.stopPropagation();

                            twCommonUi.hideModal(jQuery('.modal.modal-already-reg'));
                            var _$modal = jQuery('.modal.modal-phone-cert');

                            _$modal.find('.message .text-type2').text(_phone);
                            _$modal.find('.inp-type1').text(_phone);
                            twCommonUi.showModal(_$modal);

                            jQuery('.modal.modal-phone-cert .btn-type2').on('tap', function (e) {
                                e.stopPropagation();
                                twCommonUi.hideModal(jQuery('.modal.modal-phone-cert'));
                                jQuery('.modal.modal-phone-cert .phone').val('');
                            });


                            //인증하기
                            jQuery('.modal.modal-phone-cert .btn-modal-cert').off('tap').on('tap', function (e) {
                                e.stopPropagation();
                                var _rePphone=jQuery('.modal.modal-phone-cert .phone').val();
                                jQuery('.modal.modal-phone-cert .phone').val('');

                                reqwest({
                                    url: loc[0].api[5], //SMS 재가입용 인증번호 발송
                                    method: loc[0].method,
                                    type: loc[0].type,
                                    data: {
                                        'auth_phone': _phone
                                    }
                                })
                                .then(function (resp) {
                                    console.log(resp);
                                    if (resp[0].ResultCode == '1') { //재가입 성공
                                        twCommonUi.hideModal(jQuery('.modal.modal-phone-cert'));
                                        /*
                                         *
                                         *  set valid time
                                         *  check cert number
                                         *
                                         */

                                        _this.authIdx = resp[0].auth_idx;

                                        twCommonUi.setValidTime('.valid .time', 1, function () {
                                            /* 입력 시간이 지난 후 콜백 실행 */
                                            //console.log('입력시간이 초과되었습니다.');
                                            twCommonUi.stopValidTime('.valid .time');
                                            jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                            jQuery('.modal.modal-cert .overtime').show();
                                            jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity': 0.5});
                                        });

                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();

                                        jQuery('.modal.modal-cert .phone').text(_phone);
                                        twCommonUi.showModal(jQuery('.modal.modal-cert'));

                                        // SMS 인증번호 확인
                                        jQuery('.modal.modal-cert .btn-confirm').css({'opacity': 1}).on('tap', function (e) {
                                            e.stopPropagation();
                                            var _$certInput = jQuery('.modal.modal-cert .num-area input'),
                                            //_authNum = _$certInput.eq(0).val().toString() + _$certInput.eq(1).val().toString() + _$certInput.eq(2).val().toString() + _$certInput.eq(3).val().toString() + _$certInput.eq(4).val().toString();
                                                _authNum = _$certInput.val().toString();

                                            if (_authNum.length < 5) { //인증번호 5자리 입력 체크
                                                jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                                jQuery('.modal.modal-cert .time-area .lack-length').show();
                                            } else {
                                                //sms certification send
                                                reqwest({
                                                    url: loc[0].api[1], //SMS 인증번호 확인
                                                    method: loc[0].method,
                                                    type: loc[0].type,
                                                    data: {
                                                        'auth_idx': _this.authIdx,
                                                        'auth_phone': _phone,
                                                        'auth_num': _authNum,
                                                        'auth_type': '4' // 재가입용 인증 종류는 4번.
                                                    }
                                                })
                                                .then(function (resp) {
                                                    console.log(resp);
                                                    /*************************
                                                     resp.ResultCode
                                                     '1'=success
                                                     '-1'=fail
                                                     *************************/
                                                    if (resp[0].ResultCode == '1') {
                                                        _this.authIdx = _this.authIdx;
                                                        _this.authNum = _authNum;
                                                        _this.phone = _phone;

                                                        jQuery('.header').data('authNum', _this.authNum); // twCommonUi=>regionAccordion에서 쓰임

                                                        twCommonUi.stopValidTime('.valid .time');

                                                        twCommonUi.hideModal(jQuery('.modal.modal-cert'));
                                                        setTimeout(function () {
                                                            twCommonUi.showModal(jQuery('.modal.modal-cer-complete'));
                                                        }, 300);

                                                        jQuery('.modal.modal-cer-complete .btn-type1').on('tap', function (e) {
                                                            e.stopPropagation(0);
                                                            //sms certification send
                                                            reqwest({
                                                                url: loc[0].api[6], //재가입 요청
                                                                method: loc[0].method,
                                                                type: loc[0].type,
                                                                data: {
                                                                    'auth_idx': _this.authIdx,
                                                                    'phone': _phone,
                                                                    'auth_num': _authNum
                                                                }
                                                            })
                                                            .then(function (resp) {
                                                                console.log(resp);
                                                                /*************************
                                                                 resp.ResultCode
                                                                 '1'=success
                                                                 '-1'=fail
                                                                 *************************/
                                                                if (resp[0].ResultCode == '1') {

                                                                }
                                                            })
                                                            .fail(function (err, msg) {
                                                                console.log(err);
                                                                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                                            });
                                                        });

                                                    } else if (resp[0].ResultCode == '-30000') { //이전 sms 인증번호 입력 시
                                                        twCommonUi.stopValidTime('.valid .time');
                                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                                        _this.authCount = resp[0].ResultData.auth_count;

                                                    } else if (resp[0].ResultCode == '-50001') { //인증번호 5번 이상 실패시 코드 번호는?
                                                        twCommonUi.stopValidTime('.valid .time');
                                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                                        jQuery('.modal.modal-cert .time-area .wrong-typing').show();
                                                        jQuery('.modal.modal-cert .btn-confirm').off('tap').css({'opacity': 0.5});
                                                        _this.authCount = resp[0].ResultData.auth_count;
                                                    } else if (resp[0].ResultCode == '-1') { //실패
                                                        twCommonUi.stopValidTime('.valid .time');
                                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                                        jQuery('.modal.modal-cert .num-area input').val('');
                                                    }
                                                })
                                                .fail(function (err, msg) {
                                                    console.log(err);
                                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                                });
                                            }
                                        });

                                    } else if (resp[0].ResultCode == '-50000') { //인증하기 5번 클릭 시 10분 블럭
                                        var _$modal = jQuery('.modal.modal-auth-exceeds');
                                        twCommonUi.hideModal(jQuery('.modal.modal-phone-cert'));
                                        _$modal.find('.btn-type1').on('tap', function (e) {
                                            e.stopPropagation();
                                            twCommonUi.hideModal(_$modal);
                                        });
                                        setTimeout(function () {
                                            twCommonUi.showModal(_$modal);
                                        }, 300);
                                    } else if (resp[0].ResultCode == '-50001') { //인증하기 5번 클릭 시 10분 블럭
                                        var _$modal = jQuery('.modal.modal-auth-exceeds');
                                        twCommonUi.hideModal(jQuery('.modal.modal-phone-cert'));
                                        setTimeout(function () {
                                            twCommonUi.showModal(_$modal);
                                        }, 300);

                                        _$modal.find('.btn-type1').on('tap', function (e) {
                                            e.stopPropagation();
                                            twCommonUi.hideModal(_$modal);
                                        });
                                    } else if (resp[0].ResultCode == '-50004') { //인증하기 5번 클릭 시 10분 블럭
                                        var _$modal = jQuery('.modal.modal-auth-exceeds');
                                        twCommonUi.hideModal(jQuery('.modal.modal-phone-cert'));
                                        setTimeout(function () {
                                            twCommonUi.showModal(_$modal);
                                        }, 300);

                                        _$modal.find('.btn-type1').on('tap', function (e) {
                                            e.stopPropagation();
                                            twCommonUi.hideModal(_$modal);
                                        });
                                    } else if (resp[0].ResultCode == '-30000') { // 인증번호 오류
                                        twCommonUi.stopValidTime('.valid .time');
                                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                                        jQuery('.modal.modal-cert .time-area .error-number').show();
                                        _this.authCount = resp.auth_count;
                                    } else if (resp[0].ResultCode == '-1') { //재가입 실패

                                    }
                                })
                                .fail(function (err, msg) {
                                    console.log(err);
                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                });
                            });
                        });

                        //로그인 버튼 클릭
                        jQuery('.modal.modal-already-reg').find('.btn-type2').on('tap',function(e){
                            e.stopPropagation();

                            twCommonUi.hideModal(jQuery('.modal.modal-already-reg'));
                            window.location.href="#/member-login";
                        });
                    } else if (resp[0].ResultCode == '-50001') { //인증하기 5번 클릭 시 10분 블럭
                        var _$modal=jQuery('.modal.modal-auth-exceeds');
                        twCommonUi.showModal(_$modal);

                        _$modal.find('.btn-type1').on('tap',function(e){
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                        });
                    } else if (resp[0].ResultCode == '-40001') { // 탈퇴요청 사용자.
                        console.log('-40001 왔음');
                        var _$modal = jQuery('.modal.modal-drop');
                        var leaveRequestDay = resp[0].ResultData[0].DeleteDate; // DeleteDate 탈퇴 신청을 누른 시점에서 탈퇴가 완료될 날짜. 현재는 아마 -30일이 될 듯.
                        var intervalDay = null;
                        _$modal.find('.text-type2').html(_phone);
                        _$modal.find('.text-type4 span').html(leaveRequestDay); // TODO : 추후 계산되는 날짜 변수로 변경.
                        _$modal.find('.time').html(intervalDay); // TODO : 남은 탈퇴대기 시간 계산해서 넣기.
                        twCommonUi.showModal(_$modal);

                        _$modal.find('.btn-type2').on('tap', function(e) {
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                        });

                        _$modal.find('.btn-type1').on('tap', function(e) {
                            e.stopPropagation();
                            twCommonUi.hideModal(_$modal);
                            setTimeout(function(){
                                twCommonUi.showModal(jQuery('.modal.modal-drop-cancel'));
                            }, 300);
                        });

                    } else if (resp[0].ResultCode == '-1') { //실패
                        // 확정된 프로세스 없음.
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });

            } else {
                //invalid phone number show modal
                //console.log('invalid phone number show modal');
                twCommonUi.showModal(jQuery('.modal.modal-wrongform'));
                jQuery('.phone').blur();
            }
        });

        /*
         valid password
         input class success : 'pass-ok'
         input class fail : 'pass-not'
         */
         /*
         check same password
         input class success : 'pass-ok'
         input class fail : 'pass-not'
         */

        // TODO : radio
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
            twCommonUi.commonAccordion('.list-location',function(_txt) {});

        });

        //가입하기
        jQuery('.twMember_join .btn-start').on('tap',function(e) {
            e.stopPropagation();

            var _bSaveMember=twCommonUi.checkEnableJoinButton({
                                'phone':jQuery('.cert .phone').val(),
                                'auth_num':_this.authNum,
                                'password':jQuery('.inp-type1 .password').val(),
                                'rePassword':jQuery('.inp-type1 .re-password').val(),
                                'sex':_this.sex,
                                'year':jQuery('#sel1').val(),
                                'month':jQuery('#sel2').val(),
                                'day':jQuery('#sel3').val(),
                                'area':jQuery('.region input').val()
                            },jQuery('.twMember_join .btn-start'));
            //console.log(twMember.checkMemberFieldFocus(_bSaveMember.status))

            if(_bSaveMember.bResult) {
                //입력 내용 및 인증을 거쳤다면 회원 가입 절차를 밟는다.

                var _password=jQuery('.password').val(),
                    _rePassword=jQuery('.re-password').val(),
                    _year=jQuery('#sel1 option:selected').val(),
                    _month=jQuery('#sel2 option:selected').val(),
                    _day=jQuery('#sel3 option:selected').val(),
                    _sex=_this.sex,
                    _addr=jQuery('.region input').val(),
                    _os_type=0,
                    _url='',
                    _data={};

                if (device.checkDeviceType() == 'android') {
                    _os_type=1;
                } else if (device.checkDeviceType() == 'ios') {
                    _os_type=2;
                } else {
                    _os_type=0;
                }

                _webBridge.osType=_os_type;

                BRIDGE.getUserInfo( function( userInfo ) {
                    BRIDGE.getDeviceInfo( function( deviceInfo) {
                        /*
                         * user.userState status value
                         * 0 : 임시회원 ,1: 정상회원, -1 : 탈퇴 요청, -2: 탈퇴 완료 (계정 삭제), -3: 블럭 , -4 : 임시회원 데이터이전 완료
                         */
                        var _data_idx = {
                            u_idx: userInfo.INDEX
                        };

                        reqwest({
                            url: loc[1].api[3], //유저정보
                            method: 'post',
                            type: 'json',
                            data: _data_idx
                        })
                        .then(function (resp) {
                            if (resp[0].ResultCode == '1') {
                                var user = resp[0].ResultData.u_status;

                                _data = {
                                    'pwd': _password,
                                    'pwd2': _rePassword,
                                    'phone': _this.phone,
                                    'birth_year': _year,
                                    'birth_month': _month,
                                    'birth_day': _day,
                                    'email': '',
                                    'sex': _sex,
                                    'addr': _addr,
                                    'device_id': deviceInfo.DEVICE_ORG_ID,
                                    'app_id': deviceInfo.APP_ORG_ID,
                                    'os_type': _os_type,
                                    'auth_idx': _this.authIdx,
                                    'auth_num': _this.authNum
                                };

                                if (user == -1 || user == 1 || user == -2 || user == -3 || user == -4 || !user){
                                    _url = loc[0].api[2];
                                } else if (user ==0) {
                                    _url = loc[0].api[6];
                                    _data["u_idx"] = userInfo.INDEX
                                }

                                console.log(
                                    'phone=', _this.phone,
                                    '_password=', jQuery('.password').val(),
                                    '_rePassword=', jQuery('.re-password').val(),
                                    '_year=', jQuery('#sel1 option:selected').val(),
                                    '_month=', jQuery('#sel2 option:selected').val(),
                                    '_day=', jQuery('#sel3 option:selected').val(),
                                    '_sex=', _this.sex,
                                    '_addr=', jQuery('.region input').val(),
                                    '_os_type=', _os_type,
                                    'auth_idx=', _this.authIdx,
                                    'authNum=', _this.authNum
                                );

                                reqwest({
                                    url: _url, //회원 가입
                                    method: loc[0].method,
                                    type: loc[0].type,
                                    data: _data
                                })
                                .then(function (resp) {
                                    console.log(resp);
                                    /*************************
                                     resp.ResultCode
                                     '1'=success
                                     '-1'=fail
                                     *************************/
                                    if (resp[0].ResultCode == '1') {
                                        //회원가입 완료 후 u_idx를 전역에서 사용할 수 있게 localstorage에 저장
                                        window.location.href = loc[3].hash + "/" + resp[0].u_idx;
                                    } else if (resp[0].ResultCode == '-10000') { // 파라미터오류인데 보통 인증번호를 입력하지 않을 경우 나타남.
                                        jQuery('error-log').append('<p class="comment notice">* 인증번호를 입력하세요.</p>');
                                    }
                                })
                                .fail(function (err, msg) {
                                    console.log(err);
                                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                                });
                            }
                        })
                        .fail(function (err, msg) {
                            console.log(err);
                            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                        });
                    });
                });
            } else {
                //입력 내용 및 인증이 제대로 통과되지 않았다면 해당 메세지 및 포커스 이동
            }
        });

        jQuery('.contents').css({
            'padding-left':0,
            'padding-right':0
        });

        jQuery('.contents .page').css({
            'padding-left':10,
            'padding-right':10
        });

        BRIDGE.webIsReady( function( initData )
        {

        });

        twCommonUi.setContentsHeight();

        // 다른 페이지에서 놀다가 회원가입, 로그인, 비밀번호 찾기로 진입할 경우 비콘스테이터스 강제 삭제.
        if(jQuery('.beaconState .state-bottombox') && jQuery('.modal-wrap-beacon div')) {
            jQuery('.beaconState .state-bottombox').remove();
            jQuery('.modal-wrap-beacon div').remove();
        }
        React.render(React.createElement(ModalAll, null), document.getElementsByClassName('modal-wrap')[0]);

    },
    render: function() {
        var _contents=null;

        _contents = <MemberJoin />;

        return (
            <div className={"page "+loc[0].pageName+" "+this.props.position}>
                <div className="member-info">
                    <div className="member-title">
                        <h3>회원가입정보</h3>
                        <p className="essential">*표시는 필수 입력사항 입니다.</p>
                    </div>
                    <div className="member-contents error-log">

                        <div className="cert">
                            <div className="inp-type1"><input type="tel" pattern="[0-9]*" inputmode="numberic" min="0" className="phone" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                            <a href="javascript:void(0);" className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                        </div>

                        <div className="inp-type1">
                            <input type="password" className="password" maxLength="15" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                            <span className="marker good"></span>
                            <span className="marker ng"></span>
                        </div>

                        <div className="inp-type1">
                            <input type="password" className="re-password" placeholder="* 비밀번호 확인" />
                            <span className="marker good"></span>
                            <span className="marker ng"></span>
                        </div>

                        <div className="inputbox-group fix">
                            <div className="inp-radio">
                                <input type="radio" id="rdo1" name="sex" value="m" /><label for="rdo1"><span className="box"><em className="box-dot"></em></span><span className="text">남자</span></label>
                            </div>
                            <div className="inp-radio">
                                <input type="radio" id="rdo2" name="sex" value="f" /><label for="rdo2"><span className="box"><em className="box-dot"></em></span><span className="text">여자</span></label>
                            </div>
                        </div>

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

                        <div className="inp-type1 region">
                            <a href="javascript:void(0);"></a>
                            <input type="text" placeholder="* 거주지역설정" value="" />
                        </div>

                    </div>
                </div>

                <div className="member-footer">
                    <a href="javascript:void(0);" className="btn-start active"><span>가입하기</span></a>
                </div>
            </div>
        )
    }

});

/*********************************************************************************
 * modal class
 * html template
 * certification number modal
 *********************************************************************************/
var ModalCert = React.createClass({
    componentDidMount : function() {
        //인증 번호 자리 이동, 2015-10-20 : 인증번호 입력 필드 변경으로 인해 기존 내용 주석처리
        /* jQuery('.num-area input').on('keyup',function(e) {
            e.stopPropagation();
            var _maxChars=1;

            if(e.which!='8') {
                if (jQuery(this).val().length > 0) {
                    if (jQuery(this).next().size() > 0) {
                        jQuery(this).next().focus();
                    } else {
                        jQuery(this).next().focusout();
                    }
                    $(this).val($(this).val().substr(0, _maxChars));
                }
            } else {
                jQuery(this).val('');
                if (jQuery(this).prev().size() > 0) {
                    jQuery(this).prev().focus();
                }
            }
        }); */

        //취소 버튼 클릭
        jQuery('.modal.modal-cert .btn-cancel').on('tap',function() {
            jQuery('.modal.modal-cert .num-area input').val('');
            twCommonUi.stopValidTime('.valid .time');
            jQuery('.modal.modal-cert .time-area .text-type4').hide();
            twCommonUi.hideModal(jQuery('.modal.modal-cert'));
        });
    },
    render : function(){
        var _hide={
            display:'none'
        };

        return(
            <section className="modal modal-cert" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type2"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2 phone">010-1234-4322</p>
                            <p className="text-type3">전송된 인증번호 5자리를 입력해주세요.</p>
                        </div>
                        <div className="num-area">
                            <input type="tel" maxLength="5" />
                        </div>
                        <div className="time-area">
                            <div className="valid">유효입력시간
                                <span className="time">00:59</span>
                            </div>
                            <p className="overtime text-type4" style={_hide}>입력 제한 시간 초과 다시 진행해 주세요.</p>
                            <p className="error-number text-type4" style={_hide}>잘못된 인증번호 입니다.</p>
                            <p className="lack-length text-type4" style={_hide}>인증번호 5자리를 다 입력해주세요.</p>
                            <p className="wrong-typing text-type4" style={_hide}>5회 이상 틀렸습니다. 인증번호를 새로 받아주세요.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2 btn-cancel" href="javascript:void(0);">취소</a>
                            <a className="btn-type3 btn-confirm" href="javascript:void(0);">확인</a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});


/*********************************************************************************
 * modal class
 * html template
 * Invalid message modal
 *********************************************************************************/
var ModalInvalid = React.createClass({
    componentDidMount:function(){
        //번호 입력 잘못됐을 시
        jQuery('.modal.modal-wrongform .btn-confirm').on('tap',function() {
            twCommonUi.hideModal(jQuery('.modal.modal-wrongform'));
            jQuery('.inp-type1 .phone').val('');

        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-wrongform" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">번호형식이 올바르지 않습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1 btn-confirm" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 재가입 여부 확인 모달
 *********************************************************************************/
var ModalInHistory = React.createClass({
    render : function() {
        return (
            <section className="modal modal-already-reg" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <p className="text-type4"><span className="date">2015. 6. 21</span> 가입내역이 있습니다.</p>
                            <p className="text-type5">재가입시 기존정보는 모두 삭제됩니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">로그인</a>
                            <a className="btn-type1" href="javascript:void(0);">재가입</a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 탈퇴대기 modal
 *********************************************************************************/
var ModalDropOut = React.createClass({
    render : function () {
        return (
            <section className="modal modal-drop" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">010-1234-4322</p>
                            <p className="text-type4"><span>2015. 6. 21 22:00:00</span><br />탈퇴 처리중입니다.</p>
                            <p className="text-type5">남은 탈퇴 대기시간 <span class="time"> 21:59 </span></p>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">닫기</a>
                            <a className="btn-type1" href="javascript:void(0);">탈퇴취소</a>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * certification complete modal
 *********************************************************************************/
var ModalCertComplete = React.createClass({
    componentDidMount : function() {
        jQuery('.modal.modal-cer-complete .btn-type1').on('tap',function() {
            twCommonUi.hideModal(jQuery('.modal.modal-cer-complete'));
            jQuery('.cert .phone').attr('readOnly',true);
        });
    },
    render : function() {
        return (
            <section className="modal modal-small modal-cer-complete" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">인증완료</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * phone certification modal
 *********************************************************************************/
var ModalPhoneCert = React.createClass({
    render : function() {
        return (
            <section className="modal modal-small modal-phone-cert" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type2"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type1">휴대폰 인증</p>
                            <div className="cert">
                                <div className="inp-type1">

                                </div>
                                <a href="javascript:void(0);" className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                            </div>
                            <p className="text-type5 left">휴대폰 인증을 하셔야 재가입 할 수 있습니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type2" href="javascript:void(0);">닫기</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 비밀번호가 틀렸습니다.
 *********************************************************************************/
var ModalWrongPassword = React.createClass({
    render : function() {
        return (
            <section className="modal modal-small modal-wrong-password" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type3"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">비밀번호가 틀렸습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
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

/*********************************************************************************
 * modal class
 * html template
 * 탈퇴가 취소되었습니다. 모달
 *********************************************************************************/
var ModalDropCancel = React.createClass({
    componentDidMount : function() {
        jQuery('.modal.modal-drop-cancel .btn-type1').on('tap', function(e){
            twCommonUi.hideModal(jQuery('.modal.modal-drop-cancel'));
        });
    },
    render : function () {
        return (
            <section className="modal modal-small modal-drop-cancel" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type4"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">탈퇴가 취소되었습니다.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * 인증버튼 클릭제한횟수 초과 모달
 *********************************************************************************/
var ModalAuthExceeds = React.createClass({
    render : function () {
        return (
            <section className="modal modal-small modal-auth-exceeds" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type1"></div>

                    <div className="modal-content">
                        <div className="message">
                            <span className="text-type1">인증 제한 횟수 초과</span><br /><br />
                            <p className="text-type3">10분 후 재시도 부탁드립니다.</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        )
    }
});

/*********************************************************************************
 * modal class
 * html template
 * mix and render all modal
 *********************************************************************************/
var ModalAll = React.createClass({
    render : function(){
        var props={
            display:'none',
            position:'absolute',
            top:'100px',
            width:'100%',
            zIndex:'200'
        };

        return (
            <div>
                <ModalInvalid {...props} />
                <ModalCert {...props} />
                <ModalPhoneCert {...props} />
                <ModalInHistory {...props} />
                <ModalDropOut {...props} />
                <ModalCertComplete {...props} />
                <ModalSetLocation {...props} />
                <ModalDropCancel {...props} />
                <ModalAuthExceeds {...props} />
            </div>
        )
    }
});