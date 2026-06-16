import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import InnerBanner from '../Components/InnerBanner';
import API from '../api';
import { getImageUrl } from '../config';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs');
        setBlogs(res.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading blogs...</div>;
  }

  return (
    <>
      <Helmet><title>Blogs | Jewelery For All Occasions</title></Helmet>
      <InnerBanner InnerBannerText="Our Blogs" />

      <section className="blogs-list-sec">
        <div className="container">
          <div className="blogs-grid">
            {blogs.length > 0 ? (
              blogs.map((item) => {
                return (
                  <div className="blog-card" key={item.id}>
                    <div className="blog-card-image">
                      <Link to={`/blog/${item.slug}`}>
                        <img src={getImageUrl(item.image)} alt={item.title} />
                      </Link>
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-meta">
                        <span><i className="fa fa-calendar"></i> {new Date(item.created_at).toLocaleDateString()}</span>
                        <span><i className="fa fa-user"></i> Admin</span>
                      </div>
                      <Link to={`/blog/${item.slug}`} style={{ textDecoration: 'none' }}>
                        <h3>{item.title}</h3>
                      </Link>
                      <p>
                        {item.excerpt 
                          ? item.excerpt 
                          : item.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...'}
                      </p>
                      <Link to={`/blog/${item.slug}`} className="read-more-btn">
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                <h3>No blog posts found.</h3>
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .blogs-list-sec { padding: 80px 0; background: #fff; }
        .blogs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        @media (max-width: 992px) { .blogs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .blogs-grid { grid-template-columns: 1fr; } }
        
        .blog-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: 0.3s; height: 100%; display: flex; flex-direction: column; }
        .blog-card:hover { transform: translateY(-10px); }
        .blog-card-image { height: 250px; overflow: hidden; }
        .blog-card-image img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .blog-card:hover .blog-card-image img { transform: scale(1.1); }
        .blog-card-content { padding: 25px; flex: 1; display: flex; flex-direction: column; }
        .blog-meta { display: flex; gap: 15px; font-size: 0.85rem; color: #888; margin-bottom: 15px; }
        .blog-card-content h3 { font-size: 1.4rem; margin-bottom: 15px; font-family: var(--heading-font); color: #140b07; line-height: 1.4; }
        .blog-card-content p { color: #666; line-height: 1.6; margin-bottom: 20px; font-size: 0.95rem; }
        .read-more-btn { margin-top: auto; color: #140b07; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
        .read-more-btn::after { content: '→'; transition: 0.2s; }
        .read-more-btn:hover::after { transform: translateX(5px); }
      `}</style>
    </>
  );
}

export default Blogs;
