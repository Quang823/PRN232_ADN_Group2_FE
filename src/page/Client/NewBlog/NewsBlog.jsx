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

            <form
              onSubmit={handleSubmit}
              style={{
                marginBottom: 32,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h3 style={{ marginBottom: 12 }}>Post a new blog</h3>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                style={{
                  width: "100%",
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Content"
                rows={3}
                style={{
                  width: "100%",
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                }}
              />
              {error && (
                <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
              )}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "8px 18px",
                  borderRadius: 6,
                  background: "#8b5cf6",
                  color: "#fff",
                  border: "none",
                }}
              >
                {submitting ? "Posting..." : "Post Blog"}
              </button>
            </form>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="blog-grid">
                {blogs.map(mapBlogToCard).map((post, index) => (
                  <BlogCard key={index} {...post} />
                ))}
              </div>
            )}

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
