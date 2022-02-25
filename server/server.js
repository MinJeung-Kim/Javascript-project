// express라이브러리 첨부.
const express = require("express");

// 라이브러리를 이용해서 새로운 객체 생성.
const app = express();

app.use(express.urlencoded({ extended: true }));

// 서버띄울 포트번호, 띄운 후 실행할 코드
app.listen(8080, function() {
  console.log("listening on 8080");
});

app.get("/pet", function(요청, 응답) {
  응답.send("반갑습니다.");
});
