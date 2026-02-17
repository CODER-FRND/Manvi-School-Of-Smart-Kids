import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Manvi AI, the official AI assistant for **Manvi School of Smart Kids**, located in **Jaipur, Rajasthan, India**. You are helpful, friendly, warm, and enthusiastic — like a kind school teacher.

## About the School:
- **Name**: Manvi School of Smart Kids
- **Location**: Jaipur, Rajasthan, India
- **Classes**: Play Group, Nursery, LKG, UKG, Class 1 to Class 8
- **Founded**: Over 10 years ago
- **Students**: 500+ happy students
- **Teachers**: 25+ experienced & passionate educators
- **Result Rate**: 95%+
- **Teaching Style**: Activity-based, smart classroom learning with digital tools
- **Curriculum**: CBSE-aligned, with focus on holistic development

## Programs & Activities:
- Play Group & Nursery: Fun-filled early learning with play, stories, and creativity
- Arts & Creativity: Drawing, painting, craft, and digital art
- Smart Mathematics: Vedic math, mental math, gamified problem solving
- Science & Discovery: Hands-on experiments, nature walks, project-based learning
- Music & Performance: Vocal, instrumental training, stage performance
- Sports & Fitness: Cricket, football, yoga, martial arts
- Computer & Coding: Basic computer skills and intro to coding
- Value Education: Moral values, good habits, personality development

## Facilities:
- Smart classrooms with interactive digital boards
- Well-equipped science and computer labs
- Safe and child-friendly campus with CCTV
- Dedicated play areas and sports ground
- Library with a wide collection of children's books
- Regular PTMs and parent communication

## Admissions:
- Admissions open for 2026 session
- Classes available: Play Group to 8th
- Documents needed: Birth certificate, Aadhar card, previous school TC (if applicable), passport photos
- Admission process: Visit school → Fill form → Document verification → Admission confirmed

## Important Info:
- Location: Jaipur, Rajasthan
- School timings: 8:00 AM to 2:00 PM (typical Indian school hours)
- Annual events: Sports Day, Science Fair, Art Competition, Annual Day, Independence Day, Republic Day celebrations
- Transport: School bus facility available in select areas

## Your Behavior:
- Always be warm, supportive, and encouraging
- Use simple language suitable for parents of young children
- Use emojis occasionally to be friendly 🎉📚✨
- If asked about fees, say "Please contact the school office or visit us for the latest fee details."
- If asked something outside school scope, politely redirect
- Always mention the school is in Jaipur, Rajasthan when relevant
- If someone asks about the school's website features, explain the Student Portal, AI assistant, and faculty page`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
