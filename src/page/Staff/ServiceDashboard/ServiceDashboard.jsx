import React, { useEffect, useState } from "react";
import {
  fetchAllServices,
  addService,
  fetchServiceById,
  updateService,
} from "../../../service/dnaServiceService";
import { Search, Plus, MoreHorizontal, X } from "lucide-react";
import "./ServiceDashboard.scss";

export default function ServiceDashboard() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    allowHomeKit: false,
    price: "",
    type: "",
  });
  const [viewService, setViewService] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");
  const [editService, setEditService] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllServices();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        setServices([]);
        setFilteredServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      await addService({
        ...newService,
        price: Number(newService.price),
      });
      setShowModal(false);
      setNewService({
        name: "",
        description: "",
        allowHomeKit: false,
        price: "",
        type: "",
      });
      // Refresh list
      const data = await fetchAllServices();
      setServices(data);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleViewService = async (serviceId) => {
    setViewLoading(true);
    setViewError("");
    setEditService(null);
    try {
      const data = await fetchServiceById(serviceId);
      setEditService({
        serviceId: data.serviceId,
        name: data.name || "",
        description: data.description || "",
        allowHomeKit: !!data.allowHomeKit,
        price:
          data.price !== undefined && data.price !== null
            ? String(data.price)
            : "",
        type: data.type || "",
      });
    } catch (err) {
      setViewError("Failed to load service details");
    } finally {
      setViewLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditService((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError("");
    try {
      await updateService(editService.serviceId, {
        name: editService.name,
        description: editService.description,
        allowHomeKit: editService.allowHomeKit,
        price: Number(editService.price),
        type: editService.type,
      });
      setEditService(null);
      // Refresh list
      const data = await fetchAllServices();
      setServices(data);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="ap-container">
      <div className="ap-header-actions">
        <div className="ap-search-section">
          <div className="ap-search-wrapper">
            <Search className="ap-search-icon" />
            <input
              type="text"
              placeholder="Search by service name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ap-search-input"
            />
          </div>
        </div>
        <div className="ap-action-buttons">
          <button className="ap-add-button" onClick={() => setShowModal(true)}>
            <Plus className="ap-button-icon" />
            Add Service
          </button>
        </div>
      </div>
      <div className="ap-table-card">
        <div className="ap-table-header">
          <div className="ap-table-title">
            Service List ({filteredServices.length})
          </div>
        </div>
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr className="ap-table-row-header">
                <th className="ap-table-header-cell">Name</th>
                <th className="ap-table-header-cell">Description</th>
                <th className="ap-table-header-cell">Type</th>
                <th className="ap-table-header-cell">Allow HomeKit</th>
                <th className="ap-table-header-cell">Price</th>
                <th className="ap-table-header-cell"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="ap-table-loading">
                          <div className="ap-loading-pulse">
                            <div className="ap-loading-avatar"></div>
                            <div className="ap-loading-text">
                              <div className="ap-loading-line ap-loading-line-short"></div>
                              <div className="ap-loading-line ap-loading-line-medium"></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                : filteredServices.map((service) => (
                    <tr
                      key={service.serviceId}
                      className="ap-table-row"
                      onClick={() => handleViewService(service.serviceId)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ap-table-cell">{service.name}</td>
                      <td className="ap-table-cell">{service.description}</td>
                      <td className="ap-table-cell">{service.type}</td>
                      <td className="ap-table-cell">
                        {service.allowHomeKit ? "Yes" : "No"}
                      </td>
                      <td className="ap-table-cell">{service.price}</td>
                      <td className="ap-table-cell">
                        <div className="ap-actions-cell">
                          <button
                            className="ap-action-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewService(service.serviceId);
                            }}
                          >
                            <MoreHorizontal className="ap-action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal service-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create New Service</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateService} className="service-form">
              <label>
                Name
                <input
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowHomeKit"
                  checked={newService.allowHomeKit}
                  onChange={handleInputChange}
                />
                Allow Home Kit
              </label>
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  value={newService.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </label>
              <label>
                Type
                <input
                  name="type"
                  value={newService.type}
                  onChange={handleInputChange}
                  required
                />
              </label>
              {createError && <div className="error">{createError}</div>}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editService && (
        <div className="modal-overlay" onClick={() => setEditService(null)}>
          <div
            className="modal service-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Update Service</h3>
              <button
                className="modal-close-btn"
                onClick={() => setEditService(null)}
              >
                <X size={20} />
              </button>
            </div>
            {viewLoading ? (
              <div style={{ padding: 24 }}>Loading...</div>
            ) : viewError ? (
              <div className="error">{viewError}</div>
            ) : (
              <form onSubmit={handleUpdateService} className="service-form">
                <label>
                  Name
                  <input
                    name="name"
                    value={editService.name || ""}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>
                <label>
                  Description
                  <textarea
                    name="description"
                    value={editService.description || ""}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allowHomeKit"
                    checked={editService.allowHomeKit}
                    onChange={handleEditInputChange}
                  />
                  Allow Home Kit
                </label>
                <label>
                  Price
                  <input
                    name="price"
                    type="number"
                    value={editService.price || ""}
                    onChange={handleEditInputChange}
                    required
                    min="0"
                  />
                </label>
                <label>
                  Type
                  <input
                    name="type"
                    value={editService.type || ""}
                    onChange={handleEditInputChange}
                    required
                  />
                </label>
                {updateError && <div className="error">{updateError}</div>}
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setEditService(null)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
