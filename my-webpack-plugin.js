class MyWebpackPlugin {
  apply(compiler) {
    // plugin() : compiler객체에 속한 함수
    // plugin(문자열,콜백함수)
    compiler.plugin("emit", (compilation, callback) => {
      // compilation : 웹팩이 번들링한 결과를 알수 있다.
      // assets[]을 통해 output에있는 main.js에 접근이 가능하다.
      // source() 함수를 통해 main.js가 갖게될 파일을 내용을 확인할 수 있다.
      const source = compilation.assets["main.js"].source();
      console.log(source);
      // source() 함수 재 정의
      compilation.assets["main.js"].source = () => {
        // banner의 문자열 + 원본소스를 합한 문자열을 반환한다.
        const banner = [
          "/**",
          "* 이것은 BannerPlugin이 처리한 결과입니다.",
          "* Build Date: 2019-10-10",
          "*/",
        ].join("\n");
        return banner + "\n\n" + source;
      };
      callback();
    });
  }
}

module.exports = MyWebpackPlugin;
