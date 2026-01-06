const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;

export const getBlogs = async ({ token }: { token?: string } = {}): Promise<Blog[]> => {
  const res = await fetch(`${BASE_URL}/`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = "Failed to fetch blogs";
    try {
      const data = await res.json();
      if (data?.error) message += `: ${data.error}`;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};

export const getBlogById = async (
  id: number | string,
  { token }: { token?: string } = {}
): Promise<Blog> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = "Failed to fetch blog";
    try {
      const data = await res.json();
      if (data?.error) message += `: ${data.error}`;
    } catch {}
    throw new Error(message);
  }
  return res.json();
};
