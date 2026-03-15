"use client"

import { useForm } from "react-hook-form"

export default function Signup() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const password = watch("password")

  const onSubmit = async (data) => {
    console.log(data)
    alert("Signup Successful!")
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">

      <h1 className="text-xl font-bold mb-4">Signup</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        {/* Email */}
        <input
         type="text"
         placeholder="Email"
         className="border p-2 w-full"
         {...register("email", {
           required: "Email is required",
           pattern: {
             value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
             message: "Invalid email format"
            }
          })}/>
        {errors.email && (
         <p className="text-red-500 text-sm">
        {errors.email.message}
        </p>
         )}
        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          {...register("password", {
            required: "Password required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          })}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full"
          {...register("confirmPassword", {
            required: "Confirm password required",
            validate: (value) =>
              value === password || "Passwords do not match"
          })}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Terms Checkbox */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...register("terms", {
              required: "You must accept terms"
            })}
          />
          I agree to the Terms and Conditions
        </label>

        {errors.terms && (
          <p className="text-red-500 text-sm">
            {errors.terms.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Signup
        </button>

      </form>
    </div>
  )
}