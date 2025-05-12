import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    company: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    setError("");

    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (step === 2) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First name and last name are required.");
        return;
      }
    }

    if (step === 3) {
      const phoneRegex = /^[0-9]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError("Enter a valid phone number with at least 10 digits.");
        return;
      }
    }

    if (step === 4) {
      if (!formData.company.trim() || !formData.job.trim()) {
        setError("Company Name field cannot be empty.");
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
  
    let imageUrl = "";
  
    try {
      if (profilePic) {
        const fileName = `${formData.email}-${Date.now()}.jpg`;
  
       
        const presignRes = await fetch("http://localhost:8080/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query GetPresignedURL($fileName: String!) {
                getPresignedURL(fileName: $fileName)
              }
            `,
            variables: { fileName },
          }),
        });
  
        const presignData = await presignRes.json();
        const uploadUrl = presignData.data.getPresignedURL;
  
        if (!uploadUrl) {
          throw new Error("Failed to get upload URL from server");
        }
  
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "image/jpeg",
            //"x-amz-acl": "public-read",
          },
          body: profilePic,
        });
  
        console.log("Upload status:", uploadRes.status);
  
        if (!uploadRes.ok) {
          throw new Error("Failed to upload image to S3");
        }
  

        const bucketName = "levanter914-s3-user-profile-pictures";
        imageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        console.log("Profile URL:", imageUrl);
      }
  

      const query = `
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            token
            user {
              id
              email
              firstName
              lastName
              phoneNumber
              company
              profilePicURL
            }
          }
        }
      `;
  
      const variables = {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          company: formData.company,
          profilePicURL: imageUrl,
        },
      };
  
      const res = await fetch("http://localhost:8080/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
  
      const data = await res.json();
  
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
  
      localStorage.setItem("token", data.data.signup.token);
      alert("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-white flex items-center justify-start px-8">
      <div className="max-w-md bg-white space-y-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#00b3b3] bg-clip-text text-transparent leading-normal overflow-visible">
          Sign Up
        </h2>
  
        <form className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-md font-medium text-gray-500">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium text-gray-500">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium text-gray-500">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </>
          )}
  
          {step === 2 && (
            <>
              <div>
                <label className="block text-md font-medium text-gray-500">Profile Picture</label>
                <div className="w-full px-22 py-3 border border-dashed border-gray-300 rounded-4xl shadow-sm bg-white text-gray-500 text-sm flex items-center justify-between cursor-pointer hover:border-indigo-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="w-full mt-1"
                  required
                />
                </div>
              </div>
              <div>
                <label className="block text-md font-medium text-gray-500">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-md font-medium text-gray-500">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </>
          )}
  
          {step === 3 && (
            <div>
              <label className="block text-md font-medium text-gray-500">Phone Number</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
  
          {step === 4 && (
            <>
              <div>
                <label className="block text-md font-medium text-gray-500">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full mt-1 px-22 py-3 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}
  
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="text-sm text-gray-500 hover:underline"
              >
                Back
              </button>
            )}
  
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-500 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto bg-indigo-700 text-white px-6 py-2 rounded-full  hover:bg-indigo-400 transition duration-400 ease-in-out"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );  
}
