import { Calendar, User, ArrowRight } from "lucide-react";

const BlogCard = ({
  title,
  excerpt,
  author,
  date,
  category,
  image,
  readTime,
  featured = false,
}) => {
  return (
    <article className={`blog-card ${featured ? "blog-card-featured" : ""}`}>
      <div className="blog-card-image">
        <img
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=80`}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="blog-card-category">{category}</div>
      </div>

      <div className="blog-card-content">
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>

        <div className="blog-card-meta">
          <div className="blog-card-author">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="blog-card-date">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="blog-card-read-time">
            <span>{readTime} min read</span>
          </div>
        </div>

        <button className="blog-card-read-more">
          <span>Read more</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

export default BlogCard;
