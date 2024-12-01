// ipConfig.js
import os from 'os';

// Function to get local IP address
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    let localIP = 'localhost'; // Default fallback
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            // Check for non-internal IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                if (interfaceName.toLowerCase() === 'wi-fi') {
                    localIP = iface.address; // Use the IP of the Wi-Fi adapter
                    break; // Exit loop once we find the Wi-Fi IP
                }
            }
        }
        if (localIP !== 'localhost') break; // Exit loop if we found a valid IP
    }
    return localIP;
};

// Get the local IP address
const localIP = getLocalIP();
console.log(`Local IP Address: ${localIP}`);

// Export the local IP address
export default localIP;