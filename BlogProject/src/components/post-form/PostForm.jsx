import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/serviceConfig";

export default function PostForm({ post }) {
    // const rawUserData = useSelector((state) => state.auth.userData);
    // const user = rawUserData?.userData; 

    const user = useSelector((state) => state.auth.userData?.userData);

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            contents: post?.contents || "",
            status: post?.status || "active",
        },
    });
    
   
       const navigate = useNavigate();



    const submit = async (data) => {   
    try {
        if (post) {
            // Handle post update
            let featuredImage = post.featuredImage;
            
            // Upload new image if provided
            if (data.image[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    // Delete old image if it exists
                    if (post.featuredImage) {
                        await appwriteService.deleteFile(post.featuredImage);
                    }
                    featuredImage = file.$id;
                }
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                title: data.title,
                slug: data.slug,
                contents: data.contents,
                featuredImage,
                status: data.status
                

            });

            if (!dbPost) {
                throw new Error("Failed to update post");
            }

            navigate(`/post/${dbPost.$id}`);
        } else {
            // Handle new post creation
            if (!data.image[0]) {
                throw new Error("Featured image is required");
            }

            const file = await appwriteService.uploadFile(data.image[0]);
            if (!file) {
                throw new Error("Failed to upload image");
            }

            const dbPost = await appwriteService.createPost({
                title: data.title,
                slug: data.slug,
                contents: data.contents,
                featuredImage: file.$id,
                status: data.status,
                userId: user.id  
            });

            if (!dbPost) {
                // Clean up the uploaded image if post creation fails
                await appwriteService.deleteFile(file.$id);
                throw new Error("Failed to create post");
            }

            navigate(`/post/${dbPost.$id}`);
        }
    } catch (error) {
        console.error("Post submission error:", error);
        // Add user-friendly error handling here (toast, alert, etc.)
        alert(`Error: ${error.message}`);
    }
};


    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Contents :" name="contents" control={control} defaultValue={getValues("contents")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}