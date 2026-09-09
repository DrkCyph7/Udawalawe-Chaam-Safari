"use client";

import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
            return { id: doc.id, ...data } as any;
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

    // 5. 60-second timer to re-open
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
    }, 60000);
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a3024] to-[#122219] text-white shadow-2xl ring-1 ring-white/20"
          >
            {/* Close Button (Skip) */}
            <button
              onClick={handleSkip}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>

            {post.imageUrl && (
              <div className="relative h-80 w-full bg-black/20">
                <img
                  src={post.imageUrl}
                  alt={post.title || "Promotion"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3024] to-transparent"></div>
              </div>
            )}
            
            <div className={`p-6 text-center ${!post.imageUrl ? "pt-12" : "pt-0 -mt-8 relative"}`}>
              {/* Optional "Special Offer" Ribbon / Badge */}
              <div className="mb-3 inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold tracking-wider text-orange-400 border border-orange-500/30">
                SPECIAL OFFER
              </div>
              
              <h2 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                {post.title}
              </h2>
              {post.description && (
                <p className="mb-6 text-sm sm:text-base leading-relaxed text-[#a3c4b1]">
                  {post.description}
                </p>
              )}
              
              <div className="flex flex-col gap-2">
                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/94772783223?text=${encodeURIComponent(`Hi, I'm interested in the special offer: "${post.title}". Could you provide more details?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)} // Optionally close popup on click
                  className="mx-auto flex w-full max-w-sm items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-[#20bd5a] hover:shadow-md hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#1a3024]"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Contact on WhatsApp
                </a>
                
                {/* Remind Later Button */}
                <button
                  onClick={handleLater}
                  className="mt-1 text-xs sm:text-sm font-medium text-[#a3c4b1] transition-colors hover:text-white underline decoration-transparent hover:decoration-white/50 underline-offset-4 focus:outline-none"
                >
                  Remind me later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

