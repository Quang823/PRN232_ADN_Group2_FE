import NewsHero from "./NewsHero";
import BlogCard from "./BlogCard";
import BlogSidebar from "./BlogSidebar";
import "./NewsBlog.scss";
import { useEffect, useState } from "react";
import { fetchBlogs, createBlog } from "../../../service/blogService";
import useAuth from "../../../hook/useAuth";

const BLOG_IMAGES = [
  "photo-1434494878577-86c23bcb06b9",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1486312338219-ce68d2c6f44d",
  "photo-1461749280684-dccba630e2f6",
  "photo-1581091226825-a6a2a5aee158",
  "photo-1506744038136-46273834b3fb",
];

const NewsBlog = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs()
      .then((data) => {
        setBlogs(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!form.title || !form.content) {
        setError("Please fill all fields");
        setSubmitting(false);
        return;
      }
      if (!user || !user.id) {
        setError("You must be logged in to post a blog");
        setSubmitting(false);
        return;
      }
      // Log dữ liệu trước khi gọi API
      console.log("Blog data gửi lên:", { ...form, userId: user.id });
      await createBlog({ ...form, userId: user.id });
      const data = await fetchBlogs();
      setBlogs(Array.isArray(data) ? data.reverse() : []);
      setForm({ title: "", content: "" });
    } catch (err) {
      setError("Failed to post blog");
    }
    setSubmitting(false);
  };

  // BlogCard expects: title, excerpt, author, date, category, image, readTime, featured
  const mapBlogToCard = (blog, idx) => ({
    title: blog.title,
    excerpt: blog.content,
    author: blog.userId,
    date: blog.publishedDate
      ? new Date(blog.publishedDate).toLocaleDateString()
      : "",
    category: "Blog",
    image: BLOG_IMAGES[idx % BLOG_IMAGES.length],
    readTime: Math.max(2, Math.round((blog.content?.length || 100) / 500)),
    featured: false,
  });

  return (
    <div className="news-blog">
      <NewsHero />
      <div className="animated-background">
        <div className="dna-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="dna-helix-bg">
          <div className="helix-strand strand-1"></div>
          <div className="helix-strand strand-2"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="blog-layout">
          <main className="blog-main">
            <div className="blog-header">
              <h2>
                <span className="header-part1">Latest</span>
                <span className="header-part2">Articles</span>
              </h2>
              <p>
                Stay updated with the latest knowledge and experiences in the
                translation field
              </p>
            </div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="blog-grid">
                {blogs.map(mapBlogToCard).map((post, index) => (
                  <BlogCard key={index} {...post} />
                ))}
              </div>
            )}

            {/* Form tạo blog đẹp, đặt dưới danh sách blog */}
            <form
              onSubmit={handleSubmit}
              className="create-blog-form"
              style={{
                margin: "48px auto 0",
                maxWidth: 600,
                background: "rgba(255,255,255,0.10)",
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(139,92,246,0.13)",
                padding: 32,
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <h3
                style={{
                  marginBottom: 8,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#8b5cf6",
                  textAlign: "center",
                }}
              >
                Post a new blog
              </h3>
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title..."
                style={{
                  width: "100%",
                  marginBottom: 8,
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: "1.5px solid #8b5cf6",
                  fontSize: 16,
                  background: "rgba(255,255,255,0.18)",
                  color: "#23234a",
                  outline: "none",
                }}
              />
              <label style={{ fontWeight: 500, marginBottom: 4 }}>
                Content
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog content..."
                rows={5}
                style={{
                  width: "100%",
                  marginBottom: 8,
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: "1.5px solid #8b5cf6",
                  fontSize: 16,
                  background: "rgba(255,255,255,0.18)",
                  color: "#23234a",
                  outline: "none",
                  resize: "vertical",
                }}
              />
              {error && (
                <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
              )}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 0",
                  borderRadius: 8,
                  background: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: "0 2px 8px rgba(139,92,246,0.13)",
                  cursor: submitting ? "not-allowed" : "pointer",
                  marginTop: 8,
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Posting..." : "Post Blog"}
              </button>
            </form>

            <div className="blog-pagination">
              <button className="pagination-btn pagination-prev" disabled>
                Previous Page
              </button>
              <div className="pagination-numbers">
                <button className="pagination-number active">1</button>
                <button className="pagination-number">2</button>
                <button className="pagination-number">3</button>
                <span className="pagination-dots">...</span>
                <button className="pagination-number">12</button>
              </div>
              <button className="pagination-btn pagination-next">
                Next Page
              </button>
            </div>
          </main>

          <BlogSidebar />
        </div>
      </div>
    </div>
  );
};

export default NewsBlog;
