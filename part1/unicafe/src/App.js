import { useState } from "react";

const Button = ({ label, set }) => <button onClick={set}>{label}</button>;

const Feedback = ({ states }) => (
  <div>
    <h1>give feedback</h1>
    <div>
      {Object.keys(states).map((key) => (
        <Button
          label={key}
          set={() => states[key].set(states[key].get + 1)}
          key={key}
        />
      ))}
    </div>
  </div>
);

const Statistics = ({ states }) => {
  const total = Object.keys(states)
    .map((key) => states[key].get)
    .reduce((a, b) => a + b);
  const average = total ? (states.good.get - states.bad.get) / total : 0;
  const positive = total ? states.good.get / total : 0;

  return (
    <div>
      <h1>statistics</h1>
      {Object.keys(states).map((key) => (
        <div key={key}>
          {key} {states[key].get}
        </div>
      ))}
      <div>all {total}</div>
      <div>average {average}</div>
      <div>positive {positive}</div>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const states = {
    good: {
      get: good,
      set: setGood,
    },
    neutral: {
      get: neutral,
      set: setNeutral,
    },
    bad: {
      get: bad,
      set: setBad,
    },
  };

  return (
    <div>
      <Feedback states={states} />
      <Statistics states={states} />
    </div>
  );
};

export default App;
