"use client";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
import { collection, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { serverTimestamp } from "firebase/firestore";
import Input from "./Input";
import { generateStatusColor } from "./helpers";
import type { ApplicantsType } from "./types";

const Main = () => {
  const [applicants, setAplicants] = useState<null | ApplicantsType[]>(null);
  const [appliedStatus, setAppliedStatus] = useState<string>("Applied");
  const [newCandidate, setNewCandidate] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPossition: "",
    appliedCompany: "",
  });

  const router = useRouter();
  const applicantsCollection = collection(db, "jobs");

  useEffect(() => {
    const getApplicants = async () => {
      try {
        const data = await getDocs(applicantsCollection);
        const filteredData = data.docs.map((doc) => ({
          ...(doc.data() as Omit<ApplicantsType, "id">),
          id: doc.id,
        }));
        console.log(filteredData);
        setAplicants(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getApplicants();
  }, []);

  function handleInfoChange(e: any) {
    e.preventDefault();

    setNewCandidate((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const logout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setNewCandidate({
      applicantName: "",
      applicantEmail: "",
      applicantPossition: "",
      appliedCompany: "",
    });
  };

  const submitNewCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addDoc(applicantsCollection, {
        status: appliedStatus,
        company: newCandidate.appliedCompany,
        email: newCandidate.applicantEmail,
        fullName: newCandidate.applicantName,
        position: newCandidate.applicantPossition,
        createdAt: serverTimestamp(),
        notes: "Adding Notes About Application...",
        updatedAt: "",
        userId: crypto.randomUUID(),
      });

      resetForm();
      setAppliedStatus("Applied");
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
      <section className="flex flex-col !mb-12">
        <form
          onSubmit={submitNewCandidate}
          className="flex flex-col  !mx-auto bg-gray-100 !w-120 !p-4 !my-8 gap-2 rounded-lg"
        >
          <Input
            name="applicantName"
            value={newCandidate.applicantName}
            placeholder="Name..."
            label="Applicant Full Name"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="applicantEmail"
            value={newCandidate.applicantEmail}
            placeholder="Email..."
            label="Applicant Email"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="applicantPossition"
            value={newCandidate.applicantPossition}
            placeholder="Possition..."
            label="Applied Possition"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="appliedCompany"
            value={newCandidate.appliedCompany}
            placeholder="Company..."
            label="Company Name"
            handleInputChange={handleInfoChange}
          />

          <label className="font-bold text-gray-400">Status</label>
          <select
            value={appliedStatus}
            onChange={(e) => setAppliedStatus(e.target.value)}
            className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-200 text-white font-bold hover:bg-blue-700 hover:text-white transition duration-200 shadow-md !my-3"
          >
            Apply
          </button>
        </form>

        <div className="!mx-auto !w-134">
          <ul className="list-none flex flex-col gap-2">
            {applicants &&
              applicants.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-800">
                      {item.fullName}
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
                  <h2 className="text-2xl font-bold text-left text-gray-900 tracking-wide uppercase">
                    {item.position}{" "}
                    <span className="text-sm font-normal capitalize">
                      {item.company}
                    </span>
                  </h2>
                  <div className="flex flex-col text-sm text-gray-600">
                    {" "}
                    {/* <span>{item.createdAt.substring(0, 10)}</span> */}
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
