var PageJoin = React.createClass({
    reJoinDate:'',
    dropOutDate:'',
    blockEndDate:'',
    authIdx:'',
    phone:'',
    rePhone:'',
    authNum:'',
    sex:'',
    authType:1, //1 회원가입, 2. 로그인, 3. 탈퇴
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        var state = {

        };
        return state;
    },
    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
    },
    openCert : function() {
        var _this = this,
            _phone=jQuery('.cert .phone-join').val();

        jQuery('.modal.modal-cert .num-area input').val('');

        if(twMember.getValidPhone(_phone)) {
            var _data = {
                'auth_phone':_phone
            };
            MODEL.get(API.SEND_SMS_FOR_JOIN, _data, function(ret) {
                var respData = ret.data[0];

                if (ret.success && respData.ResultCode == 1) { // 정상응답.
                    twCommonUi.setValidTime('.valid .time', 1, function () {
                        /* 입력 시간이 지난 후 콜백 실행 */
                        //console.log('입력시간이 초과되었습니다.');
                        twCommonUi.stopValidTime('.valid .time');
                        jQuery('.modal.modal-cert .time-area .text-type4').hide();
                        jQuery('.modal.modal-cert .overtime').show();
                        jQuery('.modal.modal-cert .btn-confirm').off('click').css({'opacity': 0.5});
                    });

                    jQuery('.modal.modal-cert .time-area .text-type4').hide();

                    jQuery('.modal.modal-cert .phone').text(_phone);
                    _this.authIdx = ret.data[0].auth_idx;

                    var certData = {
                        'auth_idx': _this.authIdx,
                        'auth_phone': _phone,
                        'auth_type': _this.authType
                    };

                    UI.openPopup('POP_PHONE_CERT', certData);
                } else if (ret.success && respData.ResultCode == -50001) { // 인증하기 5번 클릭 시 10분 블럭, 회원가입
                    UI.openPopup('POP_AUTH_EXCEEDS');

                } else if (ret.success && respData.ResultCode == -40005) { // 이미 존재하는 유저, 재가입 할 지, 로그인 할 지 분기.
                    // 너 가입내역이 있다. 라는 걸 보여주기 위해 날짜 세팅.
                    var regdate=respData.ResultData[0].regdate,
                        year=regdate.substring(0,4)+'.',
                        month=regdate.substring(5,7)+'.',
                        day=regdate.substring(8,10),
                        hour=regdate.substring(11,13)+':',
                        minute=regdate.substring(14,16)+':',
                        second=regdate.substring(17,19);

                    jQuery('.modal.modal-already-reg .text-type2').text(_phone);
                    jQuery('.modal.modal-already-reg .date').text(year+month+day);

                    UI.openPopup('POP_ALREADY_REG', _phone);
                }
            });
        } else {
            UI.openPopup('POP_MODAL_INVALID');
        }
    },
    setAuthNum : function (authNum) {
        var _this = this;
        _this.authNum = authNum;
    },
    setAuthIdx : function (authIdx) {
        var _this = this;
        _this.authIdx = authIdx;
    },
    onShow : function() {
        var _this = this; // context switching

        // 디자인된 라디오 박스 액션.
        jQuery('.inp-radio label').on('click',function(e){
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
    },
    showLocation : function() {
        UI.openPopup('POP_SELECT_LOCATION');
    },
    setLocation : function( loc ) {

    },
    goJoin : function() {

    },
    render : function() {
        return (
            <div className="page page-join member" style={this.context.viewSize}>
                <PageHeader title="회원가입" />
                <PageContents className="contents member-reg twMember_join">
                    <div className="member-info">
                        <div className="member-title">
                            <h3>회원가입정보</h3>
                            <p className="essential">*표시는 필수 입력사항 입니다.</p>
                        </div>
                        <div className="member-contents error-log">

                            <div className="cert">
                                <div className="inp-type1"><input type="tel" pattern="[0-9]*" min="0" className="phone-join" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                                <a href="javascript:void(0);" onClick={this.openCert} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
                            </div>

                            <div className="inp-type1">
                                <input type="password" className="password-join" maxLength="15" placeholder="* 비밀번호 입력(영,숫자 혼합 8~15자리)" />
                                <span className="marker good"></span>
                                <span className="marker ng"></span>
                            </div>

                            <div className="inp-type1">
                                <input type="password" className="re-password-join" placeholder="* 비밀번호 확인" />
                                <span className="marker good"></span>
                                <span className="marker ng"></span>
                            </div>

                            <div className="inputbox-group fix">
                                <div className="inp-radio">
                                    <input type="radio" id="rdo1" name="sex" value="m" /><label htmlFor="rdo1"><span className="box"><em className="box-dot"></em></span><span className="text">남자</span></label>
                                </div>
                                <div className="inp-radio">
                                    <input type="radio" id="rdo2" name="sex" value="f" /><label htmlFor="rdo2"><span className="box"><em className="box-dot"></em></span><span className="text">여자</span></label>
                                </div>
                            </div>

                            <div className="selectbox-group fix">
                                <div className="select-type1 year">
                                    <span className="select-title">* 생년월일</span>
                                    <select id="sel1">
                                    </select>
                                    <label htmlFor="sel1" className="right">년</label>
                                </div>
                                <div className="select-type1 month">
                                    <select id="sel2">
                                    </select>
                                    <label htmlFor="sel2" className="right">월</label>
                                </div>
                                <div className="select-type1 date">
                                    <select id="sel3">
                                    </select>
                                    <label className="right">일</label>
                                </div>
                            </div>

                            <div className="inp-type1 region">
                                <a href="javascript:void(0);" onClick={this.showLocation}>&nbsp;</a>
                                <input type="text" placeholder="* 거주지역설정" value="강원도 강릉시" />
                            </div>

                        </div>
                    </div>

                    <div className="member-footer">
                        <a href="javascript:void(0);" onClick={this.goJoin} className="btn-start active"><span>가입하기</span></a>
                    </div>
                </PageContents>
            </div>
        );
    }
});