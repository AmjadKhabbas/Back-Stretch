"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // simulation
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Have questions about our products or your order? We&apos;re here to help.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-medium mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Email Us</p>
                                        <a href="mailto:support@flexcore.com" className="text-gray-500 hover:text-blue-600 transition-colors">ekhabbas91@gtaauction.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Call Us</p>
                                        <p className="text-gray-500">+1 (555) 123-4567</p>
                                        <p className="text-xs text-gray-400">Mon-Fri, 9am - 5pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">HQ</p>
                                        <p className="text-gray-500">123 Wellness Blvd,<br />Suite 400<br />New York, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
                                <Button className="mt-8" onClick={() => setSubmitted(false)}>Send Another</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-medium mb-6">Send us a Message</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Name" placeholder="John Doe" required />
                                    <Input label="Email" type="email" placeholder="john@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-700 font-medium text-sm block">Subject</label>
                                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Product Question</option>
                                        <option>Returns</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-700 font-medium text-sm block">Message</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none min-h-[150px] resize-y"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>
                                <Button type="submit" size="lg" className="w-full">
                                    Send Message <Send size={16} className="ml-2" />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
