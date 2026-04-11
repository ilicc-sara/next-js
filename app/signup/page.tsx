"use client";
import { useState } from "react";
import { auth } from "../config/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

const Signup = () => {
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const [inputCode, setInputCode] = useState<string>("");

  const signUp = async (e: any) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={signUp}
      className="w-[400px] backdrop-blur-md bg-gradient-to-br from-gray-100/70 to-gray-300/60 shadow-xl rounded-2xl px-10 py-8 flex flex-col mx-auto items-center gap-5 mt-10 border border-gray-200"
    >
      <h1 className="text-gray-800 text-3xl self-start font-semibold">
        Sign Up
      </h1>

      <input
        type="text"
        placeholder="Email"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Login Code"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
      />

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition duration-200 shadow-md"
      >
        Sign Up
      </button>

      <p className="text-[#3f0fe]">
        Already have an accout ?
        <Link href="login">
          <span className="text-[#fc4747] cursor-pointer"> Log In</span>
        </Link>
      </p>
    </form>
  );
};

export default Signup;
