import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/XSvg";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='min-h-screen bg-black m-auto'>
			<div className='max-w-screen-xl mx-auto flex min-h-screen'>
				{/* Left Panel - Hidden on mobile, shows X logo on desktop */}
				<div className='flex-1 hidden lg:flex items-center justify-center px-8'>
					<XSvg className='w-80 h-80 fill-white' />
				</div>

				{/* Right Panel - Form */}
				<div className='flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12'>
					<div className='w-full max-w-md mx-auto'>
						{/* Mobile X Logo */}
						<div className='flex justify-start mb-8 lg:hidden'>
							<XSvg className='w-8 h-8 fill-white' />
						</div>

						{/* Headings */}
						<div className='mb-12'>
							<h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8'>
								Sign in to X
							</h1>
						</div>
						
						{/* Form */}
						<form className='flex flex-col gap-5' onSubmit={handleSubmit}>
							{/* Username/Email Input */}
							<div className='relative'>
								<div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'>
									<MdOutlineMail size={20} />
								</div>
								<input
									type='text'
									className='w-full bg-black border border-gray-700 rounded-lg px-14 py-4 text-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors'
									placeholder='Username'
									name='username'
									onChange={handleInputChange}
									value={formData.username}
								/>
							</div>

							{/* Password Input */}
							<div className='relative'>
								<div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'>
									<MdPassword size={20} />
								</div>
								<input
									type='password'
									className='w-full bg-black border border-gray-700 rounded-lg px-14 py-4 text-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors'
									placeholder='Password'
									name='password'
									onChange={handleInputChange}
									value={formData.password}
								/>
							</div>

							{/* Sign In Button */}
							<button 
								type='submit'
								className='w-full bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-gray-200 transition-colors text-lg mt-6'
							>
								Sign in
							</button>
							
							{isError && <p className='text-red-500 text-center text-sm'>Something went wrong</p>}
						</form>

						{/* Forgot Password Link */}
						<div className='mt-6'>
							<Link to='/forgot-password' className='text-blue-400 hover:underline text-sm'>
								Forgot password?
							</Link>
						</div>
						
						{/* Sign Up Section */}
						<div className='mt-10'>
							<p className='text-gray-500 text-base mb-4'>Don't have an account?</p>
							<Link to='/signup'>
								<button className='w-full bg-transparent border border-gray-600 text-blue-400 font-bold py-4 px-8 rounded-full hover:bg-gray-900 hover:bg-opacity-20 transition-colors text-lg'>
									Create account
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;