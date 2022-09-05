const Header = ({ course }) => <h1>{course}</h1>;
const Content = ({ parts }) => (
  <>
    {parts.map((item, index) => (
      <Part key={index} name={item.name} exercises={item.exercises} />
    ))}
  </>
);
const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);
const Total = ({ parts }) => {
  const sum = parts.map((item) => item.exercises).reduce((a, b) => a + b);
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      { name: "Fundamentals of React", exercises: 10 },
      { name: "Using props to pass data", exercises: 7 },
      { name: "State of a component", exercises: 14 },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
