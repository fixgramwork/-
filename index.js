const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db.js');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/test', (req, res) => {
  res.render('index');
});

app.get('/map', (req, res) => {
  res.render('map');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/aboutList',(req,res) => {
  var sql = `select * from contact`;
  db.query(sql, function(err, results, fields){
    if(err) throw err;
    res.render('contactList', {lists:results})
  })
});

app.post('/contactProc', (req, res) => {
  const { name, email, phone, memo } = req.body;
  //const name.req.body;
  //const email.req.body;
  //const phone.req.body;
  //const memo.req.body;

  
  // SQL Injection 방지를 위한 Parameterized Query
  const sql = `INSERT INTO new_table (name, phone, email, memo, regdate) VALUES ('${name}','${phone}','${email}','${memo}', NOW())`;
  const values = [name, phone, email, memo];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res
        .status(500)    
        .send("<script>alert('오류가 발생했습니다. 다시 시도해주세요.'); location.href='/';</script>");
    }
    console.log('자료 1개를 삽입했습니다.');
    res.send("<script>alert('문의사항이 등록되었습니다.'); location.href='/';</script>");
  });
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소는 http://localhost:${port}`);
});