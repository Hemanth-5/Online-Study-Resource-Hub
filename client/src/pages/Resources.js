import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { browseResources, fetchAllTags } from "../api/apiServices";
import { useSelector } from "react-redux";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { useNavigate } from "react-router-dom";
import "./Resources.css";
import Header from "../components/Header";
import { FaSignature } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUserProfile, setOpenUserProfile] = useState(false);

  const token = localStorage.getItem("accessToken");
  const canvasRefs = useRef([]);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const userProfile = useSelector((state) => state.user.profile);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await fetchAllTags(token);
        setTags(tagsData);
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };
    loadTags();
  }, [token]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await browseResources(token, { accessLevel: "public" });
        // console.log({ data });
        setResources(data);
        setFilteredResources(data);
        setLoading(false);
        data.forEach((resource, index) => {
          if (resource.fileUrl.endsWith(".pdf")) {
            renderPDF(resource.fileUrl, index);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load resources.");
        setLoading(false);
      }
    };
    fetchResources();
  }, [token]);

  useEffect(() => {
    const filterResourcesLocally = () => {
      let updatedResources = resources;

      if (query) {
        updatedResources = updatedResources.filter((resource) =>
          resource.fileName.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (selectedTags.length > 0) {
        updatedResources = updatedResources.filter(
          (resource) =>
            selectedTags.some((tagId) => resource.tags.includes(tagId)) // Check if any selected tag is in resource.tags
        );
      }

      setFilteredResources(updatedResources);
    };

    filterResourcesLocally();
  }, [query, selectedTags, resources]);

  const renderPDF = async (fileUrl, index) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRefs.current[index];
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      console.log("Page rendered");
    } catch (reason) {
      console.error("Error rendering PDF:", reason);
    }
  };

  const handleTagToggle = (tag) => {
    console.log("Tag clicked:", tag);
    setSelectedTags(
      (prevSelected) =>
        prevSelected.includes(tag._id) // Check against tag._id
          ? prevSelected.filter((selectedTag) => selectedTag !== tag._id)
          : [...prevSelected, tag._id] // Add tag._id to the array
    );
  };

  const renderPillTags = () => (
    <div className="selected-tags">
      {selectedTags.map((tagId) => {
        const tag = tags.find((t) => t._id === tagId);
        return (
          tag && (
            <div
              key={tag._id}
              className="tag-pill"
              onClick={() => handleTagToggle(tag)}
            >
              {tag.name} &times;
            </div>
          )
        );
      })}
    </div>
  );

  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Navigate back to the dashboard
  };

  if (loading) return <div>Loading resources...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="resources-container">
      <Header userProfile={userProfile} />

      {/* <div className="back-button" onClick={handleBackToDashboard}>
        <FaArrowLeft />
      </div> */}

      <div className="resources-main">
        <Navbar />
        <div className="resources-content">
          <h2>Browse Resources</h2>

          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search by keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-bar"
            />

            <div className="tags-container">
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  className={`tag ${
                    selectedTags.includes(tag._id) ? "selected" : ""
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>

          {renderPillTags()}

          <div className="resources-view grid">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, index) => (
                <Link
                  key={resource._id}
                  className="resource-card"
                  to={`/resource/${resource._id}`}
                >
                  <div className="resource-thumbnail">
                    {resource.fileUrl.endsWith(".pdf") ? (
                      <canvas
                        ref={(el) => (canvasRefs.current[index] = el)}
                      ></canvas>
                    ) : (
                      <img src={resource.fileUrl} alt={resource.fileName} />
                    )}
                  </div>
                  <div className="resource-details">
                    <h4>{resource.fileName}</h4>
                    <p>
                      {resource.description == "" ? " " : resource.description}
                    </p>
                  </div>
                  {resource.uploadedBy && (
                    <Link
                      className="uploader-info"
                      onMouseEnter={() => setOpenUserProfile(true)}
                      onMouseLeave={() => setOpenUserProfile(false)}
                      to={`/profile/${resource.uploadedBy._id}`}
                    >
                      <FaSignature />
                      {resource.uploadedBy.name}{" "}
                      <img src={resource.uploadedBy.profilePicture} />
                    </Link>
                  )}
                </Link>
              ))
            ) : (
              <div>No resources found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
