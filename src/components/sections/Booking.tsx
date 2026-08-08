"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  interest: z.enum(["Tour", "Membership", "Event", "Other"]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const contactItems = [
  {
    icon: MapPin,
    text: CONTACT_INFO.address,
    href: CONTACT_INFO.mapsUrl,
    label: "Open Elite Health Club location in Google Maps",
  },
  { icon: Phone, text: CONTACT_INFO.phone },
  { icon: Mail, text: CONTACT_INFO.email },
  { icon: Clock, text: CONTACT_INFO.hours },
];

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interest: "Tour" },
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-dark/15 bg-white px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-dark/30 transition-colors focus:border-brand focus:outline-none";

  return (
    <section
      id="contact"
      className="bg-light py-24"
      aria-label="Contact and booking"
    >
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <SectionHeading
            title="Get in Touch"
            subtitle="Book a tour, ask a question, or start your membership journey today."
          />
        </AnimatedSection>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left — contact info */}
          <AnimatedSection>
            <div className="space-y-6">
              {contactItems.map(({ icon: Icon, text, href, label }) => (
                <div key={text} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand">
                    <Icon size={20} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-sm leading-relaxed text-neutral-dark/70 underline decoration-neutral-dark/20 underline-offset-4 transition-colors hover:text-brand"
                    >
                      {text}
                    </a>
                  ) : (
                    <p className="text-sm leading-relaxed text-neutral-dark/70">
                      {text}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Club location */}
            <div className="mt-10 overflow-hidden rounded-xl border border-neutral-dark/10">
              <iframe
                title="Elite Health Club location"
                src={CONTACT_INFO.mapsEmbedUrl}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90"
              />
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                <MapPin size={17} aria-hidden="true" />
                Open in Google Maps
              </a>
            </div>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection delay={0.15}>
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-brand/30 bg-brand/10 p-10 text-center">
                <CheckCircle size={48} className="text-brand" />
                <h3 className="font-display text-2xl font-bold text-neutral-dark">
                  Thank You!
                </h3>
                <p className="text-neutral-dark/60">
                  We&apos;ve received your enquiry and will get back to you
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Name */}
                <div>
                  <input
                    {...register("name")}
                    placeholder="Full Name"
                    className={cn(inputClass, errors.name && "border-red-400")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email Address"
                    className={cn(inputClass, errors.email && "border-red-400")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Phone Number"
                    className={cn(inputClass, errors.phone && "border-red-400")}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Interest */}
                <div>
                  <select
                    {...register("interest")}
                    className={cn(inputClass, "appearance-none")}
                  >
                    <option value="Tour">Book a Tour</option>
                    <option value="Membership">Membership Enquiry</option>
                    <option value="Event">Event Booking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Your Message (optional)"
                    className={inputClass}
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Send Enquiry
                </Button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
