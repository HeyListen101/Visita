import { customSignInAction, googleSignInAction } from "@/app/server/auth-actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function Home() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://www.eduopinions.com/wp-content/uploads/2017/09/Visayas-State-University-VSU-campus.jpg')",
        backgroundSize: "100% 100%",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-black">Log In</h2>

        {/* Sign In Form */}
        <form action={customSignInAction} className="w-full flex flex-col">
          {/* Email Field */}
          <Input type="email" name="email" placeholder="Email Address" className="mb-3" required/>

          {/* Password Field */}
          <Input type="password" name="password" placeholder="Password" className="mb-3" required/>

          {/* Sign-up and Forgot Password Links */}
          <div className="flex justify-between w-full text-sm mb-4">
            <Link href="/sign-up" className="text-[#696047] hover:text-[#57503A]">
              Sign-up or Register
            </Link>
            <Link href="/forgot-password" className="text-[#696047] hover:text-[#57503A]">
              Forgot Password?
            </Link>
          </div>

          {/* Continue Button */}
          <SubmitButton pendingText="Signing In..." formAction={customSignInAction}>
            Continue
          </SubmitButton>
        </form>

        {/* OR Divider */}
        <div className="flex items-center w-full my-3">
          <hr className="flex-grow border-t border-[#d2d2d2] mx-2" />
          <span className="text-[#696047] font-medium text-m relative bottom-[3px]">
            or
          </span>
          <hr className="flex-grow border-t border-[#d2d2d2] mx-2" />
        </div>

        {/* Google Sign-In Form */}
        <form action={googleSignInAction}>
        <SubmitButton className="gsi-material-button" style= {{width:320}}>
          <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ display: "block" }}
                      className="w-6 h-6"
                    >
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">Continue with Google</span>
              <span style={{display: "none"}}>Continue with Google</span>
            </div>
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
