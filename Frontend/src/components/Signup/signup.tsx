import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
    const navigate = useNavigate();
    const inputStyle = "border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
    const [showPassword, setShowPassword] = useState(false);

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (userInfo.password !== e.target.value) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError("");
        }
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userInfo.password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        axios.post('http://localhost:3002/user/createUser', userInfo)
            .then(result => {
                console.log(result);
                navigate("/login");
            })
            .catch(err => {
                console.error('Error signing up:', err);
                alert('Signup failed. Please check your information and try again.');
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">OptiCare</h1>
                <form onSubmit={submit} className="space-y-6">
                    <div className="text-center mb-4">
                        <h1 className="font-semibold text-2xl text-gray-700">Welcome to OptiCare</h1>
                        <h2 className="font-medium text-lg text-gray-500">To get started, please sign up</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                className={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                className={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userInfo.password}
                                    onChange={handleChange}
                                    className={inputStyle}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={inputStyle}
                                    required
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={togglePasswordVisibility}
                                    />
                                    Show Password
                                </label>
                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="submit"
                        disabled={userInfo.password !== confirmPassword}
                    >
                        Sign Up
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm text-blue-500 hover:underline">
                            Already have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
