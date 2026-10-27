"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, ChevronRight, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.");
    }, 800);
  };

  return (
    <div className="container py-8 md:py-16">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Contact Us</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Have a question about an order, product authenticity, or bulk corporate gifting?
              Our dedicated customer concierge team in Dhaka is here to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border bg-card/60 shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Flagship Store</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Plot 14, Road 45, Gulshan-2, Dhaka 1212, Bangladesh
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-card/60 shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Helpline & WhatsApp</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                +880 9612-000000<br />
                +880 1711-000000
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-card/60 shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Email Inquiries</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                support@kinakati.com<br />
                orders@kinakati.com
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-card/60 shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Working Hours</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Saturday – Thursday: 9:00 AM – 10:00 PM<br />
                Friday: 2:00 PM – 10:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl border bg-card shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              Send us a Message
            </h2>
            <p className="text-xs text-muted-foreground">
              Fill out the form below and we will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Message Sent Successfully!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Thank you for reaching out. A KinaKati customer support specialist will contact you shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="text-xs mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Your Full Name</label>
                  <Input required placeholder="e.g. Tanvir Ahmed" className="text-xs" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Mobile Phone (BD)</label>
                  <Input required placeholder="017XXXXXXXX" className="text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Address</label>
                <Input type="email" required placeholder="tanvir@example.com" className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Subject</label>
                <Input required placeholder="Order inquiry / Product feedback" className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Message</label>
                <Textarea required placeholder="How can we help you today?" rows={4} className="text-xs" />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11"
              >
                {loading ? "Sending Message..." : "Submit Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
