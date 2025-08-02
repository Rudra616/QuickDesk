import { useState } from 'react';
import API from '../api/axios';

export default function AddComment({ ticketId, onCommentAdded }) {
  const [content, setContent] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post(`tickets/${ticketId}/comments/`, { content });
      setContent('');
      if (onCommentAdded) onCommentAdded(); // to refresh comments in parent
    } catch (err) {
      alert('Failed to post comment');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Comment</h3>
      <textarea
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <br />
      <button type="submit">Post Comment</button>
    </form>
  );
}
