import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/serviceConfig";

export default function PostForm({ post }) {
    const user = useSelector((state) => state.auth.userData?.userData);
    const navigate = useNavigate();

    const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors }, // <-- add this
        } = useForm({
    defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        contents: post?.contents || "",
        status: post?.status || "active",
    },
});
    const submit = async (data) => {
        try {
            // Ensure user is logged in
            if (!user || !user.id) {
                alert("User not logged in. Please log in to create or update a post.");
                return;
            }

            if (post) {
                // Update existing post
                let featuredImage = post.featuredImage;

                if (data.image && data.image[0]) {
                    const file = await appwriteService.uploadFile(data.image[0]);

                    if (file) {
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
                    status: data.status,
                });

                if (!dbPost) throw new Error("Failed to update post");

                navigate(`/post/${dbPost.$id}`);
            } else {
                // Create new post
                if (!data.image || data.image.length === 0 || !data.image[0]) {
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
                    userId: user.id,
                });

                if (!dbPost) {
                    await appwriteService.deleteFile(file.$id); // cleanup
                    throw new Error("Failed to create post");
                }

                navigate(`/post/${dbPost.$id}`);
            }
        } catch (error) {
            console.error("Post submission error:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            
                    <div className="w-2/4 px-2">
                        <Input
                            label="Title :"
                            placeholder="Title"
                            className="mb-4"
                            {...register("title", { required: true })}
                        />
                        {/* <label htmlFor="status">Status :</label> */}
                        <Select
                            options={["active", "inactive"]}
                            className="mb-4"
                            label="Status :"
                            {...register("status", { required: true })}
                        />
                    </div>
                    <div className="w-2/4 px-2">
                        <Input
                                label="Slug :"
                                placeholder="Slug"
                                className="mb-4"
                                {...register("slug", { required: true })}
                                onInput={(e) => {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }}
                            />
                        <Input
                                label="Featured Image :"
                                type="file"
                                className="mb-2"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", {
                                    required: !post ? "Featured image is required" : false,
                                })}
                            />

                        {errors.image && (
                                <p className="text-red-500 text-sm mb-2">{errors.image.message}</p>
                            )}

                            {post && post.featuredImage && (
                                <div className="w-full mb-4">
                                    <img
                                        src={appwriteService.getFilePreview(post.featuredImage)}
                                        alt={post.title}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}
            
                    </div>
                    <div className="w-full px-2 py-2">
                        <RTE
                            label="Contents :"
                            name="contents"
                            control={control}
                            defaultValue={getValues("contents")}
                        />
                    </div>
                    <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                            {post ? "Update" : "Submit"}
                    </Button>
                    
            </form>
            </div>
    );
}
