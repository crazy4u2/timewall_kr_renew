var PageLogin = React.createClass({
    reJoinDate:'',
    dropOutDate:'',
    blockEndDate:'',
    authIdx:'',
    phone:'',
    rePhone:'',
    authNum:'',
    authType:2, //1 회원가입, 2. 로그인, 3. 탈퇴
    getInitialState : function()
    {
        var state = {

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
    openCert : function() {
        UI.openPopup('POP_PHONE_CERT');
    },
    onShow : function() {
        jQuery('.inputbox-group .inp-radio label').on('click', function(e) {
            jQuery(this).closest('.inputbox-group').find('.inp-radio').removeClass('active');
            jQuery(this).closest('.inputbox-group').find('input[type=radio]').prop('checked',false).attr('checked',false);
            jQuery(this).closest('.inp-radio').addClass('active');
            jQuery(this).prev('input[type=radio]').prop('checked',true).attr('checked',true);
            e.stopImmediatePropagation();
        });
    },
    render : function()
    {
        return (
            <div className="page page-login" style={this.context.viewSize}>
                <PageHeader title="로그인" />
                <PageContents>
                    <div className="member-info">
                        <div className="member-title">
                            <h3>회원가입정보</h3>
                            <p className="essential">*표시는 필수 입력사항 입니다.</p>
                        </div>
                        <div className="member-contents error-log">

                            <div className="cert">
                                <div className="inp-type1"><input type="tel" pattern="[0-9]*" inputMode="numberic" min="0" className="phone" maxLength="11" placeholder="* 휴대폰 번호" /></div>
                                <a href="javascript:void(0);" onClick={this.openCert} className="btn-modal-cert modal-cert"><span>인증하기</span></a>
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
                                <a href="javascript:void(0);"></a>
                                <input type="text" placeholder="* 거주지역설정" value="" />
                            </div>

                        </div>
                    </div>

                    <div className="member-footer">
                        <a href="javascript:void(0);" className="btn-start active"><span>가입하기</span></a>
                    </div>
                </PageContents>
            </div>
        );
    }
});