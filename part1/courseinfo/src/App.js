const Header = (props) => <h1>{props.course}</h1>;
const Content = (props) => (
  <>
    {props.items.map((item, index) => (
      <Part key={index} part={item.part} exercises={item.exercises} />
    ))}
  </>
);
const Part = (props) => (
  <p>
    {props.part} {props.exercises}
  </p>
);
const Total = (props) => {
  const sum = props.items.map((item) => item.exercises).reduce((a, b) => a + b);
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const items = [
    { part: "Fundamentals of React", exercises: 10 },
    { part: "Using props to pass data", exercises: 7 },
    { part: "State of a component", exercises: 14 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content items={items} />
      <Total items={items} />
    </div>
  );
};

export default App;
