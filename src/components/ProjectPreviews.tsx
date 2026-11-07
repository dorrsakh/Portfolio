import { useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw, Search } from "lucide-react";
const games = [
  { name: "Afterlight", genre: "Adventure", kind: "horizon" },
  { name: "Monument", genre: "Puzzle", kind: "monument" },
  { name: "Wildwood", genre: "Adventure", kind: "forest" },
];
export function GamePreview() {
  const [query, setQuery] = useState(""),
    [genre, setGenre] = useState("All");
  const shown = games.filter(
    (g) =>
      (genre === "All" || g.genre === genre) &&
      g.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="interactive-preview game-preview" data-tilt>
      <div className="preview-top">
        <span>Find your next adventure</span>
        <span className="preview-live">Interactive study</span>
      </div>
      <label className="preview-search">
        <Search size={15} aria-hidden="true" />
        <input
          aria-label="Filter preview games"
          placeholder="Search games…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div
        className="preview-genres"
        role="group"
        aria-label="Preview game genre"
      >
        {["All", "Adventure", "Puzzle"].map((item) => (
          <button
            key={item}
            aria-pressed={genre === item}
            onClick={() => setGenre(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="preview-games" aria-live="polite">
        {shown.map((game) => (
          <div className="preview-game" key={game.name}>
            <div className={`game-landscape ${game.kind}`} aria-hidden="true">
              <span />
              <i />
            </div>
            <span>{game.name}</span>
            <small>{game.genre}</small>
          </div>
        ))}
        {!shown.length && (
          <p className="preview-empty">No matches. Try another title.</p>
        )}
      </div>
      <p className="preview-caption">
        Try the search and filters. Sample data.
      </p>
    </div>
  );
}
export function CaloriePreview() {
  const [meals, setMeals] = useState(1240),
    [activity, setActivity] = useState(200);
  const net = meals - activity,
    progress = Math.min(100, Math.max(0, (net / 2000) * 100));
  return (
    <div className="interactive-preview calorie-preview" data-tilt>
      <div className="preview-top">
        <span>A little balance, every day.</span>
        <button
          className="icon-button"
          aria-label="Reset calorie preview"
          onClick={() => {
            setMeals(1240);
            setActivity(200);
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>
      <div className="calorie-total">
        <output aria-live="polite" aria-label="Preview net calories">
          {net.toLocaleString()}
        </output>
        <span>/ 2,000 kcal</span>
      </div>
      <div
        className="calorie-progress"
        role="progressbar"
        aria-label="Daily calorie progress"
        aria-valuenow={net}
        aria-valuemin={0}
        aria-valuemax={2000}
      >
        <span style={{ width: progress + "%" }} />
      </div>
      <div className="calorie-summary">
        <span>
          Meals <b>{meals.toLocaleString()}</b>
        </span>
        <span>
          Activity <b>{activity.toLocaleString()}</b>
        </span>
      </div>
      <div className="calorie-actions">
        <button onClick={() => setMeals((v) => Math.min(v + 150, 2000))}>
          <ArrowUp size={14} /> Add a snack <small>+150</small>
        </button>
        <button onClick={() => setActivity((v) => Math.min(v + 100, meals))}>
          <ArrowDown size={14} /> Take a walk <small>−100</small>
        </button>
      </div>
      <p className="preview-caption">
        A working interaction study. Sample data.
      </p>
    </div>
  );
}
