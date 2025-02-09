import { createContext, useState, useEffect, FunctionComponent } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }: { children: FunctionComponent }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on page load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/auth-status",
        {
          credentials: "include", // Important for including cookies
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await fetch("https://yourapi.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Sends cookies with the request
    });

    if (response.ok) {
      await checkAuth(); // Refresh auth state
    }
  };

  const logout = async () => {
    await fetch("https://yourapi.com/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
