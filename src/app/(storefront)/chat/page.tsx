"use client";

import { MessageCircle, Mail, Phone, Clock, ChevronDown, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ChatPage() {
  const whatsappNumber = "15551234567"; // Can be easily updated later
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi! I need some help with my shopping on Nexa Store.`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
      {/* Header section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">How can we help?</h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Our support team is always ready to assist you. Get in touch with us instantly via WhatsApp or check our FAQs below.
        </p>
      </div>

      {/* Main Chat Action */}
      <Card className="border-green-500/20 shadow-lg bg-green-50/50 dark:bg-green-950/10">
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Live WhatsApp Support</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Get instant answers to your questions, track your order, or report an issue directly through WhatsApp.
            </p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-14 px-8 text-lg rounded-full shadow-lg shadow-green-500/30">
              <Send className="w-5 h-5 mr-2" /> Chat with us on WhatsApp
            </Button>
          </a>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Average response time: under 5 minutes
          </p>
        </CardContent>
      </Card>

      {/* Other Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Email Support
            </CardTitle>
            <CardDescription>For detailed inquiries and attachments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">support@nexastore.com</p>
            <p className="text-sm text-muted-foreground mt-2">We typically reply within 24 hours.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Phone Support
            </CardTitle>
            <CardDescription>Speak directly with a support agent.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">+1 (555) 123-4567</p>
            <p className="text-sm text-muted-foreground mt-2">Mon - Fri, 9:00 AM - 6:00 PM EST</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div className="space-y-6 pt-8 border-t">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How long does shipping take?</AccordionTrigger>
            <AccordionContent>
              Standard shipping usually takes 3-5 business days. Express shipping options are available at checkout for 1-2 day delivery depending on your location.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              We offer a 30-day hassle-free return policy. If you aren't completely satisfied with your purchase, you can return it for a full refund or exchange as long as it's in its original condition.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I track my order?</AccordionTrigger>
            <AccordionContent>
              Once your order has shipped, you will receive an email with a tracking number. You can also view your order status in your Account profile under 'Order History'.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Is it safe to use my credit card?</AccordionTrigger>
            <AccordionContent>
              Yes, absolutely. We use industry-standard encryption protocols to ensure that your personal and payment information is completely secure. We partner with Cashfree to process payments safely.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
