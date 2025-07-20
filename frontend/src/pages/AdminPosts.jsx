import { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => API.get('/posts').then(res => setPosts(res.data));

  useEffect(() => { fetchPosts(); }, []);

  const remove = id => API.delete(`/posts/${id}`).then(fetchPosts);

  return (
    <div>
      <h3>All Posts</h3>
      {posts.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
          <h4>{p.title}</h4>
          <p>{p.content}</p>
          <p>By: {p.createdBy} | Likes: {p.likes}</p>
          <Link to={`/edit-post/${p.id}`}><button>Edit</button></Link>
          <button onClick={() => remove(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}