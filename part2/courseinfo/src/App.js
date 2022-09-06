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

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
  </>
);

const Total = ({ course }) => {
  const sum = course.parts
    .map((part) => part.exercises)
    .reduce((a, b) => a + b, 0);
  return <b>Total of {sum} exercises</b>;
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
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
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <Course course={course} id={course.id} />
          <Total course={course} />
        </div>
      ))}
    </div>
  );
};

export default App;
