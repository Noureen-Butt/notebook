import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const createUser = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    });
    const json = await response.json();
    console.log(json.AuthTocken);
    if (json.AuthTocken) {
      localStorage.setItem("token", json.AuthTocken);
      props.showAlert("success", "Account created successfully");
      navigate("/homes");
    } else {
      props.showAlert("danger", "Please try with some other email");
    }
  };

  return (
    <div>
      <form onSubmit={createUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            minLength={3}
            aria-describedby="emailHelp"
            name="name"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="exampleInputPassword1"
            onChange={handleChange}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            minLength={5}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            minLength={5}
            onChange={handleChange}
          />
        </div>

        <button
          disabled={
            user.name.length < 3 ||
            user.password.length < 5 ||
            user.cpassword.length < 5
          }
          type="submit"
          className="btn btn-primary"
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
