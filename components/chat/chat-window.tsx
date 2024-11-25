"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ChatWindowProps {
  bookingId: string;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function ChatWindow({ bookingId, otherUser }: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to chat channel
    const channel = pusherClient.subscribe(`booking-${bookingId}`);
    
    channel.bind("new-message", (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
      
      // Scroll to bottom on new message
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    // Load existing messages
    fetch(`/api/chat/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    return () => {
      pusherClient.unsubscribe(`booking-${bookingId}`);
    };
  }, [bookingId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          message: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-background border rounded-lg">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={otherUser.image || undefined} />
            <AvatarFallback>
              {otherUser.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-sm text-muted-foreground">
              {session?.user?.id === otherUser.id ? "You" : "Your ride partner"}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender.id === session?.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.sender.id === session?.user?.id
                    ? "flex-row-reverse"
                    : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.image || undefined} />
                  <AvatarFallback>
                    {message.sender.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender.id === session?.user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(message.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}