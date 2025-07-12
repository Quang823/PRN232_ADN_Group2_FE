import { Globe } from "lucide-react";

const NewsHero = () => {
  return (
    <section className="news-blog-hero">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="news-blog-hero-icon">
              <Globe className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="news-blog-hero-title animate-fade-in">
            Connect News & Insights
          </h1>
          <p className="news-blog-hero-subtitle animate-fade-in-delay">
            A platform connecting professional translators and interpreters with
            users. Share knowledge, experience, and inspiring stories.
          </p>
          <div className="news-blog-hero-stats flex justify-center gap-8 mt-12 animate-scale-up">
            <div className="news-blog-stat-item text-center">
              <span className="news-blog-stat-number">1,200+</span>
              <span className="news-blog-stat-label">Articles</span>
            </div>
            <div className="news-blog-stat-item text-center">
              <span className="news-blog-stat-number">500+</span>
              <span className="news-blog-stat-label">Authors</span>
            </div>
            <div className="news-blog-stat-item text-center">
              <span className="news-blog-stat-number">50K+</span>
              <span className="news-blog-stat-label">Readers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsHero;
