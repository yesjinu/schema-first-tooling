"use client";

import { useGetPosts } from "@/api-client/hooks";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data, error, isLoading } = useGetPosts();

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error.message}</div>;
  if (!data?.data.edges) return <div>No posts found.</div>;

  const posts = data.data.edges;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map((edge) => (
          <li key={edge.cursor} className="bg-white border rounded p-4 shadow">
            <h2 className="text-black text-xl font-semibold">{edge.node.title}</h2>
            <p className="text-gray-600">{edge.node.body}</p>
            <p className="text-sm text-gray-400 mt-2">ID: {edge.node.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
