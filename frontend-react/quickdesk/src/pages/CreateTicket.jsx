import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

export default function CreateTicket() {
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('api/tickets/', form);
      alert('Ticket created!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to create ticket');
    }
  };

  return (
    <div className="p-4">
      <Form onSubmit={handleSubmit} className="border p-4 rounded-3 shadow-sm">
        <h2 className="mb-4">Create Ticket</h2>
        
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}