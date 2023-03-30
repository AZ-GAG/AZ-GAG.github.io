"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var app = (0, express_1["default"])();
var limitTime = undefined;
var time_file_path = 'time.txt';
fs_1["default"].access('time.txt', fs_1["default"].constants.F_OK | fs_1["default"].constants.R_OK, function (err) {
    if (err) {
        console.error(err);
        limitTime = init_limit_time(time_file_path);
    }
    else {
        console.log('Time File exists');
        limitTime = read_time_file(time_file_path);
    }
});
app.get('/time', function (req, res) {
    // return the remaining time
    // remaining time = limitTime - now
    if (limitTime === undefined) {
        res.send('No limit time');
    }
    else {
        var now = new Date();
        var remainTime = limitTime.getTime() - now.getTime();
        // console.log(remainTime);
        // res.send(remainTime.toString());
        res.send(get_time_in_form_DHMS(remainTime));
    }
});
app.post('/time', function (req, res) {
    // set the limit time
    // limitTime = now + 7 days
    limitTime = init_limit_time(time_file_path);
    res.send('Set limit time');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('Server Start with Limit time:', limitTime);
});
function init_limit_time(path) {
    var new_limit_date = new Date();
    new_limit_date.setDate(new_limit_date.getDate() + 7);
    fs_1["default"].writeFileSync(path, new_limit_date.toString());
    return new_limit_date;
}
function read_time_file(path) {
    var Data = fs_1["default"].readFileSync(path).toString();
    var date = new Date(Data);
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
    }
    return undefined;
}
function get_time_in_form_DHMS(time_ms) {
    var diffMs = time_ms; // 밀리초 단위 차이 계산
    var diffSec = Math.floor(diffMs / 1000); // 초 단위 차이 계산
    var diffMin = Math.floor(diffSec / 60); // 분 단위 차이 계산
    var diffHr = Math.floor(diffMin / 60); // 시 단위 차이 계산
    var diffDay = Math.floor(diffHr / 24); // 일 단위 차이 계산
    var remainTime = {
        day: diffDay,
        hour: diffHr % 24,
        minute: diffMin % 60,
        second: diffSec % 60,
        millisecond: diffMs % 1000
    };
    return remainTime;
}
