"use client";

import { useState } from "react";
import { useGetPosts, usePostPosts, patchPostsId } from "@/api-client/hooks";
import type { Post, PostPostsBody, PatchPostsIdBody } from "@/api-client/model"; 
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data, error, isLoading, mutate } = useGetPosts(); 
  const { trigger: createPost, isMutating: isCreating } = usePostPosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [apiError, setApiError] = useState<string | null>(null); 
  const [isUpdating, setIsUpdating] = useState(false); 


  const handleAddClick = () => {
    setEditingPost(null);
    setTitle("");
    setBody("");
    setApiError(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setBody(post.body);
    setApiError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setTitle("");
    setBody("");
    setApiError(null);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null); 
    const postData = { title, body };
    
    const isEditing = !!editingPost;
    if (isEditing && !editingPost?.id) {
        console.error("Cannot update post without an ID.");
        setApiError("Cannot update post without an ID.");
        return;
    }

    if (isEditing) {
        setIsUpdating(true);
    }

    try {
      if (isEditing) {
        await patchPostsId(editingPost.id, postData as PatchPostsIdBody);
      } else {
        await createPost(postData as PostPostsBody); 
      }
      mutate(); 
      handleCloseModal(); 
    } catch (err: any) {
      console.error("Failed to save post:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to save the post. Please try again.";
      setApiError(errorMessage);
    } finally {
      if (isEditing) {
          setIsUpdating(false);
      }
    }
  };


  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts: {error.message}</div>;

  const posts = data?.data?.edges || [];


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-bold">Blog Posts</h1>
         <button
            onClick={handleAddClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
         >
            Add Post
         </button>
      </div>
      {posts.length === 0 ? (
         <div>No posts found.</div>
      ) : (
         <ul className="space-y-4">
           {posts.map((edge) => (
             <li
               key={edge.cursor}
               className="bg-white border rounded p-4 shadow cursor-pointer hover:bg-gray-50"
               onClick={() => handleEditClick(edge.node)}
             >
               <h2 className="text-black text-xl font-semibold">{edge.node.title}</h2>
               <p className="text-gray-600">{edge.node.body}</p>
               <p className="text-sm text-gray-400 mt-2">ID: {edge.node.id}</p>
             </li>
           ))}
         </ul>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 border w-full max-w-md m-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">
               {editingPost ? "Edit Post" : "Add New Post"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">Body</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                />
              </div>
              {apiError && (
                 <p className="text-red-500 text-xs italic mb-4">{apiError}</p>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save Post"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
