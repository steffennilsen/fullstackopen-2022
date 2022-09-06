import { useState } from "react";

const Anecdote = ({ anecdote, points }) => (
  <div>
    <div>{anecdote}</div>
    <div>has {points} votes</div>
  </div>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(
    anecdotes.reduce((c, p, i) => ({ ...c, ...{ [i]: 0 } }), {})
  );

  const roll = () => Math.ceil(Math.random() * anecdotes.length) - 1;
  const vote = () => {
    const _points = { ...points };
    _points[selected] += 1;
    setPoints(_points);
  };

  const highestVoteIndex = Object.values(points).reduce(
    (prevIndex, currValue, index) =>
      currValue > points[prevIndex] ? index : prevIndex,
    0
  );

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote anecdote={anecdotes[selected]} points={points[selected]} />
      <div>
        <button onClick={() => vote()}>vote</button>
        <button onClick={() => setSelected(roll())}>next anecdote</button>
      </div>
      <h1>Anecdote with the most votes</h1>
      <Anecdote
        anecdote={anecdotes[highestVoteIndex]}
        points={points[highestVoteIndex]}
      />
    </div>
  );
};

export default App;
