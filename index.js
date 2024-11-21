const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db.js');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// 메인 페이지
app.get('/', (req, res) => {
  res.render('index');
});

// 정적 템플릿 처리 경로 간소화
const staticPages = ['profile', 'map', 'about', 'test'];
staticPages.forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    res.render(page);
  });
});

/*
app.get('/aboutList', (req, res) => {
  const sqls = `SELECT * FROM new_table`;

  db.query(sqls, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res
        .status(500)
        .send("<script>alert('데이터를 불러오는 중 오류가 발생했습니다.'); location.href='/';</script>");
    }
    res.render('aboutlist', { lists: results });
  });
});
*/
// 문의사항 목록 조회 Read
app.get('/aboutList', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM new_table');
    res.render('aboutlist', { lists: results });
  } catch (err) {
    console.error('Error fetching data:', err);
    return res
      .status(500)
      .send("<script>alert('데이터를 불러오는 중 오류가 발생했습니다.'); location.href='/';</script>");
  }
});

//문의사항 삭제 Delete
app.get('/aboutDelete', async (req, res) => {
  try {
    const idx = req.query.idx;

    // SQL Injection 방지를 위해 Parameterized Query 사용
    const sql = `DELETE FROM new_table WHERE idx = ?`;
    const [result] = await db.query(sql, [idx]);

    if (result.affectedRows > 0) {
      console.log('자료 1개를 삭제하였습니다.');
      res.send(
        "<script>alert('문의사항이 삭제되었습니다.'); location.href='/aboutList';</script>"
      );
    } else {
      res.send(
        "<script>alert('삭제할 데이터가 없습니다.'); location.href='/aboutList';</script>"
      );
    }
  } catch (err) {
    console.error('Error deleting data:', err);
    res
      .status(500)
      .send("<script>alert('삭제 중 오류가 발생했습니다.'); location.href='/aboutList';</script>");
  }
});


// 문의사항 등록 Create
app.post('/contactProc', async (req, res) => {
  const { name, email, phone, memo } = req.body;

  // Parameterized Query 사용
  const sql = `INSERT INTO new_table (name, phone, email, memo, regdate) VALUES (?, ?, ?, ?, NOW())`;
  const values = [name, phone, email, memo];

  try {
    await db.query(sql, values); // await 사용
    console.log('자료 1개를 삽입했습니다.');
    res.send("<script>alert('문의사항이 등록되었습니다.'); location.href='/';</script>");
  } catch (err) {
    console.error('Error inserting data:', err);
    res
      .status(500)
      .send("<script>alert('오류가 발생했습니다. 다시 시도해주세요.'); location.href='/';</script>");
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소는 http://localhost:${port}`);
});
