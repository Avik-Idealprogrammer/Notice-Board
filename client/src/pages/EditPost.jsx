import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import PostForm from '../components/PostForm';

// Fetches the post first just to know its type (ad/notice), then renders the shared form locked to that type.
export default function EditPost() {
  const { id } = useParams();
  const [type, setType] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setType(res.data.type));
  }, [id]);

  if (!type) return <p className="text-center text-slate-400 py-16 text-sm">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-slate-900 mb-6">Edit post</h1>
      <PostForm fixedType={type} />
    </div>
  );
}
