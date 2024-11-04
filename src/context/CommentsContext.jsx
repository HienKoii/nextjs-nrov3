import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Placeholder } from "react-bootstrap";

const CommentsContext = createContext();

export const CommentsProvider = ({ postId, children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  const fetchComments = async (selectedPage = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/comments?page=${page}&limit=${limit}&postId=${postId}`);
      console.log("Lấy bình luận: ", response.data);
      setComments(response.data.comments);
      setTotalPages(response.data.totalPages);
      setPage(selectedPage);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    fetchComments(newPage);
  };

  if (loading) {
    const virtualArray = Array.from({ length: 3 });
    return (
      <div>
        {virtualArray.map((_, index) => (
          <Placeholder as={ListGroup} animation="glow" key={index} className={"mb-2"}>
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "94px" }} />
          </Placeholder>
        ))}
      </div>
    );
  }

  const values = { loading, fetchComments, comments, handlePageChange, page, totalPages };

  return <CommentsContext.Provider value={values}>{children}</CommentsContext.Provider>;
};

export const useComments = () => useContext(CommentsContext);
