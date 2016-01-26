
/**
 * Module dependencies.
 */

var express = require('express')
    , http=require('http')
    , path = require('path')
    , bodyParser = require('body-parser')
    , app = express()
    , fs = require("fs")
    , engine = require('express-dot-engine');

var _path='/front-src/release/html/',
    _pathTemplate='/front-src/release/',
    dev='/front-src/dev/',
    release='/front-src/dev/';

app.set('port', process.env.PORT || 8080);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//set link root
app.use(express.static(__dirname));

//react main
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + _pathTemplate + 'index.html'));
});

app.get('/slider', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'index.html'));
});

app.get('/shopMain', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_main.html'));
});

// test
app.get('/include', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'include.html'));
});

app.get('/splash', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'splash.html'));
});

app.get('/terms', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'terms.html'));
});

app.get('/commonComponent', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'common_component.html'));
});

app.get('/modalView', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'modal.html'));
});

app.get('/memberJoin', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'member_join.html'));
});

app.get('/memberLogin', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'member_login.html'));
});

app.get('/memberSearchPassword', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'member_search_password.html'));
});

app.get('/memberJoinComplete', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'member_join_complete.html'));
});

app.get('/memberLoginComplete', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'member_login_complete.html'));
});

app.get('/shopList', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_list.html'));
});

app.get('/shopMap', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_map.html'));
});

app.get('/shopSearch', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_search.html'));
});

app.get('/shopSearchList', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_search_list.html'));
});

app.get('/shopDetail', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'shop_detail.html'));
});

app.get('/list', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'list-page.html'))
});

app.get('/menuMain', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'menu-main.html'))
});

app.get('/couponExchange', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coupon_exchange.html'))
});

app.get('/couponInfo', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coupon_info.html'))
});

app.get('/coinExchange', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_exchange.html'))
});

app.get('/coinUse', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_use.html'))
});

app.get('/coinUseStep1', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_use_step1.html'))
});

app.get('/coinUseStep2', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_use_step2.html'))
});

app.get('/coinDonate', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_donate.html'))
});

app.get('/coinMyDonate', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_my_donate.html'))
});

app.get('/coinDonateDetail', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coin_donate_detail.html'))
});

app.get('/myWallet', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'my_wallet.html'))
});

app.get('/bookmark', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'bookmark.html'))
});

app.get('/myCoupon', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'my_coupon.html'))
});

app.get('/usedList', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'used_list.html'))
});

app.get('/notice', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'notice.html'))
});

app.get('/setting', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'setting.html'))
});

app.get('/settingApp', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'setting_app.html'))
});

app.get('/settingVersion', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'setting_version.html'))
});

app.get('/couponUse', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coupon_use.html'))
});

app.get('/couponUseStep1', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coupon_use_step1.html'))
});

app.get('/couponUseStep2', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'coupon_use_step2.html'))
});

app.get('/settingFaq', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'setting_faq.html'))
});

app.get('/settingTutorial', function(req, res) {
    res.sendFile(path.join(__dirname + _path + 'setting_tutorial.html'))
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
