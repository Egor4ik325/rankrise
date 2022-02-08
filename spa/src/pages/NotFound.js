import notFoundIllustration from "../assets/img/illustrations/not-found.svg";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import routes from "../routes";

const NotFound = () => {
  return (
    <div className="not-found">
      <img className="not-found-illustration" src={notFoundIllustration} />
      <h1 className="not-found-title">Page not found</h1>
      <Button
        className="not-found-go-home"
        variant="tertiary"
        as={Link}
        to={routes.home}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
