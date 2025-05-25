import Link from 'next/link';
import api from '../utils/api';
import { useState, useEffect } from 'react';

const BlogList = ({ status }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get(`/blogs?status=${status}`);
        setBlogs(response.data.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [status]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">
        {status === 'draft' ? 'Drafts' : 'Published Blogs'}
      </h2>
      
      {blogs.length === 0 ? (
        <p className="text-gray-500">No {status} blogs found</p>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog._id} className="border p-4 rounded-lg hover:bg-gray-50">
              <Link href={`/edit/${blog._id}`}>
                <a className="block">
                  <h3 className="text-xl font-semibold">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Last updated: {new Date(blog.updatedAt).toLocaleString()}
                  </p>
                  {blog.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {blog.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
