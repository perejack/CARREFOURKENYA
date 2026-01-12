import { MessageCircle } from "lucide-react";

const ChatWidget = () => {
  const whatsappNumber = "254105575260";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="font-medium">Talk to us</span>
    </a>
  );
};

export default ChatWidget;
