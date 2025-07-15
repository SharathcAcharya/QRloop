import { useState } from 'react';
import { 
  Users, 
  Share2, 
  Plus, 
  Mail, 
  Eye,
  MoreVertical,
  Download
} from 'lucide-react';

// Workspace Card Component
const WorkspaceCard = ({ workspace, onInvite }) => {
  const [showMembers, setShowMembers] = useState(false);

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {workspace.members} members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            workspace.privacy === 'private' 
              ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
              : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
          }`}>
            {workspace.privacy}
          </span>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {workspace.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{workspace.qrCount} QR codes</span>
        <span>Updated {workspace.lastActivity}</span>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 dark:text-primary-400"
        >
          <Users size={16} />
          <span>View Members</span>
        </button>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm">
            <Share2 size={14} className="mr-1" />
            Share
          </button>
          <button className="btn-primary text-sm">
            Open
          </button>
        </div>
      </div>

      {showMembers && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Members</h4>
            <button
              onClick={() => onInvite(workspace)}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-400"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {workspace.membersList?.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">{member.name[0]}</span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Shared QR Card Component
const SharedQRCard = ({ qr }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
            <img 
              src={qr.preview} 
              alt="QR Preview" 
              className="w-8 h-8"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {qr.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Shared by {qr.sharedBy}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Download size={16} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {qr.type} • {qr.data}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>From {qr.workspace}</span>
        <span>{qr.sharedAt}</span>
      </div>

      <div className="flex space-x-2">
        <button className="flex-1 btn-secondary text-sm">
          <Eye size={14} className="mr-1" />
          Preview
        </button>
        <button className="flex-1 btn-primary text-sm">
          <Download size={14} className="mr-1" />
          Download
        </button>
      </div>
    </div>
  );
};

// Invite Card Component
const InviteCard = ({ invite }) => {
  const handleAcceptInvite = () => {
    // Accept invite logic would go here
  };

  const handleDeclineInvite = () => {
    // Decline invite logic would go here
  };

  return (
    <div className="card border-l-4 border-primary-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center">
            <Mail size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {invite.workspaceName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invited by {invite.invitedBy}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {invite.invitedAt}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        You&apos;ve been invited to join as a <strong>{invite.role}</strong>
      </p>

      <div className="flex space-x-2">
        <button
          onClick={handleDeclineInvite}
          className="flex-1 btn-secondary text-sm"
        >
          Decline
        </button>
        <button
          onClick={handleAcceptInvite}
          className="flex-1 btn-primary text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

const Collaboration = () => {
  // Replace store functions with local implementations
  const showSuccess = (_message) => {
    // Success notification would go here
    // Success: message
  };
  
  const showError = (_message) => {
    // Error notification would go here
    // Error: message
  };
  
  const trackFeatureUsage = (_feature) => {
    // Feature tracking would go here
    // Feature used: feature
  };
  
  const [activeTab, setActiveTab] = useState('workspaces');
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    privacy: 'private'
  });

  // Mock data
  const [workspaces, setWorkspaces] = useState([
    {
      id: '1',
      name: 'Marketing Team',
      description: 'QR codes for marketing campaigns and events',
      members: 8,
      qrCount: 24,
      isOwner: true,
      privacy: 'private',
      lastActivity: '2 hours ago',
      membersList: [
        { id: '1', name: 'John Doe', role: 'admin' },
        { id: '2', name: 'Jane Smith', role: 'editor' },
        { id: '3', name: 'Bob Wilson', role: 'viewer' }
      ]
    },
    {
      id: '2',
      name: 'Product Launch',
      description: 'QR codes for upcoming product launch event',
      members: 5,
      qrCount: 12,
      isOwner: false,
      privacy: 'invite-only',
      lastActivity: '1 day ago',
      membersList: [
        { id: '4', name: 'Alice Brown', role: 'admin' },
        { id: '5', name: 'Charlie Davis', role: 'editor' }
      ]
    }
  ]);

  const [sharedQRs] = useState([
    {
      id: '1',
      name: 'Event Registration',
      type: 'URL',
      data: 'https://event.example.com/register',
      sharedBy: 'Alice Brown',
      workspace: 'Product Launch',
      sharedAt: '2 hours ago',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K'
    },
    {
      id: '2',
      name: 'Product Catalog',
      type: 'URL',
      data: 'https://catalog.example.com',
      sharedBy: 'John Doe',
      workspace: 'Marketing Team',
      sharedAt: '1 day ago',
      preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K'
    }
  ]);

  const [invites] = useState([
    {
      id: '1',
      workspaceName: 'Sales Team',
      invitedBy: 'Sarah Johnson',
      role: 'editor',
      invitedAt: '3 hours ago'
    },
    {
      id: '2',
      workspaceName: 'Design Team',
      invitedBy: 'Mike Chen',
      role: 'viewer',
      invitedAt: '1 day ago'
    }
  ]);

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      showError('Workspace name is required');
      return;
    }

    const workspace = {
      id: Date.now().toString(),
      ...newWorkspace,
      members: 1,
      qrCount: 0,
      isOwner: true,
      lastActivity: 'Just now',
      membersList: [
        { id: 'me', name: 'You', role: 'admin' }
      ]
    };

    setWorkspaces(prev => [...prev, workspace]);
    setNewWorkspace({ name: '', description: '', privacy: 'private' });
    setShowCreateWorkspace(false);
    showSuccess('Workspace created successfully!');
    trackFeatureUsage('workspace_created');
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      showError('Email address is required');
      return;
    }

    showSuccess(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteRole('viewer');
    setShowInviteModal(false);
    trackFeatureUsage('member_invited');
  };

  const handleInviteToWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    setShowInviteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Team Collaboration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Work together with your team in real-time collaborative workspaces
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'workspaces'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users size={16} className="inline mr-2" />
              Workspaces
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'shared'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Share2 size={16} className="inline mr-2" />
              Shared with Me
            </button>
            <button
              onClick={() => setActiveTab('invites')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === 'invites'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Mail size={16} className="inline mr-2" />
              Invitations
              {invites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {invites.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Workspaces Tab */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Workspaces
              </h2>
              <button
                onClick={() => setShowCreateWorkspace(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Create Workspace</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <WorkspaceCard 
                  key={workspace.id} 
                  workspace={workspace} 
                  onInvite={handleInviteToWorkspace}
                />
              ))}
            </div>

            {workspaces.length === 0 && (
              <div className="card">
                <div className="text-center py-12">
                  <Users size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No workspaces yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Create your first workspace to start collaborating with your team
                  </p>
                  <button
                    onClick={() => setShowCreateWorkspace(true)}
                    className="btn-primary"
                  >
                    Create Your First Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Shared with Me Tab */}
        {activeTab === 'shared' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shared with Me
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedQRs.map((qr) => (
                <SharedQRCard key={qr.id} qr={qr} />
              ))}
            </div>

            {sharedQRs.length === 0 && (
              <div className="card">
                <div className="text-center py-12">
                  <Share2 size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nothing shared with you yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    When team members share QR codes with you, they&apos;ll appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Invitations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invites.map((invite) => (
                <InviteCard key={invite.id} invite={invite} />
              ))}
            </div>

            {invites.length === 0 && (
              <div className="card">
                <div className="text-center py-12">
                  <Mail size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No pending invitations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You&apos;re all caught up! Invitations will appear here when you receive them
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Workspace Modal */}
        {showCreateWorkspace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Workspace
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Marketing Team"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the workspace"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Privacy
                  </label>
                  <select
                    value={newWorkspace.privacy}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, privacy: e.target.value }))}
                    className="input-field"
                  >
                    <option value="private">Private - Invite only</option>
                    <option value="invite-only">Invite Only - Team members can invite others</option>
                    <option value="public">Public - Anyone can join</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateWorkspace(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 btn-primary"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Invite to {selectedWorkspace?.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="input-field"
                  >
                    <option value="viewer">Viewer - Can view QR codes</option>
                    <option value="editor">Editor - Can create and edit QR codes</option>
                    <option value="admin">Admin - Full workspace access</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteMember}
                  className="flex-1 btn-primary"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaboration;
