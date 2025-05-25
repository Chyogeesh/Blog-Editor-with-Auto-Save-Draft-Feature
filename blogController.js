const Blog = require('../models/Blog');

exports.saveDraft = async (req, res) => {
  try {
    const { title, content, tags, blogId } = req.body;
    
    let blog;
    if (blogId) {
      // Update existing draft
      blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: req.user.id, status: 'draft' },
        { title, content, tags, updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new draft
      blog = new Blog({
        title,
        content,
        tags,
        status: 'draft',
        author: req.user.id
      });
      await blog.save();
    }
    
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.publishBlog = async (req, res) => {
  try {
    const { title, content, tags, blogId } = req.body;
    
    let blog;
    if (blogId) {
      // Update existing blog (draft or published)
      blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: req.user.id },
        { title, content, tags, status: 'published', updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new published blog
      blog = new Blog({
        title,
        content,
        tags,
        status: 'published',
        author: req.user.id
      });
      await blog.save();
    }
    
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { author: req.user.id };
    if (status) filter.status = status;
    
    const blogs = await Blog.find(filter).sort({ updatedAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      _id: req.params.id, 
      author: req.user.id 
    });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
