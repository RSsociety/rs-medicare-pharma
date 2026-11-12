import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(
        "Hello RS Medicare Pharma, I would like help with product availability and pricing.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with RS Medicare Pharma on WhatsApp"
      className="no-print group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#128C7E] py-3 pl-3 pr-4 text-white shadow-[0_16px_40px_-16px_rgba(18,140,126,0.9)] transition hover:-translate-y-0.5 hover:bg-[#0f7a6e]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-3.4-1.8 11 11 0 0 1-2.4-3c-.3-.5-.6-1.2-.6-1.8 0-.6.3-1.1.6-1.4.2-.2.4-.3.6-.3h.4c.2 0 .3 0 .4.3l.7 1.6c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3-.1.4.3.6.8 1.2 1.3 1.7.5.4 1 .7 1.5 1 .2.1.3 0 .4-.1l.6-.6c.1-.2.3-.2.5-.1l1.5.8c.2.1.4.2.4.4 0 .1 0 .5-.1.8Z" />
      </svg>
      <span className="hidden text-xs font-semibold sm:block">Enquire on WhatsApp</span>
    </a>
  );
}
