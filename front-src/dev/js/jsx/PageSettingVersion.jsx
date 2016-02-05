var PageSettingVersion = React.createClass({
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
    onShow : function() {
        jQuery('.terms-box .btn-folder').on('click',function(e) {
            var _$this=jQuery(this).closest('.terms-box');
            if(!_$this.attr('class').match('active')) {
                jQuery('.terms-box').removeClass('active');
                _$this.addClass('active');
            } else {
                _$this.removeClass('active');
            }
            e.stopImmediatePropagation();
        });

        // 버전정보 호출
        var versionInfo = null;
        BRIDGE.getAppVersion(function(ver){
            versionInfo = ver;

            console.log(versionInfo);
            var updateBtn = '<a class="btn-type1 btn-update" href="javascript:void(0);">최신버전 업데이트</a>';
            if(versionInfo.CLIENT < versionInfo.SERVER) {
                jQuery('.btn-version').html(updateBtn);
            }
            jQuery('.client-ver').text(versionInfo.CLIENT);
            jQuery('.server-ver').text(versionInfo.SERVER);
        });
    },
    render : function() {
        var colWidth30 = {
            width : '30%'
        };
        var colWidth20 = {
            width : '20%'
        };
        return (
            <div className="page page-settings" style={this.context.viewSize}>
                <PageHeader title="버전정보" />
                <PageContents className="setting-version">
                    <div className="version-view">
                        <p className="version-text">
                            <span className="current"><em>현재버전 : </em><em className="ver client-ver"></em></span>
                            <span className="newest"><em>최신버전 : </em><em className="ver server-ver"></em></span>
                        </p>
                    </div>
                    <div className="btn-version">
                        <span className="btn-type3 already">현재 최신버전입니다.</span>
                    </div>

                    <div className="terms-box">
                        <div className="terms-title">
                            <span>이용약관</span>
                            <a href="javascript:void(0);" className="btn-folder"><span>더보기</span> <i className="fa fa-caret-down"></i></a>
                        </div>
                        <div className="terms-contents">
                            <div className="terms-contents-inner">
                                서비스이용약관<br />
                                제 1 장 총 칙<br />
                                제 1 조 【 목적 】<br />
                                본 이용약관(이하 “약관”)은 주식회사 에이치투이이치코리아(이하 “회사”)가 제공하는 timewallet 서비스(이하 “본 서비스”)를 이용함에 있어 회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br />
                                제 2 조 【 용어의 정의 】<br />
                                이 약관에서 사용하는 용어의 정의는 다음 각호와 같으며, 정의되지 않은 용어에 대한 해석은 관계법령과 회사의 이용약관 및 개인정보취급방침, 회사가 별도로 정한 지침, 기타 상관례에 의합니다.<br />
                                1. timewallet 서비스: 회사가 제공하는 어플리케이션 서비스로 사용자가 매장을 방문하여 머무른 시간을 계측하여 min을 부여하고, 취득한 min을 다양한 제휴사 및 가맹점에서 사용할 수 있는 서비스를 말합니다. 또한, 본 서비스는 사용자 위치를 기반으로 주변의 매장 정보를 제공하고, 매장의 상품 또는 서비스를 이용할 수 있는 다양한 쿠폰을 제공하여 드립니다.<br />
                                2. 사용자: 본 약관에 따라 본 서비스에 접속하여 그러한 서비스를 이용하는 사람을 말합니다.<br />
                                3 . min: 회원이 본 서비스 이용과정에서 제공되는 포인트를 말하며, 그 취득 및 사용 등에 관한 구체적인 사항은 본 약관 13조에 기술된 바와 같습니다.<br /><br /><br />
                                <table className="terms-tbl">
                                    <caption></caption>
                                    <colgroup>
                                        <col style={colWidth30} />
                                        <col style={colWidth20} />
                                        <col />
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col">수탁자/<br />제공받는자</th>
                                        <th scope="col">위탁업무/<br />제공목적</th>
                                        <th scope="col">제공하는 정보</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>한국모바일인증㈜</td>
                                        <td>본인인증</td>
                                        <td>고객명, 이동전화번호, 이동통신사,<br /> 생년월일, 성별, 내/외국인</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>


                    <div className="terms-box">
                        <div className="terms-title">
                            <span>개인정보 수집 및 이용안내</span>
                            <a href="javascript:void(0);" className="btn-folder"><span>더보기</span> <i className="fa fa-caret-down"></i></a>
                        </div>
                        <div className="terms-contents">
                            <div className="terms-contents-inner">
                                서비스이용약관<br />
                                제 1 장 총 칙<br />
                                제 1 조 【 목적 】<br />
                                본 이용약관(이하 “약관”)은 주식회사 에이치투이이치코리아(이하 “회사”)가 제공하는 timewallet 서비스(이하 “본 서비스”)를 이용함에 있어 회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br />
                                제 2 조 【 용어의 정의 】<br />
                                이 약관에서 사용하는 용어의 정의는 다음 각호와 같으며, 정의되지 않은 용어에 대한 해석은 관계법령과 회사의 이용약관 및 개인정보취급방침, 회사가 별도로 정한 지침, 기타 상관례에 의합니다.<br />
                                1. timewallet 서비스: 회사가 제공하는 어플리케이션 서비스로 사용자가 매장을 방문하여 머무른 시간을 계측하여 min을 부여하고, 취득한 min을 다양한 제휴사 및 가맹점에서 사용할 수 있는 서비스를 말합니다. 또한, 본 서비스는 사용자 위치를 기반으로 주변의 매장 정보를 제공하고, 매장의 상품 또는 서비스를 이용할 수 있는 다양한 쿠폰을 제공하여 드립니다.<br />
                                2. 사용자: 본 약관에 따라 본 서비스에 접속하여 그러한 서비스를 이용하는 사람을 말합니다.<br />
                                3 . min: 회원이 본 서비스 이용과정에서 제공되는 포인트를 말하며, 그 취득 및 사용 등에 관한 구체적인 사항은 본 약관 13조에 기술된 바와 같습니다.<br />
                                4. 비회원: 본 서비스를 이용하기 위해 회원가입절차 없이 어플리케이션을 설치만(단, 위치정보수집 및 활용, 이용약관 동의절차 필요)하여 서비스 이용이 가능한 회원을 의미한다. 비회원은 서비스 이용을 통해 포인트를 획득 할 수 있고 획득한 포인트를 사용할 수 있으나 포인트 사용에 일부 제한이 있습니다. 획득한 포인트를 자유롭게 사용하기 위해선 회원 등록이 필요합니다.<br />
                                5. 회원: 본 서비스를 이용하기 위해 이름, 성별 등 기본정보 입력 후 휴대폰 인증을 통해 본인 확인이 정상적으로 등록된 회원을 의미한다. 서비스에서 획득한 min을 자유롭게 사용할 수 있습니다.<br />
                                6. "제휴사" 및 "가맹점"(이하 통칭하여 "제휴가맹점" 이라 합니다.): 회사와 마케팅 제휴 계약을 체결하여 서비스를 공동으로 운영하기로 합의한 업체 또는 업소를 의미합니다.<br />
                                7. 위치검색: 모바일 단말기의 GPS, 음파 기반으로 추출된 좌표를 이용하여 확인된 회원 위치를 기준으로 반경 수km 이내를 말합니다.<br />
                                8. 애플리케이션: 모바일 단말기에서 본 서비스를 설치하여 이용할 수 있도록 구성된 프로그램을 말합니다.<br />
                                9. 개인정보: 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 “정통망법”) 상의 “개인정보”를 말합니다.<br />
                                10. 위치정보: 위치정보의 보호 및 이용 등에 관한 법률(이하 “위치정보법”) 상의 “위치정보” 및 “개인위치정보”<br />
                                11. 회원정보: 위 제9호, 제10호의 정보를 통칭합니다.<br />
                                12. 매장검색: 어플리케이션내에서 매장 상호명을 입력하여 매장을 찾을 수 있는 기능을 말합니다.<br /><br />
                                <table className="terms-tbl">
                                    <caption></caption>
                                    <colgroup>
                                        <col style={colWidth30} />
                                        <col style={colWidth20} />
                                        <col />
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col">수탁자/<br />제공받는자</th>
                                        <th scope="col">위탁업무/<br />제공목적</th>
                                        <th scope="col">제공하는 정보</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>한국모바일인증㈜</td>
                                        <td>본인인증</td>
                                        <td>고객명, 이동전화번호, 이동통신사,<br /> 생년월일, 성별, 내/외국인</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>

                    <div className="terms-box">
                        <div className="terms-title">
                            <span>위치기반 서비스 이용약관</span>
                            <a href="javascript:void(0);" className="btn-folder"><span>더보기</span> <i className="fa fa-caret-down"></i></a>
                        </div>
                        <div className="terms-contents">
                            <div className="terms-contents-inner">
                                서비스이용약관<br />
                                제 1 장 총 칙<br />
                                제 1 조 【 목적 】<br />
                                본 이용약관(이하 “약관”)은 주식회사 에이치투이이치코리아(이하 “회사”)가 제공하는 timewallet 서비스(이하 “본 서비스”)를 이용함에 있어 회사와 회원간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.<br />
                                제 2 조 【 용어의 정의 】<br />
                                이 약관에서 사용하는 용어의 정의는 다음 각호와 같으며, 정의되지 않은 용어에 대한 해석은 관계법령과 회사의 이용약관 및 개인정보취급방침, 회사가 별도로 정한 지침, 기타 상관례에 의합니다.<br />
                                1. timewallet 서비스: 회사가 제공하는 어플리케이션 서비스로 사용자가 매장을 방문하여 머무른 시간을 계측하여 min을 부여하고, 취득한 min을 다양한 제휴사 및 가맹점에서 사용할 수 있는 서비스를 말합니다. 또한, 본 서비스는 사용자 위치를 기반으로 주변의 매장 정보를 제공하고, 매장의 상품 또는 서비스를 이용할 수 있는 다양한 쿠폰을 제공하여 드립니다.<br />
                                2. 사용자: 본 약관에 따라 본 서비스에 접속하여 그러한 서비스를 이용하는 사람을 말합니다.<br />
                                3 . min: 회원이 본 서비스 이용과정에서 제공되는 포인트를 말하며, 그 취득 및 사용 등에 관한 구체적인 사항은 본 약관 13조에 기술된 바와 같습니다.<br />
                                4. 비회원: 본 서비스를 이용하기 위해 회원가입절차 없이 어플리케이션을 설치만(단, 위치정보수집 및 활용, 이용약관 동의절차 필요)하여 서비스 이용이 가능한 회원을 의미한다. 비회원은 서비스 이용을 통해 포인트를 획득 할 수 있고 획득한 포인트를 사용할 수 있으나 포인트 사용에 일부 제한이 있습니다. 획득한 포인트를 자유롭게 사용하기 위해선 회원 등록이 필요합니다.<br />
                                5. 회원: 본 서비스를 이용하기 위해 이름, 성별 등 기본정보 입력 후 휴대폰 인증을 통해 본인 확인이 정상적으로 등록된 회원을 의미한다. 서비스에서 획득한 min을 자유롭게 사용할 수 있습니다.<br />
                                6. "제휴사" 및 "가맹점"(이하 통칭하여 "제휴가맹점" 이라 합니다.): 회사와 마케팅 제휴 계약을 체결하여 서비스를 공동으로 운영하기로 합의한 업체 또는 업소를 의미합니다.<br />
                                7. 위치검색: 모바일 단말기의 GPS, 음파 기반으로 추출된 좌표를 이용하여 확인된 회원 위치를 기준으로 반경 수km 이내를 말합니다.<br />
                                8. 애플리케이션: 모바일 단말기에서 본 서비스를 설치하여 이용할 수 있도록 구성된 프로그램을 말합니다.<br />
                                9. 개인정보: 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 “정통망법”) 상의 “개인정보”를 말합니다.<br />
                                10. 위치정보: 위치정보의 보호 및 이용 등에 관한 법률(이하 “위치정보법”) 상의 “위치정보” 및 “개인위치정보”<br />
                                11. 회원정보: 위 제9호, 제10호의 정보를 통칭합니다.<br />
                                12. 매장검색: 어플리케이션내에서 매장 상호명을 입력하여 매장을 찾을 수 있는 기능을 말합니다.<br /><br />
                                <table className="terms-tbl">
                                    <caption></caption>
                                    <colgroup>
                                        <col style={colWidth30} />
                                        <col style={colWidth20} />
                                        <col />
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th scope="col">수탁자/<br />제공받는자</th>
                                        <th scope="col">위탁업무/<br />제공목적</th>
                                        <th scope="col">제공하는 정보</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>한국모바일인증㈜</td>
                                        <td>본인인증</td>
                                        <td>고객명, 이동전화번호, 이동통신사,<br /> 생년월일, 성별, 내/외국인</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>
                </PageContents>
            </div>
        );
    }
});