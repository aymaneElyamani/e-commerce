const BASE_URL = "http://localhost:8000/api/auth";

const headers = {
  "Content-Type": "application/json",
};

async function testAuthFlow() {
  try {
    console.log("🔐 Registering...");
    let res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: "testuser@example.com",
        password: "test123",
      }),
    });
    console.log("Register:", await res.json());

    console.log("🔓 Logging in...");
    res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: "testuser@example.com",
        password: "test123",
      }),
    });
    const loginResponse = await res.json();
    console.log("Login:", loginResponse);

    // Check if login was successful and token was returned
    if (loginResponse.token) {
      const token = loginResponse.token;

      console.log("👤 Getting profile...");
      res = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: {
          ...headers,
          "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      console.log("Profile:", await res.json());
    } else {
      console.error("❌ No token received during login.");
    }

   // Uncomment this block if you want to test logout
   // console.log("🚪 Logging out...");
   // res = await fetch(`${BASE_URL}/logout`, {
   //   method: "GET",
   //   headers: {
   //     ...headers,
   //     "Authorization": `Bearer ${token}`, // Pass the token in the Authorization header for logout if needed
   //   },
   // });
   // console.log("Logout:", await res.json());

   
    
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testAuthFlow();


