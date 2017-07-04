var G_API = "http://127.0.0.1:90";

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);

var Identity = {
    param: '__identity',
    get: function () {
        var identity = localStorage.getItem(this.param);
        return identity ? JSON.parse(identity) : null;
    },
    set: function (data) {
        localStorage.setItem(this.param, JSON.stringify(data));
    },
    clear: function () {
        localStorage.removeItem(this.param);
    },
    getUserId: function () {
        var identity = this.get();
        return identity ? identity['uid'] : null;
    },
    getAccessToken: function () {
        var identity = this.get();
        return identity ? identity['access_token'] : null;
    },
    isExpired: function () {
        var ctime = new Date().getTime()
        var identity = this.get()
        if (identity && identity['expire'] && identity['expire'] > ctime)
            return false
        else
            return true
    }
};