import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header courses={course} />
            <Content courses={course} />
            <Total courses={course} />
          </div>
        );
      })}
    </div>
  );
};

export default Course;
