// pages/BookCreate.jsx

import { useState, useEffect } from "react";
import axios from "axios";
// 🔽 追加
import weatherJson from "../static/weather.json";



export const BookCreate = () => {
	// 🔽 追加
  const [loading, setLoading] = useState(true); //初期値はtrue＝データが揃っていない＝ローディング中

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [geoLocation, setGeoLocation] = useState(null);
  const [place, setPlace] = useState("");
  const [weather, setWeather] = useState("");

  const getBooks = async (keyword) => {
    const url = "https://www.googleapis.com/books/v1/volumes?q=intitle:";
    const result = await axios.get(`${url}${keyword}`);
    console.log(result.data); //APIを使う時は取ってきたデータをコンソールログでデータの形を確認するのが基本。特に初めて使うAPIほどそう。
    setBooks(result.data.items ?? []);
  };

  // 🔽 追加
  const selectBook = (book) => {
    setBook(book.volumeInfo.title);
  };

  // 🔽 追加
  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    setGeoLocation({ latitude, longitude });

    // 上記2行は分割代入という書き方。以下と同じ。
    // const latitude = position.coords.latitude;
    // const longitude = position.coords.longitude;
    // setGeoLocation({
    //   latitude: latitude,
    //   longitude: longitude,
    // });

    // 🔽 追加
    const placeData = await axios.get(
    	`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    console.log(placeData.data);
    setPlace(placeData.data.display_name);
		// console.log(place); ← こうしても何も表示されない。なぜか？：setPlaceなどのset関数は非同期だから。placeに値がセットされる前に下の処理がどんどん走っていく。だからplaceに何も入っていないうちにコンソールログが走っちゃう。
		// 以下のuseEffect()を書いておけば表示できる！
		// useEffect(() => {
		// 	console.log(place);
		// }, [place]);

		// 🔽 追加
    const weatherData = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FTokyo`
    );
    console.log(weatherData.data);
    setWeather(weatherJson[weatherData.data.daily.weathercode[0]]);

		// 🔽 追加
    setLoading(false);
  };

  const fail = (error) => console.log(error);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  }, []);

	// 🔽 追加
  if (loading) {
    return <p>now loading...</p>;
  }

  return (
    <>
      {/* 🔽 ここから追加 */}
      <table>
        <tbody>
          <tr>
            <td>場所</td>
            <td>{place}</td>
          </tr>
					{/* 🔽 追加 */}
          <tr>
            <td>天気</td>
            <td>{weather}</td>
          </tr>
          <tr>
            <td>読んだ本</td>
            <td>{book}</td>
          </tr>
        </tbody>
      </table>
      {/* 🔼 ここまで追加 */}
      <p>キーワードで検索する</p>
      <input type="text" onChange={(e) => getBooks(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>書籍名</th>
            <th>出版社</th>
            <th>出版年</th>
            <th>リンク</th>
          </tr>
        </thead>
        <tbody>
          {books.map((x, i) => (
            <tr key={i}>
              <td>
                {/* 🔽 編集（onClick部分） */}
                <button type="button" onClick={() => selectBook(x)}>
                  選択
                </button>
              </td>
              <td>{x.volumeInfo.title}</td>
              <td>{x.volumeInfo.publisher}</td>
              <td>{x.volumeInfo.publishedDate}</td>
              <td>
                <a
                  href={x.volumeInfo.infoLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

// books：配列の形で本10冊分のデータが入っている
// xには1個1個のデータが入っている。iは配列のインデックス。
// 一番大元のBookCreate();関数自体はいつ動くか？ → 文字が入力されるごとに。
// useEffectの第二引数が[]だったら、「一番最初だけやってくれ」という意味になる。
// Reactの最初つまづきやすいポイント：処理がいつ実行されるか？ → 「いつやるか」は下に分けて書く（OnClickとか）

// 以下の流れだけでもReactやAPIではよく出てくる：【データをとってくる → データの中身をチェックして欲しいデータが何かを確認する → 欲しいデータをset関数でステートに保存 → 画面に表示する】

// awaitを使うためには、getBooks関数のところにasyncをつけないといけない。awaitは「外部からデータを取ってくるのに少しタイムラグがあるから、resultに値が入ってから下の処理に進んでね」という意味。asyncやawaitをつけないと「変数に値が入っていません」というエラーが出る。

// データが揃っていないうちにユーザーが操作可能な状態にしちゃうと、けっこうバグが起きる → よくやるのは、「今データが揃っているのか揃っていないのかを判断して、コンテンツを表示するかしないかを切り替える」ということ → どうやるか？：1個useStateを作っておいて、データが揃っているかどうかでtrueかfalseかを切り替える。trueのときはローディング中でコンテンツを表示しない、データが揃ったらfalseに切り替える。