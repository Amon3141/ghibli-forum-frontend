const axios = require('axios');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env.development.local';
dotenv.config({ path: envFile });

const initialMovies = [
  {
    title: "風の谷のナウシカ",
    director: "宮崎 駿",
    releaseDate: "1984-03-11",
    imagePath: "/images/nausicaa_teto.jpg"
  },
  {
    title: "天空の城ラピュタ",
    director: "宮崎 駿",
    releaseDate: "1986-08-02",
    imagePath: "/images/laputa_flower.jpg"
  },
  {
    title: "火垂るの墓",
    director: "高畑 勲",
    releaseDate: "1988-04-16",
    imagePath: ""
  },
  {
    title: "となりのトトロ",
    director: "宮崎 駿",
    releaseDate: "1988-04-16",
    imagePath: "/images/totoro_mei.jpg"
  },
  {
    title: "魔女の宅急便",
    director: "宮崎 駿",
    releaseDate: "1989-07-29",
    imagePath: "/images/majo_bike.jpg"
  },
  {
    title: "おもひでぽろぽろ",
    director: "高畑 勲",
    releaseDate: "1991-07-20",
    imagePath: "/images/omoide_lunch.jpg"
  },
  {
    title: "紅の豚",
    director: "宮崎 駿",
    releaseDate: "1992-07-18",
    imagePath: "/images/porco_strategy.jpg"
  },
  {
    title: "海がきこえる",
    director: "望月 智充",
    releaseDate: "1993-05-05",
    imagePath: "/images/umi_sitdown.jpg"
  },
  {
    title: "平成狸合戦ぽんぽこ",
    director: "高畑 勲",
    releaseDate: "1994-07-16",
    imagePath: "/images/tanuki_guitar.jpg"
  },
  {
    title: "On Your Mark",
    director: "宮崎 駿",
    releaseDate: "1995-07-15",
    imagePath: "/images/onyourmark_car.jpg"
  },
  {
    title: "耳をすませば",
    director: "近藤 喜文",
    releaseDate: "1995-07-15",
    imagePath: "/images/mimi_session.jpg"
  },
  {
    title: "もののけ姫",
    director: "宮崎 駿",
    releaseDate: "1997-07-12",
    imagePath: "/images/mononoke_help.jpg"
  },
  {
    title: "ホーホケキョ となりの山田くん",
    director: "高畑 勲",
    releaseDate: "1999-07-17",
    imagePath: "/images/yamada_bike.jpg"
  },
  {
    title: "千と千尋の神隠し",
    director: "宮崎 駿",
    releaseDate: "2001-07-20",
    imagePath: "/images/chihiro_onigiri.jpg"
  },
  {
    title: "ギブリーズ episode2",
    director: "百瀬 義行",
    releaseDate: "2002-07-20",
    imagePath: "/images/ghiblies_gather.jpg"
  },
  {
    title: "猫の恩返し",
    director: "森田 宏幸",
    releaseDate: "2002-07-20",
    imagePath: "/images/nekonoongaeshi_baron.jpg"
  },
  {
    title: "ハウルの動く城",
    director: "宮崎 駿",
    releaseDate: "2004-11-20",
    imagePath: "/images/howl_star.jpg"
  },
  {
    title: "ゲド戦記",
    director: "宮崎 吾朗",
    releaseDate: "2006-07-29",
    imagePath: "/images/ged_stare.jpg"
  },
  {
    title: "崖の上のポニョ",
    director: "宮崎 駿",
    releaseDate: "2008-07-19",
    imagePath: "/images/ponyo_boat.jpg"
  },
  {
    title: "借りぐらしのアリエッティ",
    director: "米林 宏昌",
    releaseDate: "2010-07-17",
    imagePath: "/images/karigurashi_determined.jpg"
  },
  {
    title: "コクリコ坂から",
    director: "宮崎 吾朗",
    releaseDate: "2011-07-16",
    imagePath: "/images/kokurikozaka_rush.jpg"
  },
  {
    title: "風立ちぬ",
    director: "宮崎 駿",
    releaseDate: "2013-07-20",
    imagePath: "/images/kazetachinu_kiss.jpg"
  },
  {
    title: "かぐや姫の物語",
    director: "高畑 勲",
    releaseDate: "2013-11-23",
    imagePath: "/images/kaguyahime_spin.jpg"
  },
  {
    title: "思い出のマーニー",
    director: "米林 宏昌",
    releaseDate: "2014-07-19",
    imagePath: "/images/marnie_boat.jpg"
  },
  {
    title: "レッドタートル ある島の物語",
    director: "マイケル・デュドク・ドゥ・ヴィット",
    releaseDate: "2016-09-17",
    imagePath: "/images/redturtle_meet.jpg"
  },
  {
    title: "アーヤと魔女",
    director: "宮崎 吾朗",
    releaseDate: "2021-08-27",
    imagePath: "/images/aya_withcat.jpg"
  },
  {
    title: "君たちはどう生きるか",
    director: "宮崎 駿",
    releaseDate: "2023-07-14",
    imagePath: "/images/kimitachi_mahito.jpg"
  }
];

const upsertMovie = async (baseUrl, authToken, movie) => {
  try {
    // First, get all movies to find existing one by title
    const allMoviesResponse = await axios.get(`${baseUrl}/movies`);
    const existingMovie = allMoviesResponse.data.find(m => m.title === movie.title);
    
    if (existingMovie) {
      // Movie exists, update it
      const updateResponse = await axios.put(`${baseUrl}/movies/${existingMovie.id}`, movie, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      console.log(`Updated: ${movie.title}`);
      return updateResponse.data.movie;
    } else {
      // Movie doesn't exist, create it
      const createResponse = await axios.post(`${baseUrl}/movies`, movie, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      console.log(`Created: ${movie.title}`);
      return createResponse.data.movie;
    }
  } catch (error) {
    console.error(`Error with movie ${movie.title}:`, error.response?.data || error.message);
    return null;
  }
};

const initializeMovies = async () => {
  try {
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
      throw new Error('BACKEND_URL is not set');
    }
    
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzU1OTE3NTYwLCJleHAiOjE3NTYwMDM5NjB9.MyTJoxYXLa_Z5kpksfD4zRYsblcqGo4-yTNdxvl86cM";
    const processedMovies = [];
    
    for (const movie of initialMovies) {
      const result = await upsertMovie(baseUrl, authToken, movie);
      if (result) {
        processedMovies.push(result);
      }
    }
    
    console.log(`Successfully processed ${processedMovies.length} movies`);
    return processedMovies;
  } catch (err) {
    console.error('Error initializing movies:', err);
    return [];
  }
};



initializeMovies();
