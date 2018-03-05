const G_API = "http://api.step8step.tech:8888";

export default {
    G_API,
    param: '__identity',
    get: function () {
        let identity = localStorage.getItem(this.param);
        return identity ? JSON.parse(identity) : null
    },
    set: function (data) {
        localStorage.setItem(this.param, JSON.stringify(data))
    },
    clear: function () {
        localStorage.removeItem(this.param)
    },
    getUserId: function () {
        let identity = this.get()
        return identity ? identity['uid'] : null
    },
    getAccessToken: function () {
        let identity = this.get()
        return identity ? identity['access_token'] : null
    },
    isExpired: function () {
        let ctime = new Date().getTime()
        let identity = this.get()
        if (identity && identity['expire'] && identity['expire'] > ctime)
            return false
        else
            return true
    }
}