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

    render : function()
    {
        return (
            <div className="popup-container-wrapper">
                <div className="popup-container">
                    <PopupChangePassword popName="POP_CHANGE_PASSWORD"/>
                </div>
            </div>
        );
    }
});