"use client";
import { useEffect } from "react";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const Main = () => {
  console.log(auth?.currentUser?.email);
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav className="flex justify-between  !p-6 bg-yellow-50  shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
        <h1 className="text-lg font-bold ">Job Applications</h1>
        <button
          onClick={() => logout()}
          className="!p-2 bg-red-400 text-white rounded-lg"
        >
          Log Out
        </button>
      </nav>
      <section className="flex flex-col  ">
        <form className="flex flex-col  !mx-auto bg-gray-100 !w-120 !p-4 !my-8 gap-2 rounded-lg">
          <label className="font-bold text-gray-400">Applicant Full Name</label>
          <input
            className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Name..."
          />
          <label className="font-bold text-gray-400">Applied Possition</label>
          <input
            className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Possition..."
          />
          <label className="font-bold text-gray-400">Company Name</label>
          <input
            className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            placeholder="Company"
          />

          <button className="w-full py-2 rounded-lg bg-blue-200 text-white font-bold hover:bg-blue-700 hover:text-white transition duration-200 shadow-md !my-3">
            Apply
          </button>
        </form>
      </section>
    </>
  );
};

export default Main;
