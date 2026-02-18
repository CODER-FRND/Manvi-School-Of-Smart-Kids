
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'parent');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g. "Play Group", "Nursery", "Class 1"
  section TEXT DEFAULT 'A',
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone authenticated can view classes"
  ON public.classes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage classes"
  ON public.classes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  roll_number TEXT,
  date_of_birth DATE,
  gender TEXT,
  guardian_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their class students"
  ON public.students FOR SELECT
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Parents can view their children"
  ON public.students FOR SELECT
  USING (parent_user_id = auth.uid());

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half-day')),
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance"
  ON public.attendance FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage attendance for their class"
  ON public.attendance FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT s.id FROM public.students s
      JOIN public.classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's attendance"
  ON public.attendance FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_user_id = auth.uid())
  );

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone authenticated can view subjects"
  ON public.subjects FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Marks table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  exam_type TEXT NOT NULL, -- e.g. "Unit Test 1", "Half Yearly", "Annual"
  marks_obtained NUMERIC NOT NULL DEFAULT 0,
  total_marks NUMERIC NOT NULL DEFAULT 100,
  grade TEXT,
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage marks"
  ON public.marks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage marks for their class"
  ON public.marks FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT s.id FROM public.students s
      JOIN public.classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's marks"
  ON public.marks FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_user_id = auth.uid())
  );

-- Fees table
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  fee_type TEXT NOT NULL, -- "Tuition", "Transport", "Exam", etc.
  amount NUMERIC NOT NULL,
  due_date DATE,
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_date DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage fees"
  ON public.fees FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view their children's fees"
  ON public.fees FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_user_id = auth.uid())
  );

-- Homework table
CREATE TABLE public.homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage homework"
  ON public.homework FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage homework for their class"
  ON public.homework FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    class_id IN (SELECT id FROM public.classes WHERE teacher_id = auth.uid())
  );

CREATE POLICY "Parents can view homework for their children's class"
  ON public.homework FOR SELECT
  USING (
    class_id IN (
      SELECT class_id FROM public.students WHERE parent_user_id = auth.uid()
    )
  );

-- Remarks table
CREATE TABLE public.remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  remark TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'positive', 'concern', 'achievement')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.remarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage remarks"
  ON public.remarks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage remarks for their class"
  ON public.remarks FOR ALL
  USING (
    public.has_role(auth.uid(), 'teacher') AND
    student_id IN (
      SELECT s.id FROM public.students s
      JOIN public.classes c ON s.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Parents can view their children's remarks"
  ON public.remarks FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_user_id = auth.uid())
  );

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
