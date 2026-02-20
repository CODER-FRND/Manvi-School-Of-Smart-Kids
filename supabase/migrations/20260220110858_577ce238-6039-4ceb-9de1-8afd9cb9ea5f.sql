
-- Allow parents to link themselves to a student (update parent_user_id when it's NULL)
CREATE POLICY "Parents can link to unlinked students" ON public.students
FOR UPDATE TO authenticated
USING (parent_user_id IS NULL)
WITH CHECK (parent_user_id = auth.uid());
