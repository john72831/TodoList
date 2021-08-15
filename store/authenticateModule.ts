import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { LoginForm, LoginRes } from "~/models";
import { $axios } from "~/utils/api";
import { alert } from "~/utils/ui";

@Module({
  name: "authenticateModule",
  stateFactory: true,
  namespaced: true
})
export default class AuthenticateModule extends VuexModule {
  _userId: string | null = null;
  _token: string | null = null;
  _didAutoLogout: boolean = false;
  _timer: NodeJS.Timeout | null = null;

  @Mutation
  setUser(payload: LoginRes) {
    this._token = payload.token;
    this._userId = payload.userId;
    this._didAutoLogout = false;
  }

  @Mutation
  setAutoLogout() {
    this._didAutoLogout = true;
  }

  @Mutation
  setTimer(timer: NodeJS.Timeout | null) {
    this._timer = timer;
  }

  @Action
  async login(payload: LoginForm) {
    return await this.auth({
      ...payload,
      mode: "login"
    });
  }

  @Action
  async signup(payload: LoginForm) {
    return await this.auth({
      ...payload,
      mode: "signup"
    });
  }

  @Action
  async auth(payload: LoginForm) {
    const mode = payload.mode;
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAE3H8LE_drScYpOTkz6SncfvvBRG7EWPY";

    if (mode === "signup")
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAE3H8LE_drScYpOTkz6SncfvvBRG7EWPY";

    try {
      const response = await $axios.post(url, {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      });

      if (response.status != 200) {
        alert("登入失敗，請確認帳號密碼是否正確");
        return false;
      }

      const responseData = response.data;

      const expiresIn = responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate.toString());

      this.setTimer(
        setTimeout(() => {
          this.autoLogout();
        }, expiresIn)
      );

      this.setUser({
        token: responseData.idToken,
        userId: responseData.localId
      });

      return true;
    } catch (error) {
      alert("登入失敗，請確認帳號密碼是否正確");
      return false;
    }
  }

  @Action
  tryLogin() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = tokenExpiration
      ? +tokenExpiration - new Date().getTime()
      : -1;

    if (expiresIn < 0) {
      return;
    }

    this.setTimer(
      setTimeout(() => {
        this.autoLogout();
      }, expiresIn)
    );

    if (token && userId) {
      this.setUser({
        token: token,
        userId: userId
      });
    }
  }

  @Action
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");

    if (this._timer) {
      clearTimeout(this._timer);
      this.setTimer(null);
    }

    this.setUser({
      token: null,
      userId: null
    });
  }

  @Action
  autoLogout() {
    this.logout();
    this.setAutoLogout;
  }

  get userId() {
    return this._userId;
  }

  get token() {
    return this._token;
  }

  get isAuthenticated() {
    return !!this._token;
  }

  get didAutoLogout() {
    return this._didAutoLogout;
  }
}
