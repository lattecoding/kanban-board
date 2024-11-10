import { JwtPayload, jwtDecode } from "jwt-decode";

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        return decoded.exp * 1000 < Date.now();
      }
      return false;
    } catch (error) {
      console.error("Invalid token format:", error);
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  login(idToken: string) {
    localStorage.setItem("jwtToken", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("jwtToken");
    window.location.assign("/login");
  }
}

export default new AuthService();
