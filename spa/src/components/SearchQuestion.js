import { Link } from "react-router-dom";
import routes from "../routes";

const SearchQuestion = ({ question }) => {
  return (
    <div>
      <b>{question.title}</b>
      <div>
        <Link to={`${routes.questions}/${question.pk}`}>More</Link>
      </div>
    </div>
  );
};

export default SearchQuestion;
