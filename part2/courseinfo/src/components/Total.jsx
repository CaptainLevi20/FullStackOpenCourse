const Total = ({ courses }) => {
  return (
    <p>
      <strong>Number of Exercises: </strong>
      {courses.parts.reduce((acc, current) => acc + current.exercises, 0)}
    </p>
  );
};

export default Total;
