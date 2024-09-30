import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { browseResources, fetchAllTags } from "../api/apiServices";
import { useSelector } from "react-redux";
import { FaSignature, FaFilter } from "react-icons/fa"; // Add FaFilter for the filter button
import { useNavigate } from "react-router-dom";
import renderPDF from "../utils/renderPDF";
import "./Resources.css";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import TagPopup from "../components/TagPopup";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // New state to toggle filters

  const token = localStorage.getItem("accessToken");
  const canvasRefs = useRef([]);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const userProfile = useSelector((state) => state.user.profile);
  const [tagsByType, setTagsByType] = useState({});
  const [popupStyle, setPopupStyle] = useState({ display: "none" }); // State for popup style
  const filterButtonRef = useRef(null);

  const handleShowFilters = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setPopupStyle({
        display: "block",
        position: "absolute",
        // Position to place the end of the popup at the bottom left of the button

        // top: `${rect.bottom + 10}px`, // Position below the button
        // left: `${rect.left - 10}px`, // Align left with the button
        // zIndex: 1000, // Ensure it overlays on other elements

        // Position to place the end of the popup at the top right of the button
        top: `${rect.bottom + 10}px`, // Position above the button
        left: `${rect.left - 275}px`, // Align right with the button
        zIndex: 1000, // Ensure it overlays on other elements
      });
    }
    setShowFilters((prev) => !prev);
  };

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
        setResources(data);
        setFilteredResources(data);
        setLoading(false);
        data.forEach((resource, index) => {
          if (resource.fileUrl.endsWith(".pdf")) {
            fetchPDFPages(resource.fileUrl, index);
          }
        });
      } catch (err) {
        console.error(err);
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
        updatedResources = updatedResources.filter((resource) =>
          selectedTags.some((tagId) => resource.tags.includes(tagId))
        );
      }

      setFilteredResources(updatedResources);
    };

    filterResourcesLocally();
  }, [query, selectedTags, resources]);

  const fetchPDFPages = async (fileUrl, index) => {
    try {
      await renderPDF(fileUrl, canvasRefs, index, 1);
    } catch (error) {
      console.error("Error rendering PDF:", error);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prevSelected) =>
      prevSelected.includes(tag._id)
        ? prevSelected.filter((selectedTag) => selectedTag !== tag._id)
        : [...prevSelected, tag._id]
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

  useEffect(() => {
    // Organize tags by type
    const categorizedTags = {};
    tags.forEach((tag) => {
      if (!categorizedTags[tag.type]) {
        categorizedTags[tag.type] = [];
      }
      categorizedTags[tag.type].push(tag);
    });
    setTagsByType(categorizedTags);
  }, [tags]);

  if (error) return <div>{error}</div>;

  return (
    <div className="resources-container">
      <Header userProfile={userProfile} />
      <div className="resources-main">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
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
            <button
              className="filter-button"
              ref={filterButtonRef} // Attach the ref to the button
              onClick={handleShowFilters} // Update click handler
            >
              <FaFilter /> Show Filters
            </button>
          </div>

          {/* Conditional rendering of filters */}
          {showFilters && (
            <TagPopup
              tags={Object.values(tagsByType).flat()} // Flatten the tags for rendering
              onTagToggle={handleTagToggle}
              selectedTags={selectedTags}
              style={popupStyle} // Pass the style prop
            />
          )}

          {renderPillTags()}

          <div className="resources-view grid">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource, index) => (
                <Link
                  key={resource._id}
                  className="resource-card"
                  to={`/resources/view/${resource._id}`}
                >
                  <div className="resource-thumbnail">
                    {resource.fileUrl.endsWith(".pdf") ? (
                      <canvas
                        style={{
                          width: "-webkit-fill-available",
                          height: "auto",
                        }}
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
