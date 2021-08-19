export async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;

  if (response.status === 400) {
    // Server side validation returns a string error message, so parse as text instead of json.
    const errors = await response.json();
    throw new Error(errors[0]);
  }
  throw new Error("Network response was not ok.");
}
