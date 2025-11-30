import { useState, useEffect, FormEvent, useCallback } from 'react';
import { api } from '../../api/client';
import type { Note } from '../../api/types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { ErrorMessage } from '../../components/ErrorMessage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

export const NotesPage = () => {
  useAuth(); // Redirects to login if not authenticated
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedNotes = await api.getNotes();
      setNotes(fetchedNotes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.createNote({ title, content });
      setTitle('');
      setContent('');
      setShowForm(false);
      await loadNotes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setError('');
      await api.deleteNote(id);
      await loadNotes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading notes..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Note'}
        </Button>
      </div>

      <ErrorMessage message={error} />

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Note'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setTitle('');
                  setContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(note.id)}
                  className="text-sm"
                >
                  Delete
                </Button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-3">{note.content}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

