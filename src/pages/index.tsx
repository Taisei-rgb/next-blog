import Link from "next/link";
import type { InferGetStaticPropsType, NextPage } from "next";
import { client } from "../libs/client";
import type { Blog, Tag } from "types/blog"; // srcから見た絶対パスで指定

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
	const blog = await client.get({ endpoint: "blog" });
	const tag = await client.get({ endpoint: "tag" });

	return {
		props: {
			blogs: blog.contents,
			tags: tag.contents,
		},
	};
};

type Props = {
	blogs: Blog[];
	tags: Tag[];
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
	blogs,
	tags,
}: Props) => {
	return (
		<div>
			<ul>
				{blogs.map((blog) => (
					<li key={blog.id}>
						<Link href={`/blog/${blog.id}`}>
							<a>{blog.title}</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
