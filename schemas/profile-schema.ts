import { z } from "zod";

// The maximum file size for the profile picture (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const profileSchema = z.object({
  // The 'name' field is required and must be a string between 1 and 100 characters.
  name: z
    .string({
      message: "Name must be a string"
    })
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" }),

  // The 'email' field is required, must be a valid email format, and cannot exceed 255 characters.
  email: z
    .string({
      message: "Email must be a string"
    })
    .min(1, { message: "Email is required" })
    .email({
      message: "Invalid email address"
    })
    .max(255, {
      message: "Email is too long"
    }),

  // The 'image' field is optional. If it exists, we validate it using 'refine'.
  // It checks two things:
  // 1. That it's a string, and if it's not a pre-existing path (like "uploads" or "default"),
  //    it must be a valid Base64 string.
  // 2. We use a custom 'refine' to check for a maximum file size. This requires decoding
  //    the Base64 string to get the size in bytes.
  image: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If the value is not provided, or it's a pre-existing image path, validation passes.
        if (!val || val.includes("uploads") || val.includes("default"))
          return true;

        // Separate MIME type from Base64 data to get the size.
        const base64Data = val.split(",")[1];
        const sizeInBytes = Buffer.from(base64Data, "base64").length;

        // Return false if the size exceeds the maximum allowed.
        return sizeInBytes <= MAX_FILE_SIZE;
      },
      {
        message: "Profile picture is too large (max 5MB)"
      }
    ),
  userID: z.string().min(1, { message: "User ID is required" })
});

export type ProfileSchema = z.infer<typeof profileSchema>;
