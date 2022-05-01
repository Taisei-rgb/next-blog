import {
	GetStaticPaths,
	GetStaticProps,
	InferGetStaticPropsType,
	NextPage,
} from "next";
import { client } from "libs/client";
import type { Blog } from "types/blog";
import cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/hybrid.css";
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
	const blog = await client.get({ endpoint: "blog", contentId: id });
	// 以下の部分を追記
	const $ = cheerio.load(blog.body);
	$("pre code").each((_, elm) => {
		const result = hljs.highlightAuto($(elm).text());
		$(elm).html(result.value);
		$(elm).addClass("hljs");
	});

	return {
		props: {
			blog,
			highlightedBody: $.html(),
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
