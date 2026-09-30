export async function requestStartups(params, options = {}) {
  const searchParams = params instanceof URLSearchParams ? params : new URLSearchParams(params);
  const response = await fetch(`/api/startups?${searchParams.toString()}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Unable to load startup data.');
    error.status = response.status;
    throw error;
  }

  return data;
}