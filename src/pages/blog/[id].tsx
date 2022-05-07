import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import { client } from "libs/client";
import type { Blog } from "types/blog";
import { Params } from "next/dist/server/router";

// APIリクエストを行うパスを指定
export const getStaticPaths: GetStaticPaths<Params> = async () => {
	const data = await client.get({ endpoint: "blog" });

	const paths = data.contents.map((content: any) => `/blog/${content.id}`);
	return { paths, fallback: false };
};

// microCMSへAPIリクエスト
export const getStaticProps: GetStaticProps<Props, Params> = async (
	context
) => {
	const id = context.params?.id;
	const data = await client.get({ endpoint: "blog", contentId: id });

	return {
		props: {
			blog: data,
		},
	};
};

// // Props（blog）の型
type Props = {
	blog: Blog;
};

const BlogId: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	blog,
}: Props) => {
	return (
		<main>
			<h1>{blog.title}</h1>
			<p>{blog.publishedAt}</p>
			{blog.tags.map((tag) => (
				<li key={tag.id}>#{tag.tag}</li>
			))}
			<div
				dangerouslySetInnerHTML={{
					__html: `${blog.body}`,
				}}
			/>
		</main>
	);
};

export default BlogId;
