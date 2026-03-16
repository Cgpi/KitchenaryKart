import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.replace("/Api","")
  : 'https://kitchenarykart.com/kitchen_app';
const getAuthConfig = () => ({
  headers: {
    "x-Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("active");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let res;
      if (filter === "inactive") {
        res = await axios.get(`${BASE_URL}/Api/User/deactivated`, getAuthConfig());
      } else {
        res = await axios.get(`${BASE_URL}/Api/User/all`, getAuthConfig());
      }

      if (res.data.success && Array.isArray(res.data.data)) {
        const normalizedUsers = res.data.data.map((user) => ({
          ...user,
          deleted: user.deleted === "1" || user.deleted === 1 || user.deleted === true,
        }));
        setUsers(normalizedUsers);
      } else {
        
        setUsers([]);
      }
    } catch (err) {
     
    }
    finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/Api/user/get_user_by_id/${userId}`, getAuthConfig());
      if (res.data.success && res.data.data) {
        const user = {
          ...res.data.data,
          deleted: res.data.data.deleted === "1" || res.data.data.deleted === 1 || res.data.data.deleted === true,
        };
        setSelectedUser(user);
        setDetailsOpen(true);
        setIsModalOpen(true);
      }
    } catch (err) {
      
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/Api/User/delete_user/${id}`, getAuthConfig());
      fetchUsers();
    } catch (err) {
      console.error("Error deactivating user", err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/Api/User/restore_user/${id}`, null, getAuthConfig());
      fetchUsers();
    } catch (err) {
      console.error("Error restoring user", err);
    }
    finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 bg-stone-50 min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-red-600"></div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-stone-800 mb-6">👤 User Management</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === "active"
                ? "bg-red-700 text-white"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === "inactive"
                ? "bg-red-700 text-white"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            }`}
          >
            Inactive
          </button>
        </div>
        <input
          type="text"
          placeholder="Search by username or email…"
          className="flex-1 min-w-0 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-stone-800 text-white">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold">Username</th>
              <th className="px-4 py-3 text-xs font-semibold">Email</th>
              <th className="px-4 py-3 text-xs font-semibold">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-stone-400 text-sm">No users found</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-stone-700">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.deleted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {user.deleted ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!user.deleted && (
                        <button
                          onClick={() => fetchUserDetails(user.id)}
                          className="px-3 py-1 bg-stone-600 hover:bg-stone-700 text-white rounded text-xs font-semibold transition"
                        >
                          View
                        </button>
                      )}
                      {!user.deleted ? (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(user.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {isModalOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => { setIsModalOpen(false); setDetailsOpen(false); }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-800">User Details</h3>
              <button
                onClick={() => { setIsModalOpen(false); setDetailsOpen(false); }}
                className="text-stone-400 hover:text-stone-600 text-xl leading-none"
              >&times;</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                ["Username", selectedUser.username],
                ["Email", selectedUser.email],
                ["Address", selectedUser.address],
                ["State", selectedUser.state],
                ["Country", selectedUser.country],
                ["Pincode", selectedUser.pincode],
                ["Contact", selectedUser.contact_number],
                ["Status", selectedUser.deleted ? "Inactive" : "Active"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold text-stone-700 w-24 shrink-0">{label}:</span>
                  <span className="text-stone-600">{value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => { setIsModalOpen(false); setDetailsOpen(false); }}
                className="w-full px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
