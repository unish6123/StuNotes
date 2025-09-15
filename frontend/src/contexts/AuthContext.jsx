import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is authenticated by verifying the HTTP-only cookie
      const response = await fetch("http://localhost:4000/api/auth/verify", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json(); 
        if (data.success && data.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.name}`,
          });
        }
      }
    } catch (error) {
      console.log("No existing session found");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.user) {
        return {
          success: false,
          message: data.message || "Sign in failed",
        };
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.name}`,
      };

      setUser(userData);

      return {
        success: true,
        message: "Sign in successful",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Sign in failed",
      };
    }
  };

  const signUp = async (name, email, password) => {
    const response = await fetch("http://localhost:4000/api/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Sign up failed");
    }

    // After successful signup, the user is automatically signed in
    const userData = {
      id: Date.now().toString(), // Temporary ID since backend doesn't return user data on signup
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    };

    setUser(userData);
  };

  const signOut = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/signOut", {
        method: "GET",
        credentials: "include",
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
