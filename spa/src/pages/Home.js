import { Container } from "react-bootstrap";

const Hero = () => {
  return <>Hero: RankRise</>;
};

const Questions = () => {
  return <>List of question:</>;
};

const Home = () => {
  return (
    <Container>
      <Hero />
      <main>
        <Questions />
      </main>
    </Container>
  );
};

export default Home;
