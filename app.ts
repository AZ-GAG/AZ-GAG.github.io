import express, { Request, Response } from 'express';
import fs from 'fs';


const app = express();

let limitTime: Date | undefined = undefined;
const time_file_path = 'time.txt';
const time_to_hell = 5;

fs.access('time.txt', fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
        console.error(err);
        limitTime = init_limit_time(time_file_path);
    } else {
        console.log('Time File exists');
        limitTime = read_time_file(time_file_path);
    }
})

app.get('/time', (req: Request, res: Response) => {
  // return the remaining time
  // remaining time = limitTime - now
  if (limitTime === undefined) {
    res.status(500);
    res.send('No limit time');
  } else {
    const now = new Date();
    const remainTime = limitTime.getTime() - now.getTime();
    // console.log(remainTime);
    // res.send(remainTime.toString());
    res.status(200);
    res.send(get_time_in_form_DHMS(remainTime));
  }
});

app.post('/time', (req: Request, res: Response) => {
    // set the limit time
    // limitTime = now + 7 days
    limitTime = init_limit_time(time_file_path);
    res.send('Set limit time');
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
    console.log('Server Start with Limit time:', limitTime);
});

function init_limit_time(path : string) : Date {
    let new_limit_date : Date = new Date();
    new_limit_date.setDate(new_limit_date.getDate() + time_to_hell);
    fs.writeFileSync(path, new_limit_date.toString());
    return new_limit_date;
}

function read_time_file(path : string) : Date {
    const Data : string = fs.readFileSync(path).toString();
    const date : Date = new Date(Data);
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date;
    }
    return undefined;
}

function get_time_in_form_DHMS(time_ms) {
    const diffMs = time_ms; // 밀리초 단위 차이 계산
    const diffSec = Math.floor(diffMs / 1000); // 초 단위 차이 계산
    const diffMin = Math.floor(diffSec / 60); // 분 단위 차이 계산
    const diffHr = Math.floor(diffMin / 60); // 시 단위 차이 계산
    const diffDay = Math.floor(diffHr / 24); // 일 단위 차이 계산
    const remainTime = {
        day : diffDay,
        hour : diffHr % 24,
        minute : diffMin % 60,
        second : diffSec % 60,
        millisecond : diffMs % 1000
    }
    return remainTime;
}