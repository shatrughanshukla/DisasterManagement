// EarthquakeQuiz.jsx
// Single-file React component (no Tailwind).
// Usage: drop into src/ and import in App.jsx

import React, { useEffect, useMemo, useState } from "react";

/* ---------- QUESTIONS (same as before) ---------- */
const QUESTIONS = [
  /* ... (same 10 questions from your earlier JSON) ... */
  {
    id: 1,
    scenario:
      "You are sitting in your classroom during a lecture. Suddenly, the floor begins to shake violently. The ceiling fan rattles, books fall from shelves. Your teacher panics and yells: ‘Everyone, get out quickly!’ You also notice desks around you where you can hide.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Duck under a desk and hold on 🪑",
        isCorrect: true,
        feedback:
          "Correct! 🎉 During an earthquake, running outside can be dangerous because debris may fall. Standing near windows is risky as glass may shatter. The safest action is to DUCK under a sturdy desk, COVER your head, and HOLD until the shaking stops.",
      },
      {
        text: "Run outside immediately 🏃",
        isCorrect: false,
        feedback:
          "Not safe ❌. Running outside during shaking increases the risk of falling objects, collapsing walls, or stampedes. Debris can fall unpredictably and exits become crowded — you’re more likely to get injured while trying to run.",
      },

      {
        text: "Stand near a window to look outside 🪟",
        isCorrect: false,
        feedback:
          "Dangerous choice ❌. Windows may shatter, causing severe injuries. Glass can break into sharp shards and window frames or adjacent walls can fail — standing by a window exposes you to flying glass and falling debris.",
      },
    ],
  },
  {
    id: 2,
    scenario:
      "You are on the 5th floor of a building when the earthquake hits. The walls are shaking, and lights are flickering. The exit staircase is crowded with people rushing down.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Push through the crowd to escape",
        isCorrect: false,
        feedback:
          "Not safe ❌. Pushing through a panicked crowd can cause trampling, falls, or people getting stuck. In a rush, you can be knocked over or blocked from safe exits — moving to cover and waiting is usually safer.",
      },
      {
        text: "Stay inside, move away from walls, and take cover until shaking stops",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Staying inside and taking cover is safer. Crowded stairs or elevators can be life-threatening during shaking.",
      },
      {
        text: "Use the elevator to go down faster",
        isCorrect: false,
        feedback:
          "Extremely risky ❌. Elevators can lose power, get stuck, or suffer mechanical failure during quakes. If an elevator stops between floors you could become trapped — avoid elevators during shaking.",
      },
    ],
  },
  {
    id: 3,
    scenario:
      "You are in your bedroom when the earthquake starts. The cupboard doors swing open, and items begin falling. There’s a sturdy bed and a nearby doorway.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Stand in the doorway",
        isCorrect: false,
        feedback:
          "Not safe ❌. Doorways don’t provide enough protection anymore. Modern doorframes are not necessarily stronger than walls, and they don’t stop falling contents from shelves or the ceiling — you can still be struck by debris.",
      },
      {
        text: "Run outside barefoot",
        isCorrect: false,
        feedback:
          "Dangerous ❌. Running outside barefoot exposes you to broken glass, nails, and debris; you could badly injure your feet and then be unable to move to safety.",
      },
      {
        text: "Drop beside the bed and cover your head",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Dropping beside a sturdy bed or table gives you cover from falling items. This reduces the chance of being hit by falling objects.",
      },
    ],
  },
  {
    id: 4,
    scenario:
      "You are walking outside on the street when the ground begins shaking. You see tall buildings, electric poles, and a small open park nearby.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Stand next to a building for support",
        isCorrect: false,
        feedback:
          "Not safe ❌. Standing next to buildings is risky because parts of the facade, windows, or masonry can fall outward. You could be struck by falling bricks, signage, or glass.",
      },
      {
        text: "Move to the open park",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Open spaces are the safest outdoors during an earthquake — they reduce the chance of being hit by falling debris.",
      },
      {
        text: "Run inside the nearest shop",
        isCorrect: false,
        feedback:
          "Wrong ❌. Entering a shop puts you near glass windows, shelves, and heavy displays that can fall — indoor hazards may be worse than staying in an open area.",
      },
    ],
  },
  {
    id: 5,
    scenario:
      "You are cooking in the kitchen when the earthquake begins. Hot oil is on the stove, and glass jars are rattling.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Leave the stove on and run outside",
        isCorrect: false,
        feedback:
          "Wrong ❌. Leaving hot oil or gas on can start fires or explosions while you’re away. A small spill can ignite and cause a much larger hazard for everyone.",
      },
      {
        text: "Hold the cupboard doors shut",
        isCorrect: false,
        feedback:
          "Unsafe ❌. Trying to hold cupboards wastes time and puts your hands and arms at risk of being crushed by falling items; heavy objects can break free and still hit you.",
      },
      {
        text: "Quickly turn off the stove and take cover nearby",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Turning off heat sources reduces fire risk, then taking cover protects you from falling items and hot liquids.",
      },
    ],
  },
  {
    id: 6,
    scenario:
      "You are in a movie theater when the earthquake begins. The lights go out, and people start screaming and rushing towards the exit.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Duck down between the seats and cover",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Staying low between seats and covering your head reduces your exposure to falling debris and flying objects until shaking stops.",
      },
      {
        text: "Run with the crowd immediately",
        isCorrect: false,
        feedback:
          "Wrong ❌. Crowds rushing at once can cause trampling, bottlenecks, and injured people. In the dark and chaos, you’re more likely to fall or get hurt trying to force your way out.",
      },
      {
        text: "Stand still near the exit",
        isCorrect: false,
        feedback:
          "Unsafe ❌. Exit zones can become congested and may have doors, glass, or fixtures that fail — standing there gives you no cover from falling items.",
      },
    ],
  },
  {
    id: 7,
    scenario:
      "You are driving when the earthquake begins. The road starts shaking, and you see an overpass ahead.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Drive faster to cross the overpass quickly",
        isCorrect: false,
        feedback:
          "Wrong ❌. Speeding during shaking reduces control and increases crash risk. Overpasses and bridges can be damaged in quakes — driving fast could put you on a compromised structure.",
      },
      {
        text: "Park under a bridge for shelter",
        isCorrect: false,
        feedback:
          "Unsafe ❌. Bridges and overpasses may suffer structural damage and falling debris; parking underneath can trap you or expose you to collapse.",
      },
      {
        text: "Pull over safely and stop",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Pulling over safely away from traffic and hazards lowers the chance of accidents and gives you time to assess damage.",
      },
    ],
  },
  {
    id: 8,
    scenario:
      "You are inside a shopping mall when an earthquake strikes. Glass windows begin cracking, and people are panicking.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Run towards the escalator immediately",
        isCorrect: false,
        feedback:
          "Wrong ❌. Escalators can jam, collapse, or become chokepoints — running toward them can cause falls and block rescue routes.",
      },
      {
        text: "Stand near a glass shop to watch",
        isCorrect: false,
        feedback:
          "Dangerous ❌. Glass storefronts can shatter and display fixtures can fall — watching puts you directly in the path of flying glass and falling objects.",
      },
      {
        text: "Stay away from windows and large shelves, drop and cover near sturdy furniture",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Keeping distance from windows and heavy shelving and taking cover near solid furniture reduces risk of cuts and crushing injuries.",
      },
    ],
  },
  {
    id: 9,
    scenario:
      "After the shaking stops, you are trapped inside a room with dust and broken objects. You have your phone with you.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Stay calm, cover your mouth, call for help/send location",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Staying calm, covering your mouth from dust, and using your phone to call for help or send your location conserves energy and gets rescuers to you faster.",
      },
      {
        text: "Shout continuously and waste your energy",
        isCorrect: false,
        feedback:
          "Wrong ❌. Constant shouting uses up energy and breath and may not improve rescue chances. Short, periodic signals or using your phone conserves energy and is more effective.",
      },
      {
        text: "Try to move heavy debris alone",
        isCorrect: false,
        feedback:
          "Unsafe ❌. Lifting heavy debris can cause collapse or serious injury — wait for trained rescuers or use safe leverage/assistance rather than attempting large moves alone.",
      },
    ],
  },
  {
    id: 10,
    scenario:
      "You are in school, and after the shaking stops, you and your classmates exit the building. Some students want to go back inside to collect their bags.",
    prompt: "What would you do?",
    points: 10,
    options: [
      {
        text: "Go back inside quickly to get your own bag",
        isCorrect: false,
        feedback:
          "Wrong ❌. Re-entering a structure after a quake is dangerous because aftershocks can cause additional collapses or falling debris; personal items aren’t worth risking safety.",
      },
      {
        text: "Stop them and wait in the open assembly area until authorities say it’s safe",
        isCorrect: true,
        feedback:
          "Correct! 🎉 Waiting in the open area reduces the risk from aftershocks and falling debris — wait for official clearance before re-entering.",
      },
      {
        text: "Stand near the building to wait for friends",
        isCorrect: false,
        feedback:
          "Unsafe ❌. Standing close to buildings exposes you to falling bricks, glass, or signage during aftershocks — stay in the clear assembly area instead.",
      },
    ],
  },
];

