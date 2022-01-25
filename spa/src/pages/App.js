import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "./Home";
import Login from "./Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default App;
