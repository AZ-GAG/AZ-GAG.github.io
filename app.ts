import express, { Request, Response } from 'express';
import fs from 'fs';
import morgan from 'morgan';
import cors from 'cors'
import AzGagGenerator from "az-generator";
import bodyParser from 'body-parser';

const app = express();
const time_file_path = 'time.txt';

/*
** 7일 후에 hell로 보내는 서버
** 기간을 늘리고 싶으면 Day 단위로 아래의 time_to_hell 값을 변경하면 된다.
*/
const minutes_to_hell = 42;

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors());
if (check_time_file() === false) {
    write_refresh_limit_time(time_file_path);
}
let limitTime : Date = read_time_file(time_file_path);

app.get('/time', (req: Request, res: Response) => {
  if (limitTime === undefined) {
    res.status(500).send({ result : 'No limit time' });
  } else {
    const now = new Date();
    const remainTime = limitTime.getTime() - now.getTime();
    const remainTimeInForm = get_time_in_form_DHMS(remainTime);
    res.status(200).send({
        result : 'success',
        remainTime : get_time_in_form_DHMS(remainTime)
    })
  }
});

app.get('/az', (req: Request, res: Response) => {
  console.log(AzGagGenerator());
  res.status(200).send(AzGagGenerator());
})

app.post('/time', (req: Request, res: Response) => {
    console.log(req.body);
    console.log('POST /time');
    if (write_refresh_limit_time(time_file_path) === false) {
        res.status(500);
        res.send({ result : 'failed' });
    } else {
        limitTime = read_time_file(time_file_path);
        res.status(200).send({ result : 'Refreshed' });
    }
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
    console.log('Server Start with Limit time:', limitTime);
});

/*
** util functions ================================================
*/
function write_refresh_limit_time(path : string) : Boolean {
    let new_limit_date : Date = new Date();
    new_limit_date.setMinutes(new_limit_date.getMinutes() + minutes_to_hell);
    try {
        fs.writeFileSync(path, new_limit_date.toString());
        console.log(`${write_refresh_limit_time.name} : ${new_limit_date}`)
        return true;
    } catch (err) {
        console.error(err);
    }
    return false;
}

function check_time_file() : boolean {
    try {
        fs.accessSync('time.txt', fs.constants.F_OK | fs.constants.R_OK);
        console.log('Time File exists');
        return true;
    } catch (err) {
        console.log('Time File does not exist');
        return false;
    }
}

function read_time_file(path : string) : Date {
    try {
        const Data : string = fs.readFileSync(path).toString();
        const date : Date = new Date(Data);
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date;
        }
    } catch (err) {
        console.error(err);
        return undefined;
    }
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
