import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import logo from "@/assets/images/logo2.png";
import { Eye, EyeOff, Loader2, Lock, Phone } from "lucide-react";
import customToast from "../../components/ui/customToaster";
import AuthService from "../../services/AuthService";

export function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      customToast.error("Fail To Login", "Invalid Credentials");
      setIsLoading(false);
      return;
    }

    try {
      try {
        const response = await AuthService.adminLogin(formData);
        console.log(response, "this is response");
        if (!response?.status || response?.statusCode != 200) {
          customToast.error("Error Login", response?.message);
          setIsLoading(false);
        }
        if (response?.status && response?.statusCode == 200) {
          customToast.success("Congratulation", response.data.message);
          Cookies.set("token", response.data.token);
          setIsLoading(false);
          navigate("/");
        }
      } catch (error) {}
    } catch (error) {
      console.error("Login failed", error);
      customToast.error("Login Failed", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center
  bg-gradient-to-br from-pink-200 via-pink-50 to-purple-200
  relative"
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10  w-full md:max-w-sm">
        <div className="w-full  mt-12 shadow-none backdrop-blur-none   border-0">
          <CardContent>
            <img
              src={logo || "/placeholder.svg"}
              className="w-34  mb-2 aspect-square object-cover mx-auto"
              alt="Logo"
            />
            <CardTitle className="text-xl text-center mb-2">
              Welcome Back Zu 👋
            </CardTitle>
            <p className="text-sm text-center text-gray-500 mb-4">
              Log in to manage your dashboard and stay in control
            </p>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="Email"
                  className="text-sm font-medium text-gray-900 opacity-70"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    disabled={isLoading}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ex: JohnDoe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 text-base md:text-[14px] border-pink-300 focus:border-pink-500 bg-white focus:ring-pink-500/20 rounded-xl  shadow-none transition-all duration-200 hover:shadow-md  hover:shadow-pink-300/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 opacity-70"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    disabled={isLoading}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 text-base md:text-[14px] border-pink-300 focus:border-pink-500 bg-white focus:ring-pink-500/20 rounded-xl  shadow-none transition-all duration-200 hover:shadow-md  hover:shadow-pink-300/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              onClick={handleLogin}
              className="w-full  text-[14px] bg-pink-400 cursor-pointer   border border-pink-500  hover:text-pink-400 hover:border-pink-600 hover:bg-white  h-12 mt-6 rounded-xl shadow-lg     transition-all duration-300 group transform"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Log In</>}
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
