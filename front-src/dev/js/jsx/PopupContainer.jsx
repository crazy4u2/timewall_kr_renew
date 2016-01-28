var PopupContainer = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {

        };
        return state;
    },

    componentDidMount : function()
    {

    },

    render : function() {
        var _hide = {
            'display':'none'
        };
        return (
            <div className="popup-container-wrapper">
                <div className="popup-container">
                    <PopupChangePassword popName="POP_CHANGE_PASSWORD" style={_hide} />
                    <PopupPhoneCert popName="POP_PHONE_CERT" style={_hide} />
                    <PopupModalInvalid popName="POP_MODAL_INVALID" style={_hide} />
                    <PopupPhoneCertComplete popName="POP_PHONE_CERT_COMPLETE" style={_hide} />
                    <PopupWrongPassword popName="POP_WRONG_PASSWORD" style={_hide} />
                    <PopupAuthExceeds popName="POP_AUTH_EXCEEDS" style={_hide} />
                    <PopupNoMemberInfo popName="POP_NO_MEMBER_INFO" style={_hide} />
                </div>
            </div>
        );
    }
});