// pages/BookCreate.jsx

import { useState, useEffect } from "react";
import axios from "axios";
// ð½ è¿½å 
import weatherJson from "../static/weather.json";



export const BookCreate = () => {
	// ð½ è¿½å 
  const [loading, setLoading] = useState(true); //åæå¤ã¯trueï¼ãã¼ã¿ãæã£ã¦ããªãï¼ã­ã¼ãã£ã³ã°ä¸­

  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [geoLocation, setGeoLocation] = useState(null);
  const [place, setPlace] = useState("");
  const [weather, setWeather] = useState("");

  const getBooks = async (keyword) => {
    const url = "https://www.googleapis.com/books/v1/volumes?q=intitle:";
    const result = await axios.get(`${url}${keyword}`);
    console.log(result.data); //APIãä½¿ãæã¯åã£ã¦ãããã¼ã¿ãã³ã³ã½ã¼ã«ã­ã°ã§ãã¼ã¿ã®å½¢ãç¢ºèªããã®ãåºæ¬ãç¹ã«åãã¦ä½¿ãAPIã»ã©ããã
    setBooks(result.data.items ?? []);
  };

  // ð½ è¿½å 
  const selectBook = (book) => {
    setBook(book.volumeInfo.title);
  };

  // ð½ è¿½å 
  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    setGeoLocation({ latitude, longitude });

    // ä¸è¨2è¡ã¯åå²ä»£å¥ã¨ããæ¸ãæ¹ãä»¥ä¸ã¨åãã
    // const latitude = position.coords.latitude;
    // const longitude = position.coords.longitude;
    // setGeoLocation({
    //   latitude: latitude,
    //   longitude: longitude,
    // });

    // ð½ è¿½å 
    const placeData = await axios.get(
    	`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    console.log(placeData.data);
    setPlace(placeData.data.display_name);
		// console.log(place); â ãããã¦ãä½ãè¡¨ç¤ºãããªãããªããï¼ï¼setPlaceãªã©ã®seté¢æ°ã¯éåæã ãããplaceã«å¤ãã»ãããããåã«ä¸ã®å¦çãã©ãã©ãèµ°ã£ã¦ãããã ããplaceã«ä½ãå¥ã£ã¦ããªããã¡ã«ã³ã³ã½ã¼ã«ã­ã°ãèµ°ã£ã¡ããã
		// ä»¥ä¸ã®useEffect()ãæ¸ãã¦ããã°è¡¨ç¤ºã§ããï¼
		// useEffect(() => {
		// 	console.log(place);
		// }, [place]);

		// ð½ è¿½å 
    const weatherData = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FTokyo`
    );
    console.log(weatherData.data);
    setWeather(weatherJson[weatherData.data.daily.weathercode[0]]);

		// ð½ è¿½å 
    setLoading(false);
  };

  const fail = (error) => console.log(error);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  }, []);

	// ð½ è¿½å 
  if (loading) {
    return <p>now loading...</p>;
  }

  return (
    <>
      {/* ð½ ããããè¿½å  */}
      <table>
        <tbody>
          <tr>
            <td>å ´æ</td>
            <td>{place}</td>
          </tr>
					{/* ð½ è¿½å  */}
          <tr>
            <td>å¤©æ°</td>
            <td>{weather}</td>
          </tr>
          <tr>
            <td>èª­ãã æ¬</td>
            <td>{book}</td>
          </tr>
        </tbody>
      </table>
      {/* ð¼ ããã¾ã§è¿½å  */}
      <p>ã­ã¼ã¯ã¼ãã§æ¤ç´¢ãã</p>
      <input type="text" onChange={(e) => getBooks(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>æ¸ç±å</th>
            <th>åºçç¤¾</th>
            <th>åºçå¹´</th>
            <th>ãªã³ã¯</th>
          </tr>
        </thead>
        <tbody>
          {books.map((x, i) => (
            <tr key={i}>
              <td>
                {/* ð½ ç·¨éï¼onClické¨åï¼ */}
                <button type="button" onClick={() => selectBook(x)}>
                  é¸æ
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

// booksï¼éåã®å½¢ã§æ¬10ååã®ãã¼ã¿ãå¥ã£ã¦ãã
// xã«ã¯1å1åã®ãã¼ã¿ãå¥ã£ã¦ãããiã¯éåã®ã¤ã³ããã¯ã¹ã
// ä¸çªå¤§åã®BookCreate();é¢æ°èªä½ã¯ãã¤åããï¼ â æå­ãå¥åããããã¨ã«ã
// useEffectã®ç¬¬äºå¼æ°ã[]ã ã£ããããä¸çªæåã ããã£ã¦ãããã¨ããæå³ã«ãªãã
// Reactã®æåã¤ã¾ã¥ãããããã¤ã³ãï¼å¦çããã¤å®è¡ããããï¼ â ããã¤ããããã¯ä¸ã«åãã¦æ¸ãï¼OnClickã¨ãï¼

// ä»¥ä¸ã®æµãã ãã§ãReactãAPIã§ã¯ããåºã¦ããï¼ããã¼ã¿ãã¨ã£ã¦ãã â ãã¼ã¿ã®ä¸­èº«ããã§ãã¯ãã¦æ¬²ãããã¼ã¿ãä½ããç¢ºèªãã â æ¬²ãããã¼ã¿ãseté¢æ°ã§ã¹ãã¼ãã«ä¿å­ â ç»é¢ã«è¡¨ç¤ºããã

// awaitãä½¿ãããã«ã¯ãgetBooksé¢æ°ã®ã¨ããã«asyncãã¤ããªãã¨ãããªããawaitã¯ãå¤é¨ãããã¼ã¿ãåã£ã¦ããã®ã«å°ãã¿ã¤ã ã©ã°ããããããresultã«å¤ãå¥ã£ã¦ããä¸ã®å¦çã«é²ãã§ã­ãã¨ããæå³ãasyncãawaitãã¤ããªãã¨ãå¤æ°ã«å¤ãå¥ã£ã¦ãã¾ãããã¨ããã¨ã©ã¼ãåºãã

// ãã¼ã¿ãæã£ã¦ããªããã¡ã«ã¦ã¼ã¶ã¼ãæä½å¯è½ãªç¶æã«ãã¡ããã¨ããã£ãããã°ãèµ·ãã â ããããã®ã¯ããä»ãã¼ã¿ãæã£ã¦ããã®ãæã£ã¦ããªãã®ããå¤æ­ãã¦ãã³ã³ãã³ããè¡¨ç¤ºãããããªãããåãæ¿ãããã¨ãããã¨ â ã©ããããï¼ï¼1åuseStateãä½ã£ã¦ããã¦ããã¼ã¿ãæã£ã¦ãããã©ããã§trueãfalseããåãæ¿ãããtrueã®ã¨ãã¯ã­ã¼ãã£ã³ã°ä¸­ã§ã³ã³ãã³ããè¡¨ç¤ºããªãããã¼ã¿ãæã£ããfalseã«åãæ¿ããã