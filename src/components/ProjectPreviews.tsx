import { useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
export function GamePreview() {
  return (
    <figure className="game-footage">
      <div className="game-footage-top">
        <span>Game Hub / In action</span>
        <span>Recorded from the app</span>
      </div>
      <video
        controls
        playsInline
        preload="none"
        poster="/media/gamehub-poster.webp"
        aria-label="Game Hub walkthrough using an offline catalog"
        aria-describedby="gamehub-capture-note"
      >
        <source src="/media/gamehub-walkthrough.webm" type="video/webm" />
        <track
          kind="captions"
          src="/media/gamehub-walkthrough.vtt"
          srcLang="en"
          label="English"
          default
        />
        Your browser does not support this video.{" "}
        <a href="/media/gamehub-walkthrough.webm">Download the walkthrough</a>.
      </video>
      <figcaption id="gamehub-capture-note">
        Actual app footage · Offline demo catalog. Browse, filter, sort, and
        search.
      </figcaption>
    </figure>
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
