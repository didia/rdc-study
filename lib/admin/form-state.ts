export type FormState = {error?: string; success?: string; values?: Record<string, string>} | undefined;

// React resets uncontrolled forms after an action; echoing the submitted values lets a failed
// submission keep what the user typed.
export function submittedValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') values[key] = value;
  });
  return values;
}
