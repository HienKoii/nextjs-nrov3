import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CAU_HINH } from "@/config/setting";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [memberPosts, setMemberPosts] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = CAU_HINH.sizePage;

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=${limit}`);
      setMemberPosts(response.data.posts);
      setPinnedPosts(response.data.pinnedPosts);

      setTotalPages(response.data.totalPages);

      console.log("Lấy bài viết", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageChange = (selectedPage) => {
    setPage(selectedPage);
  };

  const values = { loading, pinnedPosts, memberPosts, totalPages, page, handlePageChange, fetchPosts };
  return <PostsContext.Provider value={values}>{children}</PostsContext.Provider>;
};

export const usePosts = () => useContext(PostsContext);
