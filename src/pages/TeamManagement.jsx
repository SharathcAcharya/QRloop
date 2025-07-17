import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, ShieldCheck, Mail, Loader2 } from 'lucide-react';

const initialTeam = [
  { name: 'Sharath Acharya', email: 'sharath@example.com', role: 'Owner', status: 'active' },
  { name: 'Alex Kim', email: 'alex.kim@example.com', role: 'Admin', status: 'active' },
  { name: 'Priya Singh', email: 'priya.singh@example.com', role: 'Member', status: 'invited' },
];

const TeamManagement = () => {
  const [team, setTeam] = useState(initialTeam);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    if (!inviteEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Enter a valid email address.');
      return;
    }
    setInviting(true);
    await new Promise(res => setTimeout(res, 1200));
    setTeam([...team, { name: inviteEmail.split('@')[0], email: inviteEmail, role: 'Member', status: 'invited' }]);
    setInviteEmail('');
    setInviting(false);
  };

  const handleRemove = (email) => {
    setTeam(team.filter(member => member.email !== email));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-0">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col gap-8 relative overflow-hidden">
        {/* Animated Backgrounds */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-green-300/30 dark:bg-green-800 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-300/30 dark:bg-blue-800 rounded-full blur-3xl animate-pulse" />

        {/* Header */}
        <div className="relative flex flex-col items-center text-center z-10">
          <Users className="w-14 h-14 text-green-600 dark:text-green-300 animate-bounce mb-2" />
          <h1 className="text-4xl font-extrabold text-green-800 dark:text-green-100">Team Management</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mt-2">
            Manage your team, invite new members, assign roles, and collaborate securely.
          </p>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleInvite} className="relative z-10 flex flex-col sm:flex-row items-center gap-4 justify-center mt-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="Invite by email"
            className="px-4 py-2 rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-400 w-64"
            disabled={inviting}
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60"
            disabled={inviting}
          >
            {inviting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />} Invite
          </button>
        </form>
        {error && <div className="text-red-500 text-center text-sm z-10">{error}</div>}

        {/* Team List */}
        <div className="relative z-10 bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 shadow-inner">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-200 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Team Members
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 dark:text-gray-300">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member, idx) => (
                  <tr key={member.email} className="border-b border-green-100 dark:border-green-900">
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{member.name}</td>
                    <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{member.email}</td>
                    <td className="py-2 px-3 text-green-700 dark:text-green-300">{member.role}</td>
                    <td className="py-2 px-3">
                      {member.status === 'active' ? (
                        <span className="inline-block px-2 py-1 bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-full text-xs">Active</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 rounded-full text-xs">Invited</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleRemove(member.email)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                        title="Remove"
                        disabled={member.role === 'Owner'}
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planned Features */}
        <div className="mt-8 text-xs text-center text-gray-400 dark:text-gray-500 relative z-10">
          Coming Soon: Role management · Audit logs · Team chat · Permissions · SSO integration
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