/* ---------- helpers & icons ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const IconCheck = ({ className = "icon" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconX = ({ className = "icon" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- Progress Bar ---------- */
function ProgressBar({ answeredCount, total }) {
  const pct = useMemo(
    () => Math.round((answeredCount / total) * 100),
    [answeredCount, total]
  );
  return (
    <div className="progress-wrapper">
      <div className="progress-top">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${clamp(pct, 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function EarthquakeQuiz() {
  const total = QUESTIONS.length;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // store { qid, chosenIndex, isCorrect }
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shakeAnim, setShakeAnim] = useState(false);

  useEffect(() => {
    // Reset selection/animation when question changes
    setSelected(null);
    setShakeAnim(false);
  }, [current]);

  const currentQ = QUESTIONS[current];

  function handleChoose(idx) {
    if (selected !== null) return;
    setSelected(idx);

    const opt = currentQ.options[idx];
    const isCorrect = !!opt.isCorrect;

    setAnswers((p) => [
      ...p,
      { qid: currentQ.id, chosenIndex: idx, isCorrect },
    ]);

    if (isCorrect) {
      setScore((s) => s + currentQ.points);
    } else {
      setShakeAnim(true);
      setTimeout(() => setShakeAnim(false), 500);
    }
  }

  function handleNext() {
    if (selected === null) return;
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setScore(0);
    setShowResult(false);
  }

  const progressCount =
    answers.length +
    (selected !== null && !answers.some((a) => a.qid === currentQ.id) ? 1 : 0);

  return (
    <div className="page-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-circle" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                stroke="#fff"
                strokeWidth="1.2"
              />
              <path
                d="M12 8v4"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="1" fill="#fff" />
            </svg>
          </div>
          <div>
            <div className="brand-title">Disaster Management</div>
            <div className="brand-sub">Earthquake Safety Quiz</div>
          </div>
        </div>
        <div className="top-right">
          <div className="meta">
            Questions: <strong>{total}</strong>
          </div>
          <div className="meta">
            Points per Q: <strong>10</strong>
          </div>
          <div className="live-pill">Live</div>
        </div>
      </header>

      <main className="main-container">
        <ProgressBar answeredCount={answers.length} total={total} />

        {!showResult ? (
          <section
            className={`card ${shakeAnim ? "shake" : ""}`}
            aria-live="polite"
          >
            <div className="card-grid">
              <div className="card-main">
                <div className="q-header">
                  Question {current + 1} of {total}
                </div>
                <h2 className="q-title">{currentQ.prompt}</h2>
                <p className="q-scenario">{currentQ.scenario}</p>

                <div className="options">
                  {currentQ.options.map((opt, idx) => {
                    const isChosen = selected === idx;
                    const hasAnswered = selected !== null;
                    const tone = hasAnswered
                      ? opt.isCorrect
                        ? "correct"
                        : isChosen
                        ? "wrong"
                        : "muted"
                      : "idle";

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoose(idx)}
                        disabled={selected !== null}
                        className={`option option-${tone}`}
                        aria-pressed={isChosen}
                        aria-label={`Option ${idx + 1}: ${opt.text}`}
                      >
                        <div className="option-text">{opt.text}</div>
                        <div className="option-badge">
                          {hasAnswered ? (
                            opt.isCorrect ? (
                              <IconCheck className="icon-white" />
                            ) : isChosen ? (
                              <IconX className="icon-white" />
                            ) : null
                          ) : (
                            <span className="select-label">Select</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selected !== null ? (
                  <div className="feedback">
                    <div className="feedback-left">
                      {currentQ.options[selected].isCorrect ? (
                        <div className="feedback-pill correct">
                          <IconCheck className="icon-white" />{" "}
                          <span>Correct</span>
                        </div>
                      ) : (
                        <div className="feedback-pill wrong">
                          <IconX className="icon-white" /> <span>Not Safe</span>
                        </div>
                      )}
                    </div>
                    <div className="feedback-right">
                      <p className="feedback-text">
                        {currentQ.options[selected].feedback}
                      </p>
                      <div className="feedback-points">
                        Points: {currentQ.points}{" "}
                        {currentQ.options[selected].isCorrect
                          ? "(awarded)"
                          : "(0)"}
                      </div>
                      <div className="feedback-actions">
                        <div className="score-display">
                          Preparedness Points: <strong>{score}</strong>
                        </div>
                        <button onClick={handleNext} className="next-btn">
                          {current + 1 < total
                            ? "Next Question"
                            : "See Results"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="hint">
                    Choose the most appropriate action — each correct answer
                    gives +10 Preparedness Points.
                  </div>
                )}
              </div>

              <aside className="card-aside">
                <div className="aside-title">Quick Stats</div>
                <div className="aside-score">
                  <div className="score-label">Score</div>
                  <div className="score-value">{score}</div>
                  <div className="score-total">out of {total * 10}</div>
                </div>

                <div className="aside-row">
                  <div className="small-label">Current Question</div>
                  <div className="small-value">
                    {current + 1} / {total}
                  </div>
                </div>

                <div className="aside-tip">
                  <div className="small-label">Tip</div>
                  <div className="small-text">
                    If unsure, pick the safest action that minimizes exposure to
                    falling debris and fire risk.
                  </div>
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <section className="card result-card">
            <div className="result-grid">
              <div className="result-main">
                <h1 className="result-title">Quiz Complete</h1>
                <p className="result-sub">
                  Nice work — you’ve completed the Earthquake Safety quiz.
                  Here’s how you did:
                </p>

                <div className="result-top">
                  <div className="score-circle">
                    <div className="score-big">{score}</div>
                    <div className="score-small">/{total * 10}</div>
                  </div>

                  <div className="score-summary">
                    <div className="preparedness">Preparedness Level</div>
                    <div className="preparedness-text">
                      {score >= total * 10 * 0.9
                        ? "Excellent — you clearly know safe choices!"
                        : score >= total * 10 * 0.7
                        ? "Good — solid understanding, review a few points."
                        : score >= total * 10 * 0.4
                        ? "Fair — consider revisiting the scenarios."
                        : "Needs improvement — review the feedback and practice again."}
                    </div>

                    <div className="result-actions">
                      <button onClick={restart} className="primary">
                        Restart Quiz
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="secondary"
                      >
                        Print / Save
                      </button>
                    </div>
                  </div>
                </div>

                <div className="review-list">
                  <div className="review-title">Review</div>
                  <ol className="review-ol">
                    {QUESTIONS.map((q, qi) => {
                      const ans = answers.find((a) => a.qid === q.id);
                      const chosen = ans ? q.options[ans.chosenIndex] : null;
                      const isCorrect = ans ? ans.isCorrect : false;
                      return (
                        <li
                          key={q.id}
                          className={`review-item ${
                            isCorrect ? "rev-correct" : "rev-wrong"
                          }`}
                        >
                          <div className="rev-left">
                            {isCorrect ? (
                              <div className="rev-status correct">Correct</div>
                            ) : (
                              <div className="rev-status wrong">Incorrect</div>
                            )}
                          </div>
                          <div className="rev-right">
                            <div className="rev-q">
                              Q{qi + 1}: {q.prompt}
                            </div>
                            <div className="rev-scenario">{q.scenario}</div>
                            <div className="rev-your">
                              Your answer:{" "}
                              <strong>
                                {chosen ? chosen.text : "No answer"}
                              </strong>
                            </div>
                            <div className="rev-exp">
                              Explanation:{" "}
                              {chosen
                                ? chosen.feedback
                                : q.options[
                                    q.options.findIndex((o) => o.isCorrect)
                                  ].feedback}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              <aside className="result-aside">
                <div className="summary-title">Summary</div>
                <div className="summary-row">
                  <div className="summary-label">Total Questions</div>
                  <div className="summary-value">{total}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Correct</div>
                  <div className="summary-value">
                    {answers.filter((a) => a.isCorrect).length}
                  </div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Incorrect</div>
                  <div className="summary-value">
                    {answers.filter((a) => !a.isCorrect).length}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <footer className="page-footer">
        Made for training • Interactive earthquake safety quiz
      </footer>

      {/* ---------- Styles (embedded) ---------- */}
      <style>{`
        :root{
          --bg1: #07103a;
          --bg2: #0b2146;
          --card-start: rgba(255,255,255,0.04);
          --card-end: rgba(255,255,255,0.02);
          --muted: rgba(255,255,255,0.7);
          --accent1: #2b6fff; /* blue */
          --accent2: #8a3df5; /* purple */
          --green1: #15a85a;
          --red1: #ff4d4f;
          --glass: rgba(255,255,255,0.06);
        }

        * { box-sizing: border-box; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        body { margin: 0; }

        .page-root {
            min-height: 100vh;
            height: 100%;       /* 🔥 force full screen */
            width: 100vw;        /* 🔥 span full width */
            background: linear-gradient(180deg, var(--bg1) 0%, var(--bg2) 100%);
            color: #fff;
            display: flex;
            flex-direction: column;
            padding: 0;          /* remove extra padding */
        }


        .topbar {
          width: 100%;
          max-width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          margin-bottom: 12px;
        }
        .brand { display:flex; align-items:center; gap:12px; }
        .logo-circle{
          width:44px; height:44px; border-radius:50%;
          background: rgba(255,255,255,0.06);
          display:flex; align-items:center; justify-content:center;
        }
        .brand-title { font-weight: 700; font-size: 14px; }
        .brand-sub { font-size: 12px; color: rgba(255,255,255,0.65); }

        .top-right { display:flex; gap:14px; align-items:center; }
        .meta { font-size: 13px; color: rgba(255,255,255,0.68); }
        .live-pill { padding:6px 10px; background: rgba(255,255,255,0.06); border-radius: 20px; font-size:12px; }

        .main-container {
          flex: 1;             /* 🔥 take all available space */
          width: 100%;
          padding: 0 24px;
          margin: 0;
          display: flex;
          flex-direction: column;
        }


        /* Progress */
        .progress-wrapper { padding: 12px 8px; }
        .progress-top { display:flex; justify-content:space-between; font-size:12px; color: rgba(255,255,255,0.7); margin-bottom:8px; }
        .progress-track { width:100%; height:10px; background: rgba(255,255,255,0.06); border-radius:6px; overflow:hidden; }
        .progress-fill { height:100%; background: linear-gradient(90deg, var(--accent1), var(--accent2)); width: 0%; transition: width 450ms ease; }

        /* Card */
        .card {
          margin-top: 16px;
          background: linear-gradient(180deg, var(--card-start), var(--card-end));
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 10px 36px rgba(2,6,23,0.6);
        }
        .card-grid { display:flex; gap:18px; flex-direction:row; }
        @media (max-width: 900px) { .card-grid { flex-direction: column; } }

        .card-main { flex:1; min-width:0; }
        .q-header { font-size:12px; color: rgba(255,255,255,0.65); letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
        .q-title { font-size:28px; margin:0 0 8px 0; line-height:1.05; font-weight:800; }
        .q-scenario { color: rgba(255,255,255,0.8); margin-bottom:16px; }

        .options { display:flex; flex-direction:column; gap:12px; }

        .option {
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:14px 14px;
          border-radius:10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.03);
          cursor:pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
          text-align:left;
        }
        .option:disabled { cursor: default; opacity:0.95; }
        .option:hover { transform: translateY(-4px); box-shadow: 0 8px 22px rgba(2,6,23,0.45); }

        .option-idle { background: rgba(255,255,255,0.04); }
        .option-muted { background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.78); }
        .option-correct { background: linear-gradient(90deg, #11c77f 0%, #0e9e53 100%); box-shadow: 0 8px 20px rgba(16, 141, 87, 0.22); color:white; }
        .option-wrong { background: linear-gradient(90deg, #ff6b6b 0%, #ff3b3b 100%); box-shadow: 0 8px 20px rgba(255, 57, 57, 0.15); color:white; }

        .option-text { font-weight:600; font-size:15px; }
        .option-badge { width:52px; display:flex; align-items:center; justify-content:center; }

        .select-label { font-size:12px; color: rgba(255,255,255,0.6); }

        .feedback { margin-top:16px; padding:12px; border-radius:10px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04); display:flex; gap:12px; flex-direction:row; align-items:flex-start; }
        @media (max-width: 720px) { .feedback { flex-direction: column; } }

        .feedback-pill { display:inline-flex; gap:8px; align-items:center; padding:6px 10px; border-radius:8px; font-weight:600; }
        .feedback-pill.correct { background: rgba(255,255,255,0.05); color: #8ff0c7; }
        .feedback-pill.wrong { background: rgba(255,255,255,0.05); color: #ffb6b6; }

        .feedback-text { color: rgba(255,255,255,0.92); margin:0 0 8px 0; }
        .feedback-points { color: rgba(255,255,255,0.6); font-size:13px; margin-bottom:8px; }
        .feedback-actions { display:flex; gap:12px; align-items:center; justify-content:flex-end; }

        .next-btn { background: linear-gradient(90deg, var(--accent1), var(--accent2)); border:none; color:white; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:600; }
        .next-btn:hover { transform: translateY(-2px); }

        .score-display { color: rgba(255,255,255,0.85); margin-right:12px; }

        .hint { margin-top:12px; color: rgba(255,255,255,0.68); font-size:13px; }

        /* aside */
        .card-aside { width:260px; background: rgba(255,255,255,0.03); border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.04); }
        .aside-title { font-size:12px; color: rgba(255,255,255,0.7); margin-bottom:8px; }
        .aside-score .score-label { font-size:13px; color: rgba(255,255,255,0.9); }
        .aside-score .score-value { font-size:26px; font-weight:800; margin-top:6px; }
        .aside-score .score-total { font-size:12px; color: rgba(255,255,255,0.6); }

        .aside-row { margin-top:12px; display:flex; justify-content:space-between; align-items:center; }
        .small-label { color: rgba(255,255,255,0.68); font-size:12px; }
        .small-value { font-weight:700; }

        .aside-tip { margin-top:12px; color: rgba(255,255,255,0.75); font-size:13px; }

        /* result */
        .result-card { margin-top: 16px; }
        .result-grid { display:flex; gap:18px; align-items:flex-start; }
        @media (max-width: 900px) { .result-grid { flex-direction: column; } }

        .result-title { font-size:34px; margin:0; font-weight:900; }
        .result-sub { color: rgba(255,255,255,0.8); margin:10px 0 18px 0; }

        .result-top { display:flex; gap:18px; align-items:center; }
        .score-circle { width:120px; height:120px; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; background: linear-gradient(90deg, var(--accent1), var(--accent2)); box-shadow: 0 10px 30px rgba(10,30,80,0.4); }
        .score-big { font-size:28px; font-weight:900; }
        .score-small { font-size:12px; opacity:0.95; }

        .score-summary { max-width: 520px; }
        .preparedness { font-weight:700; margin-bottom:6px; }
        .preparedness-text { color: rgba(255,255,255,0.78); margin-bottom:10px; }

        .result-actions { display:flex; gap:10px; }
        .primary { background: linear-gradient(90deg, var(--accent1), var(--accent2)); color:white; padding:8px 14px; border-radius:8px; border:none; cursor:pointer; font-weight:700; }
        .secondary { background: rgba(255,255,255,0.06); color:white; padding:8px 14px; border-radius:8px; border:none; cursor:pointer; }

        .review-list { margin-top:18px; }
        .review-title { font-weight:700; margin-bottom:8px; }
        .review-ol { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }

        .review-item { display:flex; gap:12px; padding:10px; border-radius:8px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04); }
        .rev-left { width:82px; display:flex; align-items:flex-start; }
        .rev-status { padding:6px 8px; border-radius:6px; font-size:13px; font-weight:700; }
        .rev-status.correct { color: #8ff0c7; }
        .rev-status.wrong { color: #ffb6b6; }
        .rev-right { flex:1; }
        .rev-q { font-weight:700; margin-bottom:6px; }
        .rev-scenario { font-size:13px; color: rgba(255,255,255,0.75); margin-bottom:8px; }
        .rev-your { font-size:13px; }
        .rev-exp { font-size:13px; color: rgba(255,255,255,0.8); margin-top:6px; }

        .result-aside { width:260px; padding:12px; border-radius:10px; background: rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.04); }
        .summary-title { font-weight:700; margin-bottom:8px; }
        .summary-row { display:flex; justify-content:space-between; margin-top:8px; color: rgba(255,255,255,0.9); }

        .page-footer { margin-top:26px; color: rgba(255,255,255,0.6); font-size:13px; }

        /* small icon styles */
        .icon { width:20px; height:20px; color: white; }
        .icon-white { width:18px; height:18px; color: white; }

        /* shake animation */
        @keyframes shake-key {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .shake { animation: shake-key 0.5s; }
      `}</style>
    </div>
  );
}
