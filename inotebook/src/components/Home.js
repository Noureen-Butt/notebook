import React from "react";
import Notes from "./Notes";
import AddNote from "./AddNote";

const Home = (props) => {
  const { showAlert } = props;
  return (
    <div>
      <AddNote showAlert={showAlert} />
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;
