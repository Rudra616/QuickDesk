import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function CommentList({ ticketId, refreshTrigger, onCommentDeleted }) {
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`tickets/${ticketId}/comments/`);
        setComments(res.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const res = await API.get(`auth/users/me/`);
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    if (ticketId) {
      fetchComments();
      fetchCurrentUser();
    }
  }, [ticketId, refreshTrigger]);

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`tickets/${ticketId}/comments/${commentId}/`);
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (!comments.length) return <p>No comments yet.</p>;

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id} style={{ marginBottom: '8px' }}>
            <div>
              <strong>{comment.user?.username || 'User'}:</strong> {comment.content}
            </div>
            <small>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </small>
            {currentUser && (currentUser.id === comment.user?.id || currentUser.is_staff) && (
              <button onClick={() => handleDelete(comment.id)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
