import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchResourceDetails,
  fetchCommentsForResource,
  addCommentToResource,
  replyToComment,
  fetchAllTags,
} from "../api/apiServices";
import * as pdfjsLib from "pdfjs-dist/webpack";
import {
  FaHeart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaReply, // Add reply icon
} from "react-icons/fa";
import renderPDF from "../utils/renderPDF";
import { Link } from "react-router-dom";
import "./ViewResource.css";

const ViewResource = () => {
  const location = useLocation();
  const resourceId = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [replyVisible, setReplyVisible] = useState({}); // State to manage visibility of reply fields
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef(null);
  const token = localStorage.getItem("accessToken");

  // Fetch Resource Details and Comments
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await fetchResourceDetails(token, resourceId);
        console.log({ data });
        setResource(data);

        if (data.fileUrl.endsWith(".pdf")) {
          const pages = await getTotalPages(data.fileUrl);
          setTotalPages(pages);
          setPageNumber(1); // Initial page number
        }

        const resourceComments = await fetchCommentsForResource(
          token,
          resourceId
        );

        console.log({ resourceComments });

        // console.log({ resourceComments });

        const allTags = await fetchAllTags(token);
        setTags(allTags);
        setComments(resourceComments);
        setLoading(false);
      } catch (err) {
        console.error(err);
        // setError("Failed to load resource details.");
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId, token]);

  // Render PDF when page number or resource file changes
  useEffect(() => {
    if (resource && resource?.fileUrl.endsWith(".pdf")) {
      renderPDF(resource?.fileUrl, pageNumber);
    }
  }, [resource, pageNumber]);

  const getTotalPages = async (fileUrl) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  };

  const renderPDF = async (fileUrl, pageNum) => {
    const loadingTask = pdfjsLib.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNum);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (reason) {
      console.error("Error rendering PDF:", reason);
      // setError("Failed to render PDF preview.");
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment) {
      try {
        await addCommentToResource(token, resourceId, newComment);
        setComments([
          ...comments,
          { text: newComment, user: "currentUser", replies: [] },
        ]);
        setNewComment("");
      } catch (err) {
        console.error(err);
        // setError("Failed to add comment.");
      }
    }
  };

  // Handle Reply Submission
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (newReply[commentId]) {
      try {
        console.log({ replyText: newReply[commentId] });
        await replyToComment(token, commentId, newReply[commentId]);
        const updatedComments = [...comments];
        updatedComments[commentId].replies.push({
          text: newReply[commentId],
          user: "currentUser",
        });
        setComments(updatedComments);
        setNewReply({ ...newReply, [commentId]: "" });
        setReplyVisible({ ...replyVisible, [commentId]: false }); // Hide reply field after submitting
      } catch (err) {
        console.error(err);
        // setError("Failed to add reply.");
      }
    }
  };

  const handleLike = () => {
    // Handle the like functionality here
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const toggleReplyVisibility = (commentId) => {
    setReplyVisible((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // Toggle visibility
    }));
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="view-resource-container">
      <div className="back-button" onClick={() => navigate(-1)} title="Go Back">
        <FaArrowLeft />
      </div>

      <div className="resource-details">
        <h2 className="resource-title">{resource?.fileName}</h2>
        <p className="resource-description">{resource?.description}</p>

        {resource?.fileUrl.endsWith(".pdf") ? (
          <div className="pdf-preview-canvas">
            <canvas ref={canvasRef}></canvas>
            <div className="pagination-controls">
              <FaChevronLeft
                onClick={handlePreviousPage}
                className={`pagination-arrow ${
                  pageNumber === 1 ? "disabled" : ""
                }`}
                title="Previous Page"
              />
              <span className="page-info">
                {pageNumber} / {totalPages}
              </span>
              <FaChevronRight
                onClick={handleNextPage}
                className={`pagination-arrow ${
                  pageNumber === totalPages ? "disabled" : ""
                }`}
                title="Next Page"
              />
            </div>
            <div
              className="open-in-new-tab"
              onClick={() => window.open(resource?.fileUrl, "_blank")}
            >
              Open in New Tab
            </div>
          </div>
        ) : (
          <div className="image-preview">
            <img src={resource?.fileUrl} alt={resource?.fileName} />
          </div>
        )}

        <div className="resource-tags">
          <h3>Tags:</h3>
          <div className="tags-container">
            {resource?.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tags.find((t) => t._id === tag)?.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments:</h3>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comment-content">
                <Link to={`/profile/${comment?.user._id}`}>
                  <strong className="comment-user">
                    <img
                      src={comment?.user.profilePicture}
                      width="50px"
                      height="50px"
                    />
                    {comment?.user.name}
                  </strong>
                </Link>
                <span className="comment-text">{comment?.text}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <FaReply
                  onClick={() => toggleReplyVisibility(comment._id)} // Toggle reply visibility
                  className="reply-icon"
                  title="Reply"
                />
                <ul className="replies-list">
                  {comment.replies.map((reply, replyIndex) => (
                    <li key={replyIndex} className="reply-item">
                      <Link to={`/profile/${reply?.user._id}`}>
                        <strong className="reply-user">
                          <img
                            src={reply?.user.profilePicture}
                            width="50px"
                            height="50px"
                          />
                          {reply?.user.name}
                        </strong>
                      </Link>
                      <span className="reply-text">{reply?.text}</span>
                    </li>
                  ))}
                </ul>
                {replyVisible[comment._id] && ( // Only show reply field if visible
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment._id)}
                    className="reply-form"
                  >
                    <textarea
                      value={newReply[comment._id] || ""}
                      onChange={(e) =>
                        setNewReply({
                          ...newReply,
                          [comment._id]: e.target.value,
                        })
                      }
                      placeholder="Add a reply..."
                      required
                      className="reply-textarea"
                    />
                    <button type="submit" className="reply-submit-button">
                      Reply
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className="comment-textarea"
          />
          <button type="submit" className="comment-submit-button">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewResource;
