/*********************************************************************************
 * CoinUse class
 * html template
 *********************************************************************************/
var CoinUse = React.createClass({
    getInitialState:function() {
        return ({coin:0});
    },
    componentDidMount:function() {
        //높이 설정 공통 부분
        twCommonUi.setContentsHeight();
        jQuery('.contentsScroll').height(jQuery(window).height()-jQuery('.header').height());

        var _this=this,
            number_check = /^[0-9]*$/;

        reqwest({
            url: loc[11].api[0], //회원정보조회
            method: 'post',
            type: 'json',
            data: {
                u_idx:(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1
            }
        })
        .then(function (resp) {
            /*************************
             resp.ResultCode
             '1'=success
             '-1'=fail
             *************************/
            if (resp[0].ResultCode == '1') {

                //setState excute react render
                if (_this.isMounted()) { //ajax의 응답이 왔을 때 컴포넌트가 unmount된 경우를 판단하여 setState나 forceUpdate를 호출하지 않게 한다.
                    _this.setState({
                        coin: resp[0].ResultData[0].coin
                    });

                    jQuery('.use-button .btn-use a').on('tap',function(e) {
                        e.stopPropagation();
                        if (!jQuery('.money input').val()) {
                            jQuery('.amount .message').addClass('error')
                                .text('* 금액을 입력해 주세요.');
                            jQuery('.money input').focus();
                            return false;
                        } else {
                            if(number_check.test(jQuery('.money input').val())) {
                                if(jQuery('.money input').val().search(/[0]/g)){
                                    var result = jQuery('.money input').val() %100;
                                    if(result != 0) {
                                        jQuery('.amount .message').addClass('error').text('* 코인은 100단위로만 사용가능합니다.');
                                        jQuery('.money input').focus();
                                        return false;
                                    } else {
                                        if(parseInt(jQuery('.money input').val()) > parseInt(jQuery('.use-top-wrap strong').text())) {
                                            jQuery('.amount .message').addClass('error')
                                                .text('* 보유 coin을 초과한 금액입니다.');
                                            jQuery('.money input').focus();
                                            return false;
                                        } else {
                                            jQuery('header').data('coin',jQuery('.money input').val());
                                            location.href='#/coin-use-select';
                                        }
                                    }
                                }
                            } else {
                                jQuery('.amount .message').addClass('error')
                                    .text('* 숫자만 입력해주세요.');
                                jQuery('.money input').focus();
                                return false;
                            }
                        }
                    });
                }
            } else if (resp.ResultCode == '-1') { //실패
            }
        })
        .fail(function (err, msg) {
            console.log(err);
            jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
        });
    },
    render : function () {
        var _bg={
            background:'#e5e5e5'
        };

        return (
            <div className={"page "+loc[11].pageName+" "+this.props.position} style={_bg}>
                <div className="contentsScroll">

                    <div className="use-top-wrap coin">
                        <div className="use-top-wrap-inner">
                            <strong>{this.state.coin}</strong><span>coin</span>
                            <p>가맹점에서 현금처럼 사용이 가능합니다.</p>
                            <p className="except">*일부 가맹점 제외</p>
                        </div>
                    </div>
                    <div className="payment-wrap">
                        <div className="roundbox">
                            <div className="roundbox-inner">
                                <div className="amount">
                                    <label for="will">사용하실 금액을 입력해주세요</label>
                                    <div className="money">
                                        <div className="money-inner">
                                            <input type="tel" id="will" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="message">* 금액을 입력해 주세요</div>
                                </div>
                            </div>
                        </div>
                        <div className="roundbox">
                            <div className="roundbox-inner">
                                <div className="use-button">
                                    <span className="title">결제하기</span>
                                    <p>자세한 결제방법은 아래를 확인하세요. </p>
                                    <div className="btn-use">
                                        <a href="javascript:void(0);">결제하기</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="roundbox">
                            <div className="roundbox-inner">
                                <div className="use-way">
                                    <span className="title">결제방법</span>
                                    <div className="img-explain">
                                        <ol className="fix">
                                            <li>블루투스 ON</li>
                                            <li>단말기 제시</li>
                                            <li>비콘태그</li>
                                        </ol>
                                    </div>
                                    <ol className="text-explain">
                                        <li>1) 단말기의 블루투스 기능을 켜주세요.</li>
                                        <li>2) 점원의 안내에 따라 단말기를 제시하세요.</li>
                                        <li>3) 비콘과 단말기가 통신 후 결제가 완료됩니다.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
});


