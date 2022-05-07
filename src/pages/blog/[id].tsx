import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import { client } from "libs/client";
import type { Blog } from "types/blog";
import { Params } from "next/dist/server/router";
import styles from "../../styles/Home.module.scss";

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
		<main className={styles.main}>
			<h1 className={styles.title}>{blog.title}</h1>
			<p className={styles.publishedAt}>{blog.publishedAt}</p>
			{blog.tags.map((tag) => (
				<li key={tag.id}>#{tag.tag}</li>
			))}
			<div
				dangerouslySetInnerHTML={{
					__html: `${blog.body}`,
				}}
				className={styles.post}
			/>
		</main>
	);
};

export default BlogId;
