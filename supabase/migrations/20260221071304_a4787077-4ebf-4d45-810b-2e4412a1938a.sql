-- Allow teachers to manage subjects (needed for marks workflow)
CREATE POLICY "Teachers can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'teacher'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'teacher'::app_role));