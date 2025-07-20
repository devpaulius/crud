import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import LikesAverage from '../components/LikesAverage';

export default function Home() {

  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchPosts = () => {
    API.get('/posts', { params: { search } }).then(res => setPosts(res.data));
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const likePost = (id) => {
    API.post(`/posts/${id}/like`).then(fetchPosts);
  };

  const deletePost = (id) => {
    API.delete(`/posts/${id}`).then(fetchPosts);
  };

  return (
    <div>
      <h2>Posts</h2>
      <input 
        placeholder="Search..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
      />
      {user && (
        <div style={{ margin: '1em 0' }}>
          <button onClick={() => navigate('/new-post')}>Create New Post</button>
        </div>
      )}
      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ddd', padding: 10, margin: 10 }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>Likes: {post.likes}</p>
          <p>Category: {post.categoryName || 'None'}</p>
          <LikesAverage />
          {user && (
            <div>
              <button onClick={() => likePost(post.id)}>Like</button>
              {user.username === post.createdBy && (
                <>
                  <Link to={`/edit-post/${post.id}`}><button>Edit</button></Link>
                  <button onClick={() => deletePost(post.id)}>Delete</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}