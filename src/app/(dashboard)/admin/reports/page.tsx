"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const activityData = [
  { name: 'Mon', active: 120 },
  { name: 'Tue', active: 150 },
  { name: 'Wed', active: 180 },
  { name: 'Thu', active: 190 },
  { name: 'Fri', active: 250 },
  { name: 'Sat', active: 300 },
  { name: 'Sun', active: 280 },
];

const planData = [
  { name: 'Free', value: 800 },
  { name: 'Pro', value: 300 },
  { name: 'Agency', value: 134 },
];

const COLORS = ['#9ca3af', '#8b5cf6', '#10b981'];

export default function AdminReports() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>System Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', height: '400px' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Active Users (Weekly)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d313a" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
                itemStyle={{ color: 'white' }}
              />
              <Bar dataKey="active" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', height: '400px' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
                itemStyle={{ color: 'white' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '-20px' }}>
             {planData.map((entry, index) => (
               <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                 <div style={{ width: '10px', height: '10px', background: COLORS[index], borderRadius: '50%' }}></div>
                 {entry.name}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
