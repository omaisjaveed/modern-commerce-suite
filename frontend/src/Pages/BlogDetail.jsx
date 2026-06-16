import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faComment, faSearch } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InnerBanner from '../Components/InnerBanner';
import API from '../api';
import { getImageUrl } from '../config';

gsap.registerPlugin(ScrollTrigger);

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const [blogRes, recentRes] = await Promise.all([
          API.get(`/blogs/${slug}`),
          API.get('/blogs')
        ]);
        setBlog(blogRes.data);
        setRecentBlogs(recentRes.data.filter(b => b.slug !== slug).slice(0, 5));
      } catch (error) {
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    const timer = setTimeout(() => {
      if (contentRef.current) gsap.from(contentRef.current, { duration: 0.8, y: 40, opacity: 0, ease: "power2.out" });
      if (sidebarRef.current) gsap.from(sidebarRef.current, { duration: 0.8, x: 30, opacity: 0, ease: "back.out(0.4)", delay: 0.2 });
    }, 100);
    return () => clearTimeout(timer);
  }, [blog]);

  const filteredBlogs = recentBlogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading blog post...</div>;
  }

  if (!blog) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Blog Post Not Found</h2>
        <p>The blog post you are looking for does not exist.</p>
        <Link to="/" style={{ background: '#000', color: '#fff', padding: '12px 30px', textDecoration: 'none', borderRadius: '40px', display: 'inline-block', marginTop: '20px' }}>Back to Home</Link>
      </div>
    );
  }

  const blogImage = getImageUrl(blog.image);

  return (
    <>
      <Helmet><title>{blog.title} | Jewelery Blog</title></Helmet>
      <InnerBanner InnerBannerText={blog.title} />

      <section className="blog-detail-sec">
        <div className="container">
          <div className="blog-detail-grid">
            <div className="blog-main-content" ref={contentRef}>
              <div className="blog-header">
                <h1>{blog.title}</h1>
                <div className="blog-meta-header">
                  <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                  <span><FontAwesomeIcon icon={faComment} /> 0 Comments</span>
                  <span>By {blog.first_name} {blog.last_name}</span>
                </div>
              </div>
              <div className="blog-featured-image">
                <img src={blogImage} alt={blog.title} />
              </div>
              <div className="blog-full-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
              
              <div className="blog-comments-section">
                <h3>Leave a Comment</h3>
                <form className="comment-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-row">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                  </div>
                  <textarea rows="5" placeholder="Your Comment"></textarea>
                  <button type="submit">Post Comment</button>
                </form>
              </div>
            </div>

            <div className="blog-sidebar" ref={sidebarRef}>
              <div className="sidebar-widget search-widget">
                <h3>Search</h3>
                <div className="search-box">
                  <input type="text" placeholder="Search blogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <button><FontAwesomeIcon icon={faSearch} /></button>
                </div>
              </div>

              <div className="sidebar-widget recent-widget">
                <h3>Recent Posts</h3>
                <ul className="recent-blog-list">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blogItem => (
                      <li key={blogItem.id}>
                        <Link to={`/blog/${blogItem.slug}`}>
                          <div className="recent-img">
                            <img src={getImageUrl(blogItem.image)} alt={blogItem.title} />
                          </div>
                          <div className="recent-info"><h4>{blogItem.title}</h4><span>{new Date(blogItem.created_at).toLocaleDateString()}</span></div>
                        </Link>
                      </li>
                    ))
                  ) : <p>No other blogs found</p>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .blog-detail-sec { padding: 60px 0; background: #fff; }
        .blog-detail-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 50px; }
        @media (max-width: 992px) { .blog-detail-grid { grid-template-columns: 1fr; gap: 40px; } }
        .blog-header h1 { font-size: 2.2rem; margin-bottom: 15px; font-family: var(--heading-font); }
        .blog-meta-header { display: flex; gap: 20px; flex-wrap: wrap; color: #666; font-size: 0.9rem; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .blog-featured-image { border-radius: 20px; overflow: hidden; margin-bottom: 30px; }
        .blog-featured-image img { width: 100%; display: block; }
        .blog-full-content { line-height: 1.8; color: #333; }
        .blog-full-content p { margin-bottom: 20px; }
        .blog-full-content h2, .blog-full-content h3, .blog-full-content h4 { margin: 30px 0 15px; font-family: var(--heading-font); }
        .blog-full-content img { max-width: 100%; height: auto; border-radius: 15px; margin: 20px 0; }
        .blog-full-content ul, .blog-full-content ol { margin-bottom: 20px; padding-left: 20px; }
        .blog-full-content li { margin-bottom: 10px; }
        .blog-full-content blockquote { border-left: 4px solid #140b07; padding-left: 20px; font-style: italic; margin: 30px 0; color: #555; }
        .blog-comments-section { margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; }
        .comment-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .comment-form input, .comment-form textarea { width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 12px; }
        .comment-form button { background: #140b07; color: #fff; border: none; padding: 12px 30px; border-radius: 40px; cursor: pointer; margin-top: 10px; }
        .sidebar-widget { background: #fcf9f5; padding: 25px; border-radius: 20px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.05); }
        .sidebar-widget h3 { font-size: 1.3rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #140b07; display: inline-block; font-family: var(--heading-font); }
        .search-box { display: flex; gap: 10px; }
        .search-box input { flex: 1; padding: 12px 15px; border: 1px solid #ddd; border-radius: 40px; }
        .search-box button { background: #140b07; color: #fff; border: none; width: 48px; border-radius: 50%; cursor: pointer; }
        .recent-blog-list { list-style: none; padding: 0; }
        .recent-blog-list li { margin-bottom: 20px; }
        .recent-blog-list li a { display: flex; gap: 15px; text-decoration: none; color: #000; transition: 0.2s; }
        .recent-blog-list li a:hover { transform: translateX(5px); }
        .recent-img { width: 70px; height: 70px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
        .recent-img img { width: 100%; height: 100%; object-fit: cover; }
        .recent-info h4 { font-size: 0.95rem; margin-bottom: 5px; font-weight: 600; line-height: 1.4; }
        .recent-info span { font-size: 0.8rem; color: #888; }
      `}</style>
    </>
  );
}

export default BlogDetail;