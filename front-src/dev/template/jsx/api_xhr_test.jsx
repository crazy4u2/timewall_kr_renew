var ApiXhrTest = React.createClass({
    getInitialState:function() {
        return ({data:['']});
    },
    componentDidMount : function() {
        twCommonUi.setContentsHeight();
        var _this=this,
            _data = {
            //coin : 5000,
            //u_idx : 1,
            d_idx : 1,
            //page : 1
        };
        reqwest({
            //url : loc[29].api[0],
            url : 'http://localhost:9000/Donation/Get_Donation_Use_History', //여기다 api 주소 넣기
            type : loc[29].type,
            method : 'POST',
            data : _data
        })
        .then(function(resp) {
            if (resp[0].ResultCode == 1) {
                console.log('ok');
                console.log(resp[0]);
                _this.setState({
                    data:"ok"
                });
            } else {
                console.log('fuck');
                _this.setState({
                    data:"fuck"
                });
            }
        });

    },
    render : function() {
        return (
            <div className={"page "+loc[30].pageName+" "+this.props.position}>
                <div id="success">{this.state.data}</div>
            </div>
        )
    }
});