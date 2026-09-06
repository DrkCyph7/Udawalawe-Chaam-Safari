"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

// --- Simple Cookie Helpers ---
function setCookie(name: string, value: string, expiresDate: Date) {
  const expires = expiresDate.toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPost() {
      try {
        const postsRef = collection(db, "posts");
        // Fetch only active posts to minimize read cost & avoid complex indexes
        const q = query(postsRef, where("isActive", "==", true));
        const snapshot = await getDocs(q);

        const now = new Date();
        const validPosts = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data };
          })
          .filter((p) => {
            const expiry = p.expiryDate?.toDate ? p.expiryDate.toDate() : new Date(p.expiryDate);
            const start = p.startDate?.toDate ? p.startDate.toDate() : new Date(p.startDate);
            return expiry >= now && start <= now;
          })
          .sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
            return timeB - timeA;
          });

        if (validPosts.length > 0) {
          const latestPost = validPosts[0];

          // 2. Check for cookie before showing
          if (getCookie(`skip_${latestPost.id}`)) {
            return;
          }

          if (isMounted) {
            setPost(latestPost);
            // 3. Show after a 1-2 second delay
            timerRef.current = setTimeout(() => {
              if (isMounted) setIsOpen(true);
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error fetching popup post:", error);
      }
    }

    fetchPost();

    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSkip = () => {
    if (!post) return;
    const expiry = post.expiryDate?.toDate ? post.expiryDate.toDate() : new Date(post.expiryDate);
    // 4. Set cookie with expiry date
    setCookie(`skip_${post.id}`, "1", expiry);
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleLater = () => {
    setIsOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    // 5. 30-second timer to re-open
    timerRef.current = setTimeout(async () => {
      if (!post) return;

      if (getCookie(`skip_${post.id}`)) return;

      const now = new Date();
      const expiry = post.expiryDate?.toDate ? post.expiryDate.toDate() : new Date(post.expiryDate);
      if (expiry < now) return;

      try {
        const docRef = doc(db, "posts", post.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isActive) {
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Error re-checking post:", err);
      }
    }, 30000);
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-[#1f392b] text-white shadow-2xl ring-1 ring-white/10"
          >
            {post.imageUrl && (
              <div className="relative h-48 w-full bg-black/20">
                <img
                  src={post.imageUrl}
                  alt={post.title || "Promotion"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-[#e5f0ea]">
                {post.title}
              </h2>
              {post.description && (
                <p className="mb-6 text-sm leading-relaxed text-[#a3c4b1]">
                  {post.description}
                </p>
              )}
              
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={handleLater}
                  className="rounded-lg border border-[#3b5e4a] bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2c4d3b] focus:outline-none focus:ring-2 focus:ring-[#3b5e4a] focus:ring-offset-2 focus:ring-offset-[#1f392b]"
                >
                  Later
                </button>
                <button
                  onClick={handleSkip}
                  className="rounded-lg bg-[#4ade80] px-5 py-2.5 text-sm font-medium text-[#0f2418] transition-colors hover:bg-[#34c759] focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:ring-offset-2 focus:ring-offset-[#1f392b]"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
