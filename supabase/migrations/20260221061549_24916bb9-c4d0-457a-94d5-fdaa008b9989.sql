
-- Teachers should see ALL students (same as admin) for the panels they access
DROP POLICY IF EXISTS "Teachers can view their class students" ON public.students;
CREATE POLICY "Teachers can view all students" ON public.students FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role));

-- Teachers should manage ALL attendance (not just their class)
DROP POLICY IF EXISTS "Teachers can manage attendance for their class" ON public.attendance;
CREATE POLICY "Teachers can manage all attendance" ON public.attendance FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));

-- Teachers should manage ALL marks
DROP POLICY IF EXISTS "Teachers can manage marks for their class" ON public.marks;
CREATE POLICY "Teachers can manage all marks" ON public.marks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));

-- Teachers should manage ALL homework
DROP POLICY IF EXISTS "Teachers can manage homework for their class" ON public.homework;
CREATE POLICY "Teachers can manage all homework" ON public.homework FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));

-- Teachers should manage ALL remarks
DROP POLICY IF EXISTS "Teachers can manage remarks for their class" ON public.remarks;
CREATE POLICY "Teachers can manage all remarks" ON public.remarks FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));
