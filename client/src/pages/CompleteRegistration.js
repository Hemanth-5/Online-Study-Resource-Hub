import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resolvePath, useNavigate } from "react-router-dom";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import {
  completeProfile,
  updateProfilePicture,
  fetchUserProfile,
  fetchAllTags,
} from "../api/apiServices";
import { setPopup } from "../features/popupsSlice";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CompleteRegistration.css";

const CompleteRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const [profileData, setProfileData] = useState({
    name: "",
    department: "",
    bio: {
      gender: "",
      dob: "",
      alternateEmail: "",
      degree: "",
      batch: "",
    },
    interests: [],
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(setLoading("loading"));
    fetchUserProfile(token)
      .then((response) => {
        dispatch(setUserProfile(response));
        setProfileData({
          name: response.name || "",
          department: response.department || "",
          bio: {
            gender: response.bio?.gender || "",
            dob: response.bio?.dob || "",
            alternateEmail: response.bio?.alternateEmail || "",
            degree: response.bio?.degree || "",
            batch: response.bio?.batch || "",
          },
          interests: response.interests || [],
        });
        setProfilePicture(response.profilePicture || "");
        dispatch(setLoading("succeeded"));
      })
      .catch((err) => {
        dispatch(setError("Failed to fetch user profile."));
        dispatch(setLoading("failed"));
        setErrorState("Failed to fetch user profile.");
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchAllTags(token)
      .then((tags) => {
        const subjectTags = tags.filter((tag) => tag.type === "subject");
        setAvailableTags(subjectTags);
      })
      .catch((err) => {
        setErrorState("Failed to fetch tags.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBioChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      bio: {
        ...prevState.bio,
        [name]: value,
      },
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addInterest = (interest) => {
    if (!profileData.interests.includes(interest._id)) {
      setProfileData((prevData) => ({
        ...prevData,
        interests: [...prevData.interests, interest._id],
      }));
      setSearchTerm(""); // Clear the search input after adding
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setProfileData((prevData) => ({
        ...prevData,
        profilePictureFile: file,
      }));
    }
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handlePhotoClick = (e) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setProfilePicture(URL.createObjectURL(file));
        setProfileData((prevData) => ({
          ...prevData,
          profilePictureFile: file,
        }));
      }
    };
    input.click();
  };

  const handleSaveProfile = async () => {
    setLoadingState(true);
    setErrorState(null);
    try {
      const token = localStorage.getItem("accessToken");
      await completeProfile(token, profileData);

      if (profileData.profilePictureFile) {
        const formData = new FormData();
        formData.append("file", profileData.profilePictureFile);
        await updateProfilePicture(token, formData);
      }

      const updatedProfile = await fetchUserProfile(token);
      dispatch(setUserProfile(updatedProfile));

      // Dispatch success popup
      dispatch(
        setPopup({
          message: "Profile updated successfully!",
          type: "success",
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      dispatch(setError("Failed to update profile. Please try again."));

      // Dispatch error popup
      dispatch(
        setPopup({
          message: "Failed to update profile. Please try again.",
          type: "error",
        })
      );
    } finally {
      setLoadingState(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !profileData.interests.includes(tag._id) // Exclude already selected tags
  );

  const removeInterest = (interestToRemove) => {
    setProfileData((prevData) => ({
      ...prevData,
      interests: prevData.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    }));
  };

  return (
    <div className="complete-registration-container">
      <Header userProfile={userProfile} />
      <div className="complete-registration-main">
        <div className="complete-registration-content">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <h1>Complete Your Profile</h1>
          <div className="profile-photo-section">
            <div
              className={`profile-photo-dropzone ${dragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handlePhotoClick}
            >
              <img
                src={profilePicture}
                className="profile-photo"
                alt="Profile"
              />
            </div>
          </div>
          <form className="profile-form-modern">
            <div className="form-row">
              <div className="form-col">
                <label>Email</label>
                <input
                  type="text"
                  value={userProfile?.email || ""}
                  disabled
                  className="disabled-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Username</label>
                <input
                  type="text"
                  value={userProfile?.username || ""}
                  disabled
                  className="disabled-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileData.bio.gender}
                  onChange={handleBioChange}
                  className="text-input-modern"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-col">
                <label>Date of Birth</label>
                <div className="date-of-birth-container">
                  <input
                    type="date"
                    name="dob"
                    value={profileData.bio.dob}
                    onChange={handleBioChange}
                    className="text-input-modern date-input-modern"
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Alternate Email</label>
                <input
                  type="email"
                  name="alternateEmail"
                  value={profileData.bio.alternateEmail}
                  onChange={handleBioChange}
                  className="text-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={profileData.bio.degree}
                  onChange={handleBioChange}
                  className="text-input-modern"
                />
              </div>
              <div className="form-col">
                <label>Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={profileData.bio.batch}
                  onChange={handleBioChange}
                  className="text-input-modern"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label>Interests</label>
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search for subjects..."
                  onChange={handleSearchChange}
                  className="text-input-modern"
                />
                {
                  <ul className="tag-suggestion-list">
                    {searchTerm.length > 0 &&
                      filteredTags.map((tag) => (
                        <li
                          key={`suggest_${tag._id}`}
                          onClick={() => addInterest(tag)}
                          className="tag-suggestion-item"
                        >
                          {tag.name}
                        </li>
                      ))}
                  </ul>
                }
                <div className="selected-tags">
                  {profileData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="selected-tag"
                      onClick={() => removeInterest(interest)}
                    >
                      {
                        availableTags.filter((tag) => tag._id === interest)[0]
                          ?.name
                      }{" "}
                      <span className="remove-tag">×</span>{" "}
                      {/* Add close icon */}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-row">
              <button
                type="button"
                className="save-button-modern"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompleteRegistration;
