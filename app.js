"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var morgan_1 = __importDefault(require("morgan"));
var app = (0, express_1["default"])();
var time_file_path = 'time.txt';
var time_to_hell = 7;
app.use((0, morgan_1["default"])('combined'));
if (check_time_file() === false) {
    write_refresh_limit_time(time_file_path);
}
var limitTime = read_time_file(time_file_path);
app.get('/time', function (req, res) {
    // return the remaining time
    // remaining time = limitTime - now
    if (limitTime === undefined) {
        res.status(500);
        res.send('No limit time');
    }
    else {
        var now = new Date();
        var remainTime = limitTime.getTime() - now.getTime();
        // console.log(remainTime);
        // res.send(remainTime.toString());
        res.status(200);
        res.send(get_time_in_form_DHMS(remainTime));
    }
});
app.post('/time', function (req, res) {
    // refresh the limit time
    console.log('POST /time');
    if (write_refresh_limit_time(time_file_path) === false) {
        res.status(500);
        res.send('Refresh failed');
    }
    else {
        limitTime = read_time_file(time_file_path);
    }
    res.status(200);
    res.send('Refreshed');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('Server Start with Limit time:', limitTime);
});
function write_refresh_limit_time(path) {
    var new_limit_date = new Date();
    new_limit_date.setDate(new_limit_date.getDate() + time_to_hell);
    try {
        fs_1["default"].writeFileSync(path, new_limit_date.toString());
        console.log("".concat(write_refresh_limit_time.name, " : ").concat(new_limit_date));
        return true;
    }
    catch (err) {
        console.error(err);
    }
    return false;
}
function check_time_file() {
    try {
        fs_1["default"].accessSync('time.txt', fs_1["default"].constants.F_OK | fs_1["default"].constants.R_OK);
        console.log('Time File exists');
        return true;
    }
    catch (err) {
        console.log('Time File does not exist');
        return false;
    }
}
function read_time_file(path) {
    try {
        var Data = fs_1["default"].readFileSync(path).toString();
        var date = new Date(Data);
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date;
        }
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
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
