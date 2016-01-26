/**************************************************************************
 * 모든 모달 로딩
 *
 **************************************************************************/
var ModalAddMinAll = React.createClass({
    render : function() {
        var props={
            display:'none',
            position:'absolute',
            top:'100px',
            width:'100%',
            zIndex:'200'
        };

        return (
            <div>
                <ModalAddNonMember {...props} />
                <ModalAddMember {...props} />
                <ModalExchangeCoin {...props} />
            </div>
        );
    }
});

/**************************************************************************
 * add 10min non member class
 *
 **************************************************************************/
var ModalAddNonMember = React.createClass({
    componentDidMount : function() {
    },
    render : function() {
        return (
            <section className="modal modal-10min-stranger" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type5"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">10min 적립 성공!</p>
                            <p className="text-type5">스타벅스 강남 2호점</p>
                            <div className="text-type3"><em>10min</em>은 <em>100coin</em>으로 교환가능하며, <br />
                                coin은 지정된 가맹점에서 현금처럼사용이 가능합니다.
                            </div>
                            <p className="text-type4">현재 비회원 상태입니다. <br /> 코인교환은 로그인 후 가능합니다.</p>
                            <p className="text-type5">* 메뉴에서 회원가입을 해주세요</p>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <a className="btn-type1" href="javascript:void(0);">확인</a>
                    </div>
                </div>
            </section>
        );
    }
});

/**************************************************************************
 * add 10min member class
 *
 **************************************************************************/
var ModalAddMember = React.createClass({
    componentDidMount : function() {
    },
    render : function() {
        return (
            <section className="modal modal-10min-member" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type5"></div>

                    <div className="modal-content">
                        <div className="message">
                            <p className="text-type2">10min 적립 성공!</p>
                            <p className="text-type5">스타벅스 강남 2호점</p>
                            <div className="text-type3"><em></em>은 <em></em>으로 교환가능하며, <br />
                                coin은 지정된 가맹점에서 현금처럼사용이 가능합니다.
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer fix">
                        <div className="btnbox">
                            <a className="btn-type2" href="javascript:void(0);">취소</a>
                            <a className="btn-type1" href="javascript:void(0);">코인교환</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});

/**************************************************************************
 * exchange coin class
 *
 **************************************************************************/
var ModalExchangeCoin = React.createClass({
    componentDidMount : function() {
    },
    render : function() {
        return (
            <section className="modal modal-small modal-coin-exchange-shop-state" style={this.props}>
                <div className="modal-inner">
                    <div className="modal-header icon-type6">
                        코인교환
                        <a className="btn-modal-close" href="javascript:void(0);"><span className="팝업 창 닫기"></span></a>
                    </div>

                    <div className="modal-content">
                        <div className="numberbox min">
                            <div className="numberbox-inner">
                                <input type="text" className="write-number" readOnly />
                                <span className="unit">min</span>
                            </div>
                        </div>
                        <div className="numberbox coin">
                            <div className="numberbox-inner">
                                <input type="text" className="write-number" readOnly />
                                <span className="unit">coin</span>
                            </div>
                        </div>
                        <p className="text-type3">코인으로 교환하시겠습니까?</p>
                    </div>
                    <a className="btn-exchange-modal" href="javascript:void(0);"><span className="교환버튼"></span></a>
                </div>
            </section>
        );
    }
});



