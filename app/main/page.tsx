"use client";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

type ApplicantsType = {
  company: string;
  createdAt: string;
  notes: string;
  position: string;
  status: string;
  updatedAt: string;
  userId: string;
  id: string;
  name: string;
};

const Main = () => {
  const [applicants, setAplicants] = useState<null | ApplicantsType[]>(null);

  const applicantsCollection = collection(db, "jobs");

  useEffect(() => {
    const getApplicants = async () => {
      try {
        const data = await getDocs(applicantsCollection);
        const filteredData = data.docs.map((doc) => ({
          ...(doc.data() as Omit<ApplicantsType, "id">),
          id: doc.id,
        }));
        setAplicants(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getApplicants();
  }, []);

  console.log("applicants state", applicants);

  console.log(auth?.currentUser?.email);
  const router = useRouter();

  const logout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const generateStatusColor = (status: string) => {
    if (status === "Applied") {
      return "blue";
    }
    if (status === "Offer") {
      return "green";
    }
    if (status === "Rejected") {
      return "red";
    }
    if (status === "Interview") {
      return "yellow";
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
      <section className="flex flex-col !mb-12">
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

        <div className="!mx-auto !w-134">
          <ul className="list-none flex flex-col gap-2">
            {applicants &&
              applicants.map((item) => (
                <li className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-800">
                      {item.userId}
                    </h1>
                    <span
                      className="px-3 py-1 text-sm font-semibold rounded-full"
                      style={{
                        backgroundColor: `${generateStatusColor(item.status)}`,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-center text-gray-900 tracking-wide uppercase">
                    {item.position}
                  </h2>
                  <div className="flex flex-col text-sm text-gray-600">
                    {" "}
                    <span>{item.createdAt}</span>
                    <span> {item.notes} </span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Main;
