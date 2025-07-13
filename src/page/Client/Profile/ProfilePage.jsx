import React, { useEffect, useState, useRef } from "react";
import { getUserProfile, updateUser } from "../../../service/authService";
import { uploadToCloudinaryService } from "../../../service/uploadToCloudinaryService";
import {
  fetchAddressesOfUser,
  createAddress,
  deleteAddress,
  updateAddress,
} from "../../../service/addressService";
import "./ProfilePage.scss";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=User&background=6366f1&color=ffffff";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    avatarUrl: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [newAddress, setNewAddress] = useState({
    number: "",
    district: "",
    province: "",
  });
  const [adding, setAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        setProfile(data);
        setEditData({
          fullName: data.fullName || "",
          email: data.email || "",
          avatarUrl: data.avatarUrl || "",
          gender: data.gender || "",
        });
        setAddressLoading(true);
        try {
          const addr = await fetchAddressesOfUser(data.id);
          setAddresses(addr);
        } catch (err) {
          setAddressError("Failed to load addresses");
        } finally {
          setAddressLoading(false);
        }
      } catch (err) {
        setMessage("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setEditData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setMessage("Please select a JPG or PNG image.");
      return;
    }
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadToCloudinaryService(file);
      if (url) {
        setEditData((prev) => ({ ...prev, avatarUrl: url }));
      } else {
        setMessage("Image upload failed. Please try again.");
      }
    } catch (err) {
      setMessage("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateUser(profile.id, editData);
      setMessage("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, ...editData }));
    } catch (err) {
      setMessage("Update failed! Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddressError("");
    try {
      const result = await createAddress({ ...newAddress, userId: profile.id });
      setNewAddress({ number: "", district: "", province: "" });
      const addr = await fetchAddressesOfUser(profile.id);
      setAddresses(addr);
    } catch (err) {
      setAddressError(err.message || "Failed to add address");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      const addr = await fetchAddressesOfUser(profile.id);
      setAddresses(addr);
    } catch (err) {
      setAddressError("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      number: address.number,
      district: address.district,
      province: address.province,
    });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddressError("");
    try {
      await updateAddress(editingAddress.id, newAddress);
      setEditingAddress(null);
      setNewAddress({ number: "", district: "", province: "" });
      const addr = await fetchAddressesOfUser(profile.id);
      setAddresses(addr);
    } catch (err) {
      setAddressError(err.message || "Failed to update address");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-card">
          <div className="error-icon">👤</div>
          <p>No user data found.</p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "role-admin";
      case "manager":
        return "role-manager";
      case "user":
        return "role-user";
      default:
        return "role-default";
    }
  };

  return (
    <div className="profile-container">
      <div className="animated-background">
        <div className="dna-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        <div className="dna-helix-bg">
          <div className="helix-strand strand-1"></div>
          <div className="helix-strand strand-2"></div>
        </div>
      </div>
      <div className="profile-header">
        <h1>Profile Information</h1>
        <p>Manage and update your account details</p>
      </div>

      <div className="profile-content">
        {/* Profile Summary Card */}
        <div className="profile-summary-card">
          <div className="avatar-section">
            <div
              className="avatar-wrapper"
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src={editData.avatarUrl || defaultAvatar}
                alt="Avatar"
                className="avatar-image"
              />
              <div className="camera-icon">📷</div>
              <input
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                disabled={uploading}
              />
            </div>
            <h2 className="user-name">{profile.fullName}</h2>
            <p className="user-email">
              <span className="email-icon">✉️</span>
              {profile.email}
            </p>
          </div>
          <div className="role-section">
            <div className={`role-badge ${getRoleColor(profile.role)}`}>
              <span className="role-icon">✓</span>
              {profile.role}
            </div>
            <div className="member-info">
              <p>Member since</p>
              <p className="member-date">January, 2024</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="profile-form-card">
          <div className="form-header">
            <h2>
              <span className="form-icon">👤</span>
              Edit Profile
            </h2>
          </div>
          <form onSubmit={handleSave} className="profile-form">
            {/* Avatar URL Input */}
            <div className="form-group">
              <label htmlFor="avatarUrl">Avatar URL</label>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={editData.avatarUrl}
                  onChange={handleChange}
                  className="form-input"
                  disabled={uploading}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="choose-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{ minWidth: 110 }}
                >
                  {uploading ? "Uploading..." : "Choose Image"}
                </button>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  disabled={uploading}
                />
              </div>
              <p className="form-hint">
                Paste the image URL (formats: jpg, png, gif) or choose an image
                to upload.
              </p>
              {uploading && (
                <div className="form-hint" style={{ color: "#3b82f6" }}>
                  Uploading image...
                </div>
              )}
            </div>

            <div className="form-separator"></div>

            {/* Personal Information */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={editData.fullName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="form-input disabled"
                />
                <p className="form-hint">Email cannot be changed</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={editData.gender}
                  onChange={handleGenderChange}
                  className="form-select"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={profile.role}
                  disabled
                  className="form-input disabled"
                />
              </div>
            </div>

            <div className="form-separator"></div>

            {/* Save Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={saving || uploading}
                className={`save-button ${saving ? "saving" : ""}`}
              >
                {saving ? (
                  <>
                    <div className="button-spinner"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="save-icon">💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`message ${
                  message.includes("successfully") ? "success" : "error"
                }`}
              >
                {message}
              </div>
            )}
          </form>
          {/* Addresses Section */}
          <div className="profile-address-list-box">
            <div className="profile-edit-title">
              <i
                className="fas fa-map-marker-alt"
                style={{ marginRight: "8px", color: "#8f5cff" }}
              ></i>
              <span
                style={{
                  color: "#1a202c",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                Addresses
              </span>
            </div>
            <hr className="profile-edit-divider" />
            {addresses.length === 0 ? (
              <div className="profile-no-address">No address found.</div>
            ) : (
              <div className="profile-address-list">
                {addresses.map((address) => (
                  <div key={address.id} className="profile-address-item">
                    <span>
                      {address.number}, {address.district}, {address.province}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEditAddress(address)}
                      style={{
                        marginLeft: "1rem",
                        padding: "0.25rem 0.75rem",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Address Form */}
          <div className="profile-edit-box">
            <div className="profile-edit-title">
              <i
                className="fas fa-map-marker-alt"
                style={{ marginRight: "8px", color: "#8f5cff" }}
              ></i>
              <span
                style={{
                  color: "#1a202c",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                {editingAddress ? "Edit Address" : "Add Address"}
              </span>
            </div>
            <hr className="profile-edit-divider" />
            <form
              className="profile-address-form"
              onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            >
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Number"
                  value={newAddress.number}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, number: e.target.value })
                  }
                  required
                  style={{ flex: 1, minWidth: "120px" }}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="District"
                  value={newAddress.district}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, district: e.target.value })
                  }
                  required
                  style={{ flex: 1, minWidth: "120px" }}
                />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Province"
                  value={newAddress.province}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, province: e.target.value })
                  }
                  required
                  style={{ flex: 1, minWidth: "120px" }}
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="save-button"
                  style={{ minWidth: "140px", height: "40px" }}
                >
                  {adding
                    ? "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Add Address"}
                </button>
                {editingAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setNewAddress({ number: "", district: "", province: "" });
                    }}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {addressError && (
              <div className="message error">{addressError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
