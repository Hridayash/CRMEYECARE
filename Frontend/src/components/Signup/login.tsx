import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const inputStyle = "border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

    const [showPassword, setShowPassword] = useState(false);
   

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios.post('http://localhost:3002/login', user)
            .then(result => {
                const { accessToken } = result.data;
                console.log(accessToken);
               
                localStorage.setItem('accessToken', accessToken);
                navigate('/');
            })
            .catch(err => {
                console.error('Error logging in:', err);
                alert('Login failed. Please check your credentials and try again.');
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
                        <h2 className="font-medium text-lg text-gray-500">Please sign in</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className={inputStyle}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className={inputStyle}
                                placeholder="Enter your password"
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
                               
                           
                        </div>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Log In
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/signup" className="text-sm text-blue-500 hover:underline">
                            Don't have an account?
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
