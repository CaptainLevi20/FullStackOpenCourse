import Part from "./Part";

const Content = ({ courses }) => {
  return (
    <div>
      {courses.parts.map((part) => {
        return <Part key={part.id} part={part} />;
      })}
    </div>
  );
};

export default Content;
