'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button, Input, Modal, Checkbox } from '@/components/ui';
import styles from './page.module.css';

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'Admin', description: 'Full access to all account features' },
  { id: 'technical', label: 'Technical', description: 'Can manage devices and technical settings' },
  { id: 'technical_configuration', label: 'Technical Configuration', description: 'Can configure technical settings' },
  { id: 'technical_viewer', label: 'Technical Viewer', description: 'Read-only access to technical data' },
];

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRolesInfoModal, setShowRolesInfoModal] = useState(false);

  // Edit Profile form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Add User form state
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch owner user
        const ownerRes = await fetch('/api/users/profile/owner');
        if (ownerRes.ok) {
          const ownerData = await ownerRes.json();
          setUser(ownerData);
          setEditName(ownerData.name || '');
          setEditEmail(ownerData.email || '');
          setEditPhone(ownerData.phone || '');
        }

        // Fetch all users
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setShowEditProfileModal(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUserFirstName || !newUserEmail || selectedRoles.length === 0) {
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${newUserFirstName} ${newUserLastName}`.trim(),
          email: newUserEmail,
          phone: newUserPhone || null,
          role: selectedRoles[0], // Primary role
        }),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers([...users, newUser]);
        resetAddUserForm();
        setShowAddUserModal(false);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const resetAddUserForm = () => {
    setNewUserFirstName('');
    setNewUserLastName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setSelectedRoles([]);
    setRolesDropdownOpen(false);
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const getRolesDisplayText = () => {
    if (selectedRoles.length === 0) return 'Roles';
    if (selectedRoles.length === 1) {
      return AVAILABLE_ROLES.find(r => r.id === selectedRoles[0])?.label || 'Roles';
    }
    return `${selectedRoles.length} roles selected`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      {/* Profile Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Profile</h2>
          <Button variant="outlined" size="sm" onClick={() => setShowEditProfileModal(true)}>
            Edit
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.profileGrid}>
            <div className={styles.profileItem}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{user?.name || '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{user?.email || '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{user?.phone || '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Role</span>
              <span className={styles.value} style={{ textTransform: 'capitalize' }}>
                {user?.role || '-'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Address Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Shipping Address</h2>
          <Button variant="outlined" size="sm">Edit</Button>
        </div>

        <div className={styles.card}>
          <div className={styles.addressContent}>
            {user?.shipping_address_line1 ? (
              <>
                <p>{user.shipping_address_line1}</p>
                {user.shipping_address_line2 && <p>{user.shipping_address_line2}</p>}
                <p>
                  {user.shipping_city}, {user.shipping_state} {user.shipping_zip}
                </p>
                <p>{user.shipping_country}</p>
              </>
            ) : (
              <p className={styles.muted}>No shipping address on file</p>
            )}
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Users</h2>
          <Button variant="outlined" size="sm" onClick={() => setShowAddUserModal(true)}>
            Add User
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.usersTable}>
            <div className={styles.usersHeader}>
              <div>User</div>
              <div>Role</div>
              <div></div>
            </div>
            {users.map((u) => (
              <div key={u.id} className={styles.usersRow}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.userName}>{u.name}</div>
                    <div className={styles.userEmail}>{u.email}</div>
                  </div>
                </div>
                <div>
                  <span className={styles.roleBadge}>{u.role}</span>
                </div>
                <div>
                  {!u.is_owner && (
                    <Button variant="ghost" size="sm">Remove</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        title="Edit Profile"
      >
        <div className={styles.modalForm}>
          <Input
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <Input
            label="Phone"
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
          />
          <div className={styles.modalActions}>
            <Button variant="ghost" onClick={() => setShowEditProfileModal(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          resetAddUserForm();
        }}
        title="Add User"
        size="lg"
      >
        <div className={styles.addUserForm}>
          <div className={styles.formRow}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="First Name"
                value={newUserFirstName}
                onChange={(e) => setNewUserFirstName(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Last Name"
                value={newUserLastName}
                onChange={(e) => setNewUserLastName(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Roles Dropdown */}
          <div className={styles.rolesDropdownContainer}>
            <button
              type="button"
              className={styles.rolesDropdownButton}
              onClick={() => setRolesDropdownOpen(!rolesDropdownOpen)}
            >
              <span className={selectedRoles.length === 0 ? styles.placeholder : ''}>
                {getRolesDisplayText()}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${styles.dropdownIcon} ${rolesDropdownOpen ? styles.open : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {rolesDropdownOpen && (
              <div className={styles.rolesDropdownMenu}>
                {AVAILABLE_ROLES.map((role) => (
                  <div
                    key={role.id}
                    className={styles.roleOption}
                    onClick={() => toggleRole(role.id)}
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      label={role.label}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={styles.rolesInfoLink}
            onClick={() => setShowRolesInfoModal(true)}
          >
            What are roles?
          </button>

          <p className={styles.consentText}>
            By adding users, you affirm that you consent and have obtained their consent to share your personal information within the same account, as set forth in Starlink&apos;s Privacy Policy.
          </p>

          <div className={styles.addUserActions}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowAddUserModal(false);
                resetAddUserForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={handleAddUser}
              disabled={!newUserFirstName || !newUserEmail || selectedRoles.length === 0}
            >
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Roles Info Modal */}
      <Modal
        isOpen={showRolesInfoModal}
        onClose={() => setShowRolesInfoModal(false)}
        title="User Roles"
      >
        <div className={styles.rolesInfoContent}>
          {AVAILABLE_ROLES.map((role) => (
            <div key={role.id} className={styles.roleInfoItem}>
              <h4>{role.label}</h4>
              <p>{role.description}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
