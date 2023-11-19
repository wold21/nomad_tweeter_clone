import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div`
    /* &:last-child {
        place-self: end;
    } */
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    padding: 10px;
    font-size: 18px;
    border-radius: 15px;
`;

const Photo = styled.img`
    width: 100px;
    height: 100px;
`;

const ButtonBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: flex-start;
    width: 60px;
    height: 100%;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 400;
    border: 0;
    border-radius: 5px;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 10px;
    width: 100%;
`;

const UpdateButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 400;
    border: 0;
    border-radius: 5px;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 10px;
    width: 100%;
`;

const CancelButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 400;
    border: 0;
    border-radius: 5px;
    padding: 5px 10px;
    text-transform: uppercase;
    cursor: pointer;
    font-size: 10px;
    width: 100%;
`;

const TextArea = styled.textarea`
    margin-top: 10px;
    border: 2px solid wihte;
    border-radius: 5px;
    padding: 10px;
    font-size: 18px;
    color: white;
    background-color: black;
    width: calc(100% - 20px);
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    &::placeholder {
        font-size: 16px;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [isEdit, setEdit] = useState(false);
    const [value, setValue] = useState(tweet);
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("정말 삭제하시겠습니까?");
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (error) {
            console.log(error);
        } finally {
            //
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };
    const onUpdate = async () => {
        if (user?.uid !== userId) return;

        try {
            if (isEdit) {
                await updateDoc(doc(db, "tweets", id), {
                    tweet: value,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setEdit((prevState) => !prevState);
        }
    };

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {isEdit ? (
                    <TextArea
                        required
                        rows={2}
                        maxLength={200}
                        onChange={onChange}
                        value={value}
                        placeholder="What is happening?"
                    />
                ) : (
                    <Payload>{tweet}</Payload>
                )}
            </Column>
            <Column>{photo ? <Photo src={photo} /> : null}</Column>
            <Column>
                {user?.uid === userId ? (
                    <ButtonBox>
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                        <UpdateButton onClick={onUpdate}>
                            {isEdit ? "Submit" : "Edit"}
                        </UpdateButton>
                        {isEdit ? (
                            <CancelButton onClick={() => setEdit(false)}>
                                Cancel
                            </CancelButton>
                        ) : null}
                    </ButtonBox>
                ) : null}
            </Column>
        </Wrapper>
    );
}
