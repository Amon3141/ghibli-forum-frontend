const axios = require('axios');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env.development.local';
dotenv.config({ path: envFile });

const initialMovies = [
  {
    title: "ナウシカ",
    director: "宮崎駿",
    releaseDate: "1984-03-11",
    imagePath: "/images/nausicaa_teto.jpg"
  },
  {
    title: "ラピュタ",
    director: "宮崎駿",
    releaseDate: "1986-08-02",
    imagePath: "/images/laputa_flower.jpg"
  },
  {
    title: "千と千尋の神隠し",
    director: "宮崎駿",
    releaseDate: "2001-07-20",
    imagePath: "/images/chihiro_onigiri.jpg"
  },
  {
    title: "崖の上のポニョ",
    director: "宮崎駿",
    releaseDate: "2008-07-19",
    imagePath: "/images/ponyo_boat.jpg"
  },
  {
    title: "風立ちぬ",
    director: "宮崎駿",
    releaseDate: "2013-07-20",
    imagePath: "/images/kazetachinu_kiss.jpg"
  },
  {
    title: "となりのトトロ",
    director: "宮崎駿",
    releaseDate: "1988-04-16",
    imagePath: "/images/totoro_mei.jpg"
  },
  {
    title: "もののけ姫",
    director: "宮崎駿",
    releaseDate: "1997-07-12",
    imagePath: "/images/mononoke_eboshi.jpg"
  },
  {
    title: "ハウルの動く城",
    director: "宮崎駿",
    releaseDate: "2004-11-20",
    imagePath: "/images/howl_star.jpg"
  }
];

const initializeMovies = async () => {
  try {
    const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
      throw new Error('BACKEND_URL is not set');
    }
    
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzU1OTE3NTYwLCJleHAiOjE3NTYwMDM5NjB9.MyTJoxYXLa_Z5kpksfD4zRYsblcqGo4-yTNdxvl86cM";
    const newMovies = [];
    for (const movie of initialMovies) {
      const response = await axios.post(`${baseUrl}/movies`, movie, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      newMovies.push(response.data.movie);
    }
    
    return newMovies;
  } catch (err) {
    console.error('Error initializing movies:', err);
    return [];
  }
};

initializeMovies();
