import express, { Request, Response } from 'express';
import fs from 'fs';


const app = express();

let limitTime: Date | undefined = undefined;

fs.readFile('time.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    } else {
        limitTime = new Date(data);
        console.log('Limit time:', limitTime);
    }
});


app.get('/time', (req: Request, res: Response) => {
  // return the remaining time
  // remaining time = limitTime - now
  if (limitTime === undefined) {
    res.send('No limit time');
  } else {
    const now = new Date();
    const remainTime = limitTime.getTime() - now.getTime();
    console.log(remainTime);
    res.send(remainTime.toString());
  }
});

app.post('/time', (req: Request, res: Response) => {
  // reset limitTime to 1 week later
    limitTime = refresh_limit_time();
    res.send(limitTime.toString());
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');

  if (limitTime === undefined) {
    console.log('No limit time');
    limitTime = new Date();
    limitTime.setDate(limitTime.getDate() + 7);
    console.log('Limit time refreshed :', limitTime);
    fs.writeFile('time.txt', limitTime.toString() , (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Limit time updated');
    })
  }
});

function refresh_limit_time() : Date {
    let new_limit_date : Date = new Date();
    new_limit_date.setDate(new_limit_date.getDate() + 7);
    fs.writeFile('time.txt', new_limit_date.toString() , (err) => {
        if (err) {
            console.error(err);
            return undefined;
        }
    });
    return new_limit_date;
}