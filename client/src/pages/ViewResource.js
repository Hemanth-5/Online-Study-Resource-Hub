import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  fetchResourceDetails,
  fetchCommentsForResource,
  addCommentToResource,
  replyToComment,
  fetchAllTags,
  likeResource,
} from "../api/apiServices";
import * as pdfjsLib from "pdfjs-dist/webpack";
import {
  FaHeart,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaReply,
} from "react-icons/fa";
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
  const [replyVisible, setReplyVisible] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef(null);
  const userProfile = useSelector((state) => state.user.profile);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await fetchResourceDetails(token, resourceId);
        setResource(data);

        if (data.fileUrl.endsWith(".pdf")) {
          const pages = await getTotalPages(data.fileUrl);
          setTotalPages(pages);
          setPageNumber(1);
        }

        const resourceComments = await fetchCommentsForResource(
          token,
          resourceId
        );
        setComments(resourceComments);

        const allTags = await fetchAllTags(token);
        setTags(allTags);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId, token]);

  // Refresh comments everytime comments get changed
  useEffect(() => {
    const fetchComments = async () =>
      setComments(await fetchCommentsForResource(token, resourceId));
    fetchComments();
  }, [comments]);

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
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment) {
      try {
        // Add the comment to the server and get the created comment response
        const createdComment = await addCommentToResource(
          token,
          resourceId,
          newComment
        );
        // Update the comments state with the newly added comment
        setComments((prevComments) => [...prevComments, createdComment]);
        setNewComment("");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Handle Reply Submission
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (newReply[commentId]) {
      try {
        // Add the reply to the server and get the created reply response
        const createdReply = await replyToComment(
          token,
          commentId,
          newReply[commentId]
        );

        // Update the replies array for the specific comment in the comments state
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, replies: [...comment.replies, createdReply] }
              : comment
          )
        );

        setNewReply({ ...newReply, [commentId]: "" });
        setReplyVisible({ ...replyVisible, [commentId]: false });
      } catch (err) {
        console.error(err);
      }
    }
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
      [commentId]: !prevState[commentId],
    }));
  };

  const handleLike = async () => {
    await likeResource(token, resource._id);
    setResource((prevResource) => ({
      ...prevResource,
      likes: prevResource.likes.includes(userProfile._id)
        ? prevResource.likes.filter((id) => id !== userProfile._id)
        : [...prevResource.likes, userProfile._id],
    }));
  };

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
            <FaChevronLeft
              onClick={handlePreviousPage}
              className={`pagination-arrow ${
                pageNumber === 1 ? "disabled" : ""
              }`}
              title="Previous Page"
            />
            <canvas ref={canvasRef}></canvas>
            <FaChevronRight
              onClick={handleNextPage}
              className={`pagination-arrow ${
                pageNumber === totalPages ? "disabled" : ""
              }`}
              title="Next Page"
            />
          </div>
        ) : (
          <div className="image-preview">
            <img src={resource?.fileUrl} alt={resource?.fileName} />
          </div>
        )}
        <div className="pagination-controls">
          <span className="page-info">
            {pageNumber} / {totalPages}
          </span>
        </div>
        <div
          className="open-in-new-tab"
          onClick={() => window.open(resource?.fileUrl, "_blank")}
        >
          Open in New Tab
        </div>

        <div className="resource-bottom">
          <div className="resource-tags">
            <h3>Tags</h3>
            <div className="tags-container">
              {resource?.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tags.find((t) => t._id === tag)?.name}
                </span>
              ))}
            </div>
          </div>

          <div className="like-options">
            <FaHeart
              className={`like-icon ${
                resource?.likes?.includes(userProfile._id) ? "liked" : ""
              }`}
              title="Like"
              onClick={handleLike}
            />
            <strong>
              {resource?.likes?.length < 2
                ? `${resource?.likes?.length} like`
                : `${resource?.likes?.length} likes`}
            </strong>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments:</h3>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment?._id} className="comment-item">
              <div className="comment-content">
                <Link to={`/profile/${comment?.user?._id}`}>
                  <strong className="comment-user">
                    <img
                      src={comment?.user?.profilePicture}
                      width="50px"
                      height="50px"
                    />
                    {comment?.user?.name}
                  </strong>
                </Link>
                <span className="comment-text">{comment?.text}</span>
                <span className="comment-date">
                  {new Date(comment?.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <FaReply
                  onClick={() => toggleReplyVisibility(comment?._id)} // Toggle reply visibility
                  className="reply-icon"
                  title="Reply"
                />
                <ul className="replies-list">
                  {comment?.replies?.map((reply, replyIndex) => (
                    <li key={replyIndex} className="reply-item">
                      <Link to={`/profile/${reply?.user?._id}`}>
                        <strong className="reply-user">
                          <img
                            src={reply?.user?.profilePicture}
                            width="50px"
                            height="50px"
                          />
                          {reply?.user?.name}
                        </strong>
                      </Link>
                      <span className="reply-text">{reply?.text}</span>
                      <span className="comment-date">
                        {new Date(reply?.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
                {replyVisible[comment?._id] && ( // Only show reply field if visible
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment?._id)}
                    className="reply-form"
                  >
                    <textarea
                      value={newReply[comment?._id] || ""}
                      onChange={(e) =>
                        setNewReply({
                          ...newReply,
                          [comment?._id]: e.target.value,
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
