var ShopSelectorCategoryMenu = React.createClass(
{
    getInitialState : function()
    {
        var state =
        {
            categoryList :
                [
                    {
                        title : '모두',
                        imgUrl : ''
                    },
                    {
                        title : '음식',
                        imgUrl : ''
                    },
                    {
                        title : '음료',
                        imgUrl : ''
                    },
                    {
                        title : '뷰티',
                        imgUrl : ''
                    },
                    {
                        title : '생활',
                        imgUrl : ''
                    },
                    {
                        title : '주문',
                        imgUrl : ''
                    },
                    {
                        title : '교육/의료',
                        imgUrl : ''
                    }
                ]
        };
        console.log( 'ShopSelectorCategoryMenu::getInitialState : ', state );
        return state;
    },

    componentDidMount : function()
    {

    },

    render : function()
    {
        return (
            <div className="shop-selector-categorymenu">
            </div>
        );
    }
});

var ShopSelectorCategoryMenuButton = React.createClass(
{
    getInitialState : function()
    {

    },

    componentDidMount : function()
    {

    },

    render : function()
    {

    }
});