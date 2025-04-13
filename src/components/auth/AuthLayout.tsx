import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
				<div className="max-w-5xl w-full flex bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="hidden md:flex w-1/2 items-center justify-center p-8 h-fit">
                    <Image
                        src="/login-illustration.png"
                        alt="Login Illustration"
                        width={400}
                        height={400}
                        priority
                    />
                </div>
                <div className="w-full md:w-1/2 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
} 