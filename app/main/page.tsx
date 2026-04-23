"use client";
import { useEffect, useState, useMemo } from "react";
import { auth } from "../config/firebase-config";
import { useRouter } from "next/navigation";
// prettier-ignore
import {collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where,} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { serverTimestamp } from "firebase/firestore";
import Input from "./components/Input";
import { generateStatusColor } from "./helpers";
// prettier-ignore
import type { ApplicantsType, FiltersType, FilterKey, FilterPayload } from "./types";
import { onAuthStateChanged } from "firebase/auth";
import { debounce } from "throttle-debounce";

const Main = () => {
  const [applicants, setAplicants] = useState<null | ApplicantsType[]>(null);
  // prettier-ignore
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantsType[] | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<string>("Applied");
  // prettier-ignore
  const [inputCandidate, setInputCandidate] = useState({applicantName: "", applicantEmail: "", applicantPossition: "", appliedCompany: "",});
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editId, setEditId] = useState<null | string>(null);
  // prettier-ignore
  const [filters, setFilters] = useState({searchCompany: "", activeStatus: null,});
  const [sortValue, setSortValue] = useState("a-b");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const applicantsCollection = collection(db, "jobs");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const getApplicants = async () => {
    try {
      const user = auth?.currentUser;

      if (!user) return;

      const q = query(applicantsCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);

      const filteredData = data.docs.map((doc) => ({
        ...(doc.data() as Omit<ApplicantsType, "id">),
        id: doc.id,
      }));

      setAplicants(filteredData);
      setFilteredApplicants(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getApplicants();
  }, []);

  function handleInfoChange(e: any) {
    e.preventDefault();

    setInputCandidate((prev) => {
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
    setInputCandidate({
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
        company: inputCandidate.appliedCompany,
        email: inputCandidate.applicantEmail,
        fullName: inputCandidate.applicantName,
        position: inputCandidate.applicantPossition,
        createdAt: serverTimestamp(),
        notes: "Adding Notes About Application...",
        updatedAt: "",
        id: crypto.randomUUID(),
        userId: auth?.currentUser?.uid,
      });

      resetForm();
      getApplicants();
      setAppliedStatus("Applied");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      const candidate = doc(db, "jobs", id);
      await deleteDoc(candidate);
      setAplicants((prev) => {
        if (!prev) return prev;
        return prev?.filter((item) => item.id !== id);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const editCandidate = async (
    id: string,
    name: string,
    email: string,
    possition: string,
    company: string,
    status: string,
  ) => {
    setShowEditForm(true);
    setEditId(id);
    setInputCandidate({
      applicantName: name,
      applicantEmail: email,
      applicantPossition: possition,
      appliedCompany: company,
    });
    setAppliedStatus(status);
  };

  const submitEdidCandidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const candidateDoc = doc(db, "jobs", editId);
      await updateDoc(candidateDoc, {
        status: appliedStatus,
        company: inputCandidate.appliedCompany,
        email: inputCandidate.applicantEmail,
        fullName: inputCandidate.applicantName,
        position: inputCandidate.applicantPossition,
        updatedAt: serverTimestamp(),
      });
      getApplicants();
      setShowEditForm(false);
      setEditId(null);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  function handleChangeFIlter(payload: FilterPayload) {
    const { key, value } = payload;

    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  }

  useEffect(() => {
    const { activeStatus, searchCompany } = filters;

    if (!applicants) return;
    let filteredApplicantsTemp = [...applicants];

    if (activeStatus) {
      filteredApplicantsTemp = filteredApplicantsTemp.filter(
        (person) => person.status === activeStatus,
      );
    }
    if (searchCompany) {
      filteredApplicantsTemp = filteredApplicantsTemp.filter((person) =>
        person.company
          .toLowerCase()
          .includes(searchCompany.toLocaleLowerCase()),
      );
    }

    setFilteredApplicants(filteredApplicantsTemp);
  }, [filters]);

  const filteredCandidates = useMemo(() => {
    return filteredApplicants?.sort((a, b) => {
      if (sortValue === "a-b") return a.fullName.localeCompare(b.fullName);
      if (sortValue === "b-a") return b.fullName.localeCompare(a.fullName);
    });
  }, [filteredApplicants, sortValue]);

  return (
    <>
      {showEditForm && (
        <div className="overlay">
          <button
            onClick={() => {
              setShowEditForm(false);
              resetForm();
            }}
            className="close-overlay"
          >
            ❌
          </button>
          <form
            onSubmit={submitEdidCandidate}
            className="flex flex-col  !mx-auto bg-gray-100 !w-120 !p-4 !my-8 gap-2 rounded-lg"
          >
            <Input
              name="applicantName"
              value={inputCandidate.applicantName}
              placeholder="Name..."
              label="Applicant Full Name"
              handleInputChange={handleInfoChange}
            />

            <Input
              name="applicantEmail"
              value={inputCandidate.applicantEmail}
              placeholder="Email..."
              label="Applicant Email"
              handleInputChange={handleInfoChange}
            />

            <Input
              name="applicantPossition"
              value={inputCandidate.applicantPossition}
              placeholder="Possition..."
              label="Applied Possition"
              handleInputChange={handleInfoChange}
            />

            <Input
              name="appliedCompany"
              value={inputCandidate.appliedCompany}
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
              <option>Offer</option>
              <option>Rejected</option>
              <option>Interview</option>
            </select>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-200 text-white font-bold hover:bg-blue-700 hover:text-white transition duration-200 shadow-md !my-3"
            >
              Update
            </button>
          </form>
        </div>
      )}
      <nav className="flex justify-between  !p-6 bg-gray-100  shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
        <h1 className="text-lg font-bold ">Job Applications</h1>

        <div className="flex gap-5">
          <div className="flex gap-2">
            <input
              type="search"
              value={filters.searchCompany}
              onChange={(e) =>
                handleChangeFIlter({
                  key: "searchCompany",
                  value: e.target.value,
                })
              }
              className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              placeholder="Search Company..."
            ></input>
            <select
              onChange={(e) => {
                if (e.target.value === "All Statuses") {
                  handleChangeFIlter({ key: "activeStatus", value: null });
                } else {
                  handleChangeFIlter({
                    key: "activeStatus",
                    value: e.target.value,
                  });
                }
              }}
              className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="w-full  px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              <option value="a-b">Sort Names Ascending</option>
              <option value="b-a">Sort Names Decending</option>
            </select>
          </div>
          <button
            onClick={() => logout()}
            className="!p-2 bg-red-400 text-white rounded-lg"
          >
            Log Out
          </button>
        </div>
      </nav>
      <section className="flex flex-col !mb-12">
        <form
          onSubmit={submitNewCandidate}
          className="flex flex-col  !mx-auto bg-gray-100 !w-120 !p-4 !my-8 gap-2 rounded-lg"
        >
          <Input
            name="applicantName"
            value={inputCandidate.applicantName}
            placeholder="Name..."
            label="Applicant Full Name"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="applicantEmail"
            value={inputCandidate.applicantEmail}
            placeholder="Email..."
            label="Applicant Email"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="applicantPossition"
            value={inputCandidate.applicantPossition}
            placeholder="Possition..."
            label="Applied Possition"
            handleInputChange={handleInfoChange}
          />

          <Input
            name="appliedCompany"
            value={inputCandidate.appliedCompany}
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
            {filteredCandidates &&
              filteredCandidates.map((item) => (
                <li
                  key={item.id}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-bold text-gray-800">
                      {item.fullName}
                    </h1>
                    <span
                      className="px-3 py-1 text-sm font-semibold rounded-full text-gray-800"
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
                  <div className="flex text-sm text-gray-600 justify-between">
                    {" "}
                    {/* <span>{item.createdAt}</span> */}
                    <span> {item.notes} </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => deleteCandidate(item.id)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-200 text-white rounded-md hover:bg-red-300 transition duration-200 shadow-sm"
                      >
                        🗑️
                      </button>

                      <button
                        onClick={() =>
                          editCandidate(
                            item.id,
                            item.fullName,
                            item.email,
                            item.position,
                            item.company,
                            item.status,
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-200 text-white rounded-md hover:bg-yellow-300 transition duration-200 shadow-sm"
                      >
                        ✏️
                      </button>
                    </div>
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
