import React, { useEffect, useState } from "react"; 
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL.replace("/Api","");

const getAuthConfig = () => ({
  headers: {
    "x-Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
  },
});

const AdminEmailBroadcast = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/Api/User/all`, getAuthConfig());
      

      if (res.data.success && Array.isArray(res.data.data)) {
        const mappedUsers = res.data.data.map((u) => ({
          id: Number(u.user_id), // convert user_id to number
          username: u.username,
          name: u.username,
          email: u.email,
        }));
       
        setUsers(mappedUsers);
      } else {
       
        setUsers([]);
      }
    } catch (err) {
     
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((uid) => uid !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const sendBroadcastMail = async () => {
    if (!subject.trim() || !body.trim() || selectedUsers.length === 0) {
      alert("Subject, body and at least one user are required");
      return;
    }

    setSending(true);

   const payload = {
  user_ids: selectedUsers.map(Number), // ensure all numbers
  subject,
  body,
};

    
    try {
      await axios.post(`${BASE_URL}/Api/EmailBroadcast/create`, payload, getAuthConfig());

      // Reset selection and input fields after sending
      setSelectedUsers([]);
      setSubject("");
      setBody("");
      alert("Emails sent successfully!");
    } catch (err) {
     ;
      alert("Failed to send mail");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-2xl font-bold text-stone-800 mb-6">📧 Email Broadcast</h2>

      {/* Compose */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden">
        <div className="px-5 py-3 bg-stone-800 text-white font-semibold text-sm">Compose Email</div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Subject</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Email Body</label>
            <textarea
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition resize-y"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email body"
            />
          </div>
        </div>
      </div>

      {/* Recipients */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-6 overflow-hidden">
        <div className="px-5 py-3 bg-stone-800 text-white font-semibold text-sm flex items-center justify-between">
          <span>Select Recipients</span>
          <span className="text-xs text-stone-300 font-normal">{selectedUsers.length} selected</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-stone-300 border-t-red-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-600 w-10">
                    <input
                      type="checkbox"
                      checked={users.length > 0 && selectedUsers.length === users.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 cursor-pointer accent-red-700"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-600">User</th>
                  <th className="px-4 py-3 text-xs font-semibold text-stone-600">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                        className="w-4 h-4 cursor-pointer accent-red-700"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-sm text-stone-700">{user.name}</td>
                    <td className="px-4 py-2.5 text-sm text-stone-500">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={sendBroadcastMail}
          disabled={sending || selectedUsers.length === 0 || !subject.trim() || !body.trim()}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : `Send to ${selectedUsers.length} recipient${selectedUsers.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

export default AdminEmailBroadcast;
