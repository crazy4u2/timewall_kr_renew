var ShopSelector = React.createClass(
{
    getInitialState : function()
    {

    },

    componentDidMount : function()
    {
        console.log( 'state : ', this.state );
        console.log( 'aaaa' );
    },

    render : function()
    {
        return (
            <div className="shop-selector-wrapper" >
                <ShopSelectorHeader />
                <ShopSelectorCategoryMenu />
                <ShopSelectorMode />
            </div>
        );
    }
});