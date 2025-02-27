"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateProfile } from "@/api/user"; // Uses the updateProfile function from api/user.ts
import { useToast } from "@/hooks/use-toast";

interface ProfileDataProps {
  firstName: string;
  lastName: string;
  email: string;
  triggerProfileInfo: boolean;
  setTriggerProfileInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormInputs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const ProfileData = ({
  firstName,
  lastName,
  email,
  triggerProfileInfo,
  setTriggerProfileInfo,
}: ProfileDataProps) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: "",
    },
  });

  const openModal = () => {
    // Reset the form with current profile data when opening the modal
    reset({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    // Ensure all fields are filled before submitting
    if (!data.first_name || !data.last_name || !data.email || !data.password) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "All fields are required.",
      });
      return;
    }
    try {
      await updateProfile(data);
      toast({
        variant: "success",
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      closeModal();
      // Trigger parent's refresh by updating triggerProfileInfo (for example, with a timestamp)
      setTriggerProfileInfo(!triggerProfileInfo);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message,
      });
    }
  };

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h1 className="font-bold text-2xl">Profile</h1>
        <button onClick={openModal} className="underline font-bold text-lg">
          edit
        </button>
      </div>

      <div className="w-full flex items-center gap-5 mt-4 text-[#152759]">
        <Image
          src={"/assets/images/decoration/avatar.png"}
          width={100}
          height={100}
          alt="avatar"
        />
        <div>
          <p className="font-bold text-lg">
            {firstName} {lastName}
          </p>
          <p>{email}</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="first_name" className="block mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  className="w-full p-2 border rounded"
                  {...register("first_name", { required: "First name is required" })}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  className="w-full p-2 border rounded"
                  {...register("last_name", { required: "Last name is required" })}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border rounded"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-2 border rounded"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-myindigo text-white rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileData;
