import { useState } from "react";

export const LoginForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loginChange = (data) => {
    const { name, value } = data.target;
    setUser({ ...user, [name]: value });
  };

  const loginData = (e) => {
    e.preventDefault();

    setUser({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <form onSubmit={loginData}>
        <label>Name : </label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user?.name}
          onChange={loginChange}
        />
        <br />
        <label>Email : </label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={user?.email}
          onChange={loginChange}
        />
        <br />
        <label>Password: </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user?.password}
          onChange={loginChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
