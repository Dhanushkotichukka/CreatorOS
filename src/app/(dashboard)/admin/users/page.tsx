"use client";

import { useEffect, useState } from 'react';
import { Trash2, Edit } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  credits: number;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'creator' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;

    try {
        const res = await fetch('/api/admin/role', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role: newRole })
        });
        if (res.ok) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    } catch (e) {
        console.error(e);
        alert('Failed to update role');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="fade-in-up">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>User Management</h1>

      <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Plan</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Credits</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderTop: '1px solid var(--card-border)' }}>
                <td style={{ padding: '1rem' }}>{user.name || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <button 
                    onClick={() => handleRoleUpdate(user.id, user.role)}
                    style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: user.role === 'admin' ? 'var(--destructive)' : '#60a5fa',
                        transition: 'all 0.2s'
                    }}
                    title="Click to toggle role"
                  >
                    {user.role}
                  </button>
                </td>
                <td style={{ padding: '1rem' }}>{user.plan}</td>
                <td style={{ padding: '1rem' }}>{user.credits}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button style={{ marginRight: '0.5rem', color: '#9ca3af', opacity: 0.5, cursor: 'not-allowed' }}><Edit size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
