import { getPodUrlAll } from "@inrupt/solid-client";
import {
  EVENTS,
  fetch,
  getDefaultSession,
  handleIncomingRedirect,
  login
} from "@inrupt/solid-client-authn-browser";
import StorageErrorGenerator from "./storageErrorGenerator";

export default class SolidProvider {

  /**
   * List of well-known Solid identity providers.
   */
  public static getIdProviders() {
    return [
      "login.inrupt.com",
      "solidweb.org",
      "solidcommunity.net",
//    "solidweb.me",
      "inrupt.net",
    ].map((idp) => "https://" + idp + "/");
  }

  /**
   * Log in against a particular OpenID issuer.
   */
  public static async login(oidcIssuer: string): Promise<void> {
    await login({
      oidcIssuer: oidcIssuer,
      clientName: "GrainPath App",
      redirectUrl: window.location.origin + window.location.pathname
    });
  }

  public static async logout(): Promise<void> {
    return getDefaultSession().logout();
  }

  /**
   * Redirect handler.
   */
  public static async redirect(onLogin: (webId: string) => void, onError: (error: string | null) => void, onLogout: () => void): Promise<void> {
    await handleIncomingRedirect();
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
      onLogin(session.info.webId!);
      session.events.on(EVENTS.ERROR, onError);
      session.events.on(EVENTS.LOGOUT, onLogout);
    }
  }

  /**
   * WebId associated with the default session.
   */
  public static getWebId(): string | undefined {
    return getDefaultSession().info.webId;
  }

  /**
   * Get available pods associated with the default session.
   */
  public static async getAvailablePods(webId: string): Promise<string[]> {
    try {
      return await getPodUrlAll(webId, { fetch: fetch });
    }
    catch (ex) {
      console.log(ex);
      throw StorageErrorGenerator.generateSolidErrorPods();
    }
  }
}
