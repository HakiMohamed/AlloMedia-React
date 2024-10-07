import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
      try {
        // Make the API request with the Authorization header
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,  // Corrected placement for headers
          },
        });

        // Set user data after successful response
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        // Handle error and update error message state
        setError('Error fetching profile data.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display an error message if something goes wrong
  if (error) {
    return <div>{error}</div>;
  }

  // Render the profile details if the data is available
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg sm:p-8 p-4 rounded-md mt-10">
      {userData && (
        <div>
          <h1 className="text-2xl font-bold mb-4">User Profile</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Verified:</strong> {userData.isVerified ? 'Yes' : 'No'}</p>
              <p><strong>OTP:</strong> {userData.otp}</p>
              <p><strong>Created At:</strong> {new Date(userData.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Devices</h2>
              {userData.devices && userData.devices.length > 0 ? (
                <ul className="list-disc pl-5">
                  {userData.devices.map((device) => (
                    <li key={device._id}>
                      <p><strong>User Agent:</strong> {device.userAgent}</p>
                      <p><strong>Login At:</strong> {new Date(device.loginAt).toLocaleString()}</p>
                      <p><strong>Verified:</strong> {device.isVerified ? 'Yes' : 'No'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No devices found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
