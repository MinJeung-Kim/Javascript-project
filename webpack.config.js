const path = require("path");

const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    main: "./src/app.js",
    // result: "./src/result.js",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: (app) => {
      // apiMocker라는 미들웨어를 추가한다.
      app.use(apiMocker("/api", "mocks/api"));
    },
    hot: true,
  },
  optimization: {
    minimizer:
      mode === "production"
        ? [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그를 제거한다.
                },
              },
            }),
          ]
        : [],
    // splitChunks: {
    //   chunks: "all",
    // },
  },
  externals: {
    axios: "axios",
  },
  // loader 추가
  module: {
    rules: [
      {
        // 엔트리포인트 부터 시작하여 연결된 모든 모듈을 검색
        test: /\.css$/,
        // use: 사용할 로더를 명시한다.
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          // publicPath: "./dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000, // 20kb (용량설정)
        },
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "babel-loader",
        include: [path.resolve(__dirname, "app")],
        // node_modules의 코드를 바벨로더가 처리하지 않게 설정.
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: ` 
        Build Date : ${new Date().toLocaleDateString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({
      // 기본적으로 제공된 환경 변수 이외의 변수를 추가.
      // TWO: "1+1",  =>  코드
      TWO: JSON.stringify("1+1"), // =>  문자열
      "api.domain": JSON.stringify("http://dev.api.doamin.com"), // =>  객체타입
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      // template에 넣어줄 변수 값을 정의.
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              // 빈칸 제거
              collapseWhitespace: true,
              // 주석 제거
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(),
    // 나머지 연산자로 전달하면 환경변수에 따라서 실행된다.
    ...(process.env.NODE_ENV === "production"
      ? [
          new MiniCssExtractPlugin({
            // 원본파일명으로 빌드한다.
            fillename: "[name].css",
          }),
        ]
      : []),
    new CopyPlugin([
      {
        from: "./node_modules/axios/dist/axios.min.js",
        to: "./axios.min.js",
      },
    ]),
  ],
};
