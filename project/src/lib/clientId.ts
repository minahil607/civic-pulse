const STORAGE_KEY = "civicpulse_client_id";

export function getClientId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      "cp_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 10);
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
