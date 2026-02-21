import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { student_name, phone } = await req.json();

    if (!student_name?.trim() || !phone?.trim()) {
      return new Response(JSON.stringify({ error: "Student name and phone number are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up student by exact name (case-insensitive) and phone
    const { data: students, error } = await supabase
      .from("students")
      .select("*, classes(name, section)")
      .ilike("name", student_name.trim())
      .eq("phone", phone.trim())
      .limit(1);

    if (error || !students || students.length === 0) {
      return new Response(JSON.stringify({ error: "No student found with that name and phone number. Please check and try again." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const student = students[0];

    // Fetch all related data
    const [attRes, feeRes, markRes, remRes, hwRes] = await Promise.all([
      supabase.from("attendance").select("*").eq("student_id", student.id).order("date", { ascending: false }).limit(30),
      supabase.from("fees").select("*").eq("student_id", student.id).order("due_date", { ascending: false }),
      supabase.from("marks").select("*, subjects(name)").eq("student_id", student.id),
      supabase.from("remarks").select("*").eq("student_id", student.id).order("created_at", { ascending: false }),
      student.class_id
        ? supabase.from("homework").select("*, subjects(name)").eq("class_id", student.class_id).order("due_date", { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    return new Response(JSON.stringify({
      student,
      attendance: attRes.data || [],
      fees: feeRes.data || [],
      marks: markRes.data || [],
      remarks: remRes.data || [],
      homework: hwRes.data || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
