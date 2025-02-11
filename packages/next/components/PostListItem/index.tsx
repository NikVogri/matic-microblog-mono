import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "../../types/post";
import { ethers } from "ethers";
import { limitChars } from "../../utils/limitChars";

import styles from "./Post.module.scss";
import getContract from "../../utils/getContract";

const PostListItem: React.FC<Post> = ({
	author,
	content,
	dislikes,
	id,
	likes,
}) => {
	const [dislikesCount, setDislikesCount] = useState(0);
	const [likesCount, setLikesCount] = useState(0);

	useEffect(() => {
		setLikesCount(likes);
		setDislikesCount(dislikes);
	}, [likes, dislikes]);

	const handleRating = async (type: "like" | "dislike") => {
		const provider = new ethers.providers.Web3Provider(
			(window as any).ethereum
		);
		const contract = getContract(provider.getSigner());

		if (type === "like") {
			await contract.like(id);
			setLikesCount((oldLikes) => oldLikes + 1);
		}

		if (type === "dislike") {
			await contract.dislike(id);
			setDislikesCount((oldLikes) => oldLikes + 1);
		}
	};

	return (
		<li className={styles.postItem}>
			<div className={styles.inner}>
				<Link href={`/post/${id}`}>
					<a>
						<div className={styles.main}>
							<span>{author}</span>
							<p>{limitChars(content, 120)}</p>
						</div>
					</a>
				</Link>
				<div className={styles.rating}>
					<button
						className={styles.active}
						onClick={() => handleRating("like")}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 448 512"
						>
							<title>chevron-up</title>
							<g fill="#1c201d">
								<path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
							</g>
						</svg>
						<p>{likesCount}</p>
					</button>
					<button onClick={() => handleRating("dislike")}>
						<p>{dislikesCount}</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="15"
							height="15"
							viewBox="0 0 448 512"
						>
							<title>chevron-down</title>
							<g fill="#1c201d">
								<path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
							</g>
						</svg>
					</button>
				</div>
			</div>
		</li>
	);
};

export default PostListItem;
