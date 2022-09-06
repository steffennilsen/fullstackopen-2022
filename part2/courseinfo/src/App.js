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

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
  </>
);

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return (
    <div>
      <Course course={course} id={course.id} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
