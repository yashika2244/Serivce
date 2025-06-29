import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import uploadImageToClodinary from "../../../utils/uploadCloudinary";
import { authContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FaArrowLeft } from "react-icons/fa6";

function UpdateServicerProfile() {
  const { dispatch, token, user } = useContext(authContext);
  const [uploading, setUploading] = useState(false);

  const { id } = useParams(); // grabs :id from URL
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // password: "",
    photo: null,
    gender: "",
    // role: "service-provider",
    age: "",
    TicketPrice: "",
    about: "",
    specialization: "",
    exprole: "",
    location: "",
    expDateStart: "",
    expDateEnd: "",
  });
  const [previewSrc, setPreviewSrc] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        // password: "",
        photo: user.photo || null,
        gender: user.gender || "",
        // role: user.role || "service-provider",
        age: user.age || "",
        TicketPrice: user.TicketPrice || "",
        about: user.about || "",
        specialization: user.specialization || "",
        exprole: user.exprole || "",
        location: user.location || "",
        expDateStart: user.expDateStart || "",
        expDateEnd: user.expDateEnd || "",
      });
      setPreviewSrc(user.photo || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    setUploading(true);

    //   if (file) {
    //     const data = await uploadImageToClodinary(file);
    //     setFormData({ ...formData, photo: data.url });
    //     setPreviewSrc(data.url);
    //   }
    // };
    if (file) {
      try {
        const data = await uploadImageToClodinary(file);
        setFormData({ ...formData, photo: data.url });
        setPreviewSrc(data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Image upload failed!");
      } finally {
        setUploading(false); // Uploading complete
      }
    } else {
      setUploading(false); // No file selected, stop uploading
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // get updated user data or message

      if (res.ok) {
        if (data.service) {
          dispatch({ type: "UPDATE_USER", payload: data.service });
          toast.success("Profile updated successfully!");
          navigate(`/servicer-account/${data.service._id}`); // use updated id here
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error("Error in updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto md:mt-20  mt-12 md:p-10 p-4 bg-gradient-to-br from-white via-blue-50 to-blue-100 mb-5 rounded-3xl shadow-2xl">
      <div className="flex  gap-5 md:gap-45 md:mb-3  ">
        <FaArrowLeft
          className="text-xl  md:ml-3 md:mb-0 mt-2 "
          // onClick={() => navigate("/chat", { state: { name, photo, id } })}
          onClick={() => navigate(-1)}
        />

        <h2 className="text-3xl font-bold text-center text-sky-700 mb-6">
          Update Your Profile
        </h2>
      </div>

      <form onSubmit={submitHandler} className="space-y-8">
        {/* Name, Email, Password */}
        <div className="grid gap-6 md:grid-cols-3">
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            required
            onChange={handleInputChange}
            className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm focus:shadow-md"
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            value={formData.email}
            required
            onChange={handleInputChange}
            className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm focus:shadow-md"
          />
        </div>

        {/* Age, Specialization, Ticket Price */}
        <div className="grid gap-6 md:grid-cols-3">
          <input
            type="number"
            placeholder="Age"
            name="age"
            value={formData.age}
            required
            onChange={handleInputChange}
            className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm focus:shadow-md"
          />
          <input
            type="text"
            placeholder="Specialization"
            name="specialization"
            value={formData.specialization}
            required
            onChange={handleInputChange}
            className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm focus:shadow-md"
          />
          <input
            type="number"
            placeholder="Ticket Price"
            name="TicketPrice"
            value={formData.TicketPrice}
            required
            onChange={handleInputChange}
            className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm focus:shadow-md"
          />
        </div>

        {/* Experience Section */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-blue-300 pb-2">
          Experience Details
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            required
            onChange={handleInputChange}
            className="px-5 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm focus:shadow-md"
          />
          <input
            type="date"
            placeholder="Start date"
            name="expDateStart"
            value={formData.expDateStart}
            required
            onChange={handleInputChange}
            className="px-5 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm focus:shadow-md"
          />
          <input
            type="date"
            placeholder="End date"
            name="expDateEnd"
            value={formData.expDateEnd}
            required
            onChange={handleInputChange}
            className="px-5 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm focus:shadow-md"
          />
        </div>

        {/* About Textarea */}
        <textarea
          rows={5}
          placeholder="Enter a Paragraph About Yourself"
          name="about"
          value={formData.about}
          required
          onChange={handleInputChange}
          className="w-full px-6 py-4 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 text-lg font-medium resize-none transition-shadow focus:outline-none focus:ring-1 focus:ring-blue-300 shadow-sm focus:shadow-md"
        />

        {/* Profile Picture & Gender */}
        <div className="flex  md:flex-row  items-center justify-between  md:gap-10">
          <div className="flex items-center gap-2">
            {previewSrc && (
              <figure className="md:w-18 md:h-18 w-12 h-12  rounded-full border-2 border-blue-500 overflow-hidden shadow-lg">
                <img
                  src={previewSrc}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </figure>
            )}
            <div className="relative">
              <input
                type="file"
                name="photo"
                id="customfile"
                onChange={handleFileInputChange}
                accept=".jpg, .png.,.jpeg, .avif ,.webp , .html"
                className="absolute top-0 left-0 w-full h-full  opacity-0 cursor-pointer"
              />
              <label
                htmlFor="customfile"
                className="bg-gradient-to-b from-blue-400 to-blue-700  hover:from-blue-500 hover:to-blue-800 text-white font-semibold md:px-5 md:py-3 px-2 py-2 rounded-2xl cursor-pointer select-none shadow-md transition ${uploading ?  bg-blue-600 text-white font-bold rounded-lg md:text-[15px] text-[13px] cursor-pointer hover:bg-blue-700 transition"
              >
                {uploading ? "Uploading..." : "Upload Picture"}

                {/* Update Picture */}
              </label>
            </div>
          </div>

          <label className="text-gray-900 font-semibold md:text-lg    flex items-center md:gap-4 gap-2 text-sm">
            Gender
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className="md:px-7 md:py-3 px-3 py-1 rounded-xl border border-gray-300 bg-white text-gray-800 md:text-lg font-medium focus:outline-none   shadow-sm transition"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
        
          <button
            type="submit"
            disabled={uploading} 
            className={`bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-20 py-2 rounded-xl shadow-xl transition-transform transform hover:scale-105 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateServicerProfile;
