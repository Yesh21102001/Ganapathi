"use client";

import { useEnquiry } from "@/components/EnquiryProvider";

export default function EnquiryButton({
  children,
  className,
  product,
}: {
  children: React.ReactNode;
  className?: string;
  product?: { title: string; handle: string };
}) {
  const openEnquiry = useEnquiry();
  return (
    <button type="button" onClick={() => openEnquiry(product ?? null)} className={className}>
      {children}
    </button>
  );
}
