import { BookOpen, TrendingUp } from "lucide-react";

const BlogSidebar = () => {
  const categories = [
    "Professional Translation",
    "Translation and Interpretation Skills",
    "Language Technology",
    "International Culture",
    "Practical Experience",
    "Career Guide",
  ];

  const trendingPosts = [
    {
      title: "10 Essential Skills for Modern Translators and Interpreters",
      views: "2.5K views",
    },
    {
      title: "How to Build an Impressive Portfolio in Translation",
      views: "1.8K views",
    },
    {
      title: "AI Technology and the Future of Translation",
      views: "1.2K views",
    },
  ];

  return (
    <aside className="blog-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <BookOpen className="w-5 h-5" />
          <h3>Categories</h3>
        </div>
        <ul className="sidebar-categories">
          {categories.map((category, index) => (
            <li key={index} className="sidebar-category-item">
              <a href="#" className="sidebar-category-link">
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">
          <TrendingUp className="w-5 h-5" />
          <h3>Trending Posts</h3>
        </div>
        <div className="trending-posts">
          {trendingPosts.map((post, index) => (
            <div key={index} className="trending-post">
              <h4 className="trending-post-title">{post.title}</h4>
              <p className="trending-post-views">{post.views}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="newsletter-signup">
          <h3>Subscribe to Newsletter</h3>
          <p>Get the latest articles on translation and linguistics</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email"
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
