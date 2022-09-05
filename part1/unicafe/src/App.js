import { useState } from "react";

const Button = ({ label, set }) => <button onClick={set}>{label}</button>;

const Feedback = ({ states }) => (
  <div>
    <h1>give feedback</h1>
    <div>
      {states.map(({ label, set, get }, index) => (
        <Button label={label} set={() => set(get + 1)} key={index} />
      ))}
    </div>
  </div>
);
const Statistics = ({ states }) => (
  <div>
    <h1>statistics</h1>
    {states.map(({ label, get }, index) => (
      <div key={index}>
        {label} {get}
      </div>
    ))}
  </div>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const states = [
    {
      label: "good",
      get: good,
      set: setGood,
    },
    {
      label: "neutral",
      get: neutral,
      set: setNeutral,
    },
    {
      label: "bad",
      get: bad,
      set: setBad,
    },
  ];

  return (
    <div>
      <Feedback states={states} />
      <Statistics states={states} />
    </div>
  );
};

export default App;
