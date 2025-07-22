import { useState } from "react";

export const Register = () => {
    const [user, setUserData] = useState({
        username: "",
        usermail: "",
        password: "",
    });

    const SignupFormSubmit = () => {
        console.log("hello");
        e.preventDefault();

        setUserData({
            username: "",
            useremail: "",
            password: "",
        });
    };

    const onFormChange = (data) => {
        const { name, value } = data.target;
        setUserData({ ...user, [name]: value });
    };

    return (
        <>
            <div>
                <form onSubmit={SignupFormSubmit}>
                    <h3>SignUp</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="UserName"
                        value={user?.username}
                        onChange={onFormChange}
                    />
                    <br />
                    <input
                        type="text"
                        name="usermail"
                        placeholder="Email"
                        value={user?.usermail}
                        onChange={onFormChange}
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user?.password}
                        onChange={onFormChange}
                    />
                    <br />
                    <button>Submit</button>
                </form>
            </div>
        </>
    );
};
