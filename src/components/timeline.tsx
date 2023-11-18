import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
        const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
        const snapShot = await getDocs(tweetsQuery);
        const tweets = snapShot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, photo } = doc.data();
            return {
                id: doc.id,
                tweet,
                createdAt,
                userId,
                username,
                photo,
            };
        });
        setTweets(tweets);
    };
    useEffect(() => {
        fetchTweets();
    }, []);
    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    );
}
