var PageCouponExchangeInfo = React.createClass({
    couponMasterIdx : null,
    contextTypes : {
        viewSize : React.PropTypes.object
    },
    getInitialState : function() {
        return ({
            data : '' // getCouponInfo 에서 조회한 데이터를 담아놓을 것임.
        });
    },
    getCouponInfo : function(param, callback) {
        var _this = this;
        MODEL.get(API.COUPON_DETAIL, param, function(ret) {
            var respData = ret.data[0];
            if(ret.success && respData.ResultCode == 1) {
                var result = {
                    data : respData.ResultData
                };
                callback(result);
            } else {
                callback(null);
                alert( '오류[ResultCode :'+ret.data[0].ResultCode+']' );
                console.log( '오류[ResultCode :', ret.data[0].ResultCode,']' );
            }
        });
    },

    componentDidMount : function() {
        UI.registerPage( this.props.pageName, this );
    },

    onShow : function(idx) {
        var _this = this;
        _this.couponMasterIdx = idx;
        console.log(_this.couponMasterIdx);
        var _data = {
            'coupon_master_idx' : _this.couponMasterIdx
        };
        _this.getCouponInfo(_data, function(ret) {
            if (ret == null) { // 실패
                return;
            }

            var stateData = {
                data : ret.data
            };
            console.log(stateData);
            _this.setState(stateData);
        });
    },

    render : function() {
        //<CouponDetailInfo data={this.state.data} onShowMap={this.onShowMap} onShowCouponUse={this.onShowCouponUse} />
        return (
            <div className="page coupon" style={this.context.viewSize}>
                <PageHeader title="쿠폰정보" type="COUPON_EXCHANGE" />
                <PageContents className="twCoupon_info">

                </PageContents>
            </div>
        );
    }
});