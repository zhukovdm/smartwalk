import { getPodUrlAll } from "@inrupt/solid-client";
import {
  EVENTS,
  fetch,
  getDefaultSession,
  handleIncomingRedirect,
  login
} from "@inrupt/solid-client-authn-browser";
import StorageErrorGenerator from "./storageErrorGenerator";

/**
 * List of well-known Solid identity providers.
 */
export function getSolidIdProviders() {
  return [
    "login.inrupt.com",
    "solidweb.org",
    "solidcommunity.net",
//  "solidweb.me",
    "inrupt.net",
  ].map((idp) => "https://" + idp + "/");
}

/**
   * Log in against a particular OpenID issuer.
   */
export function solidLogin(oidcIssuer: string): Promise<void> {
  return login({
    oidcIssuer: oidcIssuer,
    clientName: "SmartWalk App",
    redirectUrl: window.location.origin
  });
}

/**
 * Redirect handler.
 */
export async function solidRedirect(
  onLogin: (webId: string) => void, onError: (error: string | null) => void, onLogout: () => void): Promise<void> {

  /* const _ = */ await handleIncomingRedirect();
  const session = getDefaultSession();

  if (session.info.isLoggedIn) {

    onLogin(session.info.webId!);
    session.events.on(EVENTS.ERROR, onError);
    session.events.on(EVENTS.LOGOUT, onLogout);
  }
}

export async function solidLogout(): Promise<void> {
  return getDefaultSession().logout();
}

/**
 * WebId associated with the default (connected) session.
 */
export function getSolidWebId(): string | undefined {
  return getDefaultSession().info.webId;
}

/**
 * Get available pods associated with the default session.
 */
export async function getAvailableSolidPods(webId: string): Promise<string[]> {
  try {
    return await getPodUrlAll(webId, { fetch: fetch });
  }
  catch (ex) {
    console.log(ex);
    throw StorageErrorGenerator.generateSolidErrorPods();
  }
}
