// 1. loader은 함수형태로 생성한다.
module.exports = function myWebpackLoader(content) {
  // "console.log("문자열을 만나면 "alert("로 치환
  return content.replace("console.log(", "alert(");
};
