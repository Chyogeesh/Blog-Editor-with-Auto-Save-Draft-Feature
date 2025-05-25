import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import api from '../utils/api';
import Notification from './Notification';

// Load ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const Editor = ({ blog }) => {
  const router = useRouter();
  const [title, setTitle] = useState(blog?.title || '');
  const [content, setContent] = useState(blog?.content || '');
  const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Auto-save after 5 seconds of inactivity
  useEffect(() => {
    const handleAutoSave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        saveDraft();
      }, 5000);
    };

    handleAutoSave();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, tags]);

  // Regular auto-save every 30 seconds
  useEffect(() => {
    saveTimeoutRef.current = setInterval(() => {
      saveDraft();
    }, 30000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current);
      }
    };
  }, []);

  const saveDraft = async () => {
    try {
      const response = await api.post('/blogs/save-draft', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        blogId: blog?._id
      });
      
      setNotification({ type: 'success', message: 'Draft auto-saved' });
      if (!blog?._id) {
        router.replace(`/edit/${response.data.blog._id}`);
      }
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  const publishBlog = async () => {
    try {
      await api.post('/blogs/publish', {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        blogId: blog?._id
      });
      
      setNotification({ type: 'success', message: 'Blog published successfully' });
      router.push('/');
    } catch (err) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Notification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog title"
        className="w-full text-3xl font-bold mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="mb-4">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Write your blog content here..."
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ]
          }}
          className="h-96 mb-12"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          onClick={saveDraft}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Save Draft
        </button>
        <button
          onClick={publishBlog}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Editor;
