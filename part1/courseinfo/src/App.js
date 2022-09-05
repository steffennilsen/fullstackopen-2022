const Header = (props) => <h1>{props.course}</h1>;
const Content = (props) => (
  <>
    {props.parts.map((item, index) => (
      <Part key={index} name={item.name} exercises={item.exercises} />
    ))}
  </>
);
const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
);
const Total = (props) => {
  const sum = props.parts.map((item) => item.exercises).reduce((a, b) => a + b);
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    { name: "Fundamentals of React", exercises: 10 },
    { name: "Using props to pass data", exercises: 7 },
    { name: "State of a component", exercises: 14 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

export default App;
