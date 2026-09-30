import { useState } from "react";
import bgLogin from "../../assets/images/common/bg_login.jpg";
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FaGoogle, FaFacebook } from "react-icons/fa";


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="relative flex-1 min-h-[600px] overflow-hidden">
        <img src={bgLogin} alt="Mountain" className="absolute inset-0 w-full h-full object-cover scale-105 blur-[1px]"/>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 px-9 pt-8">
          <h1 className="text-white text-3xl font-semibold">VoyageQuest</h1>
        </div>

        <div className="relative z-10 flex justify-center items-center min-h-[calc(100vh-100px)] px-4">
          <div className="w-full max-w-[445px] rounded-lg bg-white/85 backdrop-blur-md shadow-xl px-6 py-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Welcome Back</h2>
              <p className="text-sm text-gray-500 mt-2">Continue your journey with VoyageQuest.</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" placeholder="explorer@example.com"
                    className="w-full h-10 rounded-md bg-gray-100/90 border border-transparent pl-9 pr-3 text-xs text-gray-700 outline-none focus:border-blue-700 focus:bg-white"/>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-gray-800">Password</label>
                  <button type="button" className="text-sm text-blue-700 hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-10 rounded-md bg-gray-100/90 border border-transparent pl-9 pr-10 text-xs outline-none focus:border-blue-700 focus:bg-white"/>
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700">
                    {showPassword ? (
                      <HiEyeOff className="w-4 h-4" />
                    ) : (
                      <HiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button type="submit"
                className="w-full h-10 rounded-md bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium transition duration-200">
                Login
              </button>
            </form>

            <div className="flex items-center gap-2 my-6">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button"className="h-9 bg-white border border-gray-200 rounded-md flex items-center justify-center gap-2 text-sm text-gray-700 hover:bg-gray-50">
                <FaGoogle className="text-red-500 w-3.5 h-3.5" />
                Google
              </button>

              <button type="button"className="h-9 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center gap-2 text-sm text-white"
              ><FaFacebook className="w-3.5 h-3.5" />
                Facebook
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-5">Don't have an account?{" "}
              <button type="button" className="text-blue-700 font-medium hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;