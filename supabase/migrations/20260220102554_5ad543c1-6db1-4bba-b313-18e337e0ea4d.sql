
-- Fix ALL RLS policies: change from RESTRICTIVE to PERMISSIVE (default)
-- The current RESTRICTIVE policies require ALL to pass simultaneously, blocking normal users

-- ============ user_roles ============
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- ============ classes ============
DROP POLICY IF EXISTS "Admins can manage classes" ON public.classes;
DROP POLICY IF EXISTS "Everyone authenticated can view classes" ON public.classes;

CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone authenticated can view classes" ON public.classes FOR SELECT TO authenticated
USING (true);

-- ============ students ============
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
DROP POLICY IF EXISTS "Parents can view their children" ON public.students;
DROP POLICY IF EXISTS "Teachers can view their class students" ON public.students;

CREATE POLICY "Admins can manage students" ON public.students FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view their children" ON public.students FOR SELECT TO authenticated
USING (parent_user_id = auth.uid());

CREATE POLICY "Teachers can view their class students" ON public.students FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role) AND class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()));

-- ============ attendance ============
DROP POLICY IF EXISTS "Admins can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Parents can view their children's attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers can manage attendance for their class" ON public.attendance;

CREATE POLICY "Admins can manage attendance" ON public.attendance FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view their children attendance" ON public.attendance FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()));

CREATE POLICY "Teachers can manage attendance for their class" ON public.attendance FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()));

-- ============ marks ============
DROP POLICY IF EXISTS "Admins can manage marks" ON public.marks;
DROP POLICY IF EXISTS "Parents can view their children's marks" ON public.marks;
DROP POLICY IF EXISTS "Teachers can manage marks for their class" ON public.marks;

CREATE POLICY "Admins can manage marks" ON public.marks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view their children marks" ON public.marks FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()));

CREATE POLICY "Teachers can manage marks for their class" ON public.marks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()));

-- ============ fees ============
DROP POLICY IF EXISTS "Admins can manage fees" ON public.fees;
DROP POLICY IF EXISTS "Parents can view their children's fees" ON public.fees;

CREATE POLICY "Admins can manage fees" ON public.fees FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view their children fees" ON public.fees FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()));

-- ============ homework ============
DROP POLICY IF EXISTS "Admins can manage homework" ON public.homework;
DROP POLICY IF EXISTS "Parents can view homework for their children's class" ON public.homework;
DROP POLICY IF EXISTS "Teachers can manage homework for their class" ON public.homework;

CREATE POLICY "Admins can manage homework" ON public.homework FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view homework for their children class" ON public.homework FOR SELECT TO authenticated
USING (class_id IN (SELECT class_id FROM students WHERE parent_user_id = auth.uid()));

CREATE POLICY "Teachers can manage homework for their class" ON public.homework FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role) AND class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role) AND class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid()));

-- ============ remarks ============
DROP POLICY IF EXISTS "Admins can manage remarks" ON public.remarks;
DROP POLICY IF EXISTS "Parents can view their children's remarks" ON public.remarks;
DROP POLICY IF EXISTS "Teachers can manage remarks for their class" ON public.remarks;

CREATE POLICY "Admins can manage remarks" ON public.remarks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Parents can view their children remarks" ON public.remarks FOR SELECT TO authenticated
USING (student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()));

CREATE POLICY "Teachers can manage remarks for their class" ON public.remarks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role) AND student_id IN (SELECT s.id FROM students s JOIN classes c ON s.class_id = c.id WHERE c.teacher_id = auth.uid()));

-- ============ subjects ============
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Everyone authenticated can view subjects" ON public.subjects;

CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone authenticated can view subjects" ON public.subjects FOR SELECT TO authenticated
USING (true);
