import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/ui/button";
import { FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { validateEmail, validatePassword, validationMessages } from "@/lib/validations";

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "" };

        if (!email) {
            newErrors.email = validationMessages.required;
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = validationMessages.email;
            isValid = false;
        }

        if (!password) {
            newErrors.password = validationMessages.required;
            isValid = false;
        } else if (!validatePassword(password)) {
            newErrors.password = validationMessages.password;
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onLogin(email, password);
        }
    };

    return (
        <div className="max-w-md w-full">
            <Card className="bg-white shadow-xl">
                <CardHeader>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FaShieldAlt className="w-8 h-8 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            Super Admin Login
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Super Admin Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                                placeholder="Enter super admin email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            <Link
                                href="/super-admin/forgot-password"
                                className="text-sm text-red-600 hover:text-red-700 mt-1 inline-block"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                            <FaEnvelope className="mr-2" /> Login with email
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
