import FilmCard from "@/components/features/FilmCard";

export default function Films() {
  const films = [
    {
      title: "ナウシカ",
      filmId: "Nausicaa"
    },
    {
      title: "ラピュタ",
      filmId: "Laputa"
    },
    {
      title: "千と千尋の神隠し",
      filmId: "Spirited_Away"
    },
    {
      title: "崖の上のポニョ",
      filmId: "Ponyo"
    },
    {
      title: "風立ちぬ",
      filmId: "Wind_Rises"
    },
    {
      title: "となりのトトロ",
      filmId: "My_Neighbor_Totoro"
    },
    {
      title: "もののけ姫",
      filmId: "Princess_Mononoke"
    },
    {
      title: "ハウルの動く城",
      filmId: "Howl's_Moving_Castle"
    }
  ];

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-3xl font-bold py-2">作品一覧</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {films.map(film => {
          return (
            <FilmCard title={film.title} filmId={film.filmId} />
          )
        })}
      </div>
    </div>
  );
}