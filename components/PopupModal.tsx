"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface FirestoreTimestamp { toDate: () => Date }
type DateLike = FirestoreTimestamp | string | Date

interface Post {
  id: string
  title: string
  description?: string
  imageUrl?: string
  isActive: boolean
  expiryDate: DateLike
  startDate: DateLike
  createdAt: DateLike
}

function toDate(val: DateLike | undefined): Date {
  if (!val) return new Date(0);
  if (typeof val === "object" && "toDate" in val) return (val as FirestoreTimestamp).toDate();
  return new Date(val as string | Date);
}

/* ─── Cookie helpers ──────────────────────────────────────────────── */
function setCookie(name: string, value: string, expiresDate: Date) {
  document.cookie = `${name}=${value};expires=${expiresDate.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

/* ─── Safe image: uses next/image for Firebase Storage, <img> fallback ── */
function PopupImage({ src, alt }: { src: string; alt: string }) {
  const isFirebaseStorage = src.includes("firebasestorage.googleapis.com");
  if (isFirebaseStorage) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 512px"
        priority
        unoptimized={false}
      />
    );
  }
  // Fallback for any other external URL
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-full w-full object-cover" loading="eager" />
  );
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function PopupModal() {
  const [adState, setAdState] = useState<"hidden" | "small" | "big">("hidden");
  const [post, setPost] = useState<Post | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPost() {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("isActive", "==", true));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log("[PopupModal] No active posts found.");
          return;
        }

        const now = new Date();
        const validPosts = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() } as Post))
          .filter((p) => {
            const expiry = toDate(p.expiryDate);
            const start = toDate(p.startDate);
            const valid = expiry >= now && start <= now;
            if (!valid) {
              console.log(`[PopupModal] Post "${p.title}" skipped — date range invalid.`, { start, expiry, now });
            }
            return valid;
          })
          .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());

        if (validPosts.length === 0) {
          console.log("[PopupModal] No valid (in-date-range) posts.");
          return;
        }

        const latestPost = validPosts[0];
        console.log("[PopupModal] Valid post found:", latestPost.id, latestPost.title);

        // Check if user already dismissed this post twice
        const cookieKey = `closes_${latestPost.id}`;
        const closeCount = parseInt(getCookie(cookieKey) || "0", 10);
        
        if (closeCount >= 2) {
          console.log("[PopupModal] Post skipped — close count is 2 or more.");
          return;
        }

        if (isMounted) {
          setPost(latestPost);
          // Show small ad after 5 s
          timerRef.current = setTimeout(() => {
            if (isMounted) {
              console.log("[PopupModal] Showing small ad for:", latestPost.title);
              setAdState("small");
            }
          }, 5000);
        }
      } catch (error) {
        console.error("[PopupModal] Firestore error:", error);
      }
    }

    fetchPost();

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!post) return;
    
    const cookieKey = `closes_${post.id}`;
    const currentCloses = parseInt(getCookie(cookieKey) || "0", 10);
    const newCloses = currentCloses + 1;
    
    // Save to cookie
    setCookie(cookieKey, newCloses.toString(), toDate(post.expiryDate));
    
    setAdState("hidden");
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // If closed less than 2 times, show again in 1 minute
    if (newCloses < 2) {
      timerRef.current = setTimeout(() => {
        setAdState("small");
      }, 60000);
    }
  };

  const handleSmallClick = () => {
    setAdState("big");
  };

  return (
    <AnimatePresence>
      {adState === "small" && post && (
        <motion.div
          key="small-ad"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-[90] flex w-72 sm:w-80 cursor-pointer items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1a3024] to-[#122219] shadow-2xl ring-1 ring-white/20 hover:ring-white/40 transition-shadow"
          onClick={handleSmallClick}
        >
          {post.imageUrl && (
            <div className="relative h-20 w-24 shrink-0 bg-black/30">
              <PopupImage src={post.imageUrl} alt={post.title} />
            </div>
          )}
          <div className="flex-1 p-3 pr-10">
            <h3 className="line-clamp-2 text-sm font-bold text-white leading-snug">
              {post.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-amber-400">Click to see more</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close ad"
            className="absolute right-2 top-2 rounded-full bg-black/20 p-1.5 text-white/70 hover:bg-black/40 hover:text-white transition-all focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {adState === "big" && post && (
        <motion.div
          key="popup-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Promotional offer"
        >
          <motion.div
            key="popup-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a3024] to-[#122219] text-white shadow-2xl ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close offer"
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Poster image */}
            {post.imageUrl && (
              <div className="relative h-64 w-full bg-black/30 sm:h-80">
                <PopupImage src={post.imageUrl} alt={post.title || "Promotion"} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3024] via-transparent to-transparent" />
              </div>
            )}

            <div className={`p-6 text-center ${!post.imageUrl ? "pt-14" : "relative -mt-10"}`}>
              {/* Badge */}
              <div className="mb-4 inline-block rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold tracking-widest text-amber-400">
                SPECIAL OFFER
              </div>

              <h2 className="mb-3 text-3xl font-black tracking-tight leading-tight text-white sm:text-4xl">
                {post.title}
              </h2>

              {post.description && (
                <p className="mb-6 text-sm leading-relaxed text-[#a3c4b1] sm:text-base">
                  {post.description}
                </p>
              )}

              <div className="flex flex-col gap-3">
                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/94772783223?text=${encodeURIComponent(
                    `Hi, I'm interested in the special offer: "${post.title}". Could you provide more details?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setAdState("hidden")}
                  className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1db954] hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#1a3024]"
                >
                  <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

