"use client";

import { useState } from "react";
import { updatePost, useCreatePost, useGetPosts } from "@/api-client/hooks";
import type { PostDto, CreatePostDto, UpdatePostBody } from "@/api-client/model"; 
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { data, error, isLoading, mutate } = useGetPosts(); 
  const { trigger: createPost, isMutating: isCreating } = useCreatePost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDto | null>(null);
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

  const handleEditClick = (post: PostDto) => {
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
        await updatePost(editingPost.id, postData as UpdatePostBody);
      } else {
        await createPost(postData as CreatePostDto); 
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


  if (isLoading) return <div className="flex justify-center items-center min-h-screen text-lg font-medium text-gray-600">Loading posts...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-lg font-medium text-red-600">Error loading posts: {error.message}</div>;

  const posts = data?.data?.edges || [];


  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
         <h1 className="text-3xl font-bold">Blog Posts</h1>
         <button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md"
         >
            Add Post
         </button>
      </div>
      {posts.length === 0 ? (
         <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
           <p className="text-lg text-gray-500">No posts found.</p>
           <p className="text-sm text-gray-400 mt-2">Click 'Add Post' to create your first post.</p>
         </div>
      ) : (
         <ul className="space-y-5">
           {posts.map((edge) => (
             <li
               key={edge.cursor}
               className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
               onClick={() => handleEditClick(edge.node)}
             >
               <h2 className="text-gray-800 text-xl font-semibold mb-2">{edge.node.title}</h2>
               <p className="text-gray-600 mb-3">{edge.node.body}</p>
               <p className="text-xs text-gray-400 mt-2 font-mono">ID: {edge.node.id}</p>
             </li>
           ))}
         </ul>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 border border-4 border-gray-500 w-full max-w-md m-4 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
               {editingPost ? "Edit Post" : "Add New Post"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-5">
                <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="body" className="block text-gray-700 text-sm font-semibold mb-2">Body</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-36 resize-none"
                  required
                />
              </div>
              {apiError && (
                 <div className="mb-5 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                   <p className="text-sm">{apiError}</p>
                 </div>
              )}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-1/2"
                >
                  {isCreating || isUpdating ? "Saving..." : "Save Post"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 w-1/2"
                >
                  Cancel
                </button>
              </div>
            </form>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
              aria-label="Close"
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
