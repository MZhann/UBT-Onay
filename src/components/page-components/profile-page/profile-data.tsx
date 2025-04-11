"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { updateProfile, getProfilePhoto, uploadProfilePhoto } from "@/api/user";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  useEffect(() => {
    async function fetchAvatar() {
      try {
        if(window === undefined) return;
        const accessToken = localStorage.getItem("accessToken");
        const blob = await getProfilePhoto(accessToken as string);

        if (blob) {
          const objectUrl = URL.createObjectURL(blob);
          setAvatarUrl(objectUrl);

          // очистка при размонтировании
          return () => URL.revokeObjectURL(objectUrl);
        } else {
          // fallback если blob не пришёл
          setAvatarUrl("/assets/images/decoration/avatar.png");
        }
      } catch (err) {
        console.error("Failed to load avatar", err);
        setAvatarUrl("/assets/images/decoration/avatar.png");
      }
    }

    fetchAvatar();
  }, [triggerProfileInfo]);

  const openModal = () => {
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
      setTriggerProfileInfo(!triggerProfileInfo);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Error, check if every input is filled",
      });
    }
  };

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      const result = await uploadProfilePhoto(e.target.files[0]);
      setAvatarUrl(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${result.photo_url}`
      );
      toast({
        variant: "success",
        title: "Photo Updated",
        description: "Your avatar has been updated.",
      });
      setTriggerProfileInfo(!triggerProfileInfo);
    } catch (err) {
      console.error("Failed to upload photo", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload photo.",
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

      <div className="w-full flex items-center gap-5 mt-4 text-[#152759] relative">
        {/* Avatar Container */}
        <div className="relative w-[100px] h-[100px]">
          <Image
            src={avatarUrl || "/assets/images/decoration/avatar.png"}
            width={100}
            height={100}
            alt="avatar"
            className="rounded-full object-cover cursor-pointer w-[100px] h-[100px] border-4 border-myindigo"
            onClick={handleAvatarClick}
          />
          {/* Edit Icon (bottom right corner) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white border p-1 rounded-full hover:bg-gray-100"
            title="Edit Avatar"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
              <path
                d="M16 16H4V4h12v12z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Text Info */}
        <div>
          <p className="font-bold text-lg">
            {firstName} {lastName}
          </p>
          <p>{email}</p>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-[90vw] max-h-[90vh]">
            <Image
              src={avatarUrl || "/assets/images/decoration/avatar.png"}
              alt="avatar-full"
              width={400}
              height={400}
              className="object-contain rounded"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 bg-myindigo text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
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
                  {...register("first_name", {
                    required: "First name is required",
                  })}
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
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
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
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
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
